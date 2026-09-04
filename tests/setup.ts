import "@testing-library/jest-dom";

// Polyfill web crypto in test environment if needed
if (!globalThis.crypto) {
  const nodeCrypto = require("crypto");
  // @ts-ignore
  globalThis.crypto = nodeCrypto.webcrypto;
}
