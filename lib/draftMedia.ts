const DB_NAME = "moveti-local";
const STORE_NAME = "draft-media";

export function saveDraftMedia(
  audio: File | null,
  artwork: File | null
): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      if (audio) {
        store.put(audio, "audio");
      }

      if (artwork) {
        store.put(artwork, "artwork");
      }

      transaction.oncomplete = () => {
        db.close();
        resolve();
      };

      transaction.onerror = () => {
        db.close();
        reject(transaction.error);
      };
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}
