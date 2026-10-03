const tracks = [
  { title: "Equestria's Finest", artist: 'Neighsayer', id: '1923097646', url: 'https://neighsayer.bandcamp.com/track/equestrias-finest-2' },
  { title: 'Walking With Shadows', artist: 'Turquoise Splash · FritzyBeat · 4everfreebrony', id: '3823201151', url: 'https://turquoisesplash.bandcamp.com/track/walking-with-shadows-feat-fritzybeat-4everfreebrony' },
  { title: 'Where We Belong', artist: 'Turquoise Splash · John Kenza', id: '1199042124', url: 'https://poniesatdawn.bandcamp.com/track/where-we-belong' },
  { title: 'Loyalty (Aviators Remix)', artist: 'AcousticBrony · MandoPony · Aviators', id: '2931663848', url: 'https://soundoftheaviators.bandcamp.com/track/loyalty-aviators-remix' },
  { title: 'A Summer in the Stars', artist: 'Forest Rain', id: '2744710307', url: 'https://forestrain.bandcamp.com/track/a-summer-in-the-stars' }
];

const revealItems = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

const trackButtons = [...document.querySelectorAll('[data-track]')];
const embedSlot = document.querySelector('#embed-slot');
const loadButton = document.querySelector('#load-player');
let selectedTrack = 0;

function selectTrack(index) {
  selectedTrack = index;
  const track = tracks[index];
  trackButtons.forEach((button, buttonIndex) => {
    const selected = buttonIndex === index;
    button.classList.toggle('is-selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  document.querySelector('#current-title').textContent = track.title;
  document.querySelector('#current-artist').textContent = track.artist;
  document.querySelector('#official-link').href = track.url;
  embedSlot.replaceChildren(loadButton); // Replacing the iframe stops the previous track.
}

trackButtons.forEach(button => button.addEventListener('click', () => selectTrack(Number(button.dataset.track))));
loadButton.addEventListener('click', () => {
  const track = tracks[selectedTrack];
  const frame = document.createElement('iframe');
  frame.title = `Bandcamp 官方播放器：${track.title}`;
  frame.loading = 'lazy';
  frame.allow = 'autoplay; encrypted-media';
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  frame.src = `https://bandcamp.com/EmbeddedPlayer/v=2/track=${track.id}/size=large/tracklist=false/artwork=small/transparent=true/`;
  embedSlot.replaceChildren(frame);
});

const pony = document.querySelector('#desktop-pony');
const ponyButton = document.querySelector('#pony-character');
const sprite = document.querySelector('#pony-sprite');
const ponyToggle = document.querySelector('#pony-toggle');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const gifBase = 'gif/pony-town-Skyblue%20new2-';
const actions = {
  stand: 'stand', trot: 'trot', fly: 'fly', sit: 'sit', yawn: 'yawn',
  dance: 'dance-4', danceMove: 'dance%20move%201', laugh: 'laugh', boop: 'boop', lie: 'lie', applause: 'applause'
};
let action = 'stand';
let roamTimer;
let drag;
let motionFrame;
let facing = 1;
pony.dataset.action = action;
pony.dataset.facing = 'right';

function stopMovement() {
  cancelAnimationFrame(motionFrame);
  motionFrame = null;
}

function faceDirection(deltaX) {
  if (deltaX === 0) return;
  facing = deltaX < 0 ? -1 : 1;
  sprite.style.transform = facing === -1 ? 'scaleX(-1)' : '';
  pony.dataset.facing = facing === -1 ? 'left' : 'right';
}

function setAction(next) {
  if (next !== 'trot' && next !== 'fly') stopMovement();
  if (action === next) return;
  action = next;
  pony.dataset.action = next;
  sprite.src = `${gifBase}${actions[next]}-blinking-padded-4x.gif`;
}

function clampPony(x, y) {
  return {
    x: Math.max(0, Math.min(x, window.innerWidth - pony.offsetWidth)),
    y: Math.max(0, Math.min(y, window.innerHeight - pony.offsetHeight))
  };
}

function placePony(x, y) {
  const point = clampPony(x, y);
  pony.style.left = `${point.x}px`;
  pony.style.top = `${point.y}px`;
}

function movePony(x, y, duration = 0, onArrive) {
  stopMovement();
  if (action !== 'trot' && action !== 'fly') return;
  const start = pony.getBoundingClientRect();
  const target = clampPony(x, y);
  faceDirection(target.x - start.left);
  if (duration === 0) {
    placePony(target.x, target.y);
    onArrive?.();
    return;
  }
  const started = performance.now();
  function step(now) {
    if (action !== 'trot' && action !== 'fly') return;
    const progress = Math.min(1, (now - started) / duration);
    placePony(start.left + (target.x - start.left) * progress, start.top + (target.y - start.top) * progress);
    if (progress < 1) motionFrame = requestAnimationFrame(step);
    else { motionFrame = null; onArrive?.(); }
  }
  motionFrame = requestAnimationFrame(step);
}

function scheduleRoam(delay = 3500) {
  clearTimeout(roamTimer);
  if (drag || reduceMotion.matches || pony.classList.contains('is-hidden')) return;
  roamTimer = setTimeout(() => {
    if (drag || reduceMotion.matches || pony.classList.contains('is-hidden')) return;
    const fly = Math.random() < .34;
    const current = pony.getBoundingClientRect();
    const nextX = 12 + Math.random() * Math.max(0, window.innerWidth - pony.offsetWidth - 24);
    const nextY = fly
      ? 70 + Math.random() * Math.max(0, window.innerHeight * .43 - pony.offsetHeight)
      : current.top; // Walking stays on the current horizontal line; only flight changes height.
    const distance = Math.hypot(nextX - current.left, nextY - current.top);
    const duration = Math.max(2700, Math.min(8000, distance * 11));
    setAction(fly ? 'fly' : 'trot');
    movePony(nextX, nextY, duration, () => {
      const idleActions = ['stand', 'sit', 'yawn', 'dance', 'danceMove', 'laugh', 'lie', 'applause'];
      setAction(idleActions[Math.floor(Math.random() * idleActions.length)]);
      scheduleRoam(2500 + Math.random() * 4000);
    });
  }, delay);
}

function stopRoam() {
  clearTimeout(roamTimer);
  stopMovement();
}

ponyButton.addEventListener('pointerdown', event => {
  if (event.button !== 0) return;
  stopRoam();
  setAction('stand');
  const rect = pony.getBoundingClientRect();
  drag = { id: event.pointerId, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top, startX: event.clientX, startY: event.clientY, moved: false };
  ponyButton.setPointerCapture(event.pointerId);
});

ponyButton.addEventListener('pointermove', event => {
  if (!drag || drag.id !== event.pointerId) return;
  if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 5) drag.moved = true;
  if (drag.moved) {
    setAction('fly');
    movePony(event.clientX - drag.offsetX, event.clientY - drag.offsetY);
  }
});

function finishDrag(event) {
  if (!drag || drag.id !== event.pointerId) return;
  setAction(drag.moved ? 'stand' : 'boop');
  drag = null;
  scheduleRoam(4500);
}
ponyButton.addEventListener('pointerup', finishDrag);
ponyButton.addEventListener('pointercancel', finishDrag);
ponyButton.addEventListener('lostpointercapture', finishDrag);
ponyButton.addEventListener('click', event => {
  if (event.detail !== 0) return;
  stopRoam();
  setAction('boop');
  scheduleRoam(4500);
});
ponyButton.addEventListener('keydown', event => {
  const delta = { ArrowLeft: [-24, 0], ArrowRight: [24, 0], ArrowUp: [0, -24], ArrowDown: [0, 24] }[event.key];
  if (!delta) return;
  event.preventDefault();
  stopRoam();
  const rect = pony.getBoundingClientRect();
  setAction(delta[1] === 0 ? 'trot' : 'fly');
  movePony(rect.left + delta[0], rect.top + delta[1], reduceMotion.matches ? 0 : 180, () => setAction('stand'));
  scheduleRoam(5000);
});

ponyToggle.addEventListener('click', () => {
  const visible = pony.classList.toggle('is-hidden') === false;
  ponyToggle.textContent = visible ? '✕' : '✦';
  ponyToggle.setAttribute('aria-pressed', String(visible));
  ponyToggle.setAttribute('aria-label', visible ? '收起桌面小马' : '召唤桌面小马');
  if (visible) { setAction('stand'); scheduleRoam(); } else stopRoam();
});

window.addEventListener('resize', () => {
  const rect = pony.getBoundingClientRect();
  stopRoam();
  placePony(rect.left, rect.top); // Re-clamp only when the viewport itself changes.
  if (!drag) { setAction('stand'); scheduleRoam(); }
});
reduceMotion.addEventListener('change', () => {
  if (reduceMotion.matches) { stopRoam(); setAction('stand'); }
  else scheduleRoam();
});
if (!reduceMotion.matches) scheduleRoam(5000);
