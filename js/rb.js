/* Rebellion · interacciones editoriales v4 */
(function(){
var D=document,R=D.documentElement,W=window;
var reduce=W.matchMedia('(prefers-reduced-motion: reduce)').matches;
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v);}catch(e){return null;}}
/* ---------- selector de vista (2/3/6 en compu, 1/2/3 en celular) ---------- */
function setupView(){
  var ctr=D.querySelector('.js-category-controls'),grid=D.querySelector('.section-main-products-grid .js-product-table');
  if(!ctr||!grid||ctr.querySelector('.rb-view'))return;
  var mob=W.matchMedia('(max-width:767px)');
  var box=D.createElement('div');box.className='rb-view';box.setAttribute('role','group');box.setAttribute('aria-label','Productos por fila');
  function opts(){return mob.matches?[1,2,3]:[2,3,6];}
  function apply(n,anim){
    var go=function(){grid.classList.remove('rb-cols-1','rb-cols-2','rb-cols-3','rb-cols-6');grid.classList.add('rb-cols-'+n);
      [].forEach.call(box.querySelectorAll('button'),function(b){b.classList.toggle('rb-on',+b.dataset.n===n);b.setAttribute('aria-pressed',+b.dataset.n===n);});};
    if(anim&&!reduce&&D.startViewTransition){D.startViewTransition(go);}else if(anim&&!reduce){grid.classList.add('rb-swap');setTimeout(function(){go();grid.classList.remove('rb-swap');},180);}else go();
  }
  function build(){
    var key=mob.matches?'rb-cols-m':'rb-cols-d',def=mob.matches?2:3,cur=+(ls(key)||def);
    if(opts().indexOf(cur)<0)cur=def;
    box.innerHTML='<span class="rb-view-l">Ver</span>'+opts().map(function(n){return '<button type="button" data-n="'+n+'">'+n+'</button>';}).join('');
    [].forEach.call(box.querySelectorAll('button'),function(b){b.addEventListener('click',function(){var n=+b.dataset.n;ls(key,n);apply(n,true);});});
    apply(cur,false);
  }
  var sort=ctr.querySelector('.category-sort-button');ctr.insertBefore(box,sort);ctr.classList.add('rb-ctr3');
  build();if(mob.addEventListener)mob.addEventListener('change',build);
}
/* ---------- etiqueta de descuento en tarjetas ---------- */
function num(t){t=(t||'').replace(/[^\d,]/g,'').replace(/,\d{2}$/,'');return +t||0;}
function badges(){
  [].forEach.call(D.querySelectorAll('.js-item-product:not(.rb-b)'),function(c){
    c.classList.add('rb-b');var cp=c.querySelector('.js-compare-price-display'),p=c.querySelector('.js-price-display');
    if(!cp||!p||getComputedStyle(cp).display==='none')return;var a=num(cp.textContent),b=num(p.textContent);
    if(a>b&&b>0){var off=Math.round((1-b/a)*100);if(off<5)return;var img=c.querySelector('.product-item-image-container')||c;
      var s=D.createElement('span');s.className='rb-off';s.textContent='-'+off+'%';img.appendChild(s);}
  });
}
/* ---------- títulos que suben palabra por palabra ---------- */
function split(){
  if(reduce)return;
  [].forEach.call(D.querySelectorAll('.rich-text-section .heading-block:not(.rb-sp), .newsletter-section .heading-block:not(.rb-sp), .section-page-header .heading-block:not(.rb-sp), .rb-sale-title:not(.rb-sp)'),function(h){
    if(h.querySelector('*'))return;var w=h.textContent.trim().split(/\s+/);if(!w[0])return;
    h.classList.add('rb-sp');h.innerHTML=w.map(function(x,i){return '<span class="rb-w"><span style="transition-delay:'+(i*70)+'ms">'+x+'</span></span>';}).join(' ');
    io&&io.observe(h);
  });
}
/* ---------- revelado de banners e imágenes ---------- */
var io=null;
if(!reduce&&'IntersectionObserver' in W){R.classList.add('rb-js');io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('rb-in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px',threshold:.1});}
function clips(){if(!io)return;[].forEach.call(D.querySelectorAll('.banners-section .banner-image-container:not(.rb-clip), .rb-look2-media:not(.rb-clip), .rb-sale-tile:not(.rb-clip)'),function(el){el.classList.add('rb-clip');io.observe(el);});}
/* ---------- movimiento ligado al scroll ---------- */
var par=[],shift=[];
function collect(){
  par=[].slice.call(D.querySelectorAll('.banners-section .banner-image-container img, .rb-look2-media video, .rb-sale-tile img'));
  shift=[].slice.call(D.querySelectorAll('[data-rb-shift],[data-rb-band]'));
}
var ticking=false;
function frame(){ticking=false;var vh=W.innerHeight;
  par.forEach(function(el){var r=el.parentNode.getBoundingClientRect();if(r.bottom<0||r.top>vh)return;var p=(r.top+r.height/2-vh/2)/vh;el.style.transform='translate3d(0,'+(p*-6).toFixed(2)+'%,0) scale(1.12)';});
  shift.forEach(function(el){var r=el.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;var prog=Math.min(1,Math.max(0,(vh-r.top)/(vh+r.height)));var k;if(el.dataset.rbBand){k=parseFloat(el.dataset.rbBand);el.style.transform='translate3d('+(-prog*k).toFixed(2)+'%,0,0)';}else{k=parseFloat(el.dataset.rbShift)||10;el.style.transform='translate3d('+((prog-.5)*k).toFixed(2)+'%,0,0)';}});
}
function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(frame);}}
function all(){setupView();badges();split();clips();collect();frame();}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',all);else all();
if(!reduce){W.addEventListener('scroll',onScroll,{passive:true});W.addEventListener('resize',onScroll);}
var t;new MutationObserver(function(){clearTimeout(t);t=setTimeout(function(){badges();split();clips();collect();},120);}).observe(D.body,{childList:true,subtree:true});
})();
/* ===================== v5 ===================== */
(function(){
var D=document,R=D.documentElement,W=window,reduce=W.matchMedia('(prefers-reduced-motion: reduce)').matches;
/* ---------- menú principal dentro del encabezado fijo ---------- */
function nav(){
  var n=D.querySelector('.rb-nav'),h=D.querySelector('#ns-section-header .head-main')||D.querySelector('#ns-section-header');
  if(!n||!h)return; if(!h.contains(n))h.appendChild(n);
  var path=location.pathname;
  [].forEach.call(n.querySelectorAll('.rb-nav-list > li > a'),function(a){var u=a.getAttribute('href');if(u&&u.charAt(0)==='/'&&u!=='/'&&path.indexOf(u)===0)a.parentNode.classList.add('rb-cur');});
  R.classList.add('rb-has-nav');
}
/* ---------- Cyber: cambia textos solo por fecha (vista previa con ?rbpromo=cyber o ?rbpromo=pre) ---------- */
var PROMO={desde:'2026-11-02T00:00:00-03:00',hasta:'2026-11-05T00:00:00-03:00',previa_dias:7,menu:'Cyber',anuncio:'Cyber Monday · 2, 3 y 4 de noviembre'};
function promo(){
  var el=D.getElementById('rb-promo'),c={};try{c=el?(JSON.parse(el.textContent).cyber||{}):{};}catch(e){}
  for(var k in PROMO)if(!(k in c))c[k]=PROMO[k];
  var now=Date.now(),a=Date.parse(c.desde),b=Date.parse(c.hasta),q=(location.search.match(/rbpromo=(\w+)/)||[])[1];
  var phase=q||(now>=a&&now<b?'cyber':(now<a&&a-now<c.previa_dias*864e5?'pre':''));
  if(!phase)return;
  R.classList.add('rb-'+phase);
  if(phase==='cyber'){[].forEach.call(D.querySelectorAll('[data-rb-promo]'),function(x){var k=x.getAttribute('data-rb-promo');if(c[k])x.innerHTML=c[k];});}
  var tr=D.querySelector('.rb-marquee-track');
  if(tr&&c.anuncio){var items=[].map.call(tr.querySelectorAll('span'),function(s){return s.textContent;});var uniq=items.filter(function(x,i){return items.indexOf(x)===i;});
    var half=[c.anuncio].concat(uniq);var full=[];while(full.length<8)full=full.concat(half);full=full.concat(full);
    tr.innerHTML=full.map(function(x){return '<span>'+x+'</span>';}).join('');}
  var cd=D.querySelector('[data-rb-cd]');
  if(cd&&(phase==='pre'||phase==='cyber')){var tgt=phase==='pre'?a:b;cd.hidden=false;cd.querySelector('.rb-cd-l').textContent=phase==='pre'?'Cyber Monday empieza en':'Cyber Monday termina en';
    var put=function(u,v){var e=cd.querySelector('[data-u="'+u+'"]');var t=(v<10?'0':'')+v;if(e&&e.textContent!==t){e.textContent=t;e.classList.remove('rb-tick');void e.offsetWidth;e.classList.add('rb-tick');}};
    var tick=function(){var s=Math.max(0,(tgt-Date.now())/1000|0);put('d',s/86400|0);put('h',(s%86400)/3600|0);put('m',(s%3600)/60|0);put('s',s%60);};tick();setInterval(tick,1000);}
}
/* ---------- REBELLION baja con el scroll y se traba en la segunda sección ---------- */
function travel(){
  var t=D.querySelector('[data-rb-travel]'),dock=D.querySelector('.rb-dock'),hero=D.querySelector('#ns-section-hero');
  if(!t||!dock||!hero)return;
  var c=D.createElement('div');c.className='rb-travel';c.textContent=t.textContent.trim();c.setAttribute('aria-hidden','true');D.body.appendChild(c);
  R.classList.add('rb-travel-on');
  var st,dist,heroBottom,ch;
  function measure(){
    var cs=getComputedStyle(t);c.style.fontSize=cs.fontSize;c.style.letterSpacing=cs.letterSpacing;
    ch=c.offsetHeight;dock.style.height=(ch+Math.round(W.innerHeight*0.12))+'px';
    var r=t.getBoundingClientRect(),y=W.scrollY||W.pageYOffset;
    st=r.top+y;var dr=dock.getBoundingClientRect();var end=dr.top+y+(dr.height-ch)/2;
    dist=Math.max(0,end-st);var hb=hero.getBoundingClientRect();heroBottom=hb.bottom+y;
    c.style.top=st+'px';c.style.left=((W.innerWidth-c.offsetWidth)/2)+'px';
    frame();
  }
  function frame(){var y=W.scrollY||W.pageYOffset,m=reduce?dist:Math.min(y,dist);
    c.style.transform='translate3d(0,'+m.toFixed(1)+'px,0)';
    c.classList.toggle('rb-dark',st+m+ch*0.55>heroBottom);c.classList.toggle('rb-docked',m>=dist-1);}
  var tk=false;W.addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(function(){tk=false;frame();});}},{passive:true});
  W.addEventListener('resize',measure);W.addEventListener('load',measure);
  if(D.fonts&&D.fonts.ready)D.fonts.ready.then(measure);measure();setTimeout(measure,600);
}
/* ---------- índice: imagen que sigue al cursor ---------- */
function index(){
  var box=D.querySelector('.rb-index'),fl=box&&box.querySelector('.rb-idx-float');if(!fl||!W.matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  var img=fl.querySelector('img'),x=0,y=0,tx=0,ty=0,on=false;
  [].forEach.call(box.querySelectorAll('.rb-idx-row'),function(r){r.addEventListener('mouseenter',function(){img.src=r.dataset.img;fl.classList.add('rb-on');on=true;});r.addEventListener('mouseleave',function(){fl.classList.remove('rb-on');on=false;});});
  box.addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY;});
  (function loop(){x+=(tx-x)*0.14;y+=(ty-y)*0.14;fl.style.transform='translate3d('+(x+28)+'px,'+(y-140)+'px,0)';requestAnimationFrame(loop);})();
}

/* ---------- Sale interactivo: filas que cuentan y se abren con productos reales ---------- */
function deals(){
  var list=D.querySelector('.rb-deals');if(!list)return;
  function cl(t){return (t||'').replace(/\s+/g,' ').trim().replace(/,00\b/g,'');}
  function load(li){
    var rail=li.querySelector('.rb-deal-rail');if(rail.dataset.ok)return;rail.dataset.ok='1';
    rail.innerHTML='<p class="rb-deal-load">Cargando productos</p>';
    fetch(li.dataset.url,{credentials:'same-origin'}).then(function(r){return r.text();}).then(function(t){
      var doc=new DOMParser().parseFromString(t,'text/html');
      var its=[].slice.call(doc.querySelectorAll('.js-item-product')).slice(0,10);
      var html=its.map(function(it){
        var a=it.querySelector('a[href*="/productos/"]'),img=it.querySelector('img'),src='';
        if(img){src=img.getAttribute('data-srcset')||img.getAttribute('srcset')||img.getAttribute('data-src')||img.getAttribute('src')||'';
          if(/\s\d+w/.test(src)){var ps=src.split(',').map(function(s){return s.trim().split(/\s+/);});var pk=ps.filter(function(p){return parseInt(p[1])>=480;})[0]||ps[ps.length-1];src=pk[0];}}
        var nm=cl((it.querySelector('.js-item-name')||{}).textContent),pr=cl((it.querySelector('.js-price-display')||{}).textContent);
        var cp=it.querySelector('.js-compare-price-display'),cpt=cp&&!/display:\s*none/.test(cp.getAttribute('style')||'')?cl(cp.textContent):'';
        var off='';if(cpt){var x=+cpt.replace(/\D/g,''),y=+pr.replace(/\D/g,'');if(x>y&&y)off='<em>-'+Math.round((1-y/x)*100)+'%</em>';}
        return '<a class="rb-dcard" href="'+(a?a.getAttribute('href'):li.dataset.url)+'"><span class="rb-dcard-img"><img src="'+src+'" alt="'+nm+'" loading="lazy">'+off+'</span><b>'+nm+'</b><span>'+(cpt?'<s>'+cpt+'</s> ':'')+pr+'</span></a>';
      }).join('');
      rail.innerHTML=html||'<p class="rb-deal-load">Muy pronto</p>';
    }).catch(function(){rail.dataset.ok='';rail.innerHTML='';});
  }
  function toggle(li,force){var open=force!==undefined?force:!li.classList.contains('rb-open');
    [].forEach.call(list.querySelectorAll('.rb-deal.rb-open'),function(o){if(o!==li){o.classList.remove('rb-open');o.querySelector('.rb-deal-row').setAttribute('aria-expanded','false');}});
    li.classList.toggle('rb-open',open);li.querySelector('.rb-deal-row').setAttribute('aria-expanded',open?'true':'false');if(open)load(li);}
  [].forEach.call(list.querySelectorAll('.rb-deal'),function(li){li.querySelector('.rb-deal-row').addEventListener('click',function(){toggle(li);});});
  var first=list.querySelector('.rb-deal');
  /* números que cuentan al entrar en pantalla */
  function count(el){var m=el.textContent.match(/^(\D*)(\d+)(.*)$/);if(!m||reduce)return;var to=+m[2],t0=null;
    function st(ts){if(!t0)t0=ts;var p=Math.min(1,(ts-t0)/1100),e=1-Math.pow(1-p,3);el.textContent=m[1]+Math.round(to*e)+m[3];if(p<1)requestAnimationFrame(st);}requestAnimationFrame(st);}
  if('IntersectionObserver' in W){var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io2.unobserve(e.target);if(e.target.classList.contains('rb-deals')){if(first)toggle(first,true);}else count(e.target);}});},{threshold:.4});
    [].forEach.call(list.querySelectorAll('.rb-deal-pct'),function(p){io2.observe(p);});io2.observe(list);}
  else if(first)toggle(first,true);
}
function go(){nav();promo();travel();index();deals();}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',go);else go();
})();
