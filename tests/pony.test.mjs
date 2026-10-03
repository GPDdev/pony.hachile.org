import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import test from 'node:test';

const script = readFileSync(new URL('../script.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../style.css', import.meta.url), 'utf8');

function mascot() {
  const listeners = {};
  const button = { addEventListener: (name, fn) => { listeners[name] = fn; }, setPointerCapture() {} };
  const pony = {
    dataset: {}, style: { left: '100px', top: '100px' }, offsetWidth: 228, offsetHeight: 260,
    classList: { contains: () => false },
    getBoundingClientRect() { return { left: parseFloat(this.style.left), top: parseFloat(this.style.top) }; }
  };
  const sprite = { style: {}, src: '' };
  const nodes = { '#desktop-pony': pony, '#pony-character': button, '#pony-sprite': sprite,
    '#pony-toggle': { addEventListener() {} } };
  const frames = new Map();
  const timers = new Map();
  let clock = 0, id = 0;
  const context = createContext({
    document: { querySelector: name => nodes[name] },
    window: { innerWidth: 1280, innerHeight: 900, addEventListener() {},
      matchMedia: () => ({ matches: false, addEventListener() {} }) },
    performance: { now: () => clock },
    requestAnimationFrame: fn => { frames.set(++id, fn); return id; },
    cancelAnimationFrame: key => frames.delete(key),
    setTimeout: fn => { timers.set(++id, fn); return id; },
    clearTimeout: key => timers.delete(key)
  });
  runInContext(script.slice(script.indexOf('const pony =')), context);
  return { pony, sprite, listeners, frames, context, timers,
    tick(time) { clock = time; const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn(time)); },
    run(code) { return runInContext(code, context); } };
}

test('all stationary actions stop immediately; only walking and flight move', () => {
  const pet = mascot();
  assert.equal(pet.pony.dataset.facing, 'right');
  pet.run("setAction('trot'); movePony(700, 100, 1000)");
  pet.tick(250);
  assert.equal(pet.pony.style.left, '250px');
  for (const state of ['stand', 'sit', 'yawn', 'dance', 'danceMove', 'laugh', 'boop', 'lie', 'applause']) {
    pet.run(`setAction('${state}'); movePony(800, 200, 1000)`);
    pet.tick(500);
    assert.equal(pet.pony.style.left, '250px', state);
    assert.equal(pet.pony.style.top, '100px', state);
    assert.equal(pet.frames.size, 0, state);
  }
});

test('drag flies left or right, and every subsequent action keeps the last facing', () => {
  const pet = mascot();
  pet.listeners.pointerdown({ button: 0, pointerId: 1, clientX: 180, clientY: 180 });
  pet.listeners.pointermove({ pointerId: 1, clientX: 130, clientY: 200 });
  assert.equal(pet.pony.dataset.action, 'fly');
  assert.equal(pet.pony.dataset.facing, 'left');
  assert.equal(pet.sprite.style.transform, 'scaleX(-1)');
  pet.listeners.pointermove({ pointerId: 1, clientX: 130, clientY: 220 });
  assert.equal(pet.pony.dataset.facing, 'left');
  pet.listeners.pointerup({ pointerId: 1 });
  const position = { ...pet.pony.style };
  for (const state of ['stand', 'sit', 'yawn', 'dance', 'danceMove', 'laugh', 'boop', 'lie', 'applause']) {
    pet.run(`setAction('${state}')`);
    assert.equal(pet.sprite.style.transform, 'scaleX(-1)', state);
    assert.deepEqual(pet.pony.style, position, state);
  }
  pet.run("setAction('trot'); movePony(700, 100, 1000, () => setAction('stand'))");
  pet.tick(1000);
  assert.equal(pet.pony.dataset.action, 'stand');
  assert.equal(pet.pony.dataset.facing, 'right');
  assert.equal(pet.sprite.style.transform, '');
  assert.equal(pet.frames.size, 0);
});

test('walking does not change altitude and GIFs keep native dimensions on all viewports', () => {
  assert.match(script, /: current\.top;/);
  assert.match(css, /\.pony-character img\{flex:none;width:auto;height:auto;max-width:none;/);
  assert.doesNotMatch(css, /transition:left|width:115px;height:125px/);
  assert.match(css, /\.desktop-pony\{[^}]*width:228px;height:260px;/);
});
