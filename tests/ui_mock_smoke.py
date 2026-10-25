"""Standalone Chromium smoke tests with mocked IndexedDB storage."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import re,base64
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text().replace('<script type="module" src="/src/main.js"></script>','')
css=(ROOT/'src/style.css').read_text()
cork=base64.b64encode((ROOT/'public/assets/cork.jpg').read_bytes()).decode()
css=css.replace("url('/assets/cork.jpg')",f"url('data:image/jpeg;base64,{cork}')")
parts=["'use strict';", """const db=(()=>{const stores={};const table=name=>(stores[name]??=new Map());return {
 async getAll(n){return [...table(n).values()].map(v=>structuredClone(v));},
 async getOne(n,id){return table(n).get(id);},
 async put(n,row){table(n).set(row.id??row.key,structuredClone(row));},
 async remove(n,id){table(n).delete(id);},
 async replaceCore(data){for(const store of ['notes','links','boards','sections']){table(store).clear();for(const row of data[store]||[])table(store).set(row.id,structuredClone(row));}},
 async transaction(names,mode,fn){const tx={objectStore:(n)=>({clear:()=>table(n).clear()})};return fn(tx);},
 async restoreAll(data){for(const [store,items] of Object.entries(data)){if(!Array.isArray(items))continue;table(store).clear();for(const row of items)table(store).set(row.id??row.key,structuredClone(row));}},
 async getNoteFiles(){return [];},async deletePermanently(){},async blobToBase64(){return ''},base64ToBlob(){return new Blob()}
};})();""", "function androidNotificationsAvailable(){return false;}async function refreshReminder(){}async function resetReminders(){}async function cancelReminder(){}"]
for name in ['geometry','icons','richtext','export','main']:
 js=(ROOT/f'src/{name}.js').read_text()
 js=re.sub(r'^import .*?;\s*$', '', js, flags=re.MULTILINE)
 js=re.sub(r'^export\s+', '', js, flags=re.MULTILINE)
 parts.append(js)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w,h in [(1440,900),(390,844)]:
  page=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html)
  page.add_style_tag(content=css)
  page.add_script_tag(content='\n'.join(parts))
  page.wait_for_timeout(350)
  if page.locator('#dismissTutorial').count():page.locator('#dismissTutorial').click()
  assert page.locator('.note').count()==4, ('notes',errors)
  assert page.locator('[data-action="add-section"]').count()==0
  assert page.locator('.board-section,.section-header,.section-resize-handle').count()==0
  assert 'section' not in page.locator('#boardStats').inner_text().lower()
  page.locator('.note').first.click(position={'x':70,'y':100})
  assert page.locator('.note-preview-panel').count()==1,errors
  page.locator('[data-action="edit-from-preview"]').click()
  page.wait_for_timeout(180)
  assert page.locator('.editor-pane').count()==2,errors
  assert page.locator('#editorDetailsHeading').is_visible()
  assert page.locator('#editorContentHeading').is_visible()
  editor=page.locator('.edit-panel').bounding_box()
  assert abs(editor['x']+editor['width']/2-w/2)<5,('off-center',editor,w)
  page.locator('[data-content-tool="checklist"]').first.click()
  assert page.locator('#contentToolChecklist').is_visible()
  page.locator('[data-content-tool="attachments"]').first.click()
  assert page.locator('#contentToolAttachments').is_visible()
  page.locator('.detail-top [data-action="close-modal"]').click()
  before=page.evaluate('state.notes[0].x')
  box=page.locator('.note').first.bounding_box()
  px=box['x']+65;py=box['y']+105
  page.mouse.move(px,py);page.mouse.down();page.mouse.move(px+45,py+20,steps=7);page.mouse.up()
  page.wait_for_timeout(150)
  after=page.evaluate('state.notes[0].x')
  assert abs(after-before-45)<2,(before,after,errors)
  assert page.locator('.board-section,.section-header,.section-resize-handle').count()==0
  if w==1440:
   page.locator('.side-nav [data-nav=ideas]').click()
   assert 'nav-just-selected' in (page.locator('.side-nav [data-nav=ideas]').get_attribute('class') or '')
  else:
   page.locator('.mobile-nav [data-nav=ideas]').click()
   assert 'nav-just-selected' in (page.locator('.mobile-nav [data-nav=ideas]').get_attribute('class') or '')
  assert not errors,errors
  print(f'{w}x{h}: note drag, popup, content tools, no sections, navigation — PASS')
  page.close()
 browser.close()
