import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');
test('stylesheet does not import a data URI as a local file', () => {
  assert.doesNotMatch(css, /@import\s+(?:url\()?['"]?data:text\/css,/i);
});
test('cork texture is a local project asset', () => {
  assert.match(css, /\/assets\/cork\.jpg/);
  assert.ok(fs.existsSync(new URL('../public/assets/cork.jpg', import.meta.url)));
});
