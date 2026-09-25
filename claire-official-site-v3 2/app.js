(() => {
  const config = window.CLAIRE_SITE || {};
  const socials = config.socials || {};

  document.querySelectorAll('[data-social]').forEach((el) => {
    const key = el.dataset.social;
    const url = socials[key];
    if (url && url !== '#') {
      el.href = url;
    } else {
      if (el.classList.contains('social-card')) {
        el.classList.add('is-disabled');
        el.setAttribute('aria-disabled', 'true');
        el.removeAttribute('target');
      }
      if (el.classList.contains('button')) {
        el.href = '#links';
      }
    }
  });

  const heroVideo = document.getElementById('heroVideo');
  const heroFallback = document.querySelector('.hero-fallback');
  if (heroFallback && config.heroPoster) {
    heroFallback.style.backgroundImage = `linear-gradient(to top, rgba(9,9,11,.18), rgba(9,9,11,.06)), url("${config.heroPoster}")`;
    heroFallback.classList.add('has-image');
  }
  if (heroVideo && config.heroVideo) {
    heroVideo.src = config.heroVideo;
    if (config.heroPoster) heroVideo.poster = config.heroPoster;
    heroVideo.addEventListener('canplay', () => {
      heroVideo.classList.add('is-ready');
      heroVideo.play().catch(() => {});
    }, { once: true });
  }

  const galleryGrid = document.getElementById('galleryGrid');
  const gallery = Array.isArray(config.gallery) ? config.gallery.filter(Boolean) : [];
  const galleryItems = gallery.length ? gallery : ['', '', '', '', '', ''];

  galleryItems.forEach((path, i) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'gallery-card';
    card.setAttribute('aria-label', `Open Claire photo ${i + 1}`);

    if (path) {
      const img = document.createElement('img');
      img.src = path;
      img.alt = `Claire photo ${i + 1}`;
      img.loading = i < 2 ? 'eager' : 'lazy';
      img.decoding = 'async';
      card.appendChild(img);
      card.addEventListener('click', () => openLightbox(path));
    } else {
      const ph = document.createElement('div');
      ph.className = 'ph';
      ph.textContent = `CLAIRE / PHOTO ${String(i + 1).padStart(2, '0')}`;
      card.appendChild(ph);
    }
    galleryGrid.appendChild(card);
  });

  const videoGrid = document.getElementById('videoGrid');
  const videos = Array.isArray(config.videos) ? config.videos : [];
  const videoItems = videos.length ? videos : ['', '', ''];

  videoItems.forEach((item, i) => {
    const data = typeof item === 'string' ? { src: item } : (item || {});
    const card = document.createElement('article');
    card.className = 'video-card';

    if (data.src) {
      const video = document.createElement('video');
      video.src = data.src;
      if (data.poster) video.poster = data.poster;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.controls = true;
      card.appendChild(video);
    } else {
      const ph = document.createElement('div');
      ph.className = 'video-placeholder';
      ph.innerHTML = '<span>▶</span>';
      card.appendChild(ph);
    }

    const label = document.createElement('div');
    label.className = 'video-label';
    label.textContent = data.label || `VIDEO ${String(i + 1).padStart(2, '0')}`;
    card.appendChild(label);
    videoGrid.appendChild(card);
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const close = document.querySelector('.lightbox-close');

  function openLightbox(src) {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = src;
    lightbox.showModal();
  }

  close?.addEventListener('click', () => lightbox.close());
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.close();
  });

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('is-open')));

  document.getElementById('year').textContent = new Date().getFullYear();
})();
