/* ============================================
   theme-switcher.js
   Handles: theme toggle (CSS variables, persisted), mobile nav,
            to-do list add/remove, real-time contact form validation
   ============================================ */

(function () {
  const root = document.documentElement;
  const STORAGE_KEY = 'portfolio-theme';

  /* ================= THEME TOGGLE ================= */
  const modeToggle = document.getElementById('modeToggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* localStorage unavailable — fail silently */
    }
  }

  function getPreferredTheme() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch (e) {
      /* ignore */
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  applyTheme(getPreferredTheme());

  modeToggle?.addEventListener('click', function () {
    const current = root.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ================= MOBILE NAV TOGGLE ================= */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle?.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('navbar__links--open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks?.querySelectorAll('.navbar__link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('navbar__links--open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ================= TO-DO LIST ================= */
  const todoInput = document.getElementById('todoInput');
  const addTodoBtn = document.getElementById('addTodoBtn');
  const todoList = document.getElementById('todoList');

  function addTodo() {
    const text = todoInput.value.trim();
    if (!text) return;

    const li = document.createElement('li');
    li.className = 'todo__item';

    const span = document.createElement('span');
    span.className = 'todo__item-text';
    span.textContent = text;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'todo__remove-btn';
    removeBtn.type = 'button';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', function () {
      li.remove();
    });

    // Click the task text to mark it done / not done
    span.addEventListener('click', function () {
      li.classList.toggle('todo__item--done');
    });

    li.appendChild(span);
    li.appendChild(removeBtn);
    todoList.appendChild(li);

    todoInput.value = '';
    todoInput.focus();
  }

  addTodoBtn?.addEventListener('click', addTodo);
  todoInput?.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTodo();
    }
  });

  /* ================= CONTACT FORM VALIDATION ================= */
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const formSuccess = document.getElementById('formSuccess');

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldState(input, errorEl, message) {
    if (message) {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      errorEl.textContent = message;
      return false;
    }
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    errorEl.textContent = '';
    return true;
  }

  function validateName() {
    const value = nameInput.value.trim();
    if (!value) return setFieldState(nameInput, nameError, 'Name is required.');
    if (value.length < 2) return setFieldState(nameInput, nameError, 'Name must be at least 2 characters.');
    return setFieldState(nameInput, nameError, '');
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    if (!value) return setFieldState(emailInput, emailError, 'Email is required.');
    if (!EMAIL_PATTERN.test(value)) return setFieldState(emailInput, emailError, 'Enter a valid email address.');
    return setFieldState(emailInput, emailError, '');
  }

  function validateMessage() {
    const value = messageInput.value.trim();
    if (!value) return setFieldState(messageInput, messageError, 'Message is required.');
    if (value.length < 10) return setFieldState(messageInput, messageError, 'Message must be at least 10 characters.');
    return setFieldState(messageInput, messageError, '');
  }

  // Real-time validation as the user types
  nameInput?.addEventListener('input', validateName);
  emailInput?.addEventListener('input', validateEmail);
  messageInput?.addEventListener('input', validateMessage);

  form?.addEventListener('submit', function (e) {
    e.preventDefault();
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();

    if (isNameValid && isEmailValid && isMessageValid) {
      formSuccess.textContent = `Thanks, ${nameInput.value.trim()} — your message has been received.`;
      form.reset();
      [nameInput, emailInput, messageInput].forEach(function (input) {
        input.classList.remove('is-valid', 'is-invalid');
      });
    } else {
      formSuccess.textContent = '';
    }
  });
})();
