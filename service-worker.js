const staticQcredible = "qcredible-sign"
const assets = [
  "/",
  "/sign.html",
  "/css/index.css",
  "/css/cards.css",
  "/css/fonts/",
  "/js/scripts.js",
  "/js/script.js",
  "/js/js.cookie.min.js",
  "/js/sign-api.js",
  "/js/sign-session-check.js",
  "/js/vue.js",
  "/js/jquery-2.1.4.min.js",
  "/images/loader.gif",
  "/images/logo-client-1.jpg",
  "/images/logo-client-2.jpg",
  "/images/logo-client-3.jpg",
  "/images/logo-client-3.png",
  "/images/logo-client-4.jpg",
  "/images/logo-client-5.jpg",
  "/images/logo-client-6.jpg",
  "/images/logo.png"
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticQcredible).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })