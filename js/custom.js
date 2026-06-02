// Respect reduced motion preference for AOS
var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

AOS.init({
  duration: prefersReducedMotion ? 0 : 900,
  once: true,
  offset: 80,
  disable: prefersReducedMotion ? 'phone' : false
});

$(function () {
  var $header = $('#main-header');
  var $scrollTop = $('#scroll-top');
  var $contactForm = $('#contact-form');
  var $formFeedback = $('#form-feedback');

  // Typed.js — dynamic hero subtitle
  if (!prefersReducedMotion && typeof Typed !== 'undefined') {
    new Typed('.type', {
      strings: [
        'Web Designer.',
        'Web Developer.',
        'WordPress Expart.',
        'Freelancer.'
      ],
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 1500,
      loop: true
    });
  } else {
    $('.type').text('WordPress Expart.');
  }

  // CounterUp (if counters exist on page)
  if (typeof $.fn.counterUp === 'function') {
    $('.counter').counterUp({ delay: 10, time: 1000 });
  }

  // Testimonials slider
  $('.testimonial-slider').slick({
    dots: true,
    arrows: false,
    infinite: true,
    speed: 600,
    autoplay: !prefersReducedMotion,
    autoplaySpeed: 4000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });

  // Skill bar animation on scroll
  function animateSkillBars() {
    $('.bar').each(function () {
      var $bar = $(this);
      if ($bar.hasClass('animated')) return;

      var barTop = $bar.offset().top;
      var windowBottom = $(window).scrollTop() + $(window).height() * 0.85;

      if (barTop < windowBottom) {
        var width = $bar.data('width') + '%';
        $bar.addClass('animated').css('width', width);
      }
    });
  }

  $(window).on('scroll', function () {
    var scrollY = $(this).scrollTop();

    // Sticky header shrink
    $header.toggleClass('scrolled', scrollY > 60);

    // Scroll-to-top visibility
    $scrollTop.toggleClass('visible', scrollY > 400);

    // Active nav link highlight
    updateActiveNav();

    animateSkillBars();
  });

  animateSkillBars();

  // Smooth scroll for anchor links (skip Bootstrap toggles & empty hashes)
  $('a[href^="#"]').on('click', function (e) {
    var href = this.getAttribute('href');

    if (
      $(this).attr('data-bs-toggle') ||
      $(this).attr('data-bs-dismiss') ||
      $(this).attr('data-bs-target') ||
      !href ||
      href === '#'
    ) {
      return;
    }

    var target = $(href);
    if (target.length) {
      e.preventDefault();
      var offset = $header.outerHeight() + 16;
      $('html, body').animate({ scrollTop: target.offset().top - offset }, 600);

      closeMobileMenu();
    }
  });

  function closeMobileMenu() {
    var offcanvasEl = document.getElementById('offcanvasExample');
    if (!offcanvasEl || typeof bootstrap === 'undefined') return;

    var offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (offcanvas) {
      offcanvas.hide();
    }
  }

  // Close mobile menu when any nav link inside offcanvas is clicked
  $('#offcanvasExample .nav-link, #offcanvasExample .mobile-contact-btn').on('click', function () {
    closeMobileMenu();
  });

  // Active navigation based on scroll position
  function updateActiveNav() {
    var scrollPos = $(window).scrollTop() + $header.outerHeight() + 80;
    var currentSection = '';
    var sectionIds = ['about', 'skills', 'services', 'experience', 'portfolio', 'contact'];

    sectionIds.forEach(function (id) {
      var $el = $('#' + id);
      if (!$el.length) return;

      var top = $el.offset().top;
      var height = $el.closest('section').outerHeight() || $el.parent().outerHeight() || 400;

      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = id;
      }
    });

    var navMap = {
      about: '#about',
      skills: '#skills',
      services: '#services',
      experience: '#experience',
      portfolio: '#portfolio',
      contact: '#contact'
    };

    $('.menu .nav-link').removeClass('active');
    if (currentSection && navMap[currentSection]) {
      $('.menu .nav-link[href="' + navMap[currentSection] + '"]').addClass('active');
    } else if ($(window).scrollTop() < 200) {
      $('.menu .nav-link[href="index.html"]').addClass('active');
    }
  }

  // Scroll to top button
  $scrollTop.on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 600);
  });

  // Contact form → WhatsApp integration (frontend-only)
  $contactForm.on('submit', function (e) {
    e.preventDefault();
    $formFeedback.removeClass('error success');

    var firstName = $('#contact-firstname').val().trim();
    var lastName = $('#contact-lastname').val().trim();
    var email = $('#contact-email').val().trim();
    var message = $('#contact-message').val().trim();
    var phone = $contactForm.data('whatsapp') || '8801998870515';

    if (!firstName || !lastName || !email || !message) {
      $formFeedback
        .addClass('error')
        .text('Please fill out all required fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      $formFeedback
        .addClass('error')
        .text('Please enter a valid email address.');
      return;
    }

    var formattedText =
      '*New Client Inquiry from Portfolio*\n\n' +
      '*Name:* ' + firstName + ' ' + lastName + '\n' +
      '*Email:* ' + email + '\n\n' +
      '*Message:*\n' + message;

    var whatsappUrl = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(formattedText);

    $formFeedback
      .addClass('success')
      .text('Opening WhatsApp… Your message is ready to send.');

    window.open(whatsappUrl, '_blank');
  });

  // Preloader
  $(window).on('load', function () {
    $('#loading').fadeOut(400);
  });

  setTimeout(function () {
    $('#loading').fadeOut(300);
  }, 2500);
});
