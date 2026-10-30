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
  var cur=n.querySelector('.rb-cur'),ul=n.querySelector('.rb-nav-list');if(cur&&ul&&ul.scrollWidth>ul.clientWidth)ul.scrollLeft=Math.max(0,cur.offsetLeft-20);
  R.classList.add('rb-has-nav');
}
/* ---------- Cyber: cambia textos solo por fecha (vista previa con ?rbpromo=cyber o ?rbpromo=pre) ---------- */
var PROMO={desde:'2026-11-02T00:00:00-03:00',hasta:'2026-11-05T00:00:00-03:00',previa_dias:7,menu:'Cyber',anuncio:'Cyber Rebellion · 2, 3 y 4 de noviembre'};
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
  if(cd&&(phase==='pre'||phase==='cyber')){var tgt=phase==='pre'?a:b;cd.hidden=false;cd.querySelector('.rb-cd-l').textContent=phase==='pre'?'Cyber Rebellion empieza en':'Cyber Rebellion termina en';
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
/* ---------- Carriles horizontales: flechas en compu + arrastrar con el mouse ---------- */
function railNav(rail,bar){
  if(!rail||rail.dataset.nav)return;rail.dataset.nav='1';
  var prev=D.createElement('button'),next=D.createElement('button');prev.type=next.type='button';
  prev.className='rb-arr rb-arr-prev';next.className='rb-arr rb-arr-next';prev.setAttribute('aria-label','Anteriores');next.setAttribute('aria-label','Siguientes');
  prev.innerHTML=next.innerHTML='<i></i>';
  var nav=D.createElement('div');nav.className='rb-arrs';nav.appendChild(prev);nav.appendChild(next);(bar||rail.parentNode).appendChild(nav);
  var step=function(){var c=rail.querySelector(':scope > *');return c?Math.max(c.getBoundingClientRect().width*2,rail.clientWidth*.8):rail.clientWidth*.8;};
  prev.addEventListener('click',function(){rail.scrollBy({left:-step(),behavior:'smooth'});});
  next.addEventListener('click',function(){rail.scrollBy({left:step(),behavior:'smooth'});});
  var upd=function(){var max=rail.scrollWidth-rail.clientWidth-2;prev.disabled=rail.scrollLeft<=2;next.disabled=rail.scrollLeft>=max;nav.hidden=max<=2;};
  rail.addEventListener('scroll',function(){requestAnimationFrame(upd);},{passive:true});W.addEventListener('resize',upd);
  new MutationObserver(function(){setTimeout(upd,60);}).observe(rail,{childList:true});setTimeout(upd,60);
  /* arrastrar con el mouse (en compu no hay deslizamiento) */
  var down=false,x0=0,s0=0,moved=false;
  rail.addEventListener('mousedown',function(e){down=true;moved=false;x0=e.pageX;s0=rail.scrollLeft;rail.classList.add('rb-grab');e.preventDefault();});
  W.addEventListener('mousemove',function(e){if(!down)return;var dx=e.pageX-x0;if(Math.abs(dx)>4)moved=true;rail.scrollLeft=s0-dx;});
  W.addEventListener('mouseup',function(){if(!down)return;down=false;rail.classList.remove('rb-grab');});
  rail.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false;}},true);
}
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
        return '<a class="rb-dcard" href="'+(a?a.getAttribute('href'):li.dataset.url)+'"><span class="rb-dcard-img"><img src="'+src+'" alt="'+nm+'" decoding="async">'+off+'</span><b>'+nm+'</b><span>'+(cpt?'<s>'+cpt+'</s> ':'')+pr+'</span></a>';
      }).join('');
      rail.innerHTML=html||'<p class="rb-deal-load">Muy pronto</p>';
    }).catch(function(){rail.dataset.ok='';rail.innerHTML='';});
  }
  function toggle(li,force){var open=force!==undefined?force:!li.classList.contains('rb-open');
    if(!W.matchMedia('(max-width:767px)').matches)[].forEach.call(list.querySelectorAll('.rb-deal.rb-open'),function(o){if(o!==li){o.classList.remove('rb-open');o.querySelector('.rb-deal-row').setAttribute('aria-expanded','false');}});
    li.classList.toggle('rb-open',open);li.querySelector('.rb-deal-row').setAttribute('aria-expanded',open?'true':'false');if(open)load(li);}
  [].forEach.call(list.querySelectorAll('.rb-deal'),function(li){li.querySelector('.rb-deal-row').addEventListener('click',function(){toggle(li);});});
  [].forEach.call(list.querySelectorAll('.rb-deal'),function(li){var r=li.querySelector('.rb-deal-rail'),a=li.querySelector('.rb-deal-all');if(!r)return;var bar=D.createElement('div');bar.className='rb-deal-bar';r.parentNode.insertBefore(bar,r.nextSibling);if(a)bar.appendChild(a);railNav(r,bar);});
  var first=list.querySelector('.rb-deal');
  /* números que cuentan al entrar en pantalla */
  function count(el){var m=el.textContent.match(/^(\D*)(\d+)(.*)$/);if(!m||reduce)return;var to=+m[2],t0=null;
    function st(ts){if(!t0)t0=ts;var p=Math.min(1,(ts-t0)/1100),e=1-Math.pow(1-p,3);el.textContent=m[1]+Math.round(to*e)+m[3];if(p<1)requestAnimationFrame(st);}requestAnimationFrame(st);}
  if('IntersectionObserver' in W){var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io2.unobserve(e.target);if(e.target.classList.contains('rb-deals')){[].forEach.call(list.querySelectorAll('.rb-deal'),load);if(first)toggle(first,true);}else count(e.target);}});},{threshold:.4});
    [].forEach.call(list.querySelectorAll('.rb-deal-pct'),function(p){io2.observe(p);});io2.observe(list);}
  else if(first)toggle(first,true);
}

/* ---------- ficha: descripción en pestañas desplegables ---------- */
function ficha(){
  var box=D.querySelector('.product-info-description'),cont=box&&box.querySelector('.js-product-description');
  if(!cont||box.querySelector('.rb-acc'))return;
  [].forEach.call(box.querySelectorAll('.rb-more'),function(b){b.remove();});
  [].forEach.call(cont.querySelectorAll('.rb-clamp'),function(p){p.classList.remove('rb-clamp','rb-open');});
  var secs=[{t:'Descripción',n:[]}];
  [].slice.call(cont.childNodes).forEach(function(x){if(x.nodeType===1&&x.tagName==='H4'){secs.push({t:x.textContent.trim(),n:[]});x.remove();}else secs[secs.length-1].n.push(x);});
  if(!secs[0].n.filter(function(x){return (x.textContent||'').trim();}).length)secs.shift();
  var txt=(cont.textContent||'').toLowerCase(),care='';
  if(/gamuza/.test(txt))care='<p>Limpieza en seco. Sin secador ni sol en exceso. Usá protector en spray antes de estrenarlas y dejalo secar.</p>';
  else if(/charol/.test(txt))care='<p>Sin sol en exceso ni secador. Si se mojan, secá con un trapo limpio sin frotar y dejalas en un lugar ventilado.</p>';
  else if(/vegano|\bpu\b|sint[eé]tico/.test(txt))care='<p>Limpiá con un trapo húmedo. No uses productos con silicona: pueden dañar el color.</p>';
  else if(/cuero/.test(txt))care='<p>Aplicá ceras incoloras. No uses productos con silicona: pueden dañar el color.</p>';
  var acc=D.createElement('div');acc.className='rb-acc';
  function item(title,nodes,html,open){var it=D.createElement('div');it.className='rb-acc-item'+(open?' rb-open':'');
    it.innerHTML='<button type="button" class="rb-acc-btn" aria-expanded="'+(open?'true':'false')+'"><span>'+title+'</span><i aria-hidden="true"></i></button><div class="rb-acc-body"><div class="rb-acc-in"><div class="rb-acc-pad user-content"></div></div></div>';
    var pad=it.querySelector('.rb-acc-pad');(nodes||[]).forEach(function(x){pad.appendChild(x);});if(html)pad.insertAdjacentHTML('beforeend',html);
    it.querySelector('.rb-acc-btn').addEventListener('click',function(){var o=it.classList.toggle('rb-open');this.setAttribute('aria-expanded',o);});
    acc.appendChild(it);return it;}
  secs.forEach(function(s,i){var it=item(s.t,s.n,'',i===0);if(/medidas/i.test(s.t)){var tb=it.querySelector('table');if(tb){var w=D.createElement('div');w.className='rb-sizes-wrap';tb.parentNode.insertBefore(w,tb);w.appendChild(tb);}
    it.querySelector('.rb-acc-pad').insertAdjacentHTML('beforeend','<p class="rb-acc-note">¿Entre dos talles? <a href="https://wa.me/5491160461320" target="_blank" rel="noopener">Escribinos por WhatsApp</a> y te asesoramos.</p>');}});
  var pi=D.querySelector('[data-block-type="purchase-info"]');
  if(pi){item('Envíos, cuotas y cambios',[pi],'<p class="rb-acc-note">Tenés 30 días para cambiar tu par. <a href="/cambios-y-devoluciones/">Ver cambios y devoluciones</a>.</p>',false);}
  if(care)item('Cuidados',null,care,false);
  /* pestañas tipo botones: una fila de botones y abajo el contenido elegido */
  var its=[].slice.call(acc.querySelectorAll('.rb-acc-item'));
  if(its.length>1){var bar=D.createElement('div');bar.className='rb-tabs';bar.setAttribute('role','tablist');
    var short=function(t){return t.replace(/^Medidas de plantilla$/i,'Medidas').replace(/^Envíos, cuotas y cambios$/i,'Envíos y cambios');};
    its.forEach(function(it,i){var t=it.querySelector('.rb-acc-btn span').textContent,b=D.createElement('button');b.type='button';b.setAttribute('role','tab');b.textContent=short(t);
      b.addEventListener('click',function(){pick(i,true);});bar.appendChild(b);it.setAttribute('role','tabpanel');});
    var pick=function(i,user){its.forEach(function(it,j){it.classList.toggle('rb-on',j===i);});[].forEach.call(bar.children,function(b,j){b.setAttribute('aria-selected',j===i?'true':'false');b.classList.toggle('rb-on',j===i);});
      if(user){var b=bar.children[i];bar.scrollTo({left:b.offsetLeft-bar.offsetLeft-16,behavior:'smooth'});}};
    acc.insertBefore(bar,acc.firstChild);acc.classList.add('rb-tabbed');pick(0);}
  cont.innerHTML='';cont.appendChild(acc);
  var hd=box.querySelector('.product-description-heading');if(hd)hd.style.display='none';
  /* resalta en la tabla el talle elegido */
  function mark(){var sel=D.querySelector('#variation_2, select[name="variation[1]"]');var v=sel&&sel.value;var tb=acc.querySelector('.rb-sizes');if(!tb||!v)return;
    var head=tb.rows[0];[].forEach.call(tb.querySelectorAll('.rb-on'),function(c){c.classList.remove('rb-on');});
    for(var i=1;i<head.cells.length;i++){if(head.cells[i].textContent.trim()===v){[].forEach.call(tb.rows,function(r){if(r.cells[i])r.cells[i].classList.add('rb-on');});}}}
  D.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('.js-variant-button, .btn-variant'))setTimeout(mark,60);});
  D.addEventListener('change',function(e){if(e.target&&e.target.matches&&e.target.matches('.js-variation-option'))setTimeout(mark,60);});
  mark();
}

function mark(){var m=D.querySelector('.rb-mark');if(!m)return;if(reduce||!('IntersectionObserver' in W)){m.classList.add('rb-in');return;}
  var o=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){m.classList.add('rb-in');o.disconnect();}});},{threshold:.2});o.observe(m);}
/* ---------- Menú de celular: panel editorial en lugar del desplegable de Tienda Nube ---------- */
function mnav(){
  if(D.querySelector('.rb-drawer'))return;
  var IMG='https://guiguisv.github.io/rebellion-assets/img/';
  var cats=[['New Drop','/new-drop/'],['Botas','/botas/',[['Ver todas','/botas/'],['Caña alta','/botas/botas-cana/'],['Botas sandalia','/botas-sandalia/']]],
    ['Texanas','/hasta-50-off/texanas/'],['Borcegos','/botas/borcegos/'],
    ['Sandalias','/sandalias/',[['Ver todas','/sandalias/'],['Plataformas','/sandalias/plataformas/'],['Flats','/sandalias/flats/'],['Taco','/sandalias/taco/'],['Taco chupete','/sandalias/taco-chupete/']]],
    ['Mocasines','/mocasines/'],['Gangas','/gangas/']];
  var help=[['Mi cuenta','/account/login/'],['Guía de talles','/guia-de-talles/'],['Cambios','/cambios-y-devoluciones/'],['Cómo comprar','/como-comprar/'],['Preguntas','/preguntas-frecuentes/'],['Contacto','/contacto/']];
  var path=location.pathname,n2=function(i){return(i<9?'0':'')+(i+1);};
  var li=cats.map(function(c,i){var cur=path.indexOf(c[1])===0?' rb-cur':'';
    if(!c[2])return '<li class="rb-dr-it'+cur+'" style="--i:'+i+'"><a href="'+c[1]+'"><small>'+n2(i)+'</small>'+c[0]+'</a></li>';
    return '<li class="rb-dr-it rb-dr-sub'+cur+'" style="--i:'+i+'"><button type="button" aria-expanded="false"><small>'+n2(i)+'</small>'+c[0]+'<b></b></button><div class="rb-dr-more"><div>'+c[2].map(function(s){return '<a href="'+s[1]+'">'+s[0]+'</a>';}).join('')+'</div></div></li>';}).join('');
  var el=D.createElement('div');el.className='rb-drawer';el.setAttribute('aria-hidden','true');
  el.innerHTML='<div class="rb-dr-bg" data-rb-close></div><aside class="rb-dr-panel" role="dialog" aria-modal="true" aria-label="Menú">'+
    '<header class="rb-dr-head"><span>Menú</span><button type="button" class="rb-dr-x" data-rb-close aria-label="Cerrar"><i></i><i></i></button></header>'+
    '<div class="rb-dr-body"><div class="rb-dr-tiles">'+
      '<a class="rb-dr-tile" href="/new-drop/"><img src="'+IMG+'nvo_a.jpg" alt="" loading="lazy"><span>New Drop</span></a>'+
      '<a class="rb-dr-tile rb-dr-tile-sale" href="/hasta-50-off/"><img src="'+IMG+'tex_a.jpg" alt="" loading="lazy"><em data-rb-promo="menu">Sale</em><span>Hasta 50% off</span></a></div>'+
    '<ol class="rb-dr-list">'+li+'</ol>'+
    '<ul class="rb-dr-help">'+help.map(function(h){return '<li><a href="'+h[1]+'">'+h[0]+'</a></li>';}).join('')+'</ul>'+
    '<div class="rb-dr-foot"><a class="rb-dr-wa" href="https://wa.me/5491160461320" target="_blank" rel="noopener">Escribinos por WhatsApp<span>→</span></a>'+
      '<div class="rb-dr-row"><a href="https://wa.me/5491168786231" target="_blank" rel="noopener">Mayoristas</a><a href="https://www.instagram.com/somosrebellion/" target="_blank" rel="noopener">Instagram</a></div></div>'+
    '</div></aside>';
  D.body.appendChild(el);
  var open=function(){el.setAttribute('aria-hidden','false');R.classList.add('rb-dr-open');setTimeout(function(){var x=el.querySelector('.rb-dr-x');x&&x.focus({preventScroll:true});},50);};
  var close=function(){el.setAttribute('aria-hidden','true');R.classList.remove('rb-dr-open');};
  W.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-target="#nav-hamburger"]');
    if(b&&!el.contains(b)){e.preventDefault();e.stopImmediatePropagation();open();}},true);
  el.addEventListener('click',function(e){if(e.target.closest('[data-rb-close]'))close();
    var s=e.target.closest('.rb-dr-sub>button');if(s){var p=s.parentNode,o=p.classList.toggle('rb-open');s.setAttribute('aria-expanded',o);}});
  D.addEventListener('keydown',function(e){if(e.key==='Escape'&&R.classList.contains('rb-dr-open'))close();});
  W.addEventListener('pageshow',close);
}
/* ---------- Carrito: encabezado, barra de envío gratis, sugerencias y total fijo abajo ---------- */
var ENVIO_GRATIS=250000;
function cart(){
  var m=D.getElementById('modal-cart');if(!m||m.classList.contains('rb-cart'))return;m.classList.add('rb-cart');
  var body=m.querySelector('.modal-body'),list=m.querySelector('.js-ajax-cart-list'),empty=m.querySelector('.js-empty-ajax-cart'),row=m.querySelector('.cart-row');
  if(!body||!list)return;
  var money=function(n){return '$'+Math.round(n).toLocaleString('es-AR');};
  var num=function(t){t=(t||'').replace(/[^\d,]/g,'').split(',')[0];return +t.replace(/\D/g,'')||0;};
  var title=m.querySelector('.modal-title');if(title)title.innerHTML='Tu carrito <small class="rb-cart-n"></small>';
  var ship=D.createElement('div');ship.className='rb-ship';ship.innerHTML='<p></p><span><i></i></span>';body.insertBefore(ship,body.firstChild);
  if(empty)empty.insertAdjacentHTML('afterbegin','<div class="rb-cart-empty"><p>Tu carrito está vacío</p><div><a href="/new-drop/">New Drop</a><a href="/hasta-50-off/">Sale</a></div></div>');
  var sug=D.createElement('div');sug.className='rb-sug';sug.innerHTML='<p class="rb-sug-t">Completá tu look</p><div class="rb-sug-rail"></div>';
  (row||list).parentNode.insertBefore(sug,row||list.nextSibling);
  if(row){var sub=row.querySelector('.cart-continue-shopping');if(sub)sub.insertAdjacentHTML('beforebegin','<ul class="rb-cart-trust"><li>3 y 6 cuotas sin interés</li><li>20% off con transferencia</li><li>Cambios dentro de los 30 días</li></ul>');}
  function sync(){
    var items=[].slice.call(list.querySelectorAll('.js-cart-item')),q=0;
    items.forEach(function(it){var i=it.querySelector('.js-cart-quantity-input');q+=i?(+i.value||1):1;
      var v=it.querySelector('.cart-item-variant');if(v&&!v.dataset.rb){var p=v.textContent.replace(/[()]/g,'').split(',').map(function(s){return s.trim();});
        if(p.length===2&&/^\d{2}(\.5)?$/.test(p[1]))v.textContent=p[0]+' · Talle '+p[1];else v.textContent=p.join(' · ');v.dataset.rb='1';}
      var del=it.querySelector('.cart-item-delete-button');if(del&&!del.dataset.rb){del.dataset.rb='1';del.textContent='Quitar';}});
    [].forEach.call(m.querySelectorAll('.js-cart-total,.js-ajax-cart-total,.js-cart-item-subtotal,.cart-compare-price-container span,.js-payment-discount-price-cart'),function(e){if(e.children.length)return;var t=e.textContent;if(/,00\b/.test(t))e.textContent=t.replace(/,00\b/g,'');});
    var n=m.querySelector('.rb-cart-n'),nt=q?'('+q+')':'';if(n&&n.textContent!==nt)n.textContent=nt;
    m.classList.toggle('rb-cart-vacio',!items.length);
    var tot=num((m.querySelector('.js-cart-total')||m.querySelector('.js-ajax-cart-total')||{}).textContent),p=ship.querySelector('p');
    if(!items.length||!tot){ship.hidden=true;}else{ship.hidden=false;var f=Math.max(0,ENVIO_GRATIS-tot);
      var ph=f?'Te faltan <b>'+money(f)+'</b> para el envío gratis':'<b>¡Tenés envío gratis!</b>';if(p.innerHTML!==ph)p.innerHTML=ph;ship.classList.toggle('rb-ok',!f);
      ship.querySelector('i').style.width=Math.min(100,tot/ENVIO_GRATIS*100)+'%';}
    var st=sug.querySelector('.rb-sug-t'),stt=items.length?'Completá tu look':'Te puede gustar';if(st.textContent!==stt)st.textContent=stt;
    var inCart=items.map(function(it){var a=it.querySelector('a[href*="/productos/"]');return a?a.pathname:'';});
    [].forEach.call(sug.querySelectorAll('.rb-scard'),function(c){c.hidden=inCart.indexOf(c.pathname)>-1;});
  }
  var cl=function(t){return (t||'').replace(/\s+/g,' ').trim().replace(/,00\b/g,'');};
  function load(){if(sug.dataset.ok)return;sug.dataset.ok='1';
    Promise.all(['/sandalias/','/new-drop/','/hasta-50-off/'].map(function(u){return fetch(u,{credentials:'same-origin'}).then(function(r){return r.text();}).catch(function(){return '';});})).then(function(pages){
      var seen={},cards=[];
      pages.forEach(function(t,k){var doc=new DOMParser().parseFromString(t,'text/html');
        [].slice.call(doc.querySelectorAll('.js-item-product')).slice(0,k===0?4:3).forEach(function(it){
          var a=it.querySelector('a[href*="/productos/"]');if(!a)return;var h=a.getAttribute('href');if(seen[h])return;seen[h]=1;
          var img=it.querySelector('img'),src='';if(img){src=img.getAttribute('data-srcset')||img.getAttribute('srcset')||img.getAttribute('data-src')||img.getAttribute('src')||'';
            if(/\s\d+w/.test(src)){var ps=src.split(',').map(function(s){return s.trim().split(/\s+/);});src=(ps.filter(function(p){return parseInt(p[1])>=320;})[0]||ps[ps.length-1])[0];}}
          var nm=cl((it.querySelector('.js-item-name')||{}).textContent),pr=cl((it.querySelector('.js-price-display')||{}).textContent);
          var cp=it.querySelector('.js-compare-price-display'),cpt=cp&&!/display:\s*none/.test(cp.getAttribute('style')||'')?cl(cp.textContent):'';
          cards.push('<a class="rb-scard" href="'+h+'"><span class="rb-scard-img"><img src="'+src+'" alt="" loading="lazy"></span><b>'+nm+'</b><span>'+(cpt?'<s>'+cpt+'</s> ':'')+pr+'</span><em>Ver</em></a>');});});
      sug.querySelector('.rb-sug-rail').innerHTML=cards.join('');sug.classList.toggle('rb-sug-on',!!cards.length);sync();
    });}
  var raf=0;new MutationObserver(function(){if(!raf)raf=requestAnimationFrame(function(){raf=0;sync();});}).observe(m,{childList:true,subtree:true,characterData:true});
  new MutationObserver(function(){if(m.classList.contains('modal-show')||m.style.display==='block')load();}).observe(m,{attributes:true,attributeFilter:['class','style']});
  sync();
}
/* ---------- Página Rebel Style (/rebel-style/): grilla de looks desde looks.json ---------- */
function lookbook(){
  if(!/^\/rebel-style\/?$/.test(location.pathname))return;
  var box=D.querySelector('#ns-section-page_content .page-content')||D.querySelector('.page-content.user-content');if(!box||box.querySelector('.rb-lb'))return;
  R.classList.add('rb-lb-page');
  var A='https://guiguisv.github.io/rebellion-assets/';
  fetch(A+'looks/looks.json?v='+Date.now().toString(36).slice(0,-4)).then(function(r){return r.json();}).then(function(d){
    var cards=(d.looks||[]).map(function(l){var m=l.media||{};
      var media=m.video?'<video muted loop playsinline preload="none" poster="'+A+m.poster+'" data-src="'+A+m.video+'"></video>':'<img src="'+A+m.img+'" alt="" loading="lazy">'+(m.alt?'<img class="rb-lb-alt" src="'+A+m.alt+'" alt="" loading="lazy">':'');
      return '<article class="rb-lb-card"><div class="rb-lb-media">'+media+'<span class="rb-lb-n">'+l.n+'</span></div><div class="rb-lb-shop"><small>En el look</small>'+
        (l.products||[]).map(function(p){var inner='<img src="'+A+p.img+'" alt="" loading="lazy"><span><b>'+p.name+'</b><i>'+(p.sub||'')+'</i></span>';
          return p.url?'<a class="rb-lb-p" href="'+p.url+'">'+inner+'<em>Ver →</em></a>':'<div class="rb-lb-p rb-lb-soon">'+inner+'<em>Pronto</em></div>';}).join('')+'</div></article>';}).join('');
    var mas=d.mas?'<a class="rb-lb-more" href="'+d.mas.url+'" target="_blank" rel="noopener"><span>'+d.mas.label+'</span><b>'+d.mas.user+'</b><em>→</em></a>':'';
    box.innerHTML='<section class="rb-lb"><header class="rb-lb-head"><p class="rb-eyebrow">Verano 27</p><h1 class="rb-lb-title"><span>Rebel</span> <span>style</span></h1><p class="rb-lb-sub">Más ideas para tus looks.</p></header><div class="rb-lb-grid">'+cards+mas+'</div></section>';
    var vids=[].slice.call(box.querySelectorAll('video[data-src]'));
    var play=function(v,on){if(on){if(!v.src)v.src=v.dataset.src;v.play().catch(function(){});}else v.pause();};
    if('IntersectionObserver' in W&&!reduce){var io=new IntersectionObserver(function(es){es.forEach(function(e){play(e.target,e.isIntersecting);});},{threshold:.35});vids.forEach(function(v){io.observe(v);});}
  }).catch(function(){});
}
/* ---------- Portada en celular: los tres videos a la vez ---------- */
function heroTri(){
  var tri=D.querySelector('.rb-hero-tri');if(!tri)return;
  var mq=W.matchMedia('(max-width:767px)');
  var set=function(){[].forEach.call(tri.querySelectorAll('video'),function(v){if(mq.matches){if(!v.src){v.src=v.dataset.src;}v.play().catch(function(){});}else v.pause();});};
  set();if(mq.addEventListener)mq.addEventListener('change',set);
}
/* ---------- Ficha: "¿Tenés alguna duda?" visible debajo del botón de compra (pedido reunión 28/10) ---------- */
function waDuda(){
  var bc=D.querySelector('.product-actions .buy-button-container');if(!bc||D.querySelector('.rb-wa-duda'))return;
  var h=D.querySelector('h1'),nom=h?h.textContent.trim():'';
  var a=D.createElement('a');a.className='rb-wa-duda';a.target='_blank';a.rel='noopener';
  a.href='https://wa.me/5491160461320?text='+encodeURIComponent('Hola! Tengo una consulta sobre '+(nom||'un producto de la web'));
  a.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.2.1-.1 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.7 11.7 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.3-.2-.5-.3z"/></svg><span><b>¿Tenés alguna duda?</b> Escribinos por WhatsApp</span>';
  a.style.cssText='display:flex;align-items:center;justify-content:center;gap:8px;margin-top:12px;padding:12px 16px;border:1px solid rgba(17,17,17,.2);color:#111;text-decoration:none;font-size:13px;letter-spacing:.02em';
  bc.insertAdjacentElement('afterend',a);
}
function go(){nav();mnav();cart();lookbook();heroTri();promo();travel();index();deals();ficha();mark();waDuda();}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',go);else go();
})();
