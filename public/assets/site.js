(()=>{"use strict";
 try{
  const navigation=performance.getEntriesByType?.("navigation")?.[0],path=location.pathname.replace(/\/index\.html$/,"/").replace(/\/{2,}/g,"/"),home=path.startsWith("/en/")?"/en/":"/";
  if(navigation?.type==="reload"&&path!==home){window.__rapsReloadRedirecting=true;location.replace(home)}
 }catch{}
})();

(()=>{"use strict";
 document.addEventListener("click",event=>{
  const link=event.target.closest?.(".mobile-nav a");
  if(link)link.closest(".mobile-nav")?.removeAttribute("open");
 });
 let frame=false;
 const sync=()=>{let d=Math.max(1,document.documentElement.scrollHeight-innerHeight),indicator=document.getElementById("scroll-indicator");if(indicator)indicator.style.width=Math.min(100,Math.max(0,scrollY/d*100))+"%";frame=false};
 addEventListener("scroll",()=>{if(!frame){frame=true;requestAnimationFrame(sync)}},{passive:true});addEventListener("resize",sync,{passive:true});sync();
 const reduced=matchMedia("(prefers-reduced-motion:reduce)").matches;
 // Visible text is never held back on the first screen.
 // Only sections BELOW the initial viewport animate once when scrolled into view.
 const revealSelector=[
  ".reveal",".service-tile",".story-card",".price-card",".faq",".project-detail",
  ".promo-note",".feature-banner-inner",".service-finale-inner",".last-cta-inner",
  ".section-heading",".rc-head",".rc-card",".rc-addon-row",".bundle-card",".bundle-option",
  ".about-grid > *",".story-lede",".raps-web-work-heading",".raps-web-shot-card",
  ".raps-web-work-card",".website-feature",".pricing-grid > *",".pricing-cards > *",
  ".portfolio-list > *",".last-cta-inner > *","main section article",".portfolio-preview",
  ".site-footer .foot-grid > *",".site-footer .foot-bottom"
 ].join(",");
 const originalTargets=[...document.querySelectorAll(revealSelector)];
 // Never animate a photographic wrapper, because that would move its image.
 // Restore scroll animations on the TEXT inside those wrappers instead.
 const mediaSelector='img:not(.brand-icon),picture,video';
 const textSelector=[
  "h1","h2","h3","h4","p","figcaption",".eyebrow",".service-hero-copy",
  ".project-detail-copy",".section-heading",".story-lede",".rc-card-overline",
  ".rc-price",".raps-web-work-name",".raps-web-shot-browserbar",
  ".raps-web-shot-placeholder",".preview-headline",".preview-top",
  ".service-chip-row",".button-row",".tile-type",".tile-bottom"
 ].join(",");
 const photoOnly='img,picture,video,.hero-shot,.hero-art,.hero-art-halo,.service-hero-art,.project-detail-art,.raps-web-shot-browser,.portfolio-stack';
 const targets=new Set();
 for(const el of originalTargets){
  // Any image-bearing wrapper must remain visible. Without .seen the site's
  // base CSS hides the complete hero/card, including its photograph.
  if(el.matches(photoOnly)){
   el.classList.add("seen");
   el.classList.remove("raps-scroll-pending","raps-scroll-visible");
   continue;
  }
  if(!el.querySelector(mediaSelector)){targets.add(el);continue}
  el.classList.add("seen");
  el.classList.remove("raps-scroll-pending","raps-scroll-visible");
  // Animate the textual children, never their photo-bearing parent.
  for(const textNode of el.querySelectorAll(textSelector)){
   if(!textNode.querySelector(mediaSelector)&&!textNode.matches(photoOnly)){
    targets.add(textNode);
   }
  }
 }
 // A text element already animated by its parent must not animate twice.
 const elements=[...targets].filter(el=>{
  let p=el.parentElement;
  while(p){
   if(targets.has(p))return false;
   p=p.parentElement;
  }
  return true;
 });
 const pending=new Set();
 let revealObserver=null;
 // First-screen copy must be visible immediately; lower content animates once.
 // The intersection is measured INSIDE the screen, never 170px ahead of it.
 elements.forEach(el=>{
  if(!el.classList.contains("reveal"))el.classList.add("scroll-reveal");
  el.classList.add("seen");
  el.classList.remove("raps-scroll-pending","raps-scroll-visible");
 });
 if(!reduced&&"IntersectionObserver" in window){
  const show=el=>{
   if(!pending.has(el))return;
   pending.delete(el);
   el.classList.add("raps-scroll-visible");
   revealObserver.unobserve(el);
  };
  revealObserver=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(entry.isIntersecting)show(entry.target);
   }
  },{threshold:0.01,rootMargin:"0px 0px -14% 0px"});
  for(const el of elements){
   const rect=el.getBoundingClientRect();
   // Keep the full first fold visible, including text beside photographs.
   if(rect.top<innerHeight||rect.bottom<=0)continue;
   el.classList.add("raps-scroll-pending");
   pending.add(el);
   revealObserver.observe(el);
  }
 }
 document.body.classList.add("animate-in");
 // Images and image-bearing artwork stay static while the document scrolls.
 // Keep the text IntersectionObserver and its scroll reveal independently.
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


/* Delegate feedback and controls so they still work after a soft page swap. */
(()=>{
 let pressed=null,timer=null;
 const interactive=".btn,.nav-cta,.price-details,.mobile-chat,.service-tile";
 document.addEventListener("pointerdown",event=>{
  const item=event.target.closest?.(interactive);if(!item||event.button!==0)return;
  pressed={item,x:event.clientX,y:event.clientY};item.classList.remove("tap-pop");item.classList.add("is-pressed");
 },{passive:true});
 document.addEventListener("pointerup",event=>{
  if(!pressed)return;const {item,x,y}=pressed;pressed=null;item.classList.remove("is-pressed");
  if(Math.hypot(event.clientX-x,event.clientY-y)>12)return;
  item.classList.remove("tap-pop");void item.offsetWidth;item.classList.add("tap-pop");clearTimeout(timer);timer=setTimeout(()=>item.classList.remove("tap-pop"),320);
 },{passive:true});
 document.addEventListener("pointercancel",()=>{pressed?.item.classList.remove("is-pressed");pressed=null},{passive:true});
})();


/* Native cross-document navigation: the browser snapshots rendered pages. */
(()=>{
"use strict";
const root=document.documentElement;
const normalize=value=>{const p=new URL(value,location.href).pathname.replace(/\/index\.html$/,"/").replace(/\/{2,}/g,"/");return p.endsWith("/")?p:p+"/"};
const routesFor=path=>path.startsWith("/en/")?["/en/","/en/website/","/en/ugc/","/en/editing/","/en/advertising/","/en/marketing/","/en/digital-invitation/","/en/social-media/","/en/bundles/"]:["/","/website/","/ugc/","/editing/","/advertising/","/marketing/","/undangan-digital/","/social-media/","/paket/"];
const labelsFor=en=>en?["Home","Website","UGC","Editing","Advertising","Marketing","Invitation","Social","Bundles"]:["Beranda","Website","UGC","Editing","Advertising","Marketing","Undangan","Social Media","Bundling"];
const routes=routesFor(location.pathname),labels=labelsFor(location.pathname.startsWith("/en/"));
const currentPath=normalize(location.pathname),index=routes.indexOf(currentPath);
if(index<0)return;
const remember=target=>{
 const i=routes.indexOf(normalize(target)),dir=i>=0&&i<index?"previous":"next";
 root.dataset.routeDirection=dir;try{sessionStorage.setItem("raps-native-direction",dir)}catch{};return dir;
};
 const syncServiceNav=()=>{
  const english=location.pathname.startsWith("/en/"),path=normalize(location.pathname);
  const desktop=english?[["/en/","Home"],["/en/website/","Website"],["/en/ugc/","UGC"],["/en/editing/","Editing"],["/en/advertising/","Advertising"],["/en/marketing/","Marketing"],["/en/digital-invitation/","Digital Invitation"],["/en/social-media/","Social Media"]]:[["/","Beranda"],["/website/","Website"],["/ugc/","UGC"],["/editing/","Editing"],["/advertising/","Advertising"],["/marketing/","Marketing"],["/undangan-digital/","Undangan Digital"],["/social-media/","Social Media"]];
  const mobile=english?[["/en/","Home"],["/en/website/","Website"],["/en/ugc/","UGC"],["/en/editing/","Editing"],["/en/advertising/","Advertising"],["/en/marketing/","Marketing"],["/en/digital-invitation/","Digital Invitation"],["/en/social-media/","Social Media"],["/en/bundles/","Bundles"]]:[["/","Beranda"],["/website/","Website"],["/ugc/","UGC & Creator"],["/editing/","RAPS Edit"],["/advertising/","Advertising"],["/marketing/","Marketing"],["/undangan-digital/","Undangan Digital"],["/social-media/","Social Media Management"],["/paket/","Paket Bundling"]];
  const render=items=>items.map(([href,label])=>`<a href="${href}"${path===href?' aria-current="page"':''}>${label}</a>`).join("");
  document.querySelectorAll(".desktop-nav").forEach(nav=>{nav.innerHTML=render(desktop)});
  document.querySelectorAll(".mobile-nav nav").forEach(nav=>{const cta=nav.querySelector(".mobile-nav-cta")?.outerHTML||"";nav.innerHTML=render(mobile)+cta});
 };
 const buildGuide=()=>{
  document.querySelector(".swipe-guide")?.remove();const header=document.querySelector(".site-header");if(!header)return;
  const english=location.pathname.startsWith("/en/"),guide=document.createElement("div");guide.className="swipe-guide";guide.setAttribute("role","note");guide.setAttribute("aria-label",english?"Swipe left or right to see other services":"Geser kiri atau kanan untuk melihat layanan lain");
  const motion=document.createElement("span");motion.className="swipe-guide-motion";motion.setAttribute("aria-hidden","true");motion.append(document.createElement("i"));
  const copy=document.createElement("span");copy.className="swipe-guide-copy";copy.textContent=english?"Swipe left/right for other services":"Geser kiri/kanan untuk layanan lain";
  const count=document.createElement("strong");count.className="swipe-guide-count";count.textContent=`${labels[index]} · ${index+1}/${routes.length}`;guide.append(motion,copy,count);header.after(guide);
 };

syncServiceNav();buildGuide();
document.addEventListener("click",event=>{
 const a=event.target.closest?.("a[href]");if(!a||a.target==="_blank"||a.hasAttribute("download")||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
 try{const u=new URL(a.href,location.href);if(u.origin===location.origin&&normalize(u.pathname)!==currentPath)remember(u.href)}catch{}
},true);
window.rapsSoftNavigate=target=>{remember(target);location.assign(target)};
addEventListener("pageswap",event=>{try{if(event.activation?.entry?.url)remember(event.activation.entry.url)}catch{}});
const prefetch=()=>[routes[index-1],routes[index+1]].filter(Boolean).forEach(path=>{
 if(document.querySelector('link[rel="prefetch"][href="'+path+'"]'))return;
 const a=document.createElement("link");a.rel="prefetch";a.href=path;document.head.append(a);
});
if("requestIdleCallback" in window)requestIdleCallback(prefetch,{timeout:1200});else setTimeout(prefetch,350);
const ignore='button,input,textarea,select,summary,[contenteditable="true"],[role="slider"],[data-no-swipe],.site-header a,[data-horizontal-scroll],.swiper,.splide,.carousel';
let touch=null,mouse=null,navigating=false;
const begin=(x,y,target)=>navigating||x<17||x>innerWidth-17||target?.closest?.(ignore)||document.querySelector("dialog[open]")?null:{x,y,lastX:x,lastAt:performance.now(),velocity:0,horizontal:false};
const move=(s,x,y,e)=>{
 if(!s||s.cancelled||navigating)return;
 const dx=x-s.x,dy=y-s.y;
 if(!s.horizontal){
  if(Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)*1.08){s.cancelled=true;return}
  if(Math.abs(dx)<9||Math.abs(dx)<=Math.abs(dy)*1.14)return;
  s.horizontal=true;
 }
 if(e.cancelable)e.preventDefault();
 const now=performance.now();s.velocity=(x-s.lastX)/Math.max(1,now-s.lastAt);s.lastX=x;s.lastAt=now;
};
const go=dx=>{
 const target=routes[index+(dx<0?1:-1)];
 if(!target||navigating)return;
 navigating=true;remember(target);location.assign(target);
};
const finish=(s,x,y)=>{
 if(!s||s.cancelled||!s.horizontal)return;
 const dx=x-s.x,dy=y-s.y,fast=Math.abs(s.velocity)>.5&&Math.sign(s.velocity)===Math.sign(dx);
 if(Math.abs(dx)>Math.abs(dy)*1.14&&(Math.abs(dx)>=Math.min(70,Math.max(45,innerWidth*.14))||(Math.abs(dx)>28&&fast)))go(dx);
};
document.addEventListener("touchstart",e=>{touch=e.touches.length===1?begin(e.touches[0].clientX,e.touches[0].clientY,e.target):null},{passive:true});
document.addEventListener("touchmove",e=>{if(e.touches.length===1)move(touch,e.touches[0].clientX,e.touches[0].clientY,e)},{passive:false});
document.addEventListener("touchend",e=>{if(e.changedTouches.length===1)finish(touch,e.changedTouches[0].clientX,e.changedTouches[0].clientY);touch=null},{passive:true});
document.addEventListener("touchcancel",()=>{touch=null},{passive:true});
document.addEventListener("pointerdown",e=>{if(e.pointerType==="mouse"&&e.button===0)mouse=begin(e.clientX,e.clientY,e.target)},{passive:true});
document.addEventListener("pointermove",e=>{if(e.pointerType==="mouse")move(mouse,e.clientX,e.clientY,e)},{passive:false});
document.addEventListener("pointerup",e=>{if(e.pointerType==="mouse"){finish(mouse,e.clientX,e.clientY);mouse=null}},{passive:true});
document.addEventListener("pointercancel",()=>{mouse=null},{passive:true});
let wheel=0,last=0;
document.addEventListener("wheel",e=>{
 if(navigating||e.ctrlKey||e.metaKey||Math.abs(e.deltaX)<3||Math.abs(e.deltaX)<=Math.abs(e.deltaY)*1.15||e.target?.closest?.(ignore+',[role="tablist"]'))return;
 if(e.cancelable)e.preventDefault();
 const now=performance.now();if(now-last>350)wheel=0;last=now;wheel+=e.deltaX;
 if(Math.abs(wheel)>100){const dx=wheel;wheel=0;go(-dx)}
},{passive:false});
})();
