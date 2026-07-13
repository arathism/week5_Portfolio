/* ==========================================================================
   SecureStack — script.js
   1. Mobile nav toggle
   2. Hero terminal animation (reduced-motion aware)
   3. Contact form validation (Constraint Validation API)
   4. Active nav link fallback
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- 1. Mobile nav toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.getElementById('primary-nav');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Auto-close menu after a link is tapped (mobile)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 2. Hero terminal animation ---------- */
  // Reveal timing is handled by CSS keyframes with staggered animation-delay.
  // If the user prefers reduced motion, strip the animation so lines show instantly.
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const terminalBody = document.querySelector('[data-terminal-body]');
  if (terminalBody && prefersReducedMotion) {
    terminalBody.querySelectorAll('.line').forEach(function (line) {
      line.style.animation = 'none';
      line.style.opacity = '1';
    });
  }

  /* ---------- 3. Contact form validation ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    const statusEl = form.querySelector('.form-status');
    const fields = form.querySelectorAll('[data-validate]');

    const messages = {
      valueMissing: 'This field is required.',
      typeMismatch: 'Enter a valid email address.',
      patternMismatch: null, // uses data-pattern-message if present
      tooShort: null         // built dynamically below
    };

    function messageFor(field) {
      const validity = field.validity;
      if (validity.valueMissing) return messages.valueMissing;
      if (validity.typeMismatch) return messages.typeMismatch;
      if (validity.patternMismatch) {
        return field.dataset.patternMessage || 'Please match the requested format.';
      }
      if (validity.tooShort) {
        return 'Please enter at least ' + field.minLength + ' characters.';
      }
      return 'Please check this field.';
    }

    function showError(field) {
      const errorEl = document.getElementById(field.id + '-error');
      if (!errorEl) return;
      if (field.checkValidity()) {
        errorEl.textContent = '';
      } else {
        errorEl.textContent = messageFor(field);
      }
    }

    fields.forEach(function (field) {
      field.addEventListener('blur', function () {
        field.dataset.touched = 'true';
        showError(field);
      });
      field.addEventListener('input', function () {
        if (field.dataset.touched) showError(field);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let firstInvalid = null;
      let allValid = true;

      fields.forEach(function (field) {
        field.dataset.touched = 'true';
        showError(field);
        if (!field.checkValidity()) {
          allValid = false;
          if (!firstInvalid) firstInvalid = field;
        }
      });

      if (!allValid) {
        if (statusEl) {
          statusEl.textContent = 'Please fix the highlighted fields before sending.';
        }
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // No backend is connected — submission is simulated client-side.
      if (statusEl) {
        statusEl.textContent = 'Thanks — your message has been sent. We\'ll reply within 1 business day.';
      }
      form.reset();
      fields.forEach(function (field) {
        delete field.dataset.touched;
        const errorEl = document.getElementById(field.id + '-error');
        if (errorEl) errorEl.textContent = '';
      });
    });
  }

  /* ---------- 4. Active nav link fallback ---------- */
  // aria-current is already hardcoded per page; this just double-checks it
  // in case a page is duplicated/renamed without updating the attribute.
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPath && !link.classList.contains('nav-cta')) {
      link.setAttribute('aria-current', 'page');
    }
  });
})();
