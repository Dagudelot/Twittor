// Imports
importScripts('js/sw-utils.js');

// Global constants
const STATIC_CACHE      = 'static-v1';
const INMUTABLE_CACHE   = 'inmutable-v1';
const DYNAMIC_CACHE     = 'dynamic-v1';

// APP_SHELL's
const APP_SHELL = [
    //'/',
    'index.html',
    'js/sw-utils.js',
    'img/favicon.ico',
    'css/style.css',
    'js/app.js',
    'img/avatars/spiderman.jpg',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg'
];

const APP_SHELL_INMUTABLE = [
    'css/animate.css',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'js/libs/jquery.js'
];

// SW Listeners
self.addEventListener('install', e => {

    const staticCache = caches.open( STATIC_CACHE ).then(cache => {
        return cache.addAll( APP_SHELL );
    });

    const inmutableCache = caches.open( INMUTABLE_CACHE ).then(cache => {
        return cache.addAll( APP_SHELL_INMUTABLE );
    });


    e.waitUntil( Promise.all([ staticCache, inmutableCache ]) );
});

self.addEventListener('activate', e => {

    cleanCache( STATIC_CACHE );

});

self.addEventListener('fetch', e => {

    const response = caches.match( e.request ).then(cacheResponse => {
        if( cacheResponse ){
            return cacheResponse;
        }
        
        return fetch( e.request ).then(onlineResponse => {
            return updateDynamicCache( DYNAMIC_CACHE, e.request, onlineResponse );
        });
    });

    e.respondWith( response );
});

