/* Local-only HTML sanitizer for note content. No scripts, remote media, inline events, or arbitrary CSS. */
const tags = new Set(['B','STRONG','I','EM','U','S','STRIKE','P','DIV','BR','UL','OL','LI','SPAN','H2','H3','BLOCKQUOTE','A','FONT']);
const families = {'arial':'Arial','georgia':'Georgia','verdana':'Verdana','trebuchet ms':'Trebuchet MS','times new roman':'Times New Roman','courier new':'Courier New'};
const htmlSizes = {1:11,2:13,3:16,4:18,5:24,6:30,7:38};
export function sanitizeRichHtml(html) {
  const parser = document.createElement('template');parser.innerHTML = String(html || '');
  function safeChildren(parent) {return Array.from(parent.childNodes).map(safeNode).join('');}
  function safeNode(node) {
    if (node.nodeType === 3) return escapeHtml(node.nodeValue);
    if (node.nodeType !== 1) return '';
    const name = node.tagName.toUpperCase();
    const inside = safeChildren(node);
    if (!tags.has(name)) return inside;
    if (name === 'BR') return '<br>';
    if (name === 'A') {
      const raw = node.getAttribute('href') || '';
      let href = ''; try { const u = new URL(raw); if (['https:','http:','mailto:'].includes(u.protocol)) href = u.href; } catch {}
      return href ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${inside}</a>` : inside;
    }
    const styles=[];
    const rawStyle=node.getAttribute('style')||'';
    const rawColor=name==='FONT'?(node.getAttribute('color')||''):'';
    const rawFace=name==='FONT'?(node.getAttribute('face')||''):'';
    const rawSize=name==='FONT'?(htmlSizes[Number(node.getAttribute('size'))]||''):'';
    const vals={};
    for (const part of rawStyle.split(';')) {const idx=part.indexOf(':');if(idx<0)continue;const key=part.slice(0,idx).trim().toLowerCase();vals[key]=part.slice(idx+1).trim();}
    const color=(rawColor||vals.color||'').trim();
    if (/^#[0-9a-f]{3,8}$/i.test(color)||/^rgba?\(\s*[\d.,%\s]+\)$/.test(color)) styles.push(`color:${color}`);
    const family=(rawFace||vals['font-family']||'').replaceAll(/['"]/g,'').trim().toLowerCase();
    if (families[family]) styles.push(`font-family:'${families[family]}'`);
    const size=rawSize||parseInt(vals['font-size']||'',10);
    if (size>=9&&size<=72) styles.push(`font-size:${size}px`);
    if (/^(bold|700|800|900)$/i.test(vals['font-weight']||'')) styles.push('font-weight:bold');
    if (/^italic$/i.test(vals['font-style']||'')) styles.push('font-style:italic');
    if (/^underline$/i.test(vals['text-decoration']||'')) styles.push('text-decoration:underline');
    const tag=name==='FONT'?'span':name.toLowerCase();
    return `<${tag}${styles.length?` style="${escapeHtml(styles.join(';'))}"`:''}>${inside}</${tag}>`;
  }
  return safeChildren(parser.content);
}
export function escapeHtml(str) {return String(str??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');}
export function plainTextOf(html) {
  const el=document.createElement('div');el.innerHTML=sanitizeRichHtml(html);
  // Preserve paragraph boundaries even when the element is detached (innerText
  // behaves differently on off-screen nodes in some Android WebViews).
  function walk(node) {
    if(node.nodeType===3)return node.nodeValue||'';
    if(node.nodeType!==1)return Array.from(node.childNodes).map(walk).join('');
    if(node.tagName==='BR')return '\n';
    const content=Array.from(node.childNodes).map(walk).join('');
    return /^(P|DIV|LI|UL|OL|H2|H3|BLOCKQUOTE)$/.test(node.tagName)?content+'\n':content;
  }
  return Array.from(el.childNodes).map(walk).join('').trimEnd();
}
export function noteContentHtml(note){return note.contentHtml ? sanitizeRichHtml(note.contentHtml) : escapeHtml(note.description||'').replace(/\r?\n/g,'<br>');}
