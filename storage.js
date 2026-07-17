const StudyStorage = (() => {
  const DB_NAME = "zhixing-study-db";
  const DB_VERSION = 1;
  const STORE_NAME = "snapshots";
  const ACTIVE_ID = "active";
  const LEGACY_KEY = "zhixing-study-state";
  let databasePromise;
  let writeQueue = Promise.resolve();
  let usingFallback = false;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function openDatabase() {
    if (!globalThis.indexedDB) {
      usingFallback = true;
      return Promise.reject(new Error("IndexedDB is unavailable"));
    }
    if (databasePromise) return databasePromise;
    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return databasePromise;
  }

  async function readSnapshot() {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(ACTIVE_ID);
      request.onsuccess = () => resolve(request.result?.value || null);
      request.onerror = () => reject(request.error);
    });
  }

  async function writeSnapshot(value) {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).put({ id: ACTIVE_ID, schemaVersion: 1, updatedAt: new Date().toISOString(), value });
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async function load(defaultState) {
    try {
      const snapshot = await readSnapshot();
      if (snapshot) return { ...clone(defaultState), ...snapshot };
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        const parsed = JSON.parse(legacy);
        const migrated = { ...clone(defaultState), ...parsed };
        await writeSnapshot(migrated);
        localStorage.removeItem(LEGACY_KEY);
        return migrated;
      }
      return clone(defaultState);
    } catch {
      usingFallback = true;
      try {
        const fallback = JSON.parse(localStorage.getItem(LEGACY_KEY));
        return { ...clone(defaultState), ...(fallback || {}) };
      } catch {
        return clone(defaultState);
      }
    }
  }

  function save(state) {
    const snapshot = clone(state);
    if (usingFallback) {
      localStorage.setItem(LEGACY_KEY, JSON.stringify(snapshot));
      return Promise.resolve();
    }
    writeQueue = writeQueue.then(() => writeSnapshot(snapshot)).catch(() => {
      usingFallback = true;
      localStorage.setItem(LEGACY_KEY, JSON.stringify(snapshot));
    });
    return writeQueue;
  }

  async function clear() {
    localStorage.removeItem(LEGACY_KEY);
    try {
      const database = await openDatabase();
      await new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, "readwrite");
        transaction.objectStore(STORE_NAME).delete(ACTIVE_ID);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    } catch {
      usingFallback = true;
    }
  }

  return {
    load,
    save,
    clear,
    backend: () => usingFallback ? "localStorage" : "IndexedDB"
  };
})();
