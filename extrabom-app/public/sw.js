// EXTRABOM — Service Worker (modo offline)
// Guarda o app no aparelho; sem internet ele abre do cache e os dados
// ficam salvos localmente ate o sinal voltar (ai sincroniza sozinho).
const CACHE = 'extrabom-v2'
self.addEventListener('install', (e) => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['/','/logo.png','/manifest.webmanifest','/img/pote-redondo.jpg','/img/picole-leite.jpg','/img/picole-agua.jpg','/img/produtos.jpg']).catch(() => {}))) })
self.addEventListener('activate', (e) => { e.waitUntil((async () => { const ks = await caches.keys(); await Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))); await self.clients.claim() })()) })
self.addEventListener('fetch', (e) => {
  const req = e.request; if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== location.origin) return // Supabase etc: rede normal
  if (req.mode === 'navigate') { // paginas: rede primeiro, cache se offline
    e.respondWith((async () => { try { const r = await fetch(req); const c = await caches.open(CACHE); c.put('/', r.clone()); return r } catch (err) { const c = await caches.open(CACHE); return (await c.match('/')) || Response.error() } })()); return
  }
  // arquivos estaticos (JS, imagens): cache primeiro, atualiza por tras
  e.respondWith((async () => { const c = await caches.open(CACHE); const hit = await c.match(req); const rede = fetch(req).then((r) => { if (r.ok) c.put(req, r.clone()); return r }).catch(() => hit); return hit || rede })())
})

// PUSH: aviso chega mesmo com o app fechado (aparece igual mensagem de WhatsApp)
self.addEventListener('push', (e) => {
  let d = { title: 'EXTRABOM SORVETES', body: 'Voce tem um aviso novo.', url: '/' }
  try { if (e.data) d = { ...d, ...e.data.json() } } catch (err) { try { d.body = e.data.text() } catch (e2) {} }
  e.waitUntil(self.registration.showNotification(d.title, { body: d.body, icon: '/logo.png', badge: '/logo.png', tag: d.tag || 'extrabom-aviso', data: { url: d.url || '/' }, vibrate: [120, 60, 120] }))
})
self.addEventListener('notificationclick', (e) => {
  e.notification.close()
  const url = (e.notification.data && e.notification.data.url) || '/'
  e.waitUntil((async () => { const lista = await self.clients.matchAll({ type: 'window', includeUncontrolled: true }); for (const c of lista) { if ('focus' in c) { try { await c.navigate(url) } catch (err) {} return c.focus() } } if (self.clients.openWindow) return self.clients.openWindow(url) })())
})
