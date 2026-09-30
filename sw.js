const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.avif'];
const TEXT_EXTS = ['.json', '.txt', '.md', '.csv', '.log', '.xml'];
const PDF_EXTS = ['.pdf'];
const ALL_EXTS = [...IMAGE_EXTS, ...TEXT_EXTS, ...PDF_EXTS];
const VERSION = 'v6';

function relPrefix(pathname) {
  const segs = pathname.split('/').filter(Boolean);
  segs.pop();
  return segs.map(() => '../').join('') || './';
}

function relPrefixFolder(pathname) {
  const segs = pathname.split('/').filter(Boolean);
  return segs.map(() => '../').join('') || './';
}

function formatTextPage(requestUrl, text) {
  const u = new URL(requestUrl);
  const prefix = relPrefix(u.pathname);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${u.pathname.split('/').pop()}</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: #000000;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  font-family: monospace;
}
.fig {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 16px;
  max-width: 100%;
}
.fig img { display: block; }
.fig .fig-logo { width: 140px; height: auto; }
.fig .fig-small { width: 40px; height: auto; }
.fig .fig-name { font-size: 14px; letter-spacing: 1px; }
pre {
  background: #111111;
  border: 1px solid #ffffff;
  padding: 24px;
  max-width: 100%;
  max-height: 65vh;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 13px;
  line-height: 1.5;
}
</style>
</head>
<body>
  <div class="fig">
    <img src="${prefix}img/deathnotelogo.png" alt="" class="fig-logo">
    <img src="${prefix}img/small.png" alt="" class="fig-small">
    <div class="fig-name">${u.pathname.split('/').pop()}</div>
    <pre>${text}</pre>
  </div>
</body>
</html>`;
}

function formatPage(requestUrl, imageUrl) {
  const u = new URL(requestUrl);
  const prefix = relPrefix(u.pathname);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>KIRA</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px;
}
.fig {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 16px;
}
.fig img { display: block; }
.fig .fig-logo { width: 140px; height: auto; }
.fig .fig-small { width: 40px; height: auto; }
.fig .fig-image {
  max-width: 100%;
  max-height: 65vh;
  object-fit: contain;
  border: 1px solid #ffffff;
}
</style>
</head>
<body>
  <div class="fig">
    <img src="${prefix}img/deathnotelogo.png" alt="" class="fig-logo">
    <img src="${prefix}img/small.png" alt="" class="fig-small">
    <img src="${imageUrl}" alt="archive image" class="fig-image">
  </div>
</body>
</html>`;
}

async function loadTreeData() {
  try {
    const dataUrl = new URL('./js/imgsData.js', self.registration.scope);
    const res = await fetch(dataUrl, { cache: 'no-store' });
    if (!res.ok) return {};
    const text = await res.text();
    const cleaned = text.replace(/^const\s+IMG_TREE\s*=\s*/, '');
    const data = Function('return ' + cleaned)();
    return data && typeof data === 'object' ? data : {};
  } catch (err) {
    return {};
  }
}

function resolveFolder(tree, segs) {
  let node = tree;
  for (const s of segs) {
    if (!node || !Object.prototype.hasOwnProperty.call(node, s)) return null;
    node = node[s];
  }
  return node && typeof node === 'object' && node !== null ? node : null;
}

function treeListHtml(node) {
  return Object.keys(node)
    .map((name) => {
      if (node[name] === null) {
        return `<li class="file"><a href="${name}">${name}</a></li>`;
      }
      return `<li class="folder"><details open><summary>${name}/</summary><ul>${treeListHtml(node[name])}</ul></details></li>`;
    })
    .join('');
}

function formatTreePage(requestUrl, folderName, listHtml) {
  const u = new URL(requestUrl);
  const prefix = relPrefixFolder(u.pathname);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${folderName}</title>
<style>
@font-face {
  font-family: 'DeathNote';
  src: url('${prefix}fonts/Death-Note.ttf') format('truetype');
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'DeathNote', sans-serif;
  background: #000000;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px;
  overflow: hidden;
}
.archives-box {
  position: relative;
  width: 100%;
  max-width: 560px;
  border: 1px solid #ffffff;
  padding: 48px 32px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}
.logo-break {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  background: #000000;
  padding: 0 12px;
  line-height: 0;
}
.logo-break img { width: 90px; height: auto; display: block; }
.small { width: 60px; height: auto; }
.folder-name {
  font-size: 0.9rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  padding-bottom: 12px;
  width: 100%;
  text-align: center;
}
.file-tree {
  width: 100%;
  max-height: 50vh;
  overflow-y: auto;
  font-size: 0.85rem;
  letter-spacing: 1px;
}
.file-tree ul { list-style: none; }
.file-tree li { padding: 6px 0; }
.tree-children { padding-left: 20px; border-left: 1px solid rgba(255, 255, 255, 0.2); }
.folder > ul { padding-left: 20px; border-left: 1px solid rgba(255, 255, 255, 0.2); }
.folder summary { cursor: pointer; font-weight: bold; }
.folder summary:hover { color: #aaaaaa; }
.folder summary::-webkit-details-marker { display: none; }
.folder summary { list-style: none; }
.folder summary::before { content: '\\25B8 '; color: rgba(255, 255, 255, 0.6); }
.folder[open] > summary::before { content: '\\25BE '; }
.file { border-bottom: 1px solid rgba(255, 255, 255, 0.12); }
.file a { color: #ffffff; text-decoration: none; word-break: break-all; }
.file a:hover { color: #aaaaaa; }
.file-tree::-webkit-scrollbar { width: 4px; }
.file-tree::-webkit-scrollbar-track { background: transparent; }
.file-tree::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.4); }
.file-tree { scrollbar-width: thin; scrollbar-color: rgba(255, 255, 255, 0.4) transparent; }
</style>
</head>
<body>
  <div class="archives-box">
    <div class="logo-break">
      <img src="${prefix}img/deathnotelogo.png" alt="death note logo">
    </div>
    <img src="${prefix}img/small.png" alt="" class="small">
    <div class="folder-name">${folderName}/</div>
    <div class="file-tree"><ul>${listHtml}</ul></div>
  </div>
</body>
</html>`;
}

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;
  if (url.pathname.split('/').includes('img')) return;

  const lower = url.pathname.toLowerCase();
  const isFile = ALL_EXTS.some((ext) => lower.endsWith(ext));
  const isNavigation = event.request.destination === 'document' || event.request.mode === 'navigate';
  if (!isNavigation) return;

  if (!isFile) {
    const segs = url.pathname.split('/').filter(Boolean);
    if (segs.length === 0) return;
    event.respondWith(
      loadTreeData().then((tree) => {
        const node = resolveFolder(tree, segs);
        const folderName = segs[segs.length - 1];
        const listHtml = node ? treeListHtml(node) : '';
        return new Response(formatTreePage(event.request.url, folderName, listHtml), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      })
    );
    return;
  }

  if (PDF_EXTS.some((ext) => lower.endsWith(ext))) {
    event.respondWith(fetch(event.request));
    return;
  }

  if (TEXT_EXTS.some((ext) => lower.endsWith(ext))) {
    event.respondWith(
      fetch(event.request)
        .then((res) => res.text())
        .then((text) =>
          new Response(formatTextPage(event.request.url, text), {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          })
        )
    );
    return;
  }

  event.respondWith(
    new Response(formatPage(event.request.url, url.href), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  );
});