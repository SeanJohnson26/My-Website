(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var slides = Array.from(document.querySelectorAll('.cf-slide'));
    if (!slides.length) return;

    var total   = slides.length;
    var current = 0;

    function update() {
      slides.forEach(function (slide, i) {
        var raw = (i - current) % total;
        if (raw > total / 2)  raw -= total;
        if (raw < -total / 2) raw += total;
        // Clamp to ±3 so extras get the hidden class
        var pos = Math.max(-3, Math.min(3, raw));
        slide.setAttribute('data-pos', pos);
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
