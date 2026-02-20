self.addEventListener("install",e=>{
 e.waitUntil(
  caches.open("ntu-v1").then(cache=>{
   return cache.addAll(["/","/index.html"]);
  })
 );
});