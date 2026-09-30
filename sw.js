const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.avif'];
const TEXT_EXTS = ['.json', '.txt', '.md', '.csv', '.log', '.xml'];
const PDF_EXTS = ['.pdf'];
const ALL_EXTS = [...IMAGE_EXTS, ...TEXT_EXTS, ...PDF_EXTS];
const VERSION = 'v5';

function relPrefix(pathname) {
  const segs = pathname.split('/').filter(Boolean);
  segs.pop();
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

  const isFile = ALL_EXTS.some((ext) => url.pathname.toLowerCase().endsWith(ext));
  if (!isFile) return;

  const isNavigation = event.request.destination === 'document' || event.request.mode === 'navigate';
  if (!isNavigation) return;

  const lower = url.pathname.toLowerCase();

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