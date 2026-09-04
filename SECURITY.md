# CerebroCalm Security Architecture & Policy

## 1. Core Security Principles
CerebroCalm is architected around **Zero Trust** for third-party networks and **Zero Cloud Knowledge** by default:
- **No Client Secrets**: No API keys, database credentials, or server tokens are ever bundled into client-side JavaScript.
- **Local Cryptography**: Sensitive health metrics and symptom descriptions are encrypted on-device via Web Crypto API (AES-GCM 256-bit).
- **Strict Input Sanitization**: All inputs are validated via Zod schemas (`src/lib/validation.ts`) to reject out-of-bounds metrics and prevent injection attacks.
- **No Insecure Logging**: Health data, symptoms, and voice transcripts are never emitted to `console.log` or third-party analytics in production.

---

## 2. Recommended Content Security Policy (CSP)
For production deployments, the following HTTP headers should be configured (e.g. via Vercel, Cloudflare, or Nginx):

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(self), geolocation=(), interest-cohort=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

---

## 3. Cryptographic Key Management
1. **Algorithm**: AES-GCM with 256-bit keys.
2. **IV Randomization**: A fresh, cryptographically secure 12-byte initialization vector (`crypto.getRandomValues`) is generated for every single encrypted payload. IV reuse is strictly forbidden.
3. **Authentication Tag**: AES-GCM automatically computes a 128-bit authentication tag. If any byte of ciphertext or IV is tampered with, decryption fails immediately and rejects the record.

---

## 4. Vulnerability Reporting
If you discover a security vulnerability within CerebroCalm, please submit a responsible disclosure report to the development team or file a confidential GitHub Security Advisory. We commit to acknowledging reports within 48 hours and deploying patches rapidly.
