#!/usr/bin/env python3
"""Deterministic, locally generated Android launcher and notification icons."""
from PIL import Image,ImageDraw,ImageFilter
from pathlib import Path
base=Path(__file__).resolve().parents[1]/'resources/android'
for dens,pixels in {'mdpi':48,'hdpi':72,'xhdpi':96,'xxhdpi':144,'xxxhdpi':192}.items():
 size=pixels*4
 im=Image.new('RGBA',(size,size),(0,0,0,0));d=ImageDraw.Draw(im)
 u=size/512
 def box(coords):return tuple(round(z*u) for z in coords)
 d.rounded_rectangle(box((10,10,502,502)),radius=int(105*u),fill='#353b34')
 d.rounded_rectangle(box((68,77,443,434)),radius=int(38*u),fill='#815637')
 d.rounded_rectangle(box((85,94,426,418)),radius=int(25*u),fill='#bf9870')
 d.polygon([box((112,148))[:2],box((266,122))[:2],box((303,324))[:2],box((143,344))[:2]],fill='#f5dcab')
 d.polygon([box((252,198))[:2],box((389,222))[:2],box((371,347))[:2],box((233,325))[:2]],fill='#f1c7c3')
 d.line([box((204,160))[:2],box((336,225))[:2]],fill='#a63f38',width=max(2,int(9*u)))
 for x,y in [(204,160),(336,225)]:
  r=19
  d.ellipse(box((x-r,y-r,x+r,y+r)),fill='#a64f3d',outline='#7e342c',width=max(1,int(4*u)))
  d.ellipse(box((x-9,y-11,x-1,y-3)),fill='#e9a788')
 d.line([box((162,231))[:2],box((237,225))[:2]],fill='#c3a782',width=max(2,int(8*u)))
 d.line([box((166,258))[:2],box((240,252))[:2]],fill='#c3a782',width=max(2,int(8*u)))
 path=base/f'mipmap-{dens}';path.mkdir(exist_ok=True,parents=True)
 im.resize((pixels,pixels),Image.Resampling.LANCZOS).save(path/'ic_launcher.png')
 im.resize((pixels,pixels),Image.Resampling.LANCZOS).save(path/'ic_launcher_round.png')
# Android monochrome notification icon, alpha white only
for dens,pixels in {'mdpi':24,'hdpi':36,'xhdpi':48,'xxhdpi':72,'xxxhdpi':96}.items():
 size=pixels*4
 im=Image.new('RGBA',(size,size));d=ImageDraw.Draw(im)
 u=size/100
 def b(coords):return tuple(int(v*u) for v in coords)
 d.rounded_rectangle(b((15,13,85,87)),radius=int(7*u),outline='white',width=max(1,int(6*u)))
 d.rounded_rectangle(b((25,26,61,72)),radius=int(3*u),fill='white')
 d.rounded_rectangle(b((60,43,79,77)),radius=int(3*u),fill='white')
 d.line([b((48,37))[:2],b((69,48))[:2]],fill='white',width=max(1,int(4*u)))
 path=base/f'drawable-{dens}';path.mkdir(exist_ok=True,parents=True)
 im.resize((pixels,pixels),Image.Resampling.LANCZOS).save(path/'ic_stat_ideavault.png')
