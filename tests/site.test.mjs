import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = readFileSync(new URL('../script.js', import.meta.url), 'utf8');

test('five official tracks, page sections and pony GIFs are wired up', () => {
  assert.equal((html.match(/class="track(?: is-selected)?" data-track=/g) ?? []).length, 5);
  assert.equal((script.match(/id: '\d{10}'/g) ?? []).length, 5);
  for (const section of ['about', 'interests', 'worlds', 'music', 'contact']) {
    assert.match(html, new RegExp(`id="${section}"`));
  }
  for (const state of ['stand', 'trot', 'fly', 'sit', 'yawn', 'dance-4', 'boop']) {
    assert.ok(existsSync(join(fileURLToPath(root), 'gif', `pony-town-Skyblue new2-${state}-blinking-padded-4x.gif`)), `${state} GIF missing`);
  }
});
