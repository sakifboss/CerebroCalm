/**
 * CerebroCalm On-Device Cryptography Module
 * Uses Web Crypto API with AES-GCM 256-bit encryption.
 * Keeps sensitive recovery and symptom logs encrypted at rest in IndexedDB.
 */

const KEY_STORAGE_KEY = "cerebrocalm_device_master_key_v1";
const ALGORITHM_NAME = "AES-GCM";
const KEY_LENGTH = 256;

export interface EncryptedPayload {
  ciphertext: string; // base64
  iv: string; // base64
  version: number;
}

/**
 * Get or initialize the local non-extractable device encryption key
 */
let cachedKey: CryptoKey | null = null;

function getCryptoSubtle(): SubtleCrypto {
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    return window.crypto.subtle;
  }
  if (typeof globalThis !== "undefined" && globalThis.crypto && globalThis.crypto.subtle) {
    return globalThis.crypto.subtle;
  }
  throw new Error("Web Crypto API (crypto.subtle) is not available in this environment.");
}

function getRandomValues(array: Uint8Array): Uint8Array {
  if (typeof window !== "undefined" && window.crypto) {
    return window.crypto.getRandomValues(array);
  }
  if (typeof globalThis !== "undefined" && globalThis.crypto) {
    return globalThis.crypto.getRandomValues(array);
  }
  throw new Error("crypto.getRandomValues is not available.");
}

function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return typeof btoa !== "undefined"
    ? btoa(binary)
    : Buffer.from(binary, "binary").toString("base64");
}

function base64ToBuffer(base64: string): Uint8Array {
  const binary = typeof atob !== "undefined"
    ? atob(base64)
    : Buffer.from(base64, "base64").toString("binary");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Generates or retrieves an existing raw key from local storage
 */
export async function getOrCreateDeviceKey(): Promise<CryptoKey> {
  if (cachedKey) return cachedKey;

  const subtle = getCryptoSubtle();

  // Try to load existing key material from localStorage (as base64 raw bytes)
  let rawKeyBase64: string | null = null;
  try {
    if (typeof localStorage !== "undefined") {
      rawKeyBase64 = localStorage.getItem(KEY_STORAGE_KEY);
    }
  } catch (e) {
    // localStorage might be blocked or unavailable in private browsing
  }

  if (rawKeyBase64) {
    try {
      const rawBytes = base64ToBuffer(rawKeyBase64);
      cachedKey = await subtle.importKey(
        "raw",
        rawBytes as unknown as BufferSource,
        { name: ALGORITHM_NAME, length: KEY_LENGTH },
        false,
        ["encrypt", "decrypt"]
      );
      return cachedKey;
    } catch (err) {
      console.warn("Failed to import existing device key, regenerating a new one.");
    }
  }

  // Generate new AES-GCM 256-bit key
  const newKey = await subtle.generateKey(
    { name: ALGORITHM_NAME, length: KEY_LENGTH },
    true, // temporarily extractable to persist device key bytes
    ["encrypt", "decrypt"]
  );

  try {
    const exportedRaw = await subtle.exportKey("raw", newKey);
    const base64Key = bufferToBase64(exportedRaw);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(KEY_STORAGE_KEY, base64Key);
    }
  } catch (e) {
    console.warn("Could not persist key to localStorage; key will live in-memory.");
  }

  // Re-import as non-extractable for memory safety
  const rawBytes = await subtle.exportKey("raw", newKey);
  cachedKey = await subtle.importKey(
    "raw",
    rawBytes as unknown as BufferSource,
    { name: ALGORITHM_NAME, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );

  return cachedKey;
}

/**
 * Encrypt arbitrary plain text or JSON with AES-GCM 256-bit
 */
export async function encryptData(plainText: string, customKey?: CryptoKey): Promise<EncryptedPayload> {
  const subtle = getCryptoSubtle();
  const key = customKey || (await getOrCreateDeviceKey());
  
  // Standard 12-byte IV for AES-GCM
  const iv = new Uint8Array(12);
  getRandomValues(iv);

  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);

  const ciphertextBuffer = await subtle.encrypt(
    {
      name: ALGORITHM_NAME,
      iv: iv as unknown as BufferSource,
    },
    key,
    data as unknown as BufferSource
  );

  return {
    ciphertext: bufferToBase64(ciphertextBuffer),
    iv: bufferToBase64(iv),
    version: 1,
  };
}

/**
 * Decrypt an EncryptedPayload back to plain text
 */
export async function decryptData(payload: EncryptedPayload, customKey?: CryptoKey): Promise<string> {
  const subtle = getCryptoSubtle();
  const key = customKey || (await getOrCreateDeviceKey());

  const iv = base64ToBuffer(payload.iv);
  const ciphertext = base64ToBuffer(payload.ciphertext);

  try {
    const decryptedBuffer = await subtle.decrypt(
      {
        name: ALGORITHM_NAME,
        iv: iv as unknown as BufferSource,
      },
      key,
      ciphertext as unknown as BufferSource
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    throw new Error("Integrity check failed: decryption failed or data was corrupted/tampered with.");
  }
}
