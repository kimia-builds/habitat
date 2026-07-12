// Test-environment repair, loaded before every test file.
//
// Node (25+) ships its own experimental `localStorage` which, when no
// storage file is configured, is a broken empty shell — and it shadows
// the working localStorage that jsdom would give our tests. Real
// browsers are untouched by this; it is purely a test-sandbox quirk.
// If we detect the broken shell, we swap in a faithful in-memory
// implementation of the same API.

class MemoryStorage {
  #map = new Map()

  getItem(key) {
    const k = String(key)
    return this.#map.has(k) ? this.#map.get(k) : null
  }
  setItem(key, value) {
    this.#map.set(String(key), String(value))
  }
  removeItem(key) {
    this.#map.delete(String(key))
  }
  clear() {
    this.#map.clear()
  }
  key(index) {
    return [...this.#map.keys()][index] ?? null
  }
  get length() {
    return this.#map.size
  }
}

if (
  typeof globalThis.localStorage === 'undefined' ||
  typeof globalThis.localStorage.clear !== 'function'
) {
  const storage = new MemoryStorage()
  Object.defineProperty(globalThis, 'localStorage', {
    value: storage,
    configurable: true,
  })
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'localStorage', {
      value: storage,
      configurable: true,
    })
  }
}
