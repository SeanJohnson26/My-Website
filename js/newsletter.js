(function () {
  var BASE = 'newsletters/';

  function escHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fmtDate(dateStr) {
    var d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function monthYear(dateStr) {
    var d = new Date(dateStr + 'T00:00:00');
    return {
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      year: d.getFullYear()
    };
  }

  function stripFrontmatter(md) {
    var m = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!m) return { fm: {}, body: md };
    var fm = {};
    m[1].split('\n').forEach(function (line) {
      var idx = line.indexOf(':');
      if (idx > -1) {
        var k = line.slice(0, idx).trim();
        var v = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
        fm[k] = v;
      }
    });
    return { fm: fm, body: m[2] };
  }

  function showList(container) {
    container.innerHTML = '<p class="loading-msg">Loading newsletters&#8230;</p>';

    fetch(BASE + 'index.json')
      .then(function (r) {
        if (!r.ok) throw new Error('index not found');
        return r.json();
      })
      .then(function (list) {
        if (!list.length) {
          container.innerHTML = '<p class="loading-msg">No newsletters yet — check back soon!</p>';
          return;
        }

        var html = list.map(function (nl) {
          var my = monthYear(nl.date);
          if (nl.coming_soon) {
            return (
              '<div class="nl-card">' +
                '<div class="nl-date-chip">' +
                  '<div class="nl-month">' + escHtml(my.month) + '</div>' +
                  '<div class="nl-year">' + escHtml(my.year) + '</div>' +
                '</div>' +
                '<div class="nl-meta">' +
                  '<h3>' + escHtml(nl.title) + ' <span class="tag nl-coming-badge">COMING SOON</span></h3>' +
                  '<p class="nl-excerpt">' + escHtml(nl.excerpt || '') + '</p>' +
                  '<span class="btn btn-sm btn-disabled" aria-disabled="true">Coming Soon</span>' +
                '</div>' +
              '</div>'
            );
          }
          return (
            '<div class="nl-card">' +
              '<div class="nl-date-chip">' +
                '<div class="nl-month">' + escHtml(my.month) + '</div>' +
                '<div class="nl-year">' + escHtml(my.year) + '</div>' +
              '</div>' +
              '<div class="nl-meta">' +
                '<h3>' + escHtml(nl.title) + '</h3>' +
                '<p class="nl-excerpt">' + escHtml(nl.excerpt || '') + '</p>' +
                '<a href="newsletter.html?read=' + encodeURIComponent(nl.slug) + '" class="btn btn-navy btn-sm">Read Full Letter &rarr;</a>' +
              '</div>' +
            '</div>'
          );
        }).join('');

        container.innerHTML = '<div class="newsletter-list">' + html + '</div>';
      })
      .catch(function () {
        container.innerHTML = '<p class="error-msg">Couldn\'t load newsletters right now. Please try again later.</p>';
      });
  }

  function showNewsletter(slug, container) {
    container.innerHTML = '<p class="loading-msg">Loading&#8230;</p>';

    fetch(BASE + slug + '.md')
      .then(function (r) {
        if (!r.ok) throw new Error('not found');
        return r.text();
      })
      .then(function (md) {
        var parsed = stripFrontmatter(md);
        var title = parsed.fm.title || slug.replace(/-/g, ' ');
        var date = parsed.fm.date || '';
        var pdf = parsed.fm.pdf || '';
        var dateHtml = date ? '<p class="nl-read-date">' + escHtml(fmtDate(date)) + '</p>' : '';

        document.title = escHtml(title) + ' | Sean Johnson Ministry';

        var bodyHtml = pdf
          ? '<iframe src="' + escHtml(pdf) + '" width="100%" height="900px" style="border:none;border-radius:8px;display:block;"></iframe>'
          : '<div class="nl-body">' + marked.parse(parsed.body) + '</div>';

        container.innerHTML =
          '<div class="nl-read-back">' +
            '<a href="newsletter.html" class="btn btn-navy btn-sm">&larr; All Newsletters</a>' +
          '</div>' +
          '<div class="nl-read-card">' +
            '<h1 class="nl-read-title">' + escHtml(title) + '</h1>' +
            dateHtml +
            bodyHtml +
          '</div>';
      })
      .catch(function () {
        container.innerHTML =
          '<div class="nl-read-back">' +
            '<a href="newsletter.html" class="btn btn-navy btn-sm">&larr; All Newsletters</a>' +
          '</div>' +
          '<p class="error-msg">That newsletter couldn\'t be loaded. It may not exist yet.</p>';
      });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var container = document.getElementById('newsletter-container');
    if (!container) return;

    var params = new URLSearchParams(window.location.search);
    var slug = params.get('read');

    if (slug) {
      showNewsletter(slug, container);
    } else {
      showList(container);
    }
  });
})();
