/**
* Template Name: Ninestars
* Updated: Jul 27 2023 with Bootstrap v5.3.1
* Template URL: https://bootstrapmade.com/ninestars-free-bootstrap-3-theme-for-creative/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  const siteConfig = Object.freeze({
    contact: {
      location: 'Serving clients across India and global remote engagements.',
      email: 'contact@arq-analytics.com',
      phoneDisplay: '+91 97248 06960',
      phoneLink: '+919724806960'
    },
    demo: {
      youtubeUrl: '',
      mp4Url: '',
      posterImage: 'assets/img/portfolio/portfolio-details-1.jpg',
      posterAlt: 'ARQ ONE AI Labs demo preview',
      placeholderTitle: 'Recorded walkthrough coming soon',
      placeholderCopy: 'A product demo will appear here once the final walkthrough is published. Until then, request a live session for a guided product tour.'
    }
  })

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Clients Slider
   */
  new Swiper('.clients-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 40
      },
      480: {
        slidesPerView: 3,
        spaceBetween: 60
      },
      640: {
        slidesPerView: 4,
        spaceBetween: 80
      },
      992: {
        slidesPerView: 6,
        spaceBetween: 120
      }
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false
    });
  });

  /**
   * Render premium contact section markup from a central config
   */
  (() => {
    const mount = select('#contact .row.gy-4')
    if (!mount) return

    const { contact } = siteConfig

    mount.innerHTML = `
      <div class="col-lg-5 d-flex align-items-stretch" data-aos="fade-up" data-aos-delay="100">
        <div class="info contact-info-card reveal-up">
          <div class="contact-panel-intro">
            <span class="contact-panel-kicker">Contact / Get Started</span>
            <h3>Get in touch</h3>
            <p>Let's discuss AI copilots, agentic workflows, or a domain-specific solution for your business.</p>
          </div>

          <div class="contact-detail-row">
            <div class="contact-detail-icon">
              <i class="bi bi-geo-alt"></i>
            </div>
            <div class="contact-detail-copy">
              <h4>Location</h4>
              <p data-contact-field="location">${contact.location}</p>
            </div>
          </div>

          <div class="contact-detail-row">
            <div class="contact-detail-icon">
              <i class="bi bi-envelope"></i>
            </div>
            <div class="contact-detail-copy">
              <h4>Email</h4>
              <p><a href="mailto:${contact.email}" data-contact-field="email">${contact.email}</a></p>
            </div>
          </div>

          <div class="contact-detail-row">
            <div class="contact-detail-icon">
              <i class="bi bi-phone"></i>
            </div>
            <div class="contact-detail-copy">
              <h4>Phone</h4>
              <p><a href="tel:${contact.phoneLink}" data-contact-field="phone">${contact.phoneDisplay}</a></p>
            </div>
          </div>

          <div class="contact-service-note">
            <span class="service-note-label">Engagement model</span>
            <p>Serving clients across India and global remote engagements with architecture reviews, scoped pilots, and production delivery.</p>
          </div>

          <div class="contact-what-to-expect">
            <h5>What happens next</h5>
            <ul>
              <li><i class="bi bi-check-circle-fill"></i> Initial review within 1 business day</li>
              <li><i class="bi bi-check-circle-fill"></i> Discovery call around use case, constraints, and data readiness</li>
              <li><i class="bi bi-check-circle-fill"></i> Recommended next step: workshop, prototype, or implementation scope</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-lg-7 mt-5 mt-lg-0 d-flex align-items-stretch" data-aos="fade-up" data-aos-delay="200">
        <form action="forms/contact.php" method="post" role="form" class="php-email-form contact-form-card reveal-up" data-enhanced-form="contact" novalidate>
          <div class="row g-3">
            <div class="form-group col-md-6">
              <label for="contact-name">Full Name</label>
              <input type="text" name="name" class="form-control" id="contact-name" placeholder="Your full name" autocomplete="name" required maxlength="120">
              <div class="form-error" aria-live="polite"></div>
            </div>
            <div class="form-group col-md-6">
              <label for="contact-email">Work Email</label>
              <input type="email" class="form-control" name="email" id="contact-email" placeholder="you@company.com" autocomplete="email" inputmode="email" required maxlength="160">
              <div class="form-error" aria-live="polite"></div>
            </div>
            <div class="form-group col-md-6">
              <label for="contact-company">Company Name</label>
              <input type="text" class="form-control" name="company" id="contact-company" placeholder="Your company" autocomplete="organization" required maxlength="140">
              <div class="form-error" aria-live="polite"></div>
            </div>
            <div class="form-group col-md-6">
              <label for="contact-subject">Subject</label>
              <input type="text" class="form-control" name="subject" id="contact-subject" placeholder="What are you exploring?" required maxlength="180">
              <div class="form-error" aria-live="polite"></div>
            </div>
            <div class="form-group col-12">
              <label for="contact-message">Message</label>
              <textarea class="form-control" name="message" id="contact-message" rows="8" placeholder="Describe the use case, users, constraints, and what a successful outcome looks like." required maxlength="2400"></textarea>
              <div class="form-error" aria-live="polite"></div>
            </div>

            <div class="contact-honeypot" aria-hidden="true">
              <label for="contact-website">Website</label>
              <input type="text" id="contact-website" name="website" tabindex="-1" autocomplete="off">
            </div>

            <input type="hidden" name="form_context" value="ARQ Website Contact">
          </div>

          <div class="my-3 form-feedback-stack" aria-live="polite">
            <div class="loading">Sending your request...</div>
            <div class="error-message" role="alert"></div>
            <div class="sent-message" role="status">Thanks. Your request has been sent. We will follow up within one business day.</div>
          </div>

          <div class="contact-form-footer">
            <p class="form-trust-note">Use this form for project enquiries and demo requests. The structure is ready for backend spam protection and routing.</p>
            <div class="text-center text-lg-end"><button type="submit">Request a Demo</button></div>
          </div>
        </form>
      </div>
    `
  })();

  /**
   * Apply contact details from config across the site
   */
  (() => {
    const { contact } = siteConfig

    select('[data-contact-field="location"]', true).forEach((node) => {
      node.textContent = contact.location
    })

    select('[data-contact-field="email"]', true).forEach((node) => {
      node.textContent = contact.email
      if (node.tagName === 'A') {
        node.setAttribute('href', `mailto:${contact.email}`)
      }
    })

    select('[data-contact-field="phone"]', true).forEach((node) => {
      node.textContent = contact.phoneDisplay
      if (node.tagName === 'A') {
        node.setAttribute('href', `tel:${contact.phoneLink}`)
      }
    })
  })();

  /**
   * Render demo media with placeholder support until a final URL is available
   */
  (() => {
    const demoRoot = select('[data-demo-root]')
    if (!demoRoot) return

    const { demo } = siteConfig

    const getYouTubeEmbedUrl = (url) => {
      if (!url) return ''

      try {
        const parsedUrl = new URL(url)
        if (parsedUrl.hostname.includes('youtu.be')) {
          const videoId = parsedUrl.pathname.replace('/', '')
          return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0` : ''
        }

        if (parsedUrl.hostname.includes('youtube.com')) {
          if (parsedUrl.pathname.includes('/embed/')) {
            return parsedUrl.href.replace('youtube.com', 'youtube-nocookie.com')
          }

          const videoId = parsedUrl.searchParams.get('v')
          return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0` : ''
        }
      } catch (error) {
        return ''
      }

      return ''
    }

    const posterImage = demo.posterImage || demoRoot.getAttribute('data-demo-poster') || ''
    const youtubeEmbedUrl = getYouTubeEmbedUrl(demo.youtubeUrl)

    if (youtubeEmbedUrl) {
      demoRoot.innerHTML = `
        <div class="demo-embed">
          <iframe
            src="${youtubeEmbedUrl}"
            title="ARQ ONE AI Labs product demo"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
          </iframe>
        </div>
      `
      return
    }

    if (demo.mp4Url) {
      demoRoot.innerHTML = `
        <div class="demo-embed">
          <video controls preload="none" poster="${posterImage}">
            <source src="${demo.mp4Url}" type="video/mp4">
          </video>
        </div>
      `
      return
    }

    demoRoot.innerHTML = `
      <div class="demo-placeholder">
        <img src="${posterImage}" alt="${demo.posterAlt}" loading="lazy">
        <div class="demo-placeholder-overlay">
          <span class="demo-placeholder-pill">Demo coming soon</span>
          <div class="demo-placeholder-play"><i class="bi bi-play-fill"></i></div>
          <h4>${demo.placeholderTitle}</h4>
          <p>${demo.placeholderCopy}</p>
          <a href="#contact" class="btn-demo-placeholder scrollto">Request a live demo</a>
        </div>
      </div>
    `
  })();

  /**
   * Custom validation and submission flow for the premium contact form
   */
  (() => {
    const form = select('[data-enhanced-form="contact"]')
    if (!form) return

    const fieldLabels = {
      name: 'Full Name',
      email: 'Work Email',
      company: 'Company Name',
      subject: 'Subject',
      message: 'Message'
    }

    const inputs = [...form.querySelectorAll('.form-control')]

    const setFeedback = (state, message = '') => {
      const loading = form.querySelector('.loading')
      const error = form.querySelector('.error-message')
      const success = form.querySelector('.sent-message')

      ;[loading, error, success].forEach((node) => {
        node.classList.remove('d-block')
      })

      if (state === 'loading') {
        loading.classList.add('d-block')
      }

      if (state === 'error') {
        error.textContent = message
        error.classList.add('d-block')
      }

      if (state === 'success') {
        success.textContent = message || success.textContent
        success.classList.add('d-block')
      }
    }

    const setFieldError = (input, message) => {
      const errorNode = input.closest('.form-group')?.querySelector('.form-error')

      input.classList.toggle('is-invalid', Boolean(message))
      input.setAttribute('aria-invalid', message ? 'true' : 'false')

      if (errorNode) {
        errorNode.textContent = message
      }
    }

    const validateField = (input) => {
      const value = input.value.trim()
      const label = fieldLabels[input.name] || 'This field'
      let message = ''

      if (input.hasAttribute('required') && !value) {
        message = `${label} is required.`
      } else if (input.type === 'email') {
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        if (!isValidEmail) {
          message = 'Enter a valid email address.'
        }
      } else if (input.name === 'message' && value.length < 24) {
        message = 'Please add a bit more detail so we can route your request.'
      }

      setFieldError(input, message)
      return !message
    }

    const validateForm = () => inputs.every((input) => validateField(input))

    inputs.forEach((input) => {
      input.addEventListener('blur', () => validateField(input))
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          validateField(input)
        }
      })
    })

    form.addEventListener('submit', async (event) => {
      event.preventDefault()
      event.stopImmediatePropagation()

      if (!validateForm()) {
        setFeedback('error', 'Please review the highlighted fields and try again.')
        return
      }

      const honeypot = form.querySelector('input[name="website"]')
      if (honeypot && honeypot.value.trim()) {
        form.reset()
        setFeedback('success', 'Thanks. Your request has been received.')
        return
      }

      setFeedback('loading')

      try {
        const response = await fetch(form.getAttribute('action'), {
          method: 'POST',
          body: new FormData(form),
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })

        const result = await response.text()

        if (!response.ok || result.trim() !== 'OK') {
          throw new Error(result.trim() || 'Unable to send your request right now.')
        }

        form.reset()
        inputs.forEach((input) => setFieldError(input, ''))
        setFeedback('success', 'Thanks. Your request has been sent. We will follow up within one business day.')
      } catch (error) {
        setFeedback('error', error.message || 'Unable to send your request right now.')
      }
    }, true)
  })();

  /**
   * Progressive reveal for cards and content blocks
   */
  window.addEventListener('load', () => {
    const revealItems = select('.reveal-up', true);
    if (!revealItems.length) return;

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.18,
      rootMargin: '0px 0px -40px 0px'
    });

    revealItems.forEach((item) => revealObserver.observe(item));
  });

  /**
   * Subtle pointer-driven hero parallax
   */
  (() => {
    const panel = select('.hero-panel');
    if (!panel || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    on('mousemove', '#hero', (event) => {
      const rect = panel.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const rotateY = clamp((x - 0.5) * 8, -6, 6);
      const rotateX = clamp((0.5 - y) * 8, -6, 6);
      panel.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    on('mouseleave', '#hero', () => {
      panel.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  })();

  /**
   * Top scroll progress indicator
   */
  (() => {
    const progressBar = select('.scroll-progress');
    if (!progressBar) return;

    const updateProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = maxScroll > 0 ? (window.scrollY / maxScroll) : 0;
      progressBar.style.width = `${Math.min(Math.max(ratio, 0), 1) * 100}%`;
    };

    window.addEventListener('load', updateProgress);
    onscroll(document, updateProgress);
  })();

  /**
   * Lightweight card tilt for premium motion feel
   */
  (() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = select('.portfolio .portfolio-wrap, .playbook-card, .expertise-card', true);
    if (!cards.length) return;

    cards.forEach((card) => {
      card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 6;
        const rotateX = (0.5 - y) * 6;
        card.classList.add('is-tilting');
        card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.classList.remove('is-tilting');
      });
    });
  })();

})()
