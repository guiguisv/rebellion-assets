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
