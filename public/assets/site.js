
(()=>{"use strict";
 document.addEventListener("click",event=>{
  const link=event.target.closest?.(".mobile-nav a");
  if(link)link.closest(".mobile-nav")?.removeAttribute("open");
 });
 let frame=false;
 const sync=()=>{let d=Math.max(1,document.documentElement.scrollHeight-innerHeight),indicator=document.getElementById("scroll-indicator");if(indicator)indicator.style.width=Math.min(100,Math.max(0,scrollY/d*100))+"%";frame=false};
 addEventListener("scroll",()=>{if(!frame){frame=true;requestAnimationFrame(sync)}},{passive:true});addEventListener("resize",sync,{passive:true});sync();
 const reduced=matchMedia("(prefers-reduced-motion:reduce)").matches;
 let revealObserver=null;
 const watchReveals=()=>{
 if(reduced||!("IntersectionObserver" in window))return;
 const selector=".reveal,.service-tile,.story-card,.price-card,.faq,.project-detail,.promo-note,.feature-banner-inner,.service-finale-inner,.last-cta-inner";
 const items=[...document.querySelectorAll(selector)];
 if(!revealObserver)revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
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
 revealObserver.disconnect();
 const orderByParent=new Map();
 items.forEach(el=>{
  if(!el.classList.contains("reveal"))el.classList.add("scroll-reveal");
  const parent=el.parentElement,order=orderByParent.get(parent)||0;
  orderByParent.set(parent,order+1);
  el.style.setProperty("--reveal-stagger","0ms");
  revealObserver.observe(el);
 });
 document.body.classList.add("animate-in");
 };
 watchReveals();
 document.addEventListener("raps:route-loaded",watchReveals);
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

/* Swipe and service-link navigation use cached HTML; the document never reloads. */
(()=>{
 "use strict";
 const root=document.documentElement,body=document.body,reduced=matchMedia("(prefers-reduced-motion:reduce)").matches;
 const normalize=value=>{const path=new URL(value,location.href).pathname.replace(/\/index\.html$/,"/").replace(/\/{2,}/g,"/");return path.endsWith("/")?path:path+"/"};
 const routesFor=path=>path.startsWith("/en/")?["/en/","/en/website/","/en/ugc/","/en/editing/","/en/content-creation/","/en/marketing/","/en/social-media/","/en/digital-invitation/","/en/bundles/","/en/pricing/"]:["/","/website/","/ugc/","/editing/","/content-creation/","/marketing/","/social-media/","/undangan-digital/","/paket/","/harga/"];
 const labelsFor=english=>english?["Home","Website","UGC","Editing","Content","Marketing","Social","Invitation","Bundles","Pricing"]:["Beranda","Website","UGC","Editing","Konten","Marketing","Social Media","Undangan","Bundling","Harga"];
 let routes=routesFor(location.pathname),labels=labelsFor(location.pathname.startsWith("/en/")),currentPath=normalize(location.pathname),index=routes.indexOf(currentPath);
 if(index<0)return;
 let changing=false,start=null,softControlsActive=false;
 const cache=new Map(),preloads=new Map();
 const routeStyles=()=>[...document.querySelectorAll('link[rel="stylesheet"][data-raps-route-style]')];
 document.querySelectorAll('link[rel="stylesheet"][href*="/assets/"]').forEach(link=>{if(!/\/assets\/(site|experience)\.css(?:\?|$)/.test(link.href))link.dataset.rapsRouteStyle="1"});
 const pageURL=path=>normalize(path);
 const warmStyles=doc=>{
  const hrefs=[...doc.head.querySelectorAll('link[rel="stylesheet"][href*="/assets/"]')].map(link=>new URL(link.getAttribute("href"),location.origin).href).filter(href=>!/\/assets\/(site|experience)\.css(?:\?|$)/.test(href));
  hrefs.forEach(href=>{if([...document.querySelectorAll("link[data-raps-preload]")].some(link=>link.dataset.rapsPreload===href)||[...document.querySelectorAll('link[rel="stylesheet"]')].some(link=>link.href===href))return;const link=document.createElement("link");link.rel="preload";link.as="style";link.href=href;link.dataset.rapsPreload=href;link.onload=()=>{link.dataset.loaded="true"};link.onerror=()=>{link.remove()};document.head.append(link)});
 };
 const getPage=path=>{
  const key=pageURL(path);if(cache.has(key))return cache.get(key);
  const request=fetch(key,{credentials:"same-origin",cache:"force-cache"}).then(async response=>{if(!response.ok)throw new Error(`Page ${response.status}: ${key}`);const doc=new DOMParser().parseFromString(await response.text(),"text/html");warmStyles(doc);return doc}).catch(error=>{cache.delete(key);throw error});
  cache.set(key,request);return request;
 };
 const prewarmAdjacent=()=>[routes[index-1],routes[index+1]].filter(Boolean).forEach(path=>{void getPage(path).catch(()=>{})});
 const buildGuide=()=>{
  document.querySelector(".swipe-guide")?.remove();const header=document.querySelector(".site-header");if(!header)return;
  const english=location.pathname.startsWith("/en/"),guide=document.createElement("div");guide.className="swipe-guide";guide.setAttribute("role","note");guide.setAttribute("aria-label",english?"Swipe left or right to see other services":"Geser kiri atau kanan untuk melihat layanan lain");
  const motion=document.createElement("span");motion.className="swipe-guide-motion";motion.setAttribute("aria-hidden","true");motion.append(document.createElement("i"));
  const copy=document.createElement("span");copy.className="swipe-guide-copy";copy.textContent=english?"Swipe left/right for other services":"Geser kiri/kanan untuk layanan lain";
  const count=document.createElement("strong");count.className="swipe-guide-count";count.textContent=`${labels[index]} · ${index+1}/${routes.length}`;guide.append(motion,copy,count);header.after(guide);
 };
 const routeStylesFor=doc=>[...doc.head.querySelectorAll('link[rel="stylesheet"][href*="/assets/"]')].map(link=>new URL(link.getAttribute("href"),location.origin).href).filter(href=>!/\/assets\/(site|experience)\.css(?:\?|$)/.test(href));
 const activateStyles=doc=>{
  const wanted=routeStylesFor(doc),existing=new Set(routeStyles().map(link=>link.href));
  wanted.forEach(href=>{if(existing.has(href))return;const preload=[...document.querySelectorAll("link[data-raps-preload]")].find(link=>link.dataset.rapsPreload===href);if(preload){preload.rel="stylesheet";preload.removeAttribute("as");preload.removeAttribute("data-raps-preload");preload.dataset.rapsRouteStyle="1"}else{const link=document.createElement("link");link.rel="stylesheet";link.href=href;link.dataset.rapsRouteStyle="1";document.head.append(link)}});
  routeStyles().forEach(link=>{if(!wanted.includes(link.href))link.remove()});
 };
 const updateHead=doc=>{
  document.title=doc.title;root.lang=doc.documentElement.lang||"id";root.dataset.theme=(()=>{try{return localStorage.getItem("raps-theme")==="dark"?"dark":"light"}catch{return "light"}})();
  const selectors=['meta[name="description"]','meta[name="robots"]','meta[property^="og:"]','meta[name^="twitter:"]','link[rel="canonical"]','link[rel="alternate"]'];
  selectors.forEach(selector=>{
   document.head.querySelectorAll(selector).forEach(node=>node.remove());
   doc.head.querySelectorAll(selector).forEach(node=>document.head.append(node.cloneNode(true)));
  });
  document.head.querySelectorAll('script[type="application/ld+json"]').forEach(node=>node.remove());
  doc.head.querySelectorAll('script[type="application/ld+json"]').forEach(node=>document.head.append(node.cloneNode(true)));
 };
 const syncLanguageAndTheme=()=>{
  const lang=location.pathname.startsWith("/en/")?"en":"id";root.lang=lang;
  document.querySelectorAll("[data-lang-choice]").forEach(button=>{const active=button.dataset.langChoice===lang;button.setAttribute("aria-pressed",String(active));button.classList.toggle("active",active)});
  const dark=root.dataset.theme==="dark";document.querySelectorAll("[data-theme-toggle]").forEach(button=>{button.setAttribute("aria-pressed",String(dark));button.setAttribute("aria-label",dark?"Switch to light mode":"Switch to dark mode");button.setAttribute("title",dark?"Light mode":"Dark mode")});
 };
 const softNavigate=async(target,direction,push=true)=>{
  if(changing)return;const path=normalize(target),nextRoutes=routesFor(path),nextIndex=nextRoutes.indexOf(path);if(nextIndex<0)return;
  changing=true;start=null;root.classList.remove("swipe-tracking");
  let doc;
  try{const cachedDoc=await getPage(path);doc=cachedDoc.cloneNode(true)}catch{changing=false;location.assign(target);return}
  const incomingBody=doc.body,scriptURLs=[...incomingBody.querySelectorAll("script[src]")].map(script=>script.getAttribute("src")).filter(src=>src&&!/\/assets\/(site|experience|international)\.js(?:\?|$)/.test(src));
  incomingBody.querySelectorAll("script").forEach(script=>script.remove());
  activateStyles(doc);
  if(!reduced){
   root.classList.add("swipe-exiting");root.dataset.swipeDir=direction;
   body.style.transition="transform 115ms cubic-bezier(.62,0,.88,.38)";
   body.style.transformOrigin=`50% ${scrollY+innerHeight/2}px`;
   body.style.transform=`perspective(900px) translate3d(${direction==="next"?"-104vw":"104vw"},0,0) scale(.86) rotateY(${direction==="next"?"-10deg":"10deg"})`;
   body.style.opacity="1";
   await new Promise(resolve=>{let done=false;const finish=event=>{if(event&&event.target!==body)return;if(event&&event.propertyName!=="transform")return;if(done)return;done=true;body.removeEventListener("transitionend",finish);clearTimeout(fallback);resolve()};const fallback=setTimeout(()=>finish(),145);body.addEventListener("transitionend",finish)});
  }
  history.scrollRestoration="manual";
  body.className=incomingBody.className;body.innerHTML=incomingBody.innerHTML;body.removeAttribute("style");root.classList.remove("swipe-exiting");delete root.dataset.swipeDir;
  updateHead(doc);if(push)history.pushState({rapsSoft:true},"",target);
  routes=routesFor(location.pathname);labels=labelsFor(location.pathname.startsWith("/en/"));currentPath=normalize(location.pathname);index=routes.indexOf(currentPath);
  window.scrollTo(0,0);buildGuide();syncLanguageAndTheme();softControlsActive=true;
  body.classList.add("animate-in");
  if(!reduced){body.classList.add("swipe-entering",direction==="next"?"swipe-arrive-next":"swipe-arrive-previous")}
  document.dispatchEvent(new CustomEvent("raps:route-loaded"));
  scriptURLs.forEach(src=>{const script=document.createElement("script");script.src=new URL(src,location.origin).href;script.async=false;script.onload=()=>{};body.append(script)});
  const clear=()=>{body.classList.remove("swipe-entering","swipe-arrive-next","swipe-arrive-previous");body.removeAttribute("style");root.classList.remove("swipe-exiting");delete root.dataset.swipeDir;body.removeEventListener("animationend",finish);changing=false};
  const finish=event=>{if(event.target===body)clear()};
  if(!reduced){body.addEventListener("animationend",finish);setTimeout(clear,310)}else{clear()}
  prewarmAdjacent();
  const hash=new URL(target,location.href).hash;if(hash)setTimeout(()=>document.querySelector(hash)?.scrollIntoView({behavior:reduced?"instant":"smooth",block:"start"}),250);
 };
 window.rapsSoftNavigate=softNavigate;
 buildGuide();prewarmAdjacent();
 document.addEventListener("click",event=>{
  const themeButton=event.target.closest?.("[data-theme-toggle]");
  if(themeButton&&softControlsActive){event.preventDefault();const dark=root.dataset.theme!=="dark";root.dataset.theme=dark?"dark":"light";try{localStorage.setItem("raps-theme",root.dataset.theme)}catch{};syncLanguageAndTheme();return}
  const langButton=event.target.closest?.("[data-lang-choice]");
  if(langButton&&softControlsActive){event.preventDefault();const toEnglish=langButton.dataset.langChoice==="en",path=normalize(location.pathname);let target;
   if(toEnglish){const special={"/":"/en/","/harga/":"/en/pricing/","/paket/":"/en/bundles/","/undangan-digital/":"/en/digital-invitation/"};target=special[path]||"/en"+path}
   else{const special={"/en/":"/","/en/pricing/":"/harga/","/en/bundles/":"/paket/","/en/digital-invitation/":"/undangan-digital/"};target=special[path]||path.replace(/^\/en\//,"/")}
   if(routesFor(target).includes(normalize(target)))void softNavigate(target,toEnglish?"next":"previous");return
  }
  const link=event.target.closest?.("a[href]");if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.target==="_blank"||link.hasAttribute("download"))return;
  const url=new URL(link.href,location.href);if(url.origin!==location.origin||url.hash&&normalize(url.pathname)===normalize(location.pathname))return;
  const targetPath=normalize(url.pathname),targetIndex=routes.indexOf(targetPath);if(targetIndex<0)return;
  if(targetPath===normalize(location.pathname)){if(!url.hash){event.preventDefault();window.scrollTo({top:0,behavior:reduced?"instant":"smooth"})}return}
  event.preventDefault();const direction=targetIndex>=index?"next":"previous";void softNavigate(url.pathname+url.search+url.hash,direction);
 });
 window.addEventListener("popstate",()=>{
  const target=normalize(location.pathname),targetRoutes=routesFor(target);if(!targetRoutes.includes(target))return;
  const nextIndex=targetRoutes.indexOf(target),crossLanguage=target.startsWith("/en/")!==currentPath.startsWith("/en/"),direction=crossLanguage?(target.startsWith("/en/")?"next":"previous"):(nextIndex>=index?"next":"previous");
  void softNavigate(location.pathname+location.search+location.hash,direction,false);
 });
 const ignore='button,input,textarea,select,summary,[contenteditable="true"],[role="slider"],[data-no-swipe],.site-header a';
 const width=()=>Math.max(root.clientWidth,320);
 const resetSwipe=()=>{root.classList.remove("swipe-tracking");delete root.dataset.swipeDir;body.style.removeProperty("transition");body.style.removeProperty("transform");body.style.removeProperty("transform-origin");body.style.removeProperty("opacity")};
 const settleSwipe=()=>{if(!root.classList.contains("swipe-tracking")){start=null;return}body.style.transition="transform 150ms cubic-bezier(.2,1.2,.3,1),opacity 130ms ease";body.style.transform="translate3d(0,0,0) scale(1) rotateY(0deg)";body.style.opacity="1";body.addEventListener("transitionend",function done(event){if(event.target!==body||event.propertyName!=="transform")return;body.removeEventListener("transitionend",done);resetSwipe()});setTimeout(resetSwipe,180)};
 document.addEventListener("touchstart",event=>{if(event.touches.length!==1||changing||document.querySelector("dialog[open]")){start=null;return}const t=event.target;if(t?.closest?.(ignore)){start=null;return}const p=event.touches[0],w=width();if(p.clientX<12||p.clientX>w-12){start=null;return}start={x:p.clientX,y:p.clientY,scrollY}},{passive:true});
 document.addEventListener("touchmove",event=>{if(!start||changing||event.touches.length!==1)return;const p=event.touches[0],dx=p.clientX-start.x,dy=p.clientY-start.y;if(!start.horizontal){if(Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)*1.12){start=null;return}if(Math.abs(dx)<6||Math.abs(dx)<Math.abs(dy)*1.12)return;start.horizontal=true}const direction=dx<0?"next":"previous";if(!routes[index+(direction==="next"?1:-1)])return;if(reduced)return;event.preventDefault();const progress=Math.min(1,Math.abs(dx)/width());root.classList.add("swipe-tracking");root.dataset.swipeDir=direction;body.style.transformOrigin=`50% ${start.scrollY+innerHeight/2}px`;body.style.transition="none";body.style.transform=`perspective(900px) translate3d(${dx}px,0,0) scale(${1-progress*.12}) rotateY(${dx<0?progress*4:-progress*4}deg)`;body.style.opacity=String(1-progress*.16)},{passive:false});
 document.addEventListener("touchcancel",()=>{start=null;settleSwipe()},{passive:true});
 document.addEventListener("touchend",event=>{if(!start||changing||event.changedTouches.length!==1){start=null;settleSwipe();return}const p=event.changedTouches[0],dx=p.clientX-start.x,dy=p.clientY-start.y,wasHorizontal=start.horizontal;start=null;const direction=dx<0?"next":"previous",target=routes[index+(direction==="next"?1:-1)],threshold=Math.min(64,width()*.13);if(!wasHorizontal||!target||Math.abs(dx)<threshold||Math.abs(dx)<Math.abs(dy)*1.2){settleSwipe();return}void softNavigate(target,direction)},{passive:true});
})();
