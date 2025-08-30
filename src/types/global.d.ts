/// <reference types="node" />

declare global {
  // Ensure fetch is available globally
  const fetch: typeof globalThis.fetch;
}

export {};
