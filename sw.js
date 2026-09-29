const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.avif'];
const VERSION = 'v4';

function relPrefix(pathname) {
  const segs = pathname.split('/').filter(Boolean);
  segs.pop();
  return segs.map(() => '../').join('') || './';
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

  const isImage = IMAGE_EXTS.some((ext) => url.pathname.toLowerCase().endsWith(ext));
  if (!isImage) return;

  const isNavigation = event.request.destination === 'document' || event.request.mode === 'navigate';
  if (!isNavigation) return;

  event.respondWith(
    new Response(formatPage(event.request.url, url.href), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  );
});