import { pinPosition } from './geometry.js';
const html = (s) => String(s || '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function exportBoardSvg(notes, links, boardName, size = { width: 1480, height: 1050 }) {
  const visible = notes.filter(n=>!n.archived && !n.deleted);
  const pad = 100;
  const left = Math.min(0, ...visible.map(n=>n.x)) - pad;
  const top = Math.min(0, ...visible.map(n=>n.y)) - pad;
  const right = Math.max(1200, ...visible.map(n=>n.x+n.w)) + pad;
  const bottom = Math.max(850, ...visible.map(n=>n.y+n.h)) + pad;
  const w = right - left, h = bottom - top;
  const nmap = new Map(visible.map(n=>[n.id,n]));
  const card = n => {
    const x=n.x-left, y=n.y-top;
    return `<g transform="translate(${x} ${y})"><rect width="${n.w}" height="${n.h}" rx="4" fill="${({butter:'#f7dea0',rose:'#f4bec2',sage:'#c7dbbd',sky:'#bfdbeb',lilac:'#dcd0ee',cream:'#f8edc9'})[n.color]||'#f7dea0'}" filter="url(#shadow)"/><rect width="${n.w}" height="8" fill="#ffffff" opacity=".12"/><circle cx="${n.w/2}" cy="17" r="10" fill="#8e3a30"/><circle cx="${n.w/2-3}" cy="14" r="3.5" fill="#ffffff" opacity=".55"/><text x="17" y="58" fill="#3f322d" font-weight="bold" font-size="21" font-family="sans-serif">${html(n.title).slice(0, 30)}</text>${(n.description||'').slice(0,144).split('\n').flatMap(t=>{const lines=[];while(t.length>0){lines.push(t.slice(0,Math.floor((n.w-30)/8)));t=t.slice(Math.floor((n.w-30)/8));}return lines;}).slice(0,Math.floor((n.h-90)/23)).map((line,i)=>`<text x=\"17\" y=\"${92+i*23}\" fill=\"#514941\" font-size=\"15\" font-family=\"sans-serif\">${html(line)}</text>`).join('')}</g>`;
  };
  let edges='';
  for(const edge of links) {
    const a=nmap.get(edge.from),b=nmap.get(edge.to);
    if (!a||!b) continue;
    const p=pinPosition(a), q=pinPosition(b);
    const x1=p.x-left,y1=p.y-top,x2=q.x-left,y2=q.y-top;
    const sag = Math.min(34, Math.max(9,Math.hypot(x2-x1,y2-y1)*.07));
    edges+=`<path d="M${x1} ${y1} Q${(x1+x2)/2} ${(y1+y2)/2+sag} ${x2} ${y2}" stroke="#b34434" fill="none" stroke-width="3"/>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><pattern id="cork" width="47" height="47" patternUnits="userSpaceOnUse"><rect width="47" height="47" fill="#c7a379"/><path d="M0 20l20-11m13 7 14 5M8 38l21 3m-7-35 8 13" stroke="#805d42" stroke-opacity=".15" stroke-width="2"/><circle cx="6" cy="5" r="1" fill="#946c45"/><circle cx="34" cy="30" r="2" fill="#946c45" opacity=".4"/></pattern><filter id="shadow" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="2" dy="5" stdDeviation="5" flood-opacity=".23"/></filter></defs><rect width="100%" height="100%" fill="url(#cork)"/><rect x="8" y="8" width="${w-16}" height="${h-16}" rx="9" fill="none" stroke="#80502c" stroke-width="16"/>${edges}${visible.map(card).join('')}<text x="${w-26}" y="${h-30}" fill="#574331" font-size="17" text-anchor="end" font-family="sans-serif">IDEAVAULT · ${html(boardName)}</text></svg>`;
  return svg;
}
export async function exportPng(notes, links, name) {
  const svg = exportBoardSvg(notes,links,name);
  const blob = new Blob([svg],{type:'image/svg+xml;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url;});
    const canvas = document.createElement('canvas');
    const scale=Math.min(1,4096/Math.max(img.naturalWidth,img.naturalHeight));canvas.width=Math.round(img.naturalWidth*scale);canvas.height=Math.round(img.naturalHeight*scale);
    const ctx=canvas.getContext('2d');
    ctx.fillStyle='#c8a378';ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
    const png = await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Canvas export failed.')),'image/png'));
    return png;
  } finally {URL.revokeObjectURL(url);}
}
