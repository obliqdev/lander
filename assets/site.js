(function () {
  const platformWrap = document.getElementById('platformWrap');
  const platformTrigger = document.getElementById('platformTrigger');
  const megaMenu = document.getElementById('megaMenu');

  const overlay = document.getElementById('overlay');
  const sheet = document.getElementById('mobileSheet');
  const mobileOpen = document.getElementById('mobileOpen');
  const mobileClose = document.getElementById('mobileClose');
  const mobileRoot = document.getElementById('mobileRoot');
  const mobilePlatform = document.getElementById('mobilePlatform');
  const mobilePlatformBtn = document.getElementById('mobilePlatformBtn');
  const mobileBack = document.getElementById('mobileBack');
  const topbar = document.querySelector('.topbar');

  const years = document.querySelectorAll('.js-year');
  const currentYear = String(new Date().getFullYear());
  years.forEach((el) => { el.textContent = currentYear; });

  const roiClassesMonth = document.getElementById('roiClassesMonth');
  const roiAdminHoursWeek = document.getElementById('roiAdminHoursWeek');
  const roiNoShowRate = document.getElementById('roiNoShowRate');
  const roiActiveMembers = document.getElementById('roiActiveMembers');
  const roiAvgMemberValue = document.getElementById('roiAvgMemberValue');
  const roiHoursSaved = document.getElementById('roiHoursSaved');
  const roiNoShowsReduced = document.getElementById('roiNoShowsReduced');
  const roiRetentionLift = document.getElementById('roiRetentionLift');

  const platformChips = Array.from(document.querySelectorAll('.platform-strip .platform-chip'));
  const storyVideos = Array.from(document.querySelectorAll('[data-video-story]'));

  const applyScrollReveal = (selector, delayGroup = 5) => {
    const revealTargets = Array.from(document.querySelectorAll(selector));
    if (!revealTargets.length) return;

    revealTargets.forEach((element) => {
      element.classList.add('reveal-on-scroll');
    });

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px'
      });

      revealTargets.forEach((element, index) => {
        element.style.transitionDelay = `${Math.min(index % delayGroup, delayGroup - 1) * 60}ms`;
        revealObserver.observe(element);
      });
    } else {
      revealTargets.forEach((element) => {
        element.classList.add('reveal-visible');
      });
    }
  };

  if (document.body.classList.contains('platform-page')) {
    applyScrollReveal('[id^="platform-"] .kicker, [id^="platform-"] .section-title, [id^="platform-"] .section-copy, [id^="platform-"] .platform-showcase, [id^="platform-"] .stack');
  }

  if (document.body.classList.contains('solutions-page')) {
    applyScrollReveal('#segments .kicker, #segments .section-title, #segments .section-copy, #segments .model-row > .card, #segments .stack', 4);
  }

  if (document.body.classList.contains('home-page')) {
    applyScrollReveal('#solutions .kicker, #solutions .section-title, #solutions .card, #apps .kicker, #apps .section-title, #apps .section-copy, #apps .app-card, #outcomes .kicker, #outcomes .section-title, #outcomes .section-copy, #outcomes .matrix-wrap, #roi .kicker, #roi .section-title, #roi .section-copy, #roi .card, #built-by-owners .kicker, #built-by-owners .section-title, #built-by-owners .section-copy, #built-by-owners .card, main .final-cta', 6);

    if (topbar) {
      const updateTopbarScrollState = () => {
        topbar.classList.toggle('nav-scrolled', window.scrollY > 24);
      };

      window.addEventListener('scroll', updateTopbarScrollState, { passive: true });
      window.addEventListener('resize', updateTopbarScrollState);
      updateTopbarScrollState();
    }

    const problemTools = document.querySelector('#solutions .problem-tools');

    if (problemTools instanceof HTMLElement) {
      const inertiaRaw = Number.parseFloat(problemTools.dataset.inertia || '1');
      const problemToolsInertia = Number.isFinite(inertiaRaw) && inertiaRaw > 0 ? inertiaRaw : 1;
      let problemToolsAnimationFrame = null;

      const updateProblemToolsScrollOffset = () => {
        const rect = problemTools.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const sectionCenter = rect.top + (rect.height / 2);
        const viewportCenter = viewportHeight / 2;
        const normalizedOffset = (sectionCenter - viewportCenter) / viewportHeight;
        const clampedOffset = Math.max(-1, Math.min(1, normalizedOffset));
        const scrollOffsetPx = clampedOffset * 220 * problemToolsInertia;
        const scrollSpinDeg = clampedOffset * 9 * problemToolsInertia;
        const scrollScale = Math.abs(clampedOffset) * 0.12 * problemToolsInertia;

        problemTools.style.setProperty('--problem-tools-scroll-y', `${scrollOffsetPx.toFixed(2)}px`);
        problemTools.style.setProperty('--problem-tools-scroll-spin', `${scrollSpinDeg.toFixed(2)}deg`);
        problemTools.style.setProperty('--problem-tools-scroll-scale', scrollScale.toFixed(4));
      };

      const requestProblemToolsUpdate = () => {
        if (problemToolsAnimationFrame !== null) {
          return;
        }

        problemToolsAnimationFrame = window.requestAnimationFrame(() => {
          problemToolsAnimationFrame = null;
          updateProblemToolsScrollOffset();
        });
      };

      window.addEventListener('scroll', requestProblemToolsUpdate, { passive: true });
      window.addEventListener('resize', requestProblemToolsUpdate);
      updateProblemToolsScrollOffset();
    }
  }

  if (document.body.classList.contains('platform-page') && topbar) {
    const stripSection = document.querySelector('.platform-strip-section');
    let previousScrollY = window.scrollY;
    let navHidden = false;
    const deltaThreshold = 6;

    const setPlatformNavHidden = (hidden) => {
      if (navHidden === hidden) return;
      navHidden = hidden;
      topbar.classList.toggle('is-hidden', hidden);
      if (stripSection) {
        stripSection.classList.toggle('is-hidden', hidden);
      }
    };

    const updatePlatformNavByScrollDirection = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - previousScrollY;

      if (currentScrollY <= 24) {
        setPlatformNavHidden(false);
        previousScrollY = currentScrollY;
        return;
      }

      if (delta > deltaThreshold) {
        setPlatformNavHidden(true);
      } else if (delta < -deltaThreshold) {
        setPlatformNavHidden(false);
      }

      previousScrollY = currentScrollY;
    };

    window.addEventListener('scroll', updatePlatformNavByScrollDirection, { passive: true });
    window.addEventListener('resize', () => setPlatformNavHidden(false));
    updatePlatformNavByScrollDirection();
  }

  if (storyVideos.length) {
    storyVideos.forEach((story) => {
      const video = story.querySelector('video');
      const playButton = story.querySelector('[data-video-play]');
      const overlay = story.querySelector('[data-video-overlay]');

      if (!(video instanceof HTMLVideoElement) || !(playButton instanceof HTMLElement) || !(overlay instanceof HTMLElement)) {
        return;
      }

      const playStory = async () => {
        story.classList.add('is-playing');
        try {
          await video.play();
        } catch (error) {
          story.classList.remove('is-playing');
        }
      };

      playButton.addEventListener('click', playStory);

      video.addEventListener('pause', () => {
        if (!video.ended) {
          story.classList.remove('is-playing');
        }
      });

      video.addEventListener('ended', () => {
        story.classList.remove('is-playing');
      });
    });
  }

  if (platformChips.length) {
    const topbar = document.querySelector('.topbar');
    const stripSection = document.querySelector('.platform-strip-section');

    const trackedItems = platformChips
      .map((chip) => {
        const target = chip.getAttribute('href');
        const targetId = target && target.startsWith('#') ? target.slice(1) : '';
        const section = targetId ? document.getElementById(targetId) : null;
        return section ? { chip, section } : null;
      })
      .filter(Boolean);

    let activeChip = null;

    const getActivationLine = () => {
      const topbarHeight = topbar ? topbar.getBoundingClientRect().height : 0;
      const stripHeight = stripSection ? stripSection.getBoundingClientRect().height : 0;
      return topbarHeight + stripHeight + 14;
    };

    const setSelectedChip = (chip) => {
      if (!chip || activeChip === chip) return;
      if (activeChip) activeChip.classList.remove('selected');
      chip.classList.add('selected');
      activeChip = chip;
    };

    const updateChipByScroll = () => {
      if (!trackedItems.length) return;

      const activationLine = getActivationLine();
      let nextActive = trackedItems[0];

      trackedItems.forEach((item) => {
        if (item.section.getBoundingClientRect().top <= activationLine) {
          nextActive = item;
        }
      });

      setSelectedChip(nextActive.chip);
    };

    trackedItems.forEach((item) => {
      item.chip.addEventListener('click', () => {
        setSelectedChip(item.chip);
      });
    });

    window.addEventListener('scroll', updateChipByScroll, { passive: true });
    window.addEventListener('resize', updateChipByScroll);

    updateChipByScroll();
  }

  if (
    roiClassesMonth
    && roiAdminHoursWeek
    && roiNoShowRate
    && roiActiveMembers
    && roiAvgMemberValue
    && roiHoursSaved
    && roiNoShowsReduced
    && roiRetentionLift
  ) {
    const numberFormat = new Intl.NumberFormat('en-US');
    const currencyFormat = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    });

    const asNumber = (value) => {
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    };

    const renderRoiSnapshot = () => {
      const monthlyClasses = asNumber(roiClassesMonth.value);
      const weeklyAdminHours = asNumber(roiAdminHoursWeek.value);
      const noShowRatePct = asNumber(roiNoShowRate.value);
      const activeMembers = asNumber(roiActiveMembers.value);
      const avgMemberValue = asNumber(roiAvgMemberValue.value);

      const monthlyAdminHours = weeklyAdminHours * 4.33;
      const hoursSavedMonth = monthlyAdminHours * 0.34;

      const monthlyNoShows = monthlyClasses * (noShowRatePct / 100);
      const noShowsReducedMonth = monthlyNoShows * 0.22;

      const retentionLiftValueMonth = activeMembers * avgMemberValue * 0.03;

      roiHoursSaved.textContent = `${numberFormat.format(Math.round(hoursSavedMonth))} hrs`;
      roiNoShowsReduced.textContent = `${numberFormat.format(Math.round(noShowsReducedMonth))} bookings`;
      roiRetentionLift.textContent = currencyFormat.format(Math.round(retentionLiftValueMonth));
    };

    [roiClassesMonth, roiAdminHoursWeek, roiNoShowRate, roiActiveMembers, roiAvgMemberValue].forEach((input) => {
      input.addEventListener('input', renderRoiSnapshot);
    });

    renderRoiSnapshot();
  }

  const heroTrack = document.getElementById('heroTrack');
  const heroViewport = document.getElementById('heroViewport');
  const heroPrev = document.getElementById('heroPrev');
  const heroNext = document.getElementById('heroNext');
  const heroFeatureTitle = document.getElementById('heroFeatureTitle');
  const heroFeatureSubtitle = document.getElementById('heroFeatureSubtitle');

  if (heroTrack && heroViewport && heroPrev && heroNext) {
    const shouldRunHeroIntro = document.body.classList.contains('home-page')
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (shouldRunHeroIntro) {
      document.body.classList.add('hero-intro');
      window.setTimeout(() => {
        document.body.classList.remove('hero-intro');
      }, 1200);
    }

    const originalSlides = Array.from(heroTrack.children);
    const totalSlides = originalSlides.length;
    let index = 0;
    let trackIndex = 1;
    let touchStartX = null;
    let touchStartY = null;
    let autoScrollTimer = null;

    if (!totalSlides) {
      return;
    }

    if (totalSlides > 1) {
      const firstClone = originalSlides[0].cloneNode(true);
      const lastClone = originalSlides[totalSlides - 1].cloneNode(true);
      firstClone.setAttribute('aria-hidden', 'true');
      lastClone.setAttribute('aria-hidden', 'true');
      heroTrack.prepend(lastClone);
      heroTrack.append(firstClone);
    }

    const slides = Array.from(heroTrack.children);

    function setTrackTransition(enabled) {
      heroTrack.style.transition = enabled ? 'transform .4s ease' : 'none';
    }

    function readMetaFromSlide(slide) {
      if (!slide) return { title: '', subtitle: '' };
      const pills = slide.querySelectorAll('.preview-head .pill');
      return {
        title: pills[0] ? pills[0].textContent.trim() : '',
        subtitle: pills[1] ? pills[1].textContent.trim() : ''
      };
    }

    function updateFeatureMeta() {
      if (!heroFeatureTitle || !heroFeatureSubtitle) return;
      const sourceSlide = slides[trackIndex] || originalSlides[index];
      const meta = readMetaFromSlide(sourceSlide);
      heroFeatureTitle.textContent = meta.title;
      heroFeatureSubtitle.textContent = meta.subtitle;
    }

    function updateActiveSlideState() {
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === trackIndex);
      });
    }

    function centerOnTrackIndex(nextTrackIndex, animate = true) {
      const targetSlide = slides[nextTrackIndex];
      if (!targetSlide) return;

      setTrackTransition(animate);
      trackIndex = nextTrackIndex;

      const viewportCenter = heroViewport.clientWidth / 2;
      const cardCenter = targetSlide.offsetLeft + (targetSlide.offsetWidth / 2);
      const translateX = viewportCenter - cardCenter;
      heroTrack.style.transform = `translateX(${translateX}px)`;

      if (totalSlides > 1) {
        if (trackIndex === 0) index = totalSlides - 1;
        else if (trackIndex === slides.length - 1) index = 0;
        else index = trackIndex - 1;
      } else {
        index = 0;
      }

      updateActiveSlideState();
      updateFeatureMeta();
    }

    function setSlide(nextIndex) {
      if (totalSlides <= 1) {
        centerOnTrackIndex(0, true);
        return;
      }

      if (nextIndex < 0) {
        centerOnTrackIndex(0, true);
        return;
      }

      if (nextIndex >= totalSlides) {
        centerOnTrackIndex(slides.length - 1, true);
        return;
      }

      centerOnTrackIndex(nextIndex + 1, true);
    }

    function restartAutoScroll() {
      if (autoScrollTimer) {
        clearInterval(autoScrollTimer);
      }

      if (totalSlides <= 1) return;

      autoScrollTimer = setInterval(() => {
        setSlide(index + 1);
      }, 3800);
    }

    heroTrack.addEventListener('transitionend', () => {
      if (totalSlides <= 1) return;

      if (trackIndex === 0) {
        centerOnTrackIndex(totalSlides, false);
      } else if (trackIndex === slides.length - 1) {
        centerOnTrackIndex(1, false);
      }
    });

    heroPrev.addEventListener('click', () => {
      setSlide(index - 1);
      restartAutoScroll();
    });

    heroNext.addEventListener('click', () => {
      setSlide(index + 1);
      restartAutoScroll();
    });

    heroViewport.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        setSlide(index - 1);
        restartAutoScroll();
      }
      if (event.key === 'ArrowRight') {
        setSlide(index + 1);
        restartAutoScroll();
      }
    });

    heroViewport.addEventListener('touchstart', (event) => {
      const touch = event.changedTouches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    }, { passive: true });

    heroViewport.addEventListener('touchend', (event) => {
      if (touchStartX === null || touchStartY === null) return;
      const touch = event.changedTouches[0];
      const diffX = touch.clientX - touchStartX;
      const diffY = touch.clientY - touchStartY;

      if (Math.abs(diffX) > 44 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) setSlide(index + 1);
        else setSlide(index - 1);
        restartAutoScroll();
      }

      touchStartX = null;
      touchStartY = null;
    }, { passive: true });

    heroViewport.addEventListener('mouseenter', () => {
      if (autoScrollTimer) clearInterval(autoScrollTimer);
    });

    heroViewport.addEventListener('mouseleave', restartAutoScroll);

    window.addEventListener('resize', () => {
      centerOnTrackIndex(trackIndex, false);
    });

    centerOnTrackIndex(totalSlides > 1 ? 1 : 0, false);
    restartAutoScroll();
  }

  if (!platformWrap || !platformTrigger || !megaMenu || !overlay || !sheet || !mobileOpen || !mobileClose || !mobileRoot || !mobilePlatform || !mobilePlatformBtn || !mobileBack) {
    return;
  }

  let megaOpen = false;
  let sheetOpen = false;
  let megaCloseTimer = null;

  function clearMegaCloseTimer() {
    if (megaCloseTimer) {
      clearTimeout(megaCloseTimer);
      megaCloseTimer = null;
    }
  }

  function scheduleMegaClose() {
    clearMegaCloseTimer();
    megaCloseTimer = setTimeout(() => {
      closeMega();
    }, 180);
  }

  function openMega() {
    if (window.innerWidth < 960) return;
    clearMegaCloseTimer();
    megaOpen = true;
    megaMenu.classList.add('open');
    platformTrigger.setAttribute('aria-expanded', 'true');
  }

  function closeMega() {
    clearMegaCloseTimer();
    megaOpen = false;
    megaMenu.classList.remove('open');
    platformTrigger.setAttribute('aria-expanded', 'false');
  }

  function showMobileRoot() {
    mobileRoot.style.display = 'block';
    mobilePlatform.style.display = 'none';
  }

  function showMobilePlatform() {
    mobileRoot.style.display = 'none';
    mobilePlatform.style.display = 'block';
  }

  function openSheet() {
    sheetOpen = true;
    overlay.classList.add('open');
    sheet.classList.add('open');
    sheet.setAttribute('aria-hidden', 'false');
    mobileOpen.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeSheet() {
    sheetOpen = false;
    overlay.classList.remove('open');
    sheet.classList.remove('open');
    sheet.setAttribute('aria-hidden', 'true');
    mobileOpen.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    showMobileRoot();
  }

  platformWrap.addEventListener('mouseenter', openMega);
  platformWrap.addEventListener('mouseleave', scheduleMegaClose);
  megaMenu.addEventListener('mouseenter', clearMegaCloseTimer);
  megaMenu.addEventListener('mouseleave', scheduleMegaClose);
  platformTrigger.addEventListener('click', () => {
    window.location.href = '/platform/';
  });
  platformTrigger.addEventListener('focus', openMega);

  mobileOpen.addEventListener('click', openSheet);
  mobileClose.addEventListener('click', closeSheet);
  mobilePlatformBtn.addEventListener('click', showMobilePlatform);
  mobileBack.addEventListener('click', showMobileRoot);

  sheet.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeSheet);
  });

  overlay.addEventListener('click', () => {
    closeMega();
    closeSheet();
  });

  document.addEventListener('click', (event) => {
    if (megaOpen && !platformWrap.contains(event.target)) {
      closeMega();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMega();
      if (sheetOpen) closeSheet();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth < 960) {
      closeMega();
    } else if (sheetOpen) {
      closeSheet();
    }
  });
})();
