(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var slides    = Array.from(document.querySelectorAll('.cf-slide'));
    var dotsContainer = document.getElementById('cf-dots');
    if (!slides.length) return;

    var total   = slides.length;
    var current = 0;

    // Generate dots dynamically so adding slides never breaks the count
    slides.forEach(function (_, i) {
      var btn = document.createElement('button');
      btn.className = 'cf-dot' + (i === 0 ? ' active' : '');
      btn.setAttribute('data-go', i);
      btn.setAttribute('aria-label', 'Photo ' + (i + 1));
      dotsContainer.appendChild(btn);
    });

    var dots = Array.from(dotsContainer.querySelectorAll('.cf-dot'));

    function update() {
      slides.forEach(function (slide, i) {
        var raw = (i - current) % total;
        if (raw > total / 2)  raw -= total;
        if (raw < -total / 2) raw += total;
        // Clamp to ±3 so extras get the hidden class
        var pos = Math.max(-3, Math.min(3, raw));
        slide.setAttribute('data-pos', pos);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    var autoTimer;

    function goTo(n) {
      current = ((n % total) + total) % total;
      update();
    }

    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(function () { goTo(current + 1); }, 10000);
    }

    document.getElementById('cf-prev').addEventListener('click', function () {
      goTo(current - 1);
      startAuto();
    });

    document.getElementById('cf-next').addEventListener('click', function () {
      goTo(current + 1);
      startAuto();
    });

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goTo(parseInt(dot.getAttribute('data-go')));
      });
    });

    slides.forEach(function (slide) {
      slide.addEventListener('click', function () {
        var pos = parseInt(slide.getAttribute('data-pos'));
        if (pos !== 0) goTo(current + pos);
      });
    });

    // Keyboard navigation when carousel is in view
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });

    update();
    startAuto();
  });
})();
