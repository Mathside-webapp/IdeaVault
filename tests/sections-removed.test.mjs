import test from 'node:test';
import assert from 'node:assert/strict';
import {exportBoardSvg} from '../src/export.js';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
test('section feature is absent from both board interfaces',()=>{
 assert.doesNotMatch(html,/sectionsLayer|sectionControlsLayer|data-action="add-section"/);
 assert.doesNotMatch(main,/renderSections|addSectionCenter|confirmSectionChange|data-menu-action="add-section"/);
});
test('export PNG source includes notes and red strings without sections',()=>{
 const noteA={id:'a',x:10,y:30,w:205,h:180,title:'Keep me',description:'still here'};
 const noteB={id:'b',x:320,y:120,w:205,h:180,title:'Second',description:'connect me'};
 const svg=exportBoardSvg([noteA,noteB],[{from:'a',to:'b',kind:'related'}],'Board');
 assert.match(svg,/Keep me/);assert.match(svg,/Second/);assert.match(svg,/stroke="#b34434"/);
 assert.doesNotMatch(svg,/New section|stroke-dasharray="13 8"/);
});
test('legacy section metadata is ignored on import but note contents are preserved',()=>{
 assert.match(main,/for\(const n of data\.notes\)delete n\.sectionId;data\.sections=\[\]/);
 assert.match(main,/tx=>tx\.objectStore\('sections'\)\.clear\(\)/);
});
