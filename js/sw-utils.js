function cleanCache( staticCache, dynamicCache ){

    return caches.keys().then(keys => {

        keys.forEach(key => {
            // If key has 'static' and is different from actual STATIC_CACHE version
            if(key.includes( 'static' ) && key !== staticCache){
                return caches.delete( key );
            }

            // If key has 'dynamic' and is different from actual DYNAMIC_CACHE version
            if(key.includes( 'dynamic' ) && key !== dynamicCache){
                return caches.delete( key );
            }
        })

    })

}

function updateDynamicCache( dynamicCache, req, res ){

    if( res.ok ){
        caches.open( dynamicCache ).then(cache => {
            cache.put( req, res.clone() );
            return res.clone();
        });
    }

    return res.clone();
}