
(()=>{"use strict";
 const menu=document.querySelector(".mobile-nav");
 menu?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{menu.open=false}));
 const indicator=document.getElementById("scroll-indicator");
 let frame=false;
 const sync=()=>{let d=Math.max(1,document.documentElement.scrollHeight-innerHeight);if(indicator)indicator.style.width=Math.min(100,Math.max(0,scrollY/d*100))+"%";frame=false};
 addEventListener("scroll",()=>{if(!frame){frame=true;requestAnimationFrame(sync)}},{passive:true});addEventListener("resize",sync,{passive:true});sync();
 const reduced=matchMedia("(prefers-reduced-motion:reduce)").matches;
 if(!reduced&&"IntersectionObserver" in window){
 const selector=".reveal,.service-tile,.story-card,.price-card,.faq,.project-detail,.promo-note,.feature-banner-inner,.service-finale-inner,.last-cta-inner";
 const items=[...document.querySelectorAll(selector)];
 const orderByParent=new Map();
 items.forEach(el=>{
  if(!el.classList.contains("reveal"))el.classList.add("scroll-reveal");
  const parent=el.parentElement,order=orderByParent.get(parent)||0;
  orderByParent.set(parent,order+1);
  el.style.setProperty("--reveal-stagger",`${Math.min(order,4)*58}ms`);
 });
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  const el=entry.target,box=entry.boundingClientRect;
  if(document.documentElement.classList.contains("swipe-tracking")||document.documentElement.classList.contains("swipe-exiting"))return;
  if(entry.isIntersecting){
   const fromBottom=box.top>innerHeight*.52;
   el.style.setProperty("--reveal-y",fromBottom?"78px":"-78px");
   el.style.setProperty("--reveal-angle",fromBottom?"-2deg":"2deg");
   el.classList.add("seen");
  }else{
   const above=box.bottom<0;
   el.style.setProperty("--reveal-y",above?"-78px":"78px");
   el.style.setProperty("--reveal-angle",above?"-2deg":"2deg");
   el.classList.remove("seen");
  }
 }),{threshold:.13,rootMargin:"-6% 0px -8% 0px"});
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
  let pressPoint=null;
  item.addEventListener("pointerdown",event=>{
   if(event.button!==0)return;
   pressPoint={x:event.clientX,y:event.clientY};
   item.classList.remove("tap-pop");
   item.classList.add("is-pressed");
  },{passive:true});
  item.addEventListener("pointerup",event=>{
   item.classList.remove("is-pressed");
   const moved=pressPoint&&Math.hypot(event.clientX-pressPoint.x,event.clientY-pressPoint.y)>12;
   pressPoint=null;
   if(moved)return;
   item.classList.remove("tap-pop");
   void item.offsetWidth;
   item.classList.add("tap-pop");
   clearTimeout(tid);
   tid=setTimeout(()=>item.classList.remove("tap-pop"),420);
  },{passive:true});
  item.addEventListener("pointercancel",()=>{pressPoint=null;item.classList.remove("is-pressed")},{passive:true});
  item.addEventListener("pointerleave",()=>item.classList.remove("is-pressed"),{passive:true});
 }
})();


/* Horizontal swipe navigation across RAPS Creative pages (touch-only). */
(()=>{
 "use strict";
 const routes=["/","/website/","/ugc/","/editing/","/content-creation/","/marketing/","/social-media/","/undangan-digital/","/paket/","/harga/"];
 const canonical=location.pathname.replace(/\/index\.html$/,"/").replace(/\/{2,}/g,"/");
 const page=canonical.endsWith("/")?canonical:canonical+"/";
 const index=routes.indexOf(page);
 if(index<0||!window.addEventListener)return;
 const root=document.documentElement,body=document.body,reduced=matchMedia("(prefers-reduced-motion:reduce)").matches;
 const arrivalKey="raps-swipe-arrival";
 try{
  const arrival=sessionStorage.getItem(arrivalKey);
  sessionStorage.removeItem(arrivalKey);
  if(!reduced&&(arrival==="next"||arrival==="previous")){
   root.dataset.swipeArrival=arrival;
   body.classList.add("swipe-entering");
   body.style.transformOrigin=`50% ${scrollY+innerHeight/2}px`;
   const finishArrival=event=>{
    if(event.target!==body||!event.animationName.startsWith("raps-swipe-enter-"))return;
    body.classList.remove("swipe-entering");
    body.style.removeProperty("transform-origin");
    delete root.dataset.swipeArrival;
    body.removeEventListener("animationend",finishArrival);
   };
   body.addEventListener("animationend",finishArrival);
  }
 }catch{}
 const labels=["Beranda","Website","UGC","Editing","Konten","Marketing","Social Media","Undangan","Bundling","Harga"];
 const header=document.querySelector(".site-header");
 if(header){
  const guide=document.createElement("div");
  guide.className="swipe-guide";
  guide.setAttribute("role","note");
  guide.setAttribute("aria-label","Geser kiri atau kanan untuk melihat layanan lain");
  const motion=document.createElement("span");
  motion.className="swipe-guide-motion";
  motion.setAttribute("aria-hidden","true");
  motion.append(document.createElement("i"));
  const copy=document.createElement("span");
  copy.className="swipe-guide-copy";
  copy.textContent="Geser kiri/kanan untuk layanan lain";
  const count=document.createElement("strong");
  count.className="swipe-guide-count";
  count.textContent=`${labels[index]} · ${index+1}/${routes.length}`;
  guide.append(motion,copy,count);
  header.after(guide);
 }
 [routes[index-1],routes[index+1]].filter(Boolean).forEach(href=>{
  const link=document.createElement("link");link.rel="prefetch";link.as="document";link.href=href;document.head.append(link);
 });
 let start=null,changing=false;
 const ignore='button,input,textarea,select,summary,[contenteditable="true"],[role="slider"],[data-no-swipe],.site-header a';
 const width=()=>Math.max(root.clientWidth,320);
 const resetSwipe=()=>{
  root.classList.remove("swipe-tracking","swipe-exiting");
  delete root.dataset.swipeDir;
  body.style.removeProperty("transition");
  body.style.removeProperty("transform");
  body.style.removeProperty("transform-origin");
  body.style.removeProperty("opacity");
  body.style.removeProperty("filter");
 };
 const settleSwipe=()=>{
  if(!root.classList.contains("swipe-tracking")){start=null;return}
  root.classList.remove("swipe-tracking");
  body.style.transition="transform 220ms cubic-bezier(.2,1.25,.3,1),opacity 180ms ease,filter 180ms ease";
  body.style.transform="translate3d(0,0,0) scale(1) rotateY(0deg)";
  body.style.opacity="1";
  body.style.filter="blur(0)";
  const finish=event=>{
   if(event.target!==body||event.propertyName!=="transform")return;
   body.removeEventListener("transitionend",finish);
   resetSwipe();
  };
  body.addEventListener("transitionend",finish);
 };
 document.addEventListener("touchstart",(event)=>{
  if(event.touches.length!==1||changing||document.querySelector("dialog[open]")){start=null;return}
  const t=event.target;
  if(t?.closest?.(ignore)){start=null;return}
  const p=event.touches[0],w=width();
  if(p.clientX<18||p.clientX>w-18){start=null;return}
  start={x:p.clientX,y:p.clientY,scrollY};
 },{passive:true});
 document.addEventListener("touchmove",event=>{
  if(!start||changing||event.touches.length!==1)return;
  const p=event.touches[0],dx=p.clientX-start.x,dy=p.clientY-start.y;
  if(!start.horizontal){
   if(Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)*1.15){start=null;return}
   if(Math.abs(dx)<8||Math.abs(dx)<Math.abs(dy)*1.15)return;
   start.horizontal=true;
  }
  const direction=dx<0?"next":"previous";
  if(!routes[index+(direction==="next"?1:-1)])return;
  if(reduced)return;
  event.preventDefault();
  const progress=Math.min(1,Math.abs(dx)/width());
  root.classList.add("swipe-tracking");
  root.dataset.swipeDir=direction;
  body.style.transformOrigin=`50% ${start.scrollY+innerHeight/2}px`;
  body.style.transition="none";
  body.style.transform=`translate3d(${dx}px,0,0) scale(${1-progress*.1}) rotateY(${dx<0?progress*1.5:-progress*1.5}deg)`;
  body.style.opacity=String(1-progress*.2);
  body.style.filter=`blur(${progress*2}px)`;
 },{passive:false});
 document.addEventListener("touchcancel",()=>{start=null;settleSwipe()},{passive:true});
 document.addEventListener("touchend",(event)=>{
  if(!start||changing||event.changedTouches.length!==1){start=null;settleSwipe();return}
  const p=event.changedTouches[0],dx=p.clientX-start.x,dy=p.clientY-start.y,wasHorizontal=start.horizontal,originY=start.scrollY+innerHeight/2;start=null;
  const direction=dx<0?"next":"previous",target=routes[index+(direction==="next"?1:-1)];
  const threshold=Math.min(84,width()*.16);
  if(!wasHorizontal||!target||Math.abs(dx)<threshold||Math.abs(dx)<Math.abs(dy)*1.25){settleSwipe();return}
  changing=true;
  if(reduced){location.assign(target);return}
  try{sessionStorage.setItem(arrivalKey,direction)}catch{}
  root.classList.remove("swipe-tracking");
  root.classList.add("swipe-exiting");
  root.dataset.swipeDir=direction;
  body.style.transition="transform 175ms cubic-bezier(.68,-.12,.82,.25),opacity 175ms ease,filter 175ms ease";
  body.style.transformOrigin=`50% ${originY}px`;
  body.style.transform=`translate3d(${direction==="next"?"-110vw":"110vw"},0,0) scale(.84) rotateY(${direction==="next"?"-12deg":"12deg"})`;
  body.style.opacity="0";
  body.style.filter="blur(8px)";
  const finishExit=event=>{
   if(event.target!==body||event.propertyName!=="transform")return;
   body.removeEventListener("transitionend",finishExit);
   location.assign(target);
  };
  body.addEventListener("transitionend",finishExit);
 },{passive:true});
})();
