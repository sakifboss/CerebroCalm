# CerebroCalm Privacy Policy & Local-First Architecture

**Effective Date:** September 2026

## 1. Our Privacy Philosophy
> **"Your recovery data belongs entirely to you, on your device."**

Standard digital health platforms monetize user telemetry, upload sensitive symptom diaries to cloud databases, and train external models on user vulnerabilities. CerebroCalm takes the opposite stance: **Zero Cloud Health Tracking by Default**.

---

## 2. Data Architecture

```
User Input (Tactile / Voice)
       ↓
Deterministic Red-Flag Gate
       ↓
Local Runtime Validation (Zod)
       ↓
Web Crypto API (AES-GCM 256-bit Encryption)
       ↓
Local Browser IndexedDB (Encrypted at Rest)
```

1. **No External Server Storage**: All symptom scores, notes, pacing history, and accessibility preferences remain in your browser's private IndexedDB storage.
2. **On-Device Cryptography**: Records are encrypted before hitting disk storage. Even if someone inspects raw browser storage files, the payload is unreadable ciphertext.
3. **No Telemetry or Tracking Cookies**: CerebroCalm contains zero advertising SDKs, zero Google Analytics, zero Meta Pixels, and zero session recording software.
4. **On-Device Voice Recognition**: Voice input utilizes the browser's native Web Speech API. Audio is never recorded, never buffered on disk, and never sent to external training pipelines.

---

## 3. Optional AI Features (When Explicitly Configured)
If an external AI coaching model is enabled by the user or clinician via API key:
- **Red-Flag Pre-Check**: The deterministic red-flag detector evaluates the entry *before* any network call is initiated.
- **Data Minimization**: Only the minimal numerical scores required for immediate pacing context are transmitted. Personal names, identifiers, device fingerprints, and past notes are excluded.
- **Strict Output Validation**: The AI response is screened to ensure it contains no diagnostic assertions or unauthorized medication advice.

---

## 4. Patient Data Rights & Portability
- **Export Decrypted Data**: You may export your entire history at any time as a structured `.json` file from the **Privacy** page.
- **One-Click Local Wipe**: You can permanently purge all stored symptoms, pacing logs, and encryption keys from your device with a single click.
