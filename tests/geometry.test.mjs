import test from 'node:test';
import assert from 'node:assert/strict';
import { allowedLink, stringPath, worldPoint, zoomAround } from '../src/geometry.js';
test('connection rejects self-link and duplicates regardless of direction',()=>{
 const links=[{boardId:'todo',from:'one',to:'two'}];
 assert.equal(allowedLink(links,'todo','one','one','related'),false);
 assert.equal(allowedLink(links,'todo','two','one','related'),false);
 assert.equal(allowedLink(links,'todo','one','three','related'),true);
 assert.equal(allowedLink(links,'ideas','one','two','related'),true);
});
test('string path joins pin positions and responds to move',()=>{
 const a={x:30,y:60,w:200},b={x:230,y:100,w:200};
 const before=stringPath(a,b);assert.match(before,/M 130 77/);b.x=500;assert.notEqual(stringPath(a,b),before);
});
test('zoom keeps pointer over same world coordinate',()=>{
 const b={ox:22,oy:39,zoom:1};const rect={left:150,top:40};const before=worldPoint(400,320,rect,b);zoomAround(b,1.7,400,320,rect);const after=worldPoint(400,320,rect,b);assert.ok(Math.abs(before.x-after.x)<.001);assert.ok(Math.abs(before.y-after.y)<.001);
});
