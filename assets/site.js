// XLANA — общий скрипт: меню, шапка, появление блоков, галерея, видео
(function(){
  var doc = document.documentElement, body = document.body;

  // header: transparent over the hero, white after scrolling
  var head = document.querySelector('.site-head');
  function onScroll(){ if (head) head.classList.toggle('solid', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // mobile menu
  var burger = document.querySelector('.burger');
  if (burger) burger.addEventListener('click', function(){
    var open = body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', open);
  });

  // remember chosen language (used by the root page)
  document.querySelectorAll('[data-lang-link]').forEach(function(a){
    a.addEventListener('click', function(){ try { localStorage.setItem('xlana-lang', a.getAttribute('data-lang-link')); } catch(e) {} });
  });

  // blocks appear on scroll
  var items = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {rootMargin:'0px 0px -60px 0px'});
    items.forEach(function(el){ io.observe(el); });
  } else items.forEach(function(el){ el.classList.add('in'); });

  // photo viewer with arrows, keys and swipe
  var lb = document.querySelector('.lb');
  if (lb) {
    var lbImg = lb.querySelector('img'), cnt = lb.querySelector('.cnt'), list = [], idx = 0;
    var show = function(i){ idx = (i + list.length) % list.length; lbImg.src = list[idx]; cnt.textContent = (idx + 1) + ' / ' + list.length; };
    document.querySelectorAll('.gal').forEach(function(g){
      var srcs = Array.prototype.map.call(g.querySelectorAll('img'), function(im){ return im.getAttribute('src'); });
      g.querySelectorAll('button').forEach(function(b, i){
        b.addEventListener('click', function(){ list = srcs; show(i); lb.classList.add('open'); });
      });
    });
    var close = function(){ lb.classList.remove('open'); };
    lb.querySelector('.x').addEventListener('click', close);
    lb.querySelector('.pv').addEventListener('click', function(){ show(idx - 1); });
    lb.querySelector('.nx').addEventListener('click', function(){ show(idx + 1); });
    lb.addEventListener('click', function(e){ if (e.target === lb) close(); });
    document.addEventListener('keydown', function(e){
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
    var x0 = null;
    lb.addEventListener('touchstart', function(e){ x0 = e.touches[0].clientX; }, {passive:true});
    lb.addEventListener('touchend', function(e){
      if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
    });
  }

  // video: cover first, YouTube player loads on click and plays on the page.
  // A page opened as a local file cannot play YouTube (error 153), so there the video opens on youtube.com.
  document.querySelectorAll('.yt').forEach(function(b){
    b.addEventListener('click', function(){
      var id = b.getAttribute('data-yt');
      if (location.protocol === 'file:') { window.open('https://www.youtube.com/watch?v=' + id, '_blank', 'noopener'); return; }
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      f.title = b.getAttribute('aria-label');
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      b.replaceWith(f);
    });
  });
})();
