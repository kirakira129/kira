const archivesData = [
  { title: 'soon', date: '2026-01-01', file: 'archives/a.txt' },
  { title: 'Profit', date: 'Aug 14, 2026', file: 'archives/profit.txt' },
];

const memberSongs = {
  '$': { file: 'sounds/madeithome.mp3', title: 'made it home', artist: 'nettspend' },
  'mirva': { file: 'sounds/hope.mp3', title: 'do as you please just dont hurt me again', artist: 'lostallhope2010' },
  'kraken': { file: 'sounds/gummybear.mp3', title: 'The Gummy Bear Song', artist: 'gummibar' },
  '?': { file: 'sounds/yen.mp3', title: 'Yung Emo Ni**a', artist: 'Lil Tracy' },
  'abel': { file: 'sounds/freedocantdoit.mp3', title: 'free do/cant do it', artist: 'summrs' },
  'interpol': { file: 'sounds/entersandman.mp3', title: 'enter sandman', artist: 'metallica' },
};

const bgAudio = document.getElementById('bgMusic');
const nowPlaying = document.getElementById('nowPlaying');
const nowPlayingText = document.getElementById('nowPlayingText');
let currentSong = null;

const roster = document.getElementById('roster');
const archives = document.getElementById('archives');
const viewer = document.getElementById('viewer');
const imgs = document.getElementById('imgs');
const archivesList = document.getElementById('archivesList');
const fileTree = document.getElementById('fileTree');
const viewerTitle = document.getElementById('viewerTitle');
const viewerDate = document.getElementById('viewerDate');
const viewerContent = document.getElementById('viewerContent');

document.getElementById('enterBtn').addEventListener('click', () => {
  const screen = document.getElementById('loadingScreen');
  screen.classList.add('hidden');
  roster.classList.add('active');
  playBgMusic();
  setTimeout(() => {
    screen.style.display = 'none';
  }, 800);
});

function playBgMusic() {
  bgAudio.src = 'sounds/kira.mp3';
  bgAudio.loop = true;
  bgAudio.play().catch(() => {});
}

function playMemberSong(name) {
  const song = memberSongs[name];
  if (!song) return;
  bgAudio.pause();
  bgAudio.src = song.file;
  bgAudio.loop = true;
  bgAudio.play().catch(() => {});
  currentSong = song;
  nowPlayingText.textContent = `${song.title} \u2014 ${song.artist}`;
  nowPlaying.hidden = false;
}

let hiddenBtnCount = 0;
let chaosActive = false;

document.getElementById('hiddenBtn').addEventListener('click', () => {
  hiddenBtnCount++;
  if (hiddenBtnCount === 1) {
    const flash = document.getElementById('flash');
    flash.classList.add('show');
    const audio = new Audio('sounds/vb.mp3');
    audio.play();
    setTimeout(() => {
      flash.classList.remove('show');
    }, 500);
    return;
  }
  startChaos();
});

function startChaos() {
  if (chaosActive) return;
  chaosActive = true;

  const chaos = document.getElementById('chaos');
  const video = document.getElementById('chaosVideo');
  bgAudio.pause();
  nowPlaying.hidden = true;
  currentSong = null;
  document.title = 'KRAKEN THE GUMMY BEAR';
  chaos.hidden = false;
  video.currentTime = 0;
  video.play().catch(() => {});

  const vb = new Audio('sounds/vb.mp3');
  vb.loop = true;
  vb.play().catch(() => {});

  const ksi = new Audio('sounds/ksi.mp3');
  ksi.play().catch(() => {});

  setTimeout(() => {
    const goof = new Audio('sounds/goof.mp3');
    goof.play().catch(() => {});
  }, 1000);

  const gif = document.getElementById('chaosGif');
  gif.className = 'chaos-img';
  gif.style.width = '70vw';
  chaos.appendChild(gif);

  let rot = 0;
  const spin = setInterval(() => {
    rot += 15;
    gif.style.setProperty('--rot', `${rot}deg`);
    gif.style.left = `${Math.random() * 80}%`;
    gif.style.top = `${Math.random() * 80}%`;
  }, 250);

  const flashLayer = document.createElement('div');
  flashLayer.className = 'chaos-screen-flash';
  chaos.appendChild(flashLayer);

  const pulseTargets = document.querySelectorAll('.member, .roster-box, .archives-box');
  pulseTargets.forEach((el) => {
    el.style.transition = 'transform 0.15s ease';
  });
  const pulse = setInterval(() => {
    pulseTargets.forEach((el) => {
      el.style.transform = `scale(${0.97 + Math.random() * 0.06})`;
    });
  }, 150);

  const stop = () => {
    clearInterval(spin);
    clearInterval(pulse);
    video.pause();
    vb.pause();
    ksi.pause();
    gif.remove();
    flashLayer.remove();
    pulseTargets.forEach((el) => {
      el.style.transform = '';
      el.style.transition = '';
    });
    chaos.hidden = true;
    chaosActive = false;
  };
  chaos.dataset.stop = stop;
}

document.getElementById('archivesBtn').addEventListener('click', () => {
  roster.classList.remove('active');
  archives.classList.add('active');
});

document.getElementById('backBtn').addEventListener('click', () => {
  archives.classList.remove('active');
  roster.classList.add('active');
});

document.getElementById('viewerBack').addEventListener('click', () => {
  viewer.classList.remove('active');
  archives.classList.add('active');
});

document.getElementById('imgsBtn').addEventListener('click', () => {
  roster.classList.remove('active');
  imgs.classList.add('active');
  renderFileTree();
});

document.getElementById('imgsBack').addEventListener('click', () => {
  imgs.classList.remove('active');
  roster.classList.add('active');
});

function renderFileTree() {
  fileTree.innerHTML = '';
  Object.keys(IMG_TREE).forEach((name) => {
    fileTree.appendChild(buildTreeRow(name, IMG_TREE[name], name));
  });
}

function buildTreeRow(name, value, path) {
  if (value === null) {
    const row = document.createElement('div');
    row.className = 'tree-row';
    const spacer = document.createElement('span');
    spacer.className = 'tree-toggle';
    spacer.textContent = '';
    const link = document.createElement('a');
    link.className = 'tree-file-link';
    link.textContent = name;
    link.href = path;
    link.target = '_blank';
    row.appendChild(spacer);
    row.appendChild(link);
    return row;
  }

  const container = document.createElement('div');

  const row = document.createElement('div');
  row.className = 'tree-row tree-folder';

  const toggle = document.createElement('span');
  toggle.className = 'tree-toggle';
  toggle.textContent = '\u25B8';

  const label = document.createElement('span');
  label.className = 'tree-name';
  label.textContent = `${name}/`;

  row.appendChild(toggle);
  row.appendChild(label);

  const children = document.createElement('div');
  children.className = 'tree-children';
  Object.keys(value).forEach((childName) => {
    children.appendChild(buildTreeRow(childName, value[childName], `${path}/${childName}`));
  });
  container.appendChild(children);

  row.addEventListener('click', () => {
    const hidden = children.classList.toggle('hidden');
    toggle.textContent = hidden ? '\u25B8' : '\u25BE';
  });

  container.prepend(row);
  return container;
}

function renderArchives() {
  archivesList.innerHTML = '';
  archivesData.forEach((entry) => {
    const item = document.createElement('div');
    item.className = 'archive-item';

    const title = document.createElement('span');
    title.className = 'archive-title';
    title.textContent = entry.title;

    const date = document.createElement('span');
    date.className = 'archive-date';
    date.textContent = entry.date;

    item.appendChild(title);
    item.appendChild(date);
    item.addEventListener('click', () => openArchive(entry));
    archivesList.appendChild(item);
  });
}

async function openArchive(entry) {
  try {
    const res = await fetch(entry.file);
    const text = await res.text();
    const content = text.split(/\n\s*\n/).map((p) => `<p>${escapeHtml(p.trim())}</p>`).join('');
    viewerTitle.textContent = entry.title;
    viewerDate.textContent = entry.date;
    viewerContent.innerHTML = content;
    archives.classList.remove('active');
    viewer.classList.add('active');
  } catch (err) {
    viewerContent.textContent = `Could not load ${entry.file}`;
    viewerTitle.textContent = entry.title;
    viewerDate.textContent = entry.date;
    archives.classList.remove('active');
    viewer.classList.add('active');
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

let zoomLevel = 1;
const zoomSteps = [0.1, 0.15, 0.25, 0.4, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];

function setZoom(level) {
  zoomLevel = level;
  viewerContent.style.fontSize = `${zoomLevel}em`;
}

document.getElementById('zoomIn').addEventListener('click', () => {
  const next = zoomSteps.find((s) => s > zoomLevel);
  if (next) setZoom(next);
});

document.getElementById('zoomOut').addEventListener('click', () => {
  const prev = [...zoomSteps].reverse().find((s) => s < zoomLevel);
  if (prev) setZoom(prev);
});

document.querySelectorAll('.member').forEach((member) => {
  const nameEl = member.querySelector('.member-name');
  const name = nameEl ? nameEl.textContent : '';
  member.style.cursor = 'pointer';
  member.addEventListener('click', () => playMemberSong(name));
});

renderArchives();
