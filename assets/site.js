(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Títulos: aparición letra a letra, respetando emojis y sin romper palabras.
  if (!reduce) {
    document.querySelectorAll('.split').forEach(function (el) {
      var text = el.textContent;
      el.setAttribute('aria-label', text);
      var segmenter = window.Intl && Intl.Segmenter ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
      var chars = function (word) {
        return segmenter ? Array.from(segmenter.segment(word), function (s) { return s.segment; }) : [word];
      };
      var i = 0;
      el.textContent = '';
      text.split(' ').forEach(function (word, n, all) {
        var w = document.createElement('span');
        w.className = 'word';
        w.setAttribute('aria-hidden', 'true');
        chars(word).forEach(function (c) {
          var s = document.createElement('span');
          s.className = 'ch';
          s.style.setProperty('--i', i++);
          s.textContent = c;
          w.appendChild(s);
        });
        el.appendChild(w);
        if (n < all.length - 1) el.appendChild(document.createTextNode(' '));
      });
    });
  }

  // Contenido: aparece al entrar en pantalla.
  var items = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -5% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  // Cabecera: se oculta al bajar y vuelve al subir.
  var header = document.querySelector('[data-header]');
  var last = window.scrollY;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (Math.abs(y - last) < 6) return;
    header.classList.toggle('is-hidden', y > last && y > 120 && !document.body.classList.contains('menu-open'));
    last = y;
  }, { passive: true });

  // Menú móvil.
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', burger.getAttribute(open ? 'data-close' : 'data-open'));
  }
  burger.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); burger.focus(); }
  });
})();
