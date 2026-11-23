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
 const entering=[];
 if(!revealObserver)revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  const el=entry.target,box=entry.boundingClientRect;
  if(document.documentElement.classList.contains("swipe-tracking")||document.documentElement.classList.contains("swipe-exiting")||document.documentElement.classList.contains("swipe-committing"))return;
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
 requestAnimationFrame(()=>requestAnimationFrame(()=>entering.forEach(el=>el.classList.add("seen"))));
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
 if(window.__rapsReloadRedirecting)return;
 const root=document.documentElement,body=document.body,reduced=matchMedia("(prefers-reduced-motion:reduce)").matches;
 const normalize=value=>{const path=new URL(value,location.href).pathname.replace(/\/index\.html$/,"/").replace(/\/{2,}/g,"/");return path.endsWith("/")?path:path+"/"};
 const routesFor=path=>path.startsWith("/en/")?["/en/","/en/website/","/en/ugc/","/en/editing/","/en/content-creation/","/en/advertising/","/en/marketing/","/en/digital-invitation/","/en/social-media/","/en/bundles/"]:["/","/website/","/ugc/","/editing/","/content-creation/","/advertising/","/marketing/","/undangan-digital/","/social-media/","/paket/"];
 const labelsFor=english=>english?["Home","Website","UGC","Editing","Content","Advertising","Marketing","Invitation","Social","Bundles"]:["Beranda","Website","UGC","Editing","Konten","Advertising","Marketing","Undangan","Social Media","Bundling"];
 let routes=routesFor(location.pathname),labels=labelsFor(location.pathname.startsWith("/en/")),currentPath=normalize(location.pathname),index=routes.indexOf(currentPath);
 if(index<0)return;
 let changing=false,start=null,softControlsActive=false,swipeFrame=null,swipeTarget=null,swipeDirection=null;
 const cache=new Map(),preloads=new Map(),previewFrames=new Map();
 const swipeStyle=document.createElement('style');swipeStyle.id='raps-native-swipe-style';swipeStyle.textContent="html.raps-route-swiping{overflow-x:clip!important}\nhtml.raps-route-swiping body{backface-visibility:hidden;-webkit-backface-visibility:hidden}\nhtml.raps-route-swiping .raps-route-native-preview{box-sizing:border-box;isolation:isolate}\nhtml.raps-route-swiping .reveal,html.raps-route-swiping .scroll-reveal{opacity:1!important;transform:none!important;translate:none!important;scale:1!important;rotate:none!important;filter:none!important;transition:none!important;animation:none!important}";document.head.append(swipeStyle);
 const routeStyles=()=>[...document.querySelectorAll('link[rel="stylesheet"][data-raps-route-style]')];
 document.querySelectorAll('link[rel="stylesheet"][href*="/assets/"]').forEach(link=>{if(!/\/assets\/(site|experience)\.css(?:\?|$)/.test(link.href))link.dataset.rapsRouteStyle="1"});
 const pageURL=path=>normalize(path);
 const syncServiceNav=()=>{
  const english=location.pathname.startsWith("/en/"),path=normalize(location.pathname);
  const desktop=english?[["/en/","Home"],["/en/website/","Website"],["/en/ugc/","UGC"],["/en/editing/","Editing"],["/en/advertising/","Advertising"],["/en/marketing/","Marketing"],["/en/digital-invitation/","Digital Invitation"],["/en/social-media/","Social Media"]]:[["/","Beranda"],["/website/","Website"],["/ugc/","UGC"],["/editing/","Editing"],["/advertising/","Advertising"],["/marketing/","Marketing"],["/undangan-digital/","Undangan Digital"],["/social-media/","Social Media"]];
  const mobile=english?[["/en/","Home"],["/en/website/","Website"],["/en/ugc/","UGC"],["/en/editing/","Editing"],["/en/content-creation/","Content Creation"],["/en/advertising/","Advertising"],["/en/marketing/","Marketing"],["/en/digital-invitation/","Digital Invitation"],["/en/social-media/","Social Media"],["/en/bundles/","Bundles"]]:[["/","Beranda"],["/website/","Website"],["/ugc/","UGC & Creator"],["/editing/","RAPS Edit"],["/content-creation/","Content Creation"],["/advertising/","Advertising"],["/marketing/","Marketing"],["/undangan-digital/","Undangan Digital"],["/social-media/","Social Media Management"],["/paket/","Paket Bundling"]];
  const render=items=>items.map(([href,label])=>`<a href="${href}"${path===href?' aria-current="page"':''}>${label}</a>`).join("");
  document.querySelectorAll(".desktop-nav").forEach(nav=>{nav.innerHTML=render(desktop)});
  document.querySelectorAll(".mobile-nav nav").forEach(nav=>{const cta=nav.querySelector(".mobile-nav-cta")?.outerHTML||"";nav.innerHTML=render(mobile)+cta});
 };
 const warmStyles=doc=>{
  const hrefs=[...doc.head.querySelectorAll('link[rel="stylesheet"][href*="/assets/"]')].map(link=>new URL(link.getAttribute("href"),location.origin).href).filter(href=>!/\/assets\/(site|experience)\.css(?:\?|$)/.test(href));
  hrefs.forEach(href=>{if([...document.querySelectorAll("link[data-raps-preload]")].some(link=>link.dataset.rapsPreload===href)||[...document.querySelectorAll('link[rel="stylesheet"]')].some(link=>link.href===href))return;const link=document.createElement("link");link.rel="preload";link.as="style";link.href=href;link.dataset.rapsPreload=href;link.onload=()=>{link.dataset.loaded="true"};link.onerror=()=>{link.remove()};document.head.append(link)});
 };
 const getPage=path=>{
  const key=pageURL(path);if(cache.has(key))return cache.get(key);
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),3500);
  const request=fetch(key,{credentials:"same-origin",cache:"force-cache",signal:controller.signal}).then(async response=>{if(!response.ok)throw new Error(`Page ${response.status}: ${key}`);const doc=new DOMParser().parseFromString(await response.text(),"text/html");warmStyles(doc);return doc}).catch(error=>{cache.delete(key);throw error}).finally(()=>clearTimeout(timeout));
  cache.set(key,request);return request;
 };
 const previewDirection=path=>routes.indexOf(pageURL(path))>=index?"next":"previous";
 const preparePreview=(path,doc)=>{
  const key=pageURL(path),existing=previewFrames.get(key);if(existing)return existing;
  // Native DOM preview: one document, one set of fonts, no iframe paint swaps.
  activateStyles(doc,false);
  const previewBody=doc.body.cloneNode(true),pane=document.createElement("div");
  previewBody.querySelectorAll("script,iframe").forEach(node=>node.remove());
  pane.className="raps-route-native-preview "+previewBody.className;
  pane.setAttribute("aria-hidden","true");pane.dataset.routePreview=key;pane.dataset.ready="false";
  pane.append(...Array.from(previewBody.childNodes));
  const direction=previewDirection(key),font=getComputedStyle(body),surface=root.dataset.theme==="dark"?"#0c1624":"#f7f8f9";
  Object.assign(pane.style,{position:"fixed",zIndex:"10000",inset:"0",width:"100vw",height:"100vh",
   overflow:"hidden",border:"0",borderRadius:"0",boxShadow:"none",pointerEvents:"none",
   background:surface,color:font.color,fontFamily:font.fontFamily,fontSize:font.fontSize,
   lineHeight:font.lineHeight,opacity:"1",visibility:"hidden",willChange:"transform",
   backfaceVisibility:"hidden",transition:"none",
   transform:direction==="next"?"translate3d(100vw,0,0)":"translate3d(-100vw,0,0)"});
  if(CSS.supports("height:100dvh"))pane.style.height="100dvh";
  root.append(pane);
  const css=routeStylesFor(doc).map(href=>{
   const link=[...document.querySelectorAll('link[rel="stylesheet"]')].find(el=>el.href===href);
   if(!link||link.sheet)return Promise.resolve();
   return new Promise(resolve=>{link.addEventListener("load",resolve,{once:true});link.addEventListener("error",resolve,{once:true})});
  });
  const images=[...pane.querySelectorAll("img")].filter(img=>img.getBoundingClientRect().top<innerHeight*1.25).slice(0,8).map(img=>{
   img.loading="eager";return img.decode?.().catch(()=>{})||Promise.resolve();
  });
  const ready=Promise.allSettled([...css,document.fonts.ready,...images]).then(()=>{
   if(pane.isConnected)pane.dataset.ready="true";return pane;
  });
  const entry={frame:pane,direction,ready};previewFrames.set(key,entry);return entry;
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
  changing=true;start=null;clearTimeout(settleTimer);settleTimer=null;
  let doc;
  try{const cachedDoc=await getPage(path);doc=cachedDoc.cloneNode(true)}catch{changing=false;body.removeAttribute("style");root.classList.remove("swipe-tracking","swipe-committing","route-fallback");delete root.dataset.swipeDir;location.assign(target);return}
  root.classList.remove("swipe-tracking");
  const incomingBody=doc.body,scriptURLs=[...incomingBody.querySelectorAll("script[src]")].map(script=>script.getAttribute("src")).filter(src=>src&&!/\/assets\/(site|experience|international)\.js(?:\?|$)/.test(src));
  incomingBody.querySelectorAll("script").forEach(script=>script.remove());
  activateStyles(doc,false);root.dataset.routeDirection=direction;
  let committed=false,visualPreview=null;
  const commit=()=>{
   committed=true;
   history.scrollRestoration="manual";
   body.className=incomingBody.className;
   if(visualPreview?.dataset.ready==="true"&&visualPreview.isConnected){
    const fragment=document.createDocumentFragment();
    while(visualPreview.firstChild)fragment.append(visualPreview.firstChild);
    body.replaceChildren(fragment);
    // Never expose the empty opaque preview for even one animation frame.
    visualPreview.style.visibility="hidden";
   }else body.innerHTML=incomingBody.innerHTML;
   body.style.transition="none";body.style.transform="none";
   updateHead(doc);if(push)history.pushState({rapsSoft:true},"",target);
   routes=routesFor(location.pathname);labels=labelsFor(location.pathname.startsWith("/en/"));currentPath=normalize(location.pathname);index=routes.indexOf(currentPath);
   window.scrollTo(0,0);syncServiceNav();buildGuide();syncLanguageAndTheme();softControlsActive=true;
   body.classList.add("animate-in");document.dispatchEvent(new CustomEvent("raps:route-loaded"));
   scriptURLs.forEach(src=>{const script=document.createElement("script");script.src=new URL(src,location.origin).href;script.async=false;body.append(script)});
  };
  const animateFallback=async()=>{
   let entry=previewFrames.get(path);if(gestureFrame)entry={frame:gestureFrame,direction};if(!entry)entry=preparePreview(path,doc);
  const frame=entry.frame,curve="transform 210ms cubic-bezier(.32,.72,0,1)";
   if(frame.dataset.ready!=="true")await Promise.race([entry.ready,new Promise(resolve=>setTimeout(resolve,1300))]);
   if(frame.dataset.ready!=="true"){
    frame.remove();previewFrames.delete(path);commit();
    document.querySelectorAll(".reveal,.scroll-reveal").forEach(el=>{const rect=el.getBoundingClientRect();if(rect.bottom>0&&rect.top<innerHeight)el.classList.add("seen")});
    return;
   }
   visualPreview=frame;root.classList.add("route-fallback","swipe-committing","raps-route-swiping");frame.style.visibility="visible";frame.style.transition="none";
   if(frame!==gestureFrame)frame.style.transform=direction==="next"?"translate3d(100vw,0,0)":"translate3d(-100vw,0,0)";
   void frame.offsetWidth;body.style.transition=curve;frame.style.transition=curve;
   body.style.transform=direction==="next"?"translate3d(-100vw,0,0)":"translate3d(100vw,0,0)";frame.style.transform="translate3d(0,0,0)";
   await new Promise(resolve=>{let done=false;const finish=event=>{if(event&&event.target!==frame)return;if(event&&event.propertyName!=="transform")return;if(done)return;done=true;frame.removeEventListener("transitionend",finish);clearTimeout(timeout);resolve()};const timeout=setTimeout(()=>finish(),250);frame.addEventListener("transitionend",finish)});
   commit();
   document.querySelectorAll(".reveal,.scroll-reveal").forEach(el=>{const rect=el.getBoundingClientRect();if(rect.bottom>0&&rect.top<innerHeight)el.classList.add("seen")});
   await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
   frame.remove();previewFrames.delete(path);root.classList.remove("swipe-committing");
  };
  try{
   if(!reduced)await animateFallback();else commit();
  }catch(error){
   console.warn("RAPS route transition recovered",error);if(!committed)commit();
  }finally{
   activateStyles(doc,true);body.removeAttribute("style");root.classList.remove("swipe-tracking","swipe-committing","route-fallback","raps-route-swiping");delete root.dataset.routeDirection;delete root.dataset.swipeDir;changing=false;
   previewFrames.forEach((entry,key)=>{if(!entry.frame.isConnected){previewFrames.delete(key);return}entry.frame.style.transition="none";entry.frame.style.visibility="hidden";entry.frame.style.transform=entry.direction==="previous"?"translate3d(-100vw,0,0)":"translate3d(100vw,0,0)"});
   prewarmAdjacent();
  }
  const hash=new URL(target,location.href).hash;if(hash)setTimeout(()=>document.querySelector(hash)?.scrollIntoView({behavior:reduced?"instant":"smooth",block:"start"}),250);
 };
 window.rapsSoftNavigate=softNavigate;
 syncServiceNav();buildGuide();prewarmAdjacent();
 document.addEventListener("click",event=>{
  const themeButton=event.target.closest?.("[data-theme-toggle]");
  if(themeButton&&softControlsActive){event.preventDefault();const dark=root.dataset.theme!=="dark";root.dataset.theme=dark?"dark":"light";try{localStorage.setItem("raps-theme",root.dataset.theme)}catch{};syncLanguageAndTheme();return}
  const langButton=event.target.closest?.("[data-lang-choice]");
  if(langButton&&softControlsActive){event.preventDefault();const toEnglish=langButton.dataset.langChoice==="en",path=normalize(location.pathname);let target;
   if(toEnglish){const special={"/":"/en/","/paket/":"/en/bundles/","/undangan-digital/":"/en/digital-invitation/","/advertising/":"/en/advertising/"};target=special[path]||"/en"+path}
   else{const special={"/en/":"/","/en/bundles/":"/paket/","/en/digital-invitation/":"/undangan-digital/","/en/advertising/":"/advertising/"};target=special[path]||path.replace(/^\/en\//,"/")}
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
 let settleTimer=null;
 const resetSwipe=()=>{clearTimeout(settleTimer);settleTimer=null;root.classList.remove("swipe-tracking","route-fallback","raps-route-swiping");delete root.dataset.swipeDir;body.style.removeProperty("transition");body.style.removeProperty("transform");body.style.removeProperty("translate");body.style.removeProperty("transform-origin");body.style.removeProperty("opacity");if(swipeFrame){const entry=previewFrames.get(swipeTarget),frame=swipeFrame;frame.style.transition="none";frame.style.visibility="hidden";frame.style.transform=entry?.direction==="previous"?"translate3d(-100vw,0,0)":"translate3d(100vw,0,0)"}swipeFrame=null;swipeTarget=null;swipeDirection=null};
 const settleSwipe=()=>{if(!root.classList.contains("swipe-tracking")){start=null;return}const frame=swipeFrame,entry=frame&&previewFrames.get(swipeTarget),origin=entry?.direction==="previous"?"-100vw":"100vw",distance=Math.abs(start?.dx||0),duration=Math.min(260,Math.max(150,140+distance*.22));body.style.transition=`transform ${duration}ms cubic-bezier(.32,.72,0,1)`;body.style.transform="translate3d(0,0,0)";if(frame){frame.style.transition=`transform ${duration}ms cubic-bezier(.32,.72,0,1)`;frame.style.transform=`translate3d(${origin},0,0)`}settleTimer=setTimeout(resetSwipe,duration+24)};
 let gestureId=0;
 const showSwipeFrame=(target,direction,dx)=>{
  const entry=previewFrames.get(pageURL(target));if(!entry||entry.frame.dataset.ready!=="true")return false;
  const frame=entry.frame;swipeFrame=frame;swipeTarget=pageURL(target);swipeDirection=direction;frame.style.transition="none";frame.style.visibility="visible";frame.style.transform=`translate3d(${(direction==="next"?width():-width())+dx}px,0,0)`;return true;
 };
 const beginGesture=(id,x,y,target)=>{clearTimeout(settleTimer);settleTimer=null;if(changing||document.querySelector("dialog[open]")||target?.closest?.(ignore)){start=null;return}const w=width();if(x<18||x>w-18){start=null;return}start={id,x,y,lastX:x,lastTime:performance.now(),velocity:0,horizontal:false,dx:0};gestureId++};
 const moveGesture=(id,x,y,event)=>{if(!start||id!==start.id||changing)return;const dx=x-start.x,dy=y-start.y,now=performance.now(),elapsed=Math.max(1,now-start.lastTime);start.velocity=(x-start.lastX)/elapsed;start.lastX=x;start.lastTime=now;start.dx=dx;if(!start.horizontal){if(Math.abs(dy)>10&&Math.abs(dy)>Math.abs(dx)*1.08){start=null;return}if(Math.abs(dx)<5||Math.abs(dx)<Math.abs(dy)*1.08)return;start.horizontal=true}event.preventDefault();const direction=dx<0?"next":"previous",step=direction==="next"?1:-1,target=routes[index+step];if(!target){root.classList.add("swipe-tracking");body.style.transition="none";body.style.transform=`translate3d(${dx*.12}px,0,0)`;return}start.direction=direction;start.target=pageURL(target);const entry=previewFrames.get(start.target);if(entry?.frame.dataset.ready!=="true"){void getPage(target).then(doc=>preparePreview(target,doc).ready).catch(()=>{});return}root.classList.add("swipe-tracking","route-fallback","raps-route-swiping");root.dataset.swipeDir=direction;body.style.transition="none";body.style.transform=`translate3d(${dx}px,0,0)`;if(swipeFrame&&swipeTarget!==start.target){const old=swipeFrame,oldEntry=previewFrames.get(swipeTarget);old.style.transition="none";old.style.visibility="hidden";old.style.transform=oldEntry?.direction==="previous"?"translate3d(-100vw,0,0)":"translate3d(100vw,0,0)";swipeFrame=null;swipeTarget=null}if(!swipeFrame)showSwipeFrame(target,direction,dx);swipeFrame.style.transition="none";swipeFrame.style.visibility="visible";swipeFrame.style.transform=`translate3d(${(direction==="next"?width():-width())+dx}px,0,0)`};
 const endGesture=(id,x,y)=>{if(!start||id!==start.id){settleSwipe();return}const gesture=start,dx=x-gesture.x,dy=y-gesture.y,direction=dx<0?"next":"previous",target=routes[index+(direction==="next"?1:-1)],distanceEnough=Math.abs(dx)>=Math.min(72,width()*.18),fastFlick=Math.abs(gesture.velocity)>.45&&Math.sign(gesture.velocity)===Math.sign(dx),complete=gesture.horizontal&&target&&Math.abs(dx)>Math.abs(dy)*1.08&&(distanceEnough||fastFlick);if(!complete){settleSwipe();start=null;return}start=null;const frame=swipeFrame&&swipeTarget===pageURL(target)&&swipeFrame.dataset.ready==="true"?swipeFrame:null;swipeFrame=null;swipeTarget=null;swipeDirection=null;if(!frame)resetSwipe();void softNavigate(target,direction,true,frame)};
 document.addEventListener("touchstart",event=>{if(event.touches.length!==1){start=null;return}const point=event.touches[0];beginGesture("touch",point.clientX,point.clientY,event.target)},{passive:true});
 document.addEventListener("touchmove",event=>{if(event.touches.length!==1)return;const point=event.touches[0];moveGesture("touch",point.clientX,point.clientY,event)},{passive:false});
 document.addEventListener("touchend",event=>{if(event.changedTouches.length!==1){settleSwipe();start=null;return}const point=event.changedTouches[0];endGesture("touch",point.clientX,point.clientY)},{passive:true});
 document.addEventListener("touchcancel",()=>{settleSwipe();start=null},{passive:true});
 document.addEventListener("pointerdown",event=>{if(event.pointerType!=="mouse"||!event.isPrimary||event.button!==0)return;beginGesture(`mouse:${event.pointerId}`,event.clientX,event.clientY,event.target)},{passive:true});
 document.addEventListener("pointermove",event=>{if(event.pointerType!=="mouse")return;moveGesture(`mouse:${event.pointerId}`,event.clientX,event.clientY,event)},{passive:false});
 document.addEventListener("pointerup",event=>{if(event.pointerType!=="mouse")return;endGesture(`mouse:${event.pointerId}`,event.clientX,event.clientY)},{passive:true});
 document.addEventListener("pointercancel",event=>{if(start&&start.id===`mouse:${event.pointerId}`){settleSwipe();start=null}},{passive:true});

 // Laptop trackpad two-finger horizontal swipes.
 let wheelDelta=0,wheelTime=0,wheelCooldown=0;
 document.addEventListener("wheel",event=>{
  if(changing||event.ctrlKey||event.metaKey||Math.abs(event.deltaX)<3||Math.abs(event.deltaX)<=Math.abs(event.deltaY)*1.12)return;
  if(event.target?.closest?.(ignore+",[data-horizontal-scroll],.swiper,.splide,.carousel,[role='tablist']"))return;
  if(event.cancelable)event.preventDefault();
  const now=performance.now();if(now<wheelCooldown)return;
  if(now-wheelTime>320)wheelDelta=0;wheelTime=now;wheelDelta+=event.deltaX;
  if(Math.abs(wheelDelta)<95)return;
  const direction=wheelDelta>0?"next":"previous",target=routes[index+(direction==="next"?1:-1)];
  wheelDelta=0;wheelCooldown=now+650;
  if(target)void softNavigate(target,direction);
 },{passive:false});
})();
