// service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('workman-sw.js', {
            scope: '/',
            origins: 'http://localhost:9080/'
        })
        .then(res => {
            console.log(`ServiceWorker registration successful with scope: ${res.scope}`)
        })
        .catch(err => {
            console.log(`serviceWorker registration failed: ${err}`)
        })
    })
}