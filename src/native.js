import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
const isNative = () => Capacitor.isNativePlatform();
export function androidNotificationsAvailable() { return isNative(); }
export function notificationId(id) {
  let hash = 7;
  for (const c of String(id)) hash = ((hash * 31) + c.charCodeAt(0)) | 0;
  return Math.abs(hash % 2000000000) + 1;
}
export async function configureNotifications() {
  if (!isNative()) return false;
  const check = await LocalNotifications.checkPermissions();
  if (check.display === 'granted') return true;
  const result = await LocalNotifications.requestPermissions();
  return result.display === 'granted';
}
export async function refreshReminder(note) {
  if (!isNative()) return { supported: false };
  const id = notificationId(note.id);
  await LocalNotifications.cancel({ notifications: [{ id }] });
  if (!note.reminder || note.archived || note.deleted || note.completed) return { supported: true };
  const at = new Date(note.reminder);
  if (Number.isNaN(at.getTime()) || at.getTime() <= Date.now()) return { supported: true, expired: true };
  const allowed = await configureNotifications();
  if (!allowed) return { supported: true, denied: true };
  await LocalNotifications.schedule({ notifications: [{
    id, title: 'IdeaVault reminder', body: note.title || 'A task needs your attention',
    schedule: { at, allowWhileIdle: true }, smallIcon: 'ic_stat_ideavault',
    extra: { noteId: note.id, boardId: note.boardId }
  }] });
  return { supported: true };
}
export async function cancelReminder(id) {
  if (isNative()) await LocalNotifications.cancel({ notifications: [{ id: notificationId(id) }] });
}
export async function resetReminders(notes) {
  if (!isNative()) return;
  for (const n of notes) {
    try { await refreshReminder(n); } catch (err) { console.warn('Reminder could not be updated:', err); }
  }
}
