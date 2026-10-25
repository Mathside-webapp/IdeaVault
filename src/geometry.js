export let WORLD_W = 8000;
export let WORLD_H = 6000;
export function ensureWorldSpace(x, y, width = 300, height = 300) {
  let expanded = false;
  while (x + width + 550 > WORLD_W) { WORLD_W += 2000; expanded = true; }
  while (y + height + 550 > WORLD_H) { WORLD_H += 1500; expanded = true; }
  return expanded;
}
export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
export function worldPoint(clientX, clientY, rect, board) {
  return { x: (clientX - rect.left - board.ox) / board.zoom, y: (clientY - rect.top - board.oy) / board.zoom };
}
export function pinPosition(note) { return { x: note.x + note.w / 2, y: note.y + 17 }; }
export function stringPath(a, b) {
  const p = pinPosition(a), q = pinPosition(b);
  const d = Math.hypot(q.x - p.x, q.y - p.y);
  const sag = Math.min(34, Math.max(9, d * .07));
  return `M ${p.x} ${p.y} Q ${(p.x + q.x) / 2} ${(p.y + q.y) / 2 + sag} ${q.x} ${q.y}`;
}
export function zoomAround(board, newZoom, clientX, clientY, rect) {
  const z = clamp(newZoom, .35, 2.25);
  const localX = clientX - rect.left;
  const localY = clientY - rect.top;
  const wx = (localX - board.ox) / board.zoom;
  const wy = (localY - board.oy) / board.zoom;
  board.ox = localX - wx * z;
  board.oy = localY - wy * z;
  board.zoom = z;
}
export function allowedLink(links, boardId, from, to, kind) {
  return from !== to && !links.some(e => e.boardId === boardId && ((e.from === from && e.to === to) || (e.from === to && e.to === from)));
}
