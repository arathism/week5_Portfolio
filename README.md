# Week 5 — Advanced Portfolio with CSS Grid

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://arathism.github.io/week5_Portfolio/)
[![Docs](https://img.shields.io/badge/docs-DOCX-blue)](https://github.com/arathism/week5_Portfolio/blob/main/Week5_Portfolio_Documentation.docx)

🔗 **Live Demo:** [arathism.github.io/week5_Portfolio](https://arathism.github.io/week5_Portfolio/)
📄 **Full Documentation:** [Project Documentation](https://github.com/arathism/week5_Portfolio/blob/main/Week5_Portfolio_Documentation.docx)
💻 **Repository:** [github.com/arathism/week5_Portfolio](https://github.com/arathism/week5_Portfolio)

## Project Overview

This is Arathi Shekhar Munavalli's personal portfolio (originally built in
Week 3), rebuilt for Week 5 using advanced CSS techniques: CSS Grid for the
main layout, Flexbox for components, CSS custom properties for a full
light/dark theme system, keyframe animations, advanced selectors and
pseudo-elements, and BEM naming throughout the stylesheet.

The page keeps its three original interactive features — dark/light mode
toggle, a to-do list with add/remove, and real-time contact form validation
— and upgrades the CSS and JS behind all three to meet this week's
requirements. It also adds a new **Projects** tile that showcases past
coursework, including the Week 4 "SecureStack" business website, as a
CSS Grid card layout.

## Setup Instructions

1. Download or clone this folder.
2. No build tools or dependencies are needed — plain HTML/CSS/JS.
3. Open `index.html` directly in a browser, or serve it locally (recommended):
   ```bash
   python3 -m http.server 8000
   # then visit http://localhost:8000
   ```
4. Try the interactive features:
   - Click the 🌙/☀️ icon in the nav to switch themes (choice is saved in
     `localStorage`, so it persists on reload).
   - Add a task in the To-Do tile, click its text to mark it done, click
     "Remove" to delete it.
   - Hover over a card in the Projects tile to see the lift/shadow animation
     and the tag hover states.
   - Submit the Contact form empty to see validation errors, then fill it in
     to see the errors clear in real time and a success message appear.
5. Resize the browser (or open on a phone) below 700px to see the
   collapsible hamburger nav and single-column grid.

## Code Structure

```
index.html            # Page markup — navbar, hero, tile grid, footer
css/
├── main.css          # CSS variables (theme tokens), reset, typography, buttons
├── layout.css         # CSS Grid + Flexbox structure, mobile-first breakpoints
└── animations.css     # Keyframes, transitions, hover/focus, pseudo-elements
js/
└── theme-switcher.js  # Theme toggle, mobile nav, to-do list, form validation
images/
└── profile.jpg         # About tile photo
projects/
└── securestack/         # Full Week 4 "SecureStack" site, kept here as a local
    ├── index.html        # backup/reference copy. The Projects tile links out
    ├── about.html         # to the live GitHub Pages deployment and repo instead.
    ├── contact.html
    ├── services.html
    ├── css/style.css
    ├── js/script.js
    └── images/ (logo.svg, favicon.svg)
screenshots/           # Visual documentation
README.md
```

CSS is split by concern: `main.css` owns *what things look like* (tokens,
type, buttons), `layout.css` owns *where things sit* (Grid/Flexbox,
breakpoints), `animations.css` owns *how things move and react*. Keeping
these separate avoids specificity clashes between layout rules and
animation/hover rules targeting the same elements.

## Technical Details

### CSS Grid (main layout system)
- `.tile-grid` is a 2-column CSS Grid (`repeat(2, 1fr)`) holding the About,
  Skills, To-Do, Projects, and Contact sections.
- `.tile-grid__tile--wide` uses `grid-column: span 2` so the About, Projects,
  and Contact tiles span both columns while Skills and To-Do sit side by
  side — demonstrating explicit grid placement, not just auto-flow.
- The new `.projects` element is its own 2-column Grid of `.project-card`
  items, collapsing to 1 column under 700px — a second, nested example of
  the Grid layout system inside a wide tile.
- The contact form's Name/Email row (`.contact-form__row`) is its own
  2-column grid, collapsing to 1 column under 700px.
- Below 700px, `.tile-grid` collapses to a single column and wide tiles drop
  their span — mobile-first, min/max-width media queries handle the scaling.

### Flexbox
- `.navbar` uses Flexbox (`justify-content: space-between`) to lay out the
  logo, hamburger toggle, link list, and theme button, and switches
  `.navbar__links` from a collapsible column (mobile) to a horizontal row
  (≥700px) using `flex-direction`.
- `.about` and `.skills` use Flexbox for the avatar/text pairing and the
  wrapping skill tags respectively.
- `.project-card__body` uses `flex-direction: column` with the description
  set to `flex-grow: 1`, so card footers (tags/links) align to the bottom
  evenly across cards of different description lengths.
- `.todo__input-row` and `.todo__item` use Flexbox for the input+button row
  and the space-between layout of each task.

### CSS Variables (theme system)
- All colors, gradients, spacing, radii, and easing curves are defined once
  in `:root` in `main.css`.
- `[data-theme="dark"]` re-declares the same variable names with dark
  values — no duplicated component rules, only the tokens change. The new
  Projects tile uses the same tokens (`--color-surface-alt`,
  `--color-primary`, etc.) so it themes automatically with no extra rules.
- `theme-switcher.js` toggles the `data-theme` attribute on `<html>` and
  persists the choice in `localStorage`, falling back to the OS-level
  `prefers-color-scheme` on first visit.

### Animations & Transitions
- `@keyframes fadeInUp` staggers each tile in on page load using
  `animation-delay` per `nth-child`.
- `@keyframes popIn` animates new to-do items in as they're added.
- `@keyframes shake` plays on invalid form fields to draw attention to the
  error without relying on color alone.
- Hover states (tiles, skill boxes, buttons, project cards, project tags)
  animate `transform`, `box-shadow`, `background`, and `color` — properties
  that stay off the layout/paint-heavy path for smoother performance.
- `prefers-reduced-motion: reduce` is respected globally: all animation and
  transition durations collapse to near-zero for users who've requested it.

### Advanced Selectors & Pseudo-elements
- `.navbar__link::after` draws an animated underline on hover/focus instead
  of a static border; `.project-card__link--ghost::after` reuses the same
  pattern for the "Source Code" links.
- `.todo__list:empty::before` shows a "No tasks yet" placeholder using the
  `:empty` selector — no JavaScript needed for that piece of UI state.
- `.skills__box:nth-child(odd/even)` alternates an accent underline between
  primary and accent colors.
- `:focus-visible` (not plain `:focus`) is used for all interactive elements
  so keyboard users get a visible outline without a ring appearing on every
  mouse click.
- Attribute selectors (`[data-theme="dark"]`, `[aria-expanded="true"]`) drive
  theming and the hamburger-to-X icon animation.

### BEM Methodology
Every class follows `block__element--modifier`, e.g. `.tile-grid__tile--wide`,
`.todo__item--done`, `.navbar__links--open`, `.contact-form__input`,
`.project-card__link--ghost`. This was the main structural change from the
Week 3 version — the original CSS used flatter, less consistent names
(`.tile`, `.skill-box`, `.todo-list li`); this pass renames everything into
a single consistent BEM system so it's clear which block any given class
belongs to, including the newly added `.project-card` block.

## Testing Evidence

Verified with a Chromium browser (Playwright) at two viewports, zero console
errors in either:
- **1280×900 (desktop):** confirmed the 2-column Grid renders with correct
  tile spans, theme toggle swaps all tokens instantly with no flash of
  unstyled content, to-do add/remove/mark-done all work, the Projects grid
  shows two cards side by side with working hover states, and form
  validation correctly blocks submission with errors, then clears and shows
  a success message once all fields are valid.
- **390×844 (mobile):** confirmed the nav collapses to a hamburger, expands
  with a smooth height transition, animates into an "X", the tile grid
  stacks to one column with wide tiles no longer spanning, and the Projects
  grid drops to a single column.
- **Keyboard/accessibility:** tabbed through nav links, buttons, project
  card links, and form fields — confirmed a visible `:focus-visible` outline
  on each, and that `aria-expanded`/`aria-label` are set on the nav toggle
  and mode button.
- **Reduced motion:** simulated `prefers-reduced-motion: reduce` — all
  animations and transitions become effectively instant.

## Notes
- No CSS minification/build step is included per assignment scope.
