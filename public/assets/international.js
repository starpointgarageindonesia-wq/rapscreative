/* English static pages: keep existing RAPS controls and share saved dark mode preference. */
(()=>{"use strict";
 const root=document.documentElement;
 const save=(key,value)=>{try{localStorage.setItem(key,value)}catch{}};
 const get=(key,defaultValue)=>{try{return localStorage.getItem(key)||defaultValue}catch{return defaultValue}};
 function theme(value){const dark=value==="dark";root.dataset.theme=dark?"dark":"light";save("raps-theme",root.dataset.theme);
 document.querySelectorAll("[data-theme-toggle]").forEach(btn=>{btn.setAttribute("aria-pressed",String(dark));btn.setAttribute("aria-label",dark?"Switch to light mode":"Switch to dark mode");btn.setAttribute("title",dark?"Light mode":"Dark mode")})}
 document.querySelectorAll("[data-theme-toggle]").forEach(btn=>btn.addEventListener("click",()=>theme(root.dataset.theme==="dark"?"light":"dark")));
 document.querySelectorAll("[data-lang-choice]").forEach(btn=>btn.addEventListener("click",()=>{
 const choice=btn.dataset.langChoice==="id"?"id":"en";save("raps-language",choice);
 if(choice==="id"){const target=btn.dataset.idPath||"/";if(window.rapsSoftNavigate)void window.rapsSoftNavigate(target,"previous");else window.location.assign(target)}
 }));
 root.lang="en";save("raps-language","en");theme(get("raps-theme","light"));
 addEventListener("pageshow",()=>theme(get("raps-theme","light")));
})();
