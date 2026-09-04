import { openDB, IDBPDatabase } from "idb";
import { SymptomEntry } from "@/types/symptom";
import { PacingSession } from "@/types/pacing";
import { encryptData, decryptData, EncryptedPayload } from "./encryption";
import { validateSymptomEntry, safeParseSymptomEntry } from "./validation";

const DB_NAME = "cerebrocalm_db";
const DB_VERSION = 1;
const STORE_SYMPTOMS = "symptoms";
const STORE_PACING = "pacing_sessions";
const STORE_SETTINGS = "settings";

interface EncryptedRecord {
  id: string;
  isEncrypted: true;
  payload: EncryptedPayload;
  timestamp: string;
  isDemo?: boolean;
}

type StoredRecord<T> = EncryptedRecord | (T & { isEncrypted?: false });

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    if (typeof window === "undefined") {
      return Promise.reject(new Error("IndexedDB is only available in browser context."));
    }
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_SYMPTOMS)) {
          const symptomStore = db.createObjectStore(STORE_SYMPTOMS, { keyPath: "id" });
          symptomStore.createIndex("by_timestamp", "timestamp");
        }
        if (!db.objectStoreNames.contains(STORE_PACING)) {
          const pacingStore = db.createObjectStore(STORE_PACING, { keyPath: "id" });
          pacingStore.createIndex("by_startTime", "startTime");
        }
        if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
          db.createObjectStore(STORE_SETTINGS);
        }
      },
    });
  }
  return dbPromise;
}

// In-memory fallback for environments where IndexedDB is blocked (e.g. private browsing or test mocks)
const memoryStorage = {
  symptoms: new Map<string, StoredRecord<SymptomEntry>>(),
  pacing: new Map<string, PacingSession>(),
};

/**
 * Save a symptom entry locally with on-device encryption
 */
export async function saveSymptomLocally(
  entry: SymptomEntry,
  encrypt: boolean = true
): Promise<void> {
  const validated = validateSymptomEntry(entry);

  try {
    const db = await getDB();
    if (encrypt) {
      const encrypted = await encryptData(JSON.stringify(validated));
      const record: EncryptedRecord = {
        id: validated.id,
        isEncrypted: true,
        payload: encrypted,
        timestamp: validated.timestamp,
        isDemo: !!validated.isDemo,
      };
      await db.put(STORE_SYMPTOMS, record);
    } else {
      await db.put(STORE_SYMPTOMS, validated);
    }
  } catch (error) {
    // Fallback to memory storage
    if (encrypt) {
      const encrypted = await encryptData(JSON.stringify(validated));
      memoryStorage.symptoms.set(validated.id, {
        id: validated.id,
        isEncrypted: true,
        payload: encrypted,
        timestamp: validated.timestamp,
        isDemo: !!validated.isDemo,
      });
    } else {
      memoryStorage.symptoms.set(validated.id, validated);
    }
  }
}

/**
 * Load all symptom entries, decrypting them transparently
 */
export async function loadSymptomsLocally(): Promise<SymptomEntry[]> {
  const results: SymptomEntry[] = [];

  try {
    const db = await getDB();
    const records = await db.getAll(STORE_SYMPTOMS);

    for (const record of records) {
      try {
        if (record.isEncrypted && record.payload) {
          const decryptedJson = await decryptData(record.payload);
          const parsed = JSON.parse(decryptedJson);
          const validated = safeParseSymptomEntry(parsed);
          if (validated.success) {
            results.push(validated.data);
          }
        } else {
          const validated = safeParseSymptomEntry(record);
          if (validated.success) {
            results.push(validated.data);
          }
        }
      } catch (decryptionError) {
        console.warn(`Skipping corrupted or unreadable symptom entry: ${record.id}`);
      }
    }
  } catch (dbError) {
    // Fallback to memory storage
    for (const record of memoryStorage.symptoms.values()) {
      try {
        if (record.isEncrypted && record.payload) {
          const decryptedJson = await decryptData(record.payload);
          const parsed = JSON.parse(decryptedJson);
          const validated = safeParseSymptomEntry(parsed);
          if (validated.success) {
            results.push(validated.data);
          }
        } else {
          const validated = safeParseSymptomEntry(record);
          if (validated.success) {
            results.push(validated.data);
          }
        }
      } catch (err) {
        console.warn(`Skipping corrupted in-memory symptom entry: ${record.id}`);
      }
    }
  }

  // Sort chronologically ascending
  return results.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

/**
 * Save a pacing session locally
 */
export async function savePacingSessionLocally(session: PacingSession): Promise<void> {
  try {
    const db = await getDB();
    await db.put(STORE_PACING, session);
  } catch (error) {
    memoryStorage.pacing.set(session.id, session);
  }
}

/**
 * Load all pacing sessions
 */
export async function loadPacingSessionsLocally(): Promise<PacingSession[]> {
  try {
    const db = await getDB();
    const records = await db.getAll(STORE_PACING);
    return records.sort(
      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  } catch (error) {
    return Array.from(memoryStorage.pacing.values()).sort(
      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  }
}

/**
 * Delete only demo data, preserving real user recovery data
 */
export async function clearDemoDataLocally(): Promise<void> {
  try {
    const db = await getDB();
    const records = await db.getAll(STORE_SYMPTOMS);
    for (const r of records) {
      if (r.isDemo) {
        await db.delete(STORE_SYMPTOMS, r.id);
      }
    }
  } catch (e) {
    for (const [id, val] of memoryStorage.symptoms.entries()) {
      if (val.isDemo) {
        memoryStorage.symptoms.delete(id);
      }
    }
  }
}

/**
 * Completely wipe all local IndexedDB data for privacy reset
 */
export async function wipeAllLocalData(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear(STORE_SYMPTOMS);
    await db.clear(STORE_PACING);
    await db.clear(STORE_SETTINGS);
  } catch (e) {
    // Ignore
  }
  memoryStorage.symptoms.clear();
  memoryStorage.pacing.clear();
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("cerebrocalm_settings");
    localStorage.removeItem("cerebrocalm_device_master_key_v1");
  }
}
