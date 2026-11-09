
(()=>{"use strict";
 const menu=document.querySelector(".mobile-nav");
 menu?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{menu.open=false}));
 const indicator=document.getElementById("scroll-indicator");
 let frame=false;
 const sync=()=>{let d=Math.max(1,document.documentElement.scrollHeight-innerHeight);if(indicator)indicator.style.width=Math.min(100,Math.max(0,scrollY/d*100))+"%";frame=false};
 addEventListener("scroll",()=>{if(!frame){frame=true;requestAnimationFrame(sync)}},{passive:true});addEventListener("resize",sync,{passive:true});sync();
 const reduced=matchMedia("(prefers-reduced-motion:reduce)").matches;
 if(!reduced&&"IntersectionObserver" in window){
 const items=[...document.querySelectorAll(".reveal")];
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("seen");observer.unobserve(e.target)}}),{threshold:.06,rootMargin:"0px 0px -15px 0px"});
 items.forEach(el=>observer.observe(el));document.body.classList.add("animate-in");
 }
 const dialog=document.getElementById("benefit-dialog");
 if(dialog){
 const p=[];
 let lastTrigger=null;
 const fields={group:document.getElementById("benefit-group"),title:document.getElementById("benefit-title"),desc:document.getElementById("benefit-desc"),price:document.getElementById("benefit-price"),care:document.getElementById("benefit-care"),features:document.getElementById("benefit-features"),note:document.getElementById("benefit-note"),contact:document.getElementById("benefit-contact")};
 document.querySelectorAll("button[data-plan]").forEach(btn=>btn.addEventListener("click",()=>{
 const plan=p[Number(btn.dataset.plan)];if(!plan)return;lastTrigger=btn;
 fields.group.textContent=plan.group;fields.title.textContent=plan.name;fields.desc.textContent=plan.desc;fields.price.textContent=plan.price;fields.care.textContent=plan.care;
 fields.features.replaceChildren(...plan.benefits.map(t=>{const li=document.createElement("li");li.textContent=t;return li}));fields.note.textContent=plan.note;
 fields.contact.href="https://wa.me/6285822529630?text="+encodeURIComponent("Halo RAPS Creative, aku mau konsultasi paket "+plan.group+" — "+plan.name+" ("+plan.price+").");
 if(dialog.showModal)dialog.showModal();else dialog.setAttribute("open","");
 }));
 document.getElementById("dialog-close").addEventListener("click",()=>dialog.close());
 dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
 dialog.addEventListener("close",()=>lastTrigger?.focus());
 }
})();


/* Tactile feedback: native links keep normal navigation and benefit buttons keep their modal. */
(()=>{
 const reduced=window.matchMedia&&window.matchMedia("(prefers-reduced-motion:reduce)").matches;
 if(reduced)return;
 const targets=document.querySelectorAll(".btn,.nav-cta,.price-details,.mobile-chat,.service-tile");
 for(const item of targets){
  let tid;
  item.addEventListener("pointerdown",event=>{
   if(event.button!==0)return;
   item.classList.remove("tap-pop");
   item.classList.add("is-pressed");
  },{passive:true});
  item.addEventListener("pointerup",()=>{
   item.classList.remove("is-pressed");
   item.classList.remove("tap-pop");
   void item.offsetWidth;
   item.classList.add("tap-pop");
   clearTimeout(tid);
   tid=setTimeout(()=>item.classList.remove("tap-pop"),420);
  },{passive:true});
  item.addEventListener("pointercancel",()=>item.classList.remove("is-pressed"),{passive:true});
  item.addEventListener("pointerleave",()=>item.classList.remove("is-pressed"),{passive:true});
 }
})();


/* Horizontal swipe navigation across RAPS Creative pages (touch-only). */
(()=>{
 "use strict";
 const routes=["/","/website/","/ugc/","/editing/","/content-creation/","/social-media/","/portofolio/"];
 const canonical=location.pathname.replace(/\/index\.html$/,"/").replace(/\/{2,}/g,"/");
 const page=canonical.endsWith("/")?canonical:canonical+"/";
 const index=routes.indexOf(page);
 if(index<0||!window.addEventListener)return;
 let start=null,changing=false;
 const ignore='a,button,input,textarea,select,summary,[contenteditable="true"],[role="slider"],[data-no-swipe]';
 document.addEventListener("touchstart",(event)=>{
  if(event.touches.length!==1||changing||document.querySelector("dialog[open]")){start=null;return}
  const t=event.target;
  if(t?.closest?.(ignore)){start=null;return}
  const p=event.touches[0];start={x:p.clientX,y:p.clientY,time:Date.now()};
 },{passive:true});
 document.addEventListener("touchcancel",()=>{start=null},{passive:true});
 document.addEventListener("touchend",(event)=>{
  if(!start||changing||event.changedTouches.length!==1){start=null;return}
  const p=event.changedTouches[0],dx=p.clientX-start.x,dy=p.clientY-start.y,elapsed=Date.now()-start.time;start=null;
  const width=Math.max(document.documentElement.clientWidth,320);
  if(elapsed>1300||Math.abs(dx)<Math.min(95,width*.18)||Math.abs(dx)<Math.abs(dy)*1.65)return;
  const target=routes[index+(dx<0?1:-1)];
  if(!target)return;
  changing=true;
  const reduced=window.matchMedia?.("(prefers-reduced-motion:reduce)")?.matches;
  if(reduced){location.assign(target);return}
  document.body.classList.add(dx<0?"swipe-out-left":"swipe-out-right");
  location.assign(target);
 },{passive:true});
})();
