(function () {
  'use strict';

  /* ── 1. HUB SEARCH ────────────────────────────────────────── */

  var hubSearch = document.getElementById('hubSearch');
  if (hubSearch) {
    hubSearch.addEventListener('input', function () {
      var q = hubSearch.value.trim().toLowerCase();

      document.querySelectorAll('.docs-popular-row').forEach(function (row) {
        var match = !q || row.textContent.toLowerCase().includes(q);
        row.style.display = match ? '' : 'none';
      });

      document.querySelectorAll('.docs-category-card').forEach(function (card) {
        var match = !q || card.textContent.toLowerCase().includes(q);
        card.style.display = match ? '' : 'none';
      });
    });
  }

  /* ── 2. SIDEBAR SEARCH ────────────────────────────────────── */

  var sidebarSearch = document.getElementById('docsSearch');
  if (sidebarSearch) {
    sidebarSearch.addEventListener('input', function () {
      var q = sidebarSearch.value.trim().toLowerCase();

      document.querySelectorAll('.docs-nav-section-group').forEach(function (group) {
        var links = group.querySelectorAll('.docs-nav-link');
        var anyVisible = false;

        links.forEach(function (link) {
          var match = !q || link.textContent.toLowerCase().includes(q);
          link.style.display = match ? '' : 'none';
          if (match) anyVisible = true;
        });

        group.style.display = anyVisible ? '' : 'none';
      });
    });
  }

  /* ── 3. ACTIVE SIDEBAR LINK ───────────────────────────────── */

  var currentPath = window.location.pathname.replace(/\/$/, '');
  document.querySelectorAll('.docs-nav-link').forEach(function (link) {
    var href = (link.getAttribute('href') || '').replace(/\/$/, '');
    if (href && href === currentPath) {
      link.classList.add('is-active');
    }
  });

  /* ── 4. TOC SCROLL-SPY ────────────────────────────────────── */

  var tocLinks = Array.from(document.querySelectorAll('#tocNav .docs-toc-link'));
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var headings = tocLinks.map(function (link) {
      var id = (link.getAttribute('href') || '').replace('#', '');
      return document.getElementById(id);
    }).filter(Boolean);

    var activeHeading = null;

    function setActiveToc(heading) {
      if (activeHeading === heading) return;
      activeHeading = heading;
      tocLinks.forEach(function (link) {
        var id = (link.getAttribute('href') || '').replace('#', '');
        link.classList.toggle('is-active', !!(heading && heading.id === id));
      });
    }

    // Initialise with first heading active
    if (headings[0]) setActiveToc(headings[0]);

    var observer = new IntersectionObserver(function (entries) {
      // Collect all currently intersecting headings, pick the topmost
      var intersecting = entries
        .filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });

      if (intersecting.length) {
        setActiveToc(intersecting[0].target);
      }
    }, {
      rootMargin: '-82px 0px -60% 0px',
      threshold: 0
    });

    headings.forEach(function (h) { observer.observe(h); });
  }

  /* ── 5. MOBILE SIDEBAR DRAWER ─────────────────────────────── */

  var sidebarToggle = document.getElementById('sidebarToggle');
  var docsSidebar = document.getElementById('docsSidebar');

  if (sidebarToggle && docsSidebar) {
    // Create overlay element separately so it does not conflict with site.js #overlay
    var sidebarOverlay = document.createElement('div');
    sidebarOverlay.className = 'docs-sidebar-overlay';
    document.body.appendChild(sidebarOverlay);

    function openSidebar() {
      docsSidebar.classList.add('is-open');
      sidebarOverlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      sidebarToggle.setAttribute('aria-expanded', 'true');
    }

    function closeSidebar() {
      docsSidebar.classList.remove('is-open');
      sidebarOverlay.classList.remove('is-open');
      document.body.style.overflow = '';
      sidebarToggle.setAttribute('aria-expanded', 'false');
    }

    sidebarToggle.addEventListener('click', openSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSidebar();
    });

    docsSidebar.querySelectorAll('.docs-nav-link').forEach(function (link) {
      link.addEventListener('click', closeSidebar);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 760) closeSidebar();
    });
  }

  /* ── 6. FEEDBACK BUTTONS ──────────────────────────────────── */

  document.querySelectorAll('.docs-feedback-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wrap = btn.closest('.docs-feedback-wrap');
      if (wrap) {
        wrap.innerHTML = '<p style="font-size:12px;color:var(--muted-2)">Thanks for the feedback!</p>';
      }
    });
  });

})();
