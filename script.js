const themeButton = document.getElementById('theme'); let dark = false; try { const saved = localStorage.getItem('elaine-theme'); dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches } catch { } function applyTheme() { document.body.classList.toggle('dark', dark); themeButton.setAttribute('aria-pressed', String(dark)); themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode'); document.getElementById('theme-label').textContent = dark ? 'Light mode' : 'Dark mode'; document.getElementById('theme-icon').textContent = dark ? '☀' : '☾' } applyTheme(); themeButton.onclick = () => { dark = !dark; applyTheme(); try { localStorage.setItem('elaine-theme', dark ? 'dark' : 'light') } catch { } };
// CHANGE THESE IMAGE PATHS to your own pictures (one picture per pair).
// Both matching cards automatically use the same image.
const CARD_IMAGES = [
  'images/pair-1.jpg',
  'images/pair-2.jpg',
  'images/pair-3.jpg',
  'images/pair-4.jpg',
  'images/pair-5.jpg',
  'images/pair-6.jpg',
  'images/pair-7.jpg',
  'images/pair-8.jpg',
  'images/pair-9.jpg',
  'images/pair-10.jpg'
];
// ADD YOUR MUSIC FILE HERE. It plays after Start Game is clicked.
const MUSIC_FILE = 'audio/music.mp3';
const music = new Audio();
music.loop = true;
music.volume = 0.4;
let musicEnabled = true;
function startMusic() { if (!music.src) music.src = MUSIC_FILE; if (musicEnabled) music.play().catch(() => { }); }
function stopMusic() { music.pause(); music.currentTime = 0; }
const drawings = CARD_IMAGES.map((path, i) => ['Picture ' + (i + 1), path]);
let first = null, locked = false, moves = 0, matched = 0, start = 0, ticker, pending, epoch = 0; const $ = id => document.getElementById(id); function clock() { let n = start ? Math.floor((Date.now() - start) / 1000) : 0; return String(Math.floor(n / 60)).padStart(2, '0') + ':' + String(n % 60).padStart(2, '0') } function reset() { epoch++; clearInterval(ticker); clearTimeout(pending); $('win').close(); first = null; locked = false; moves = matched = start = 0; $('moves').textContent = 0; $('time').textContent = '00:00'; $('bar').style.width = '0'; let n = +$('level').value; $('pairs').textContent = '0 / ' + n; $('status').textContent = 'Take your time. Every flip is a fresh start.'; let deck = [...Array(n).keys(), ...Array(n).keys()]; for (let i = deck.length - 1; i > 0; i--) { let j = Math.floor(Math.random() * (i + 1));[deck[i], deck[j]] = [deck[j], deck[i]] } $('board').replaceChildren(); deck.forEach(id => { let b = document.createElement('button'); b.className = 'card'; b.dataset.id = id; b.setAttribute('aria-label', 'Reveal picture'); b.innerHTML = '<span class="card-inner"><span class="face card-back"><span class="back">✧</span></span><span class="face card-front"><img class="pair-image" src="' + CARD_IMAGES[id] + '" alt="" draggable="false"><span class="image-fallback" hidden>Picture ' + (id + 1) + '</span></span></span>'; b.querySelector('img').onerror = () => { b.querySelector('img').hidden = true; b.querySelector('.image-fallback').hidden = false }; b.onclick = () => flip(b); $('board').append(b) }) } function flip(b) { if (locked || b === first || b.classList.contains('matched')) return; if (!start) { start = Date.now(); ticker = setInterval(() => $('time').textContent = clock(), 500) } b.classList.add('open'); b.setAttribute('aria-label', drawings[b.dataset.id][0]); if (!first) { first = b; return } moves++; $('moves').textContent = moves; let a = first; first = null; if (a.dataset.id === b.dataset.id) { [a, b].forEach(c => { c.classList.replace('open', 'matched'); c.disabled = true }); matched++; let n = +$('level').value; $('pairs').textContent = matched + ' / ' + n; $('bar').style.width = matched / n * 100 + '%'; $('status').textContent = 'A lovely match! Keep going.'; if (matched === n) { clearInterval(ticker); $('result').textContent = 'You found all ' + n + ' pairs in ' + moves + ' moves and ' + clock() + '.'; pending = setTimeout(() => $('win').showModal(), 750) } } else { locked = true; $('status').textContent = 'Remember those pictures and try another pair.'; pending = setTimeout(() => { [a, b].forEach(c => { c.classList.remove('open'); c.setAttribute('aria-label', 'Reveal picture') }); locked = false }, 1300) } } function showMenu() { stopMusic(); clearInterval(ticker); clearTimeout(pending); $('win').close(); $('game-screen').hidden = true; $('start-screen').hidden = false; $('start-game').focus() } $('start-game').onclick = () => { startMusic(); $('level').value = document.querySelector('input[name="pair-count"]:checked').value; reset(); $('start-screen').hidden = true; $('game-screen').hidden = false; $('board').querySelector('button').focus() }; $('restart').onclick = showMenu; $('again').onclick = showMenu;
$('music-toggle').onclick = () => { musicEnabled = !musicEnabled; music.muted = !musicEnabled; $('music-toggle').textContent = musicEnabled ? 'Music: on' : 'Music: off'; $('music-toggle').setAttribute('aria-label', musicEnabled ? 'Mute music' : 'Unmute music'); $('music-toggle').setAttribute('aria-pressed', String(!musicEnabled)); if (musicEnabled) startMusic() };
