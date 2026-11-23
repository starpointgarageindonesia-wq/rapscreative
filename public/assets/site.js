
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
 const selector=[
  ".reveal", ".service-tile", ".story-card", ".price-card", ".faq", ".project-detail",
  ".promo-note", ".feature-banner-inner", ".service-finale-inner", ".last-cta-inner",
  ".section-heading", ".rc-head", ".rc-card", ".rc-addon-row", ".bundle-card", ".bundle-option",
  ".about-grid > *", ".story-lede", ".raps-web-work-heading", ".raps-web-shot-card",
  ".raps-web-work-card", ".website-feature", ".pricing-grid > *", ".pricing-cards > *",
  ".portfolio-list > *", ".last-cta-inner > *", "main section article", ".portfolio-preview",
  ".site-footer .foot-grid > *", ".site-footer .foot-bottom"
 ].join(",");
 const items=[...document.querySelectorAll(selector)];
 const firstEntrance=!document.body.classList.contains("animate-in"),entering=[];
 if(!revealObserver)revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  const el=entry.target,box=entry.boundingClientRect;
  if(document.documentElement.classList.contains("swipe-tracking")||document.documentElement.classList.contains("swipe-exiting"))return;
  if(entry.isIntersecting){
   const fromBottom=box.top>innerHeight*.52;
   el.style.setProperty("--reveal-y",fromBottom?"82px":"-82px");
   el.style.setProperty("--reveal-angle",fromBottom?"7deg":"-7deg");
   el.classList.add("seen");
  }else{
   const above=box.bottom<0;
   el.style.setProperty("--reveal-y",above?"-82px":"82px");
   el.style.setProperty("--reveal-angle",above?"-7deg":"7deg");
   el.classList.remove("seen");
  }
 }),{threshold:.06,rootMargin:"-2% 0px -2% 0px"});
 revealObserver.disconnect();
 const orderByParent=new Map();
 items.forEach(el=>{
  if(!el.classList.contains("reveal"))el.classList.add("scroll-reveal");
  const parent=el.parentElement,order=orderByParent.get(parent)||0;
  orderByParent.set(parent,order+1);
  el.style.setProperty("--reveal-x",order%2?"44px":"-44px");
  el.style.setProperty("--reveal-axis",order%2?"y":"x");
  el.style.setProperty("--reveal-stagger",`${Math.min(order,3)*16}ms`);
  const rect=el.getBoundingClientRect();
  el.classList.remove("seen");
  if(rect.bottom>innerHeight*.02&&rect.top<innerHeight*.98)entering.push(el);
  revealObserver.observe(el);
 });
 document.body.classList.add("animate-in");
 if(firstEntrance)requestAnimationFrame(()=>requestAnimationFrame(()=>entering.forEach(el=>el.classList.add("seen"))));
 };
 watchReveals();
 document.addEventListener("raps:route-loaded",watchReveals);
 const motionSelector="main img:not(.site-logo img),.hero-art-halo,.service-hero-art,.project-detail-art,.raps-web-shot-browser,.portfolio-preview";
 let motionItems=[...document.querySelectorAll(motionSelector)];
 let motionFrame=false;
 const syncScrollMotion=()=>{
  if(reduced){motionFrame=false;return}
  const center=innerHeight*.5,span=Math.max(innerHeight*.85,1);
  const measured=motionItems.map(el=>({el,rect:el.getBoundingClientRect()}));
  measured.forEach(({el,rect})=>{
   if(el.tagName==="IMG"&&rect.width<100&&rect.height<64){el.style.willChange="";return}
   if(rect.bottom< -80||rect.top>innerHeight+80){el.style.willChange="";return}
   const delta=(rect.top+rect.height*.5-center)/span,depth=Math.max(0,1-Math.min(1,Math.abs(delta)));
   el.style.willChange="translate,scale";
   el.style.setProperty("--motion-y",`${(-delta*72).toFixed(1)}px`);
   el.style.setProperty("--motion-scale",(0.88+depth*.34).toFixed(3));
   el.style.setProperty("--motion-angle",`${(-delta*3.5).toFixed(2)}deg`);
  });
  motionFrame=false;
 };
 const requestScrollMotion=()=>{if(!motionFrame){motionFrame=true;requestAnimationFrame(syncScrollMotion)}};
 addEventListener("scroll",requestScrollMotion,{passive:true});addEventListener("resize",requestScrollMotion,{passive:true});
 document.addEventListener("raps:route-loaded",()=>{motionItems=[...document.querySelectorAll(motionSelector)];requestScrollMotion()});requestScrollMotion();
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
 let changing=false,start=null,softControlsActive=false,swipeFrame=null,swipeTarget=null,swipeDirection=null;
 const cache=new Map(),preloads=new Map(),previewFrames=new Map();
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
 const previewDirection=path=>routes.indexOf(pageURL(path))>=index?"next":"previous";
 const preparePreview=(path,doc)=>{
  const key=pageURL(path),existing=previewFrames.get(key);if(existing)return existing;
  const preview=doc.cloneNode(true);preview.documentElement.dataset.theme=root.dataset.theme||"light";preview.querySelectorAll("script").forEach(script=>script.remove());
  preview.querySelectorAll("iframe").forEach(frame=>frame.remove());
  let base=preview.querySelector("base");if(!base){base=preview.createElement("base");preview.head.prepend(base)}base.href=location.origin+"/";
  const direction=previewDirection(key),frame=preview.createElement("iframe");frame.setAttribute("aria-hidden","true");frame.title="";frame.tabIndex=-1;frame.dataset.routePreview=key;
  Object.assign(frame.style,{position:"fixed",zIndex:"10000",top:"0",left:"0",width:"100vw",height:"100vh",border:"0",pointerEvents:"none",background:"var(--surface-page,#fff)",willChange:"transform",transform:direction==="next"?"translate3d(100vw,0,0)":"translate3d(-100vw,0,0)",visibility:"hidden",transition:"none"});if(CSS.supports("height:100dvh"))frame.style.height="100dvh";
  const entry={frame,direction,ready:new Promise(resolve=>frame.addEventListener("load",()=>{frame.dataset.ready="true";resolve(frame)},{once:true}))};
  frame.srcdoc="<!doctype html>"+preview.documentElement.outerHTML;root.append(frame);previewFrames.set(key,entry);return entry;
 };
 const prewarmAdjacent=()=>{
  const paths=[routes[index-1],routes[index+1]].filter(Boolean).map(pageURL),wanted=new Set(paths);
  previewFrames.forEach((entry,path)=>{if(!wanted.has(path)){entry.frame.remove();previewFrames.delete(path)}});
  paths.forEach(path=>{void getPage(path).then(doc=>preparePreview(path,doc).ready).catch(()=>{})});
 };
 const buildGuide=()=>{
  document.querySelector(".swipe-guide")?.remove();const header=document.querySelector(".site-header");if(!header)return;
  const english=location.pathname.startsWith("/en/"),guide=document.createElement("div");guide.className="swipe-guide";guide.setAttribute("role","note");guide.setAttribute("aria-label",english?"Swipe left or right to see other services":"Geser kiri atau kanan untuk melihat layanan lain");
  const motion=document.createElement("span");motion.className="swipe-guide-motion";motion.setAttribute("aria-hidden","true");motion.append(document.createElement("i"));
  const copy=document.createElement("span");copy.className="swipe-guide-copy";copy.textContent=english?"Swipe left/right for other services":"Geser kiri/kanan untuk layanan lain";
  const count=document.createElement("strong");count.className="swipe-guide-count";count.textContent=`${labels[index]} · ${index+1}/${routes.length}`;guide.append(motion,copy,count);header.after(guide);
 };
 const routeStylesFor=doc=>[...doc.head.querySelectorAll('link[rel="stylesheet"][href*="/assets/"]')].map(link=>new URL(link.getAttribute("href"),location.origin).href).filter(href=>!/\/assets\/(site|experience)\.css(?:\?|$)/.test(href));
 const activateStyles=(doc,prune=true)=>{
  const wanted=routeStylesFor(doc),existing=new Set(routeStyles().map(link=>link.href));
  wanted.forEach(href=>{if(existing.has(href))return;const preload=[...document.querySelectorAll("link[data-raps-preload]")].find(link=>link.dataset.rapsPreload===href);if(preload){preload.rel="stylesheet";preload.removeAttribute("as");preload.removeAttribute("data-raps-preload");preload.dataset.rapsRouteStyle="1"}else{const link=document.createElement("link");link.rel="stylesheet";link.href=href;link.dataset.rapsRouteStyle="1";document.head.append(link)}});
  if(prune)routeStyles().forEach(link=>{if(!wanted.includes(link.href))link.remove()});
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
 const softNavigate=async(target,direction,push=true,gestureFrame=null)=>{
  if(changing)return;const path=normalize(target),nextRoutes=routesFor(path),nextIndex=nextRoutes.indexOf(path);if(nextIndex<0)return;
  changing=true;start=null;
  let doc;
  try{const cachedDoc=await getPage(path);doc=cachedDoc.cloneNode(true)}catch{changing=false;root.classList.remove("swipe-tracking");location.assign(target);return}
  root.classList.remove("swipe-tracking");
  const incomingBody=doc.body,scriptURLs=[...incomingBody.querySelectorAll("script[src]")].map(script=>script.getAttribute("src")).filter(src=>src&&!/\/assets\/(site|experience|international)\.js(?:\?|$)/.test(src));
  incomingBody.querySelectorAll("script").forEach(script=>script.remove());
  activateStyles(doc,false);root.dataset.routeDirection=direction;
  let committed=false;
  const commit=()=>{
   committed=true;
   history.scrollRestoration="manual";
   body.className=incomingBody.className;body.innerHTML=incomingBody.innerHTML;body.removeAttribute("style");
   updateHead(doc);if(push)history.pushState({rapsSoft:true},"",target);
   routes=routesFor(location.pathname);labels=labelsFor(location.pathname.startsWith("/en/"));currentPath=normalize(location.pathname);index=routes.indexOf(currentPath);
   window.scrollTo(0,0);buildGuide();syncLanguageAndTheme();softControlsActive=true;
   body.classList.add("animate-in");document.dispatchEvent(new CustomEvent("raps:route-loaded"));
   scriptURLs.forEach(src=>{const script=document.createElement("script");script.src=new URL(src,location.origin).href;script.async=false;body.append(script)});
  };
  const animateFallback=async()=>{
   let entry=previewFrames.get(path);if(gestureFrame)entry={frame:gestureFrame,direction};if(!entry)entry=preparePreview(path,doc);
  const frame=entry.frame,curve="transform 260ms cubic-bezier(.2,.8,.2,1)";if(frame.dataset.ready!=="true")await entry.ready;frame.contentDocument?.documentElement?.setAttribute("data-theme",root.dataset.theme||"light");root.classList.add("route-fallback");frame.style.visibility="visible";frame.style.transition="none";
   if(frame!==gestureFrame)frame.style.transform=direction==="next"?"translate3d(100vw,0,0)":"translate3d(-100vw,0,0)";
   void frame.offsetWidth;body.style.transition=curve;frame.style.transition=curve;
   body.style.transform=direction==="next"?"translate3d(-100vw,0,0)":"translate3d(100vw,0,0)";frame.style.transform="translate3d(0,0,0)";
   await new Promise(resolve=>{let done=false;const finish=event=>{if(event&&event.target!==frame)return;if(event&&event.propertyName!=="transform")return;if(done)return;done=true;frame.removeEventListener("transitionend",finish);clearTimeout(timeout);resolve()};const timeout=setTimeout(()=>finish(),300);frame.addEventListener("transitionend",finish)});
   commit();frame.remove();previewFrames.delete(path);
  };
  if(!gestureFrame&&!reduced&&typeof document.startViewTransition==="function"){
   try{const transition=document.startViewTransition(commit);await transition.finished}catch{if(!committed)await animateFallback()}
  }else if(!reduced)await animateFallback();else commit();
  activateStyles(doc,true);body.removeAttribute("style");root.classList.remove("route-fallback");delete root.dataset.routeDirection;changing=false;
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
 const resetSwipe=()=>{root.classList.remove("swipe-tracking","route-fallback");delete root.dataset.swipeDir;body.style.removeProperty("transition");body.style.removeProperty("transform");body.style.removeProperty("translate");body.style.removeProperty("transform-origin");body.style.removeProperty("opacity");if(swipeFrame){const entry=previewFrames.get(swipeTarget),frame=swipeFrame;frame.style.transition="none";frame.style.visibility="hidden";frame.style.transform=entry?.direction==="previous"?"translate3d(-100vw,0,0)":"translate3d(100vw,0,0)"}swipeFrame=null;swipeTarget=null;swipeDirection=null};
 const settleSwipe=()=>{if(!root.classList.contains("swipe-tracking")){start=null;return}const frame=swipeFrame,entry=frame&&previewFrames.get(swipeTarget),origin=entry?.direction==="previous"?"-100vw":"100vw";body.style.transition="transform 180ms cubic-bezier(.2,.8,.2,1)";body.style.transform="translate3d(0,0,0)";if(frame){frame.style.transition="transform 180ms cubic-bezier(.2,.8,.2,1)";frame.style.transform=`translate3d(${origin},0,0)`}setTimeout(resetSwipe,190)};
 let gestureId=0;
 const showSwipeFrame=(target,direction,dx)=>{
  const entry=previewFrames.get(pageURL(target));if(!entry||entry.frame.dataset.ready!=="true")return false;
  const frame=entry.frame;swipeFrame=frame;swipeTarget=pageURL(target);swipeDirection=direction;frame.style.transition="none";frame.style.visibility="visible";frame.style.transform=`translate3d(${(direction==="next"?width():-width())+dx}px,0,0)`;return true;
 };
 document.addEventListener("touchstart",event=>{if(event.touches.length!==1||changing||document.querySelector("dialog[open]")){start=null;return}const t=event.target;if(t?.closest?.(ignore)){start=null;return}const p=event.touches[0],w=width();if(p.clientX<12||p.clientX>w-12){start=null;return}start={x:p.clientX,y:p.clientY,scrollY,horizontal:false,dx:0};gestureId++},{passive:true});
 document.addEventListener("touchmove",event=>{if(!start||changing||event.touches.length!==1)return;const p=event.touches[0],dx=p.clientX-start.x,dy=p.clientY-start.y;if(!start.horizontal){if(Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)*1.12){start=null;return}if(Math.abs(dx)<6||Math.abs(dx)<Math.abs(dy)*1.12)return;start.horizontal=true}const direction=dx<0?"next":"previous",step=direction==="next"?1:-1,target=routes[index+step];if(!target)return;if(reduced)return;event.preventDefault();start.direction=direction;start.target=pageURL(target);start.dx=dx;root.classList.add("swipe-tracking","route-fallback");root.dataset.swipeDir=direction;body.style.transition="none";body.style.transform=`translate3d(${dx}px,0,0)`;if(swipeFrame&&swipeTarget!==start.target){const old=swipeFrame,oldEntry=previewFrames.get(swipeTarget);old.style.transition="none";old.style.visibility="hidden";old.style.transform=oldEntry?.direction==="previous"?"translate3d(-100vw,0,0)":"translate3d(100vw,0,0)";swipeFrame=null;swipeTarget=null}if(!swipeFrame){const thisGesture=gestureId;void getPage(target).then(doc=>{const entry=preparePreview(target,doc);return entry.ready.then(()=>{if(start&&start.horizontal&&gestureId===thisGesture&&start.target===pageURL(target))showSwipeFrame(target,direction,start.dx)})}).catch(()=>{})}if(swipeFrame&&swipeTarget===start.target){swipeFrame.style.transition="none";swipeFrame.style.visibility="visible";swipeFrame.style.transform=`translate3d(${(direction==="next"?width():-width())+dx}px,0,0)`}},{passive:false});
 document.addEventListener("touchcancel",()=>{start=null;settleSwipe()},{passive:true});
 document.addEventListener("touchend",event=>{if(!start||changing||event.changedTouches.length!==1){start=null;settleSwipe();return}const p=event.changedTouches[0],dx=p.clientX-start.x,dy=p.clientY-start.y,wasHorizontal=start.horizontal,direction=dx<0?"next":"previous",target=routes[index+(direction==="next"?1:-1)],threshold=Math.min(64,width()*.13);start=null;if(!wasHorizontal||!target||Math.abs(dx)<threshold||Math.abs(dx)<Math.abs(dy)*1.2){settleSwipe();return}const frame=swipeFrame&&swipeTarget===pageURL(target)?swipeFrame:null;swipeFrame=null;swipeTarget=null;swipeDirection=null;void softNavigate(target,direction,true,frame)},{passive:true});
})();
