# CerebroCalm Threat Model (STRIDE)

## 1. System Overview & Trust Boundaries
CerebroCalm is a client-side, local-first web application running within the user's browser sandbox. Sensitive data consists of neurological symptom ratings, pacing session timings, and user-provided contextual recovery notes.

### Trust Boundaries:
1. **Host Device / OS Boundary**: The underlying operating system, browser process, and hardware memory.
2. **Browser Storage Boundary**: IndexedDB and localStorage partitions assigned to the CerebroCalm origin.
3. **Network Boundary**: Outbound TLS requests (only applicable when guarded AI features are explicitly enabled).

---

## 2. Assets & Data Classification
- **Critical Asset**: Sensitive symptom records, headache severity, cognitive fatigue logs, and free-text recovery notes.
- **Secondary Asset**: User pacing configurations and accessibility preferences.
- **Security Asset**: Client-side AES-GCM encryption key material.

---

## 3. Potential Threat Actors
1. **Secondary Device Users / Shoulder Surfers**: Individuals who physically borrow or inspect the user's unlocked device.
2. **Forensic Disk Extractors**: Attackers analyzing unencrypted backups or discarded storage media.
3. **Malicious Browser Extensions**: Rogue extensions installed in the user's browser with `<all_urls>` script injection privileges.
4. **Network Man-in-the-Middle (MitM)**: Attackers intercepting Wi-Fi traffic.

---

## 4. STRIDE Analysis & Mitigations

| Threat Category | Potential Attack Vector | CerebroCalm Mitigation |
| :--- | :--- | :--- |
| **Spoofing** | Impersonating emergency medical advice | Deterministic safety warnings are hardcoded and supersede all AI responses; no dynamic scripts allowed to modify clinical notices. |
| **Tampering** | Modifying stored symptom logs in IndexedDB | AES-GCM authenticated encryption produces a 128-bit MAC tag; any tampering triggers an immediate decryption error and rejects the record. |
| **Repudiation** | Denying who logged a symptom | Single-user local application; no multi-tenant shared database to dispute. |
| **Information Disclosure** | Extracting raw health data from browser cache | All symptom entries are encrypted with AES-GCM-256 before disk commit. Zero cloud telemetry. |
| **Denial of Service** | Corrupting storage to crash the UI | Graceful IndexedDB fallback to in-memory store; client-side Error Boundaries prevent total crashes. |
| **Elevation of Privilege** | Bypassing clinician guidance | Pacing timers are labeled as customizable examples and cannot override medical advice. |

---

## 5. Explicit Security Limitations
> [!WARNING]
> **Local-first encryption does not make the application invulnerable to a compromised host device.**

1. **Malicious Extensions**: If a user installs a rogue browser extension with permission to read DOM content, the extension can read decrypted text as it is rendered on screen.
2. **Memory Inspection / Root Access**: An attacker with administrative/root control of the user's operating system or a hardware debugger can dump process memory and inspect the active session key.
3. **Device Theft While Unlocked**: Encryption protects data *at rest*; an unlocked active browser session remains accessible to anyone with physical possession of the device.
