export const DB_NAME = 'ideavault-local';
export const DB_VERSION = 2;
let dbPromise;
export function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('notes')) db.createObjectStore('notes', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('links')) db.createObjectStore('links', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('boards')) db.createObjectStore('boards', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('attachments')) {
        const store = db.createObjectStore('attachments', { keyPath: 'id' });
        store.createIndex('noteId', 'noteId', { unique: false });
      }
      if (!db.objectStoreNames.contains('preferences')) db.createObjectStore('preferences', { keyPath: 'key' });
      if (!db.objectStoreNames.contains('sections')) db.createObjectStore('sections', { keyPath: 'id' });
    };
    req.onsuccess = () => { const db = req.result; db.onversionchange = () => { db.close(); dbPromise = null; }; resolve(db); };
    req.onerror = () => { dbPromise = null; reject(req.error); };
    req.onblocked = () => reject(new Error('Close other IdeaVault tabs before upgrading storage.'));
  });
  return dbPromise;
}
export async function transaction(stores, mode, callback) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(stores, mode);
    let result;
    try { result = callback(tx); } catch (error) { tx.abort(); reject(error); return; }
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error || new Error('Local storage failed.'));
    tx.onabort = () => reject(tx.error || new Error('Local storage aborted.'));
  });
}
export async function getAll(store) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
export async function getOne(store, key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction(store, 'readonly').objectStore(store).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
export const put = (store, row) => transaction([store], 'readwrite', tx => tx.objectStore(store).put(row));
export const remove = (store, key) => transaction([store], 'readwrite', tx => tx.objectStore(store).delete(key));
export async function replaceCore({ notes, links, boards, sections = [] }) {
  await transaction(['notes', 'links', 'boards', 'sections'], 'readwrite', tx => {
    for (const name of ['notes', 'links', 'boards', 'sections']) {
      const store = tx.objectStore(name);
      store.clear();
      for (const row of ({ notes, links, boards, sections })[name]) store.put(row);
    }
  });
}
export async function restoreAll(data) {
  await transaction(['notes','links','boards','attachments','preferences','sections'], 'readwrite', tx => {
    for (const name of ['notes','links','boards','attachments','preferences','sections']) {
      const store = tx.objectStore(name);
      store.clear();
      for (const row of (data[name] || [])) store.put(row);
    }
  });
}
export async function getNoteFiles(noteId) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction('attachments', 'readonly').objectStore('attachments').index('noteId').getAll(noteId);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
export async function deletePermanently(noteId) {
  const files = await getNoteFiles(noteId);
  await transaction(['notes','attachments'], 'readwrite', tx => {
    tx.objectStore('notes').delete(noteId);
    for (const f of files) tx.objectStore('attachments').delete(f.id);
  });
}
export async function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
export function base64ToBlob(base64, type) {
  const binary = atob(base64);
  const chunks = [];
  for (let i = 0; i < binary.length; i += 8192) {
    const section = binary.slice(i, i + 8192);
    const array = new Uint8Array(section.length);
    for (let j = 0; j < section.length; j++) array[j] = section.charCodeAt(j);
    chunks.push(array);
  }
  return new Blob(chunks, { type: type || 'application/octet-stream' });
}
