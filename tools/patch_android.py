#!/usr/bin/env python3
"""Apply shipped IdeaVault Android resources after `npx cap add android`."""
import pathlib, shutil
import xml.etree.ElementTree as ET
root=pathlib.Path(__file__).resolve().parents[1]
android=root/'android'
manifest=android/'app/src/main/AndroidManifest.xml'
if not manifest.exists():
 raise SystemExit('Run npx cap add android first.')
res=android/'app/src/main/res'
for folder in (root/'resources/android').iterdir():
 if folder.is_dir():
  dest=res/folder.name; dest.mkdir(exist_ok=True,parents=True)
  for file in folder.iterdir():shutil.copy2(file,dest/file.name)
for stale in (res/'mipmap-anydpi-v26').glob('ic_launcher*.xml') if (res/'mipmap-anydpi-v26').exists() else []:
 stale.unlink()
ET.register_namespace('android','http://schemas.android.com/apk/res/android')
ET.register_namespace('tools','http://schemas.android.com/tools')
ns='{http://schemas.android.com/apk/res/android}'
tree=ET.parse(manifest)
top=tree.getroot()
if not any(el.get(ns+'name')=='android.permission.POST_NOTIFICATIONS' for el in top.findall('uses-permission')):
 ET.Element('uses-permission')
 top.insert(0,ET.Element('uses-permission',{ns+'name':'android.permission.POST_NOTIFICATIONS'}))
application=top.find('application')
if application is not None:
 application.set(ns+'icon','@mipmap/ic_launcher')
 application.set(ns+'roundIcon','@mipmap/ic_launcher_round')
 application.set(ns+'label','IdeaVault')
tree.write(manifest,encoding='utf-8',xml_declaration=True)
styles = res/'values/styles.xml'
if styles.exists():
  styling=ET.parse(styles)
  sr=styling.getroot()
  for style in sr.findall('style'):
    if 'Launch' in style.get('name',''):
      item=next((i for i in style.findall('item') if i.get('name')=='android:windowBackground'),None)
      if item is None:
        item=ET.SubElement(style,'item',{'name':'android:windowBackground'})
      item.text='@drawable/splash'
  styling.write(styles,encoding='utf-8',xml_declaration=True)
print('IdeaVault Android permissions, icon and notification glyph installed.')
