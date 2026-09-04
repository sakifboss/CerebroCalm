import { describe, it, expect } from "vitest";
import { encryptData, decryptData } from "@/lib/encryption";

describe("Web Crypto API Encryption & Decryption", () => {
  it("successfully encrypts and decrypts sensitive string data", async () => {
    const sensitiveMedicalNote = "Patient experienced headache 4 after screen exposure.";
    const encrypted = await encryptData(sensitiveMedicalNote);

    expect(encrypted.ciphertext).toBeDefined();
    expect(encrypted.iv).toBeDefined();
    expect(encrypted.version).toBe(1);
    expect(encrypted.ciphertext).not.toBe(sensitiveMedicalNote);

    const decrypted = await decryptData(encrypted);
    expect(decrypted).toBe(sensitiveMedicalNote);
  });

  it("handles structured JSON serialization and recovery", async () => {
    const symptomPayload = {
      headache: 3,
      sensorySensitivity: 4,
      cognitiveFatigue: 3,
      mood: "overwhelmed",
    };

    const jsonString = JSON.stringify(symptomPayload);
    const encrypted = await encryptData(jsonString);
    const decrypted = await decryptData(encrypted);

    expect(JSON.parse(decrypted)).toEqual(symptomPayload);
  });

  it("fails integrity check when ciphertext is corrupted or tampered with", async () => {
    const plainText = "Confidential recovery record";
    const encrypted = await encryptData(plainText);

    // Tamper with base64 ciphertext
    const tamperedPayload = {
      ...encrypted,
      ciphertext: "AAAA" + encrypted.ciphertext.slice(4),
    };

    await expect(decryptData(tamperedPayload)).rejects.toThrow(/Integrity check failed/);
  });
});
