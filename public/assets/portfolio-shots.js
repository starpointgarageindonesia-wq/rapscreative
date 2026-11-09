/* Fallback between real-site screenshot services, then branded static preview. */
(()=>{"use strict";
for(const img of document.querySelectorAll(".raps-live-montage img[data-shot-fallback]")){
 img.addEventListener("error",()=>{
  if(img.dataset.fallbackTried==="yes"){img.hidden=true;return}
  img.dataset.fallbackTried="yes";
  img.src=img.dataset.shotFallback;
 });
}
})();