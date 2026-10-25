#!/usr/bin/env python3
"""Build a zero-dependency offline browser edition (native notifications are Android-only)."""
import pathlib,re,shutil
root=pathlib.Path(__file__).resolve().parents[1]
out=root/'web-preview'
(out/'assets').mkdir(parents=True,exist_ok=True)
for f in (root/'public/assets').iterdir():
 if f.is_file():shutil.copyfile(f,out/'assets'/f.name)
css=(root/'src/style.css').read_text().replace("url('/assets/cork.jpg')","url('assets/cork.jpg')")
(out/'style.css').write_text(css)
html=(root/'index.html').read_text().replace('<script type="module" src="/src/main.js"></script>','<script defer src="app.js"></script>').replace('href="/assets/icon.svg"','href="assets/icon.svg"').replace('</head>','<link rel="stylesheet" href="style.css"/></head>')
(out/'index.html').write_text(html)
parts=["/* IdeaVault standalone offline browser build. Android version uses the Capacitor native module. */\n'use strict';\n"]
for name in ['storage','geometry','icons','richtext','export','main']:
 text=(root/f'src/{name}.js').read_text()
 text=re.sub(r'^import .*?;\s*$', '', text, flags=re.MULTILINE)
 text=re.sub(r'^export\s+', '',text,flags=re.MULTILINE)
 if name=='storage':
  text='const db = (()=> {\n'+text+'\nreturn {DB_NAME,DB_VERSION,openDb,transaction,getAll,getOne,put,remove,replaceCore,restoreAll,getNoteFiles,deletePermanently,blobToBase64,base64ToBlob};\n})();'
 if name=='main':
  parts.append('''// Native notification bridge is intentionally absent in the standalone web edition.
function androidNotificationsAvailable(){return false;}
async function refreshReminder(){return {supported:false};}
async function resetReminders(){return;}
async function cancelReminder(){return;}
''')
 parts.append(f'\n/* {name}.js */\n'+text)
(out/'app.js').write_text('\n'.join(parts))
print('Standalone browser edition:',out)
