# Second Prompt for Claude Code - UX, i18n, Theme, Primary Color, and Data Explorer Fixes

Continue working on the Angular 22 Showcase application that has already been partially implemented.

This is NOT a prompt to start the project from scratch.

The goal of this prompt is to fix, improve, and polish the current result, especially navigation, translations, visual themes, primary color customization, and the Data Explorer.

Before modifying files, review the current application state, identify the affected components, and briefly propose the correction plan. Then implement the changes in an organized way.

Do not remove existing functionality that already works. Refactor only what is necessary to improve visual quality, responsiveness, i18n, and user experience.

---

## General objective of this second iteration

Fix the following issues detected in the first version:

1. Long option names in the left sidebar are being cut off.
2. Many texts do not change language when switching between English and Spanish.
3. The dashboard does not allow switching between dark and light themes.
4. The primary color is fixed as red and can be visually confused with danger/error states.
5. The Data Explorer needs a complete redesign because it looks visually unbalanced, the table does not use the available space, the paginator is not always visible, and the layout does not adapt correctly to viewport changes.
6. The table must allow users to select how many items are shown per page.
7. All labels, buttons, messages, states, tooltips, headers, filters, paginator labels, and visible UI texts must be internationalized.

---

## General rules

- Keep Angular 22, TypeScript 6, Tailwind CSS 4, Vitest, and pnpm.
- Do not change the package manager.
- Do not run `ng new`.
- Do not rebuild the project from scratch.
- Work on the existing code.
- Keep variable, function, class, file, component, and interface names in English.
- Keep code examples in English.
- Every visible user-facing text must be translatable.
- Do not add external dependencies if the issue can be solved with Angular, TypeScript, CSS, and Tailwind.
- Keep the project buildable after the changes.
- Do not use unjustified `any`.
- Use signals where they make sense.
- Keep the UI responsive and mobile-first.
- Do not store sensitive data in `localStorage`.

---

## 1. Fix the sidebar / left navigation panel

Current problem:

Option names in the left sidebar are cut off when they are long.

Expected behavior:

- Option names must NOT be cut off.
- If a name is long, it must wrap into two or more lines.
- Text must use natural wrapping.
- Do not use `truncate` on visible sidebar labels.
- Do not use `overflow-hidden` to cut the option name when the sidebar is expanded.
- The item height must grow naturally if the text uses two lines.
- The status badge must not overlap or compress the label.
- Icon, label, and badge must align correctly.
- In collapsed sidebar mode, showing only the icon is acceptable, but there must be an accessible tooltip or `title` with the full name.
- In the mobile drawer, labels must be shown completely.
- The active route indicator must continue working correctly.
- The design must remain clean and professional.

Suggested implementation:

- Review sidebar/nav item components.
- Replace `truncate`, `whitespace-nowrap`, `overflow-hidden`, `text-ellipsis`, or similar classes with a combination that allows:
  - `whitespace-normal`
  - `break-words`
  - `leading-snug`
  - flexible height
  - proper grid or flex distribution
- If the item has a badge, use a layout such as:
  - fixed icon
  - flexible content
  - badge in a second line or aligned without breaking the label
- Ensure the container has enough width when the sidebar is expanded.
- Visually validate with long names such as:
  - "Reactive Forms and Template-Driven Forms"
  - "Angular ARIA and Accessibility"
  - "Dependency Injection Patterns"
  - "Resource API and Async Reactivity"

---

## 2. Fix complete internationalization

Current problem:

Many texts, explanations, and comments are in English and do not change when the language is switched.

Expected behavior:

Every visible user-facing text must switch between English and Spanish.

The only exception is source code examples, where code identifiers must remain in English.

However, if a code block includes explanatory comments that are displayed to the user as educational content, those comments must also have a translated version or be generated according to the active language.

Current example that must be fixed:

```ts
// Bad — Angular destroys/recreates all DOM nodes
```

In Spanish it should be displayed as:

```ts
// Malo — Angular destruye y recrea todos los nodos del DOM
```

In English it should remain:

```ts
// Bad — Angular destroys/recreates all DOM nodes
```

i18n rules:

- Translate navigation.
- Translate breadcrumbs.
- Translate titles.
- Translate subtitles.
- Translate descriptions.
- Translate cards.
- Translate badges if the badge is visible text.
- Translate tooltips.
- Translate placeholders.
- Translate buttons.
- Translate tabs.
- Translate form labels.
- Translate validation messages.
- Translate error messages.
- Translate empty states.
- Translate loading states.
- Translate Data Explorer texts.
- Translate table headers.
- Translate paginator.
- Translate page size selector.
- Translate modal, drawer, and detail panel texts.
- Translate each demo explanation.
- Translate code comments if they are shown inside `CodePreview` as educational content.
- Update `document.documentElement.lang` when the language changes.
- Keep English fallback when a key is missing.
- Persist the selected language in `localStorage`.
- Default language must be English.

Important:

Do not leave hardcoded strings in templates or components if they are visible to the user.

Audit hardcoded texts:

- Search for visible texts directly in HTML.
- Search for visible texts directly in TypeScript.
- Search for navigation arrays with hardcoded labels.
- Search for cards with hardcoded descriptions.
- Search for code examples that include visible comments.
- Search for error, loading, empty, and retry messages.
- Move everything to `en.json` and `es.json`, or to the existing i18n system.

If a text belongs to a technical Angular concept, the concept name can remain in English, but the explanation around it must be translated.

Examples:

- "Signal Forms" can remain as a concept.
- "Resource API" can remain as a concept.
- "Reactive Forms" can remain as a concept.
- The surrounding explanation must change language.

Example:

Spanish:

"Signal Forms permite manejar estado de formulario usando signals, validaciones y errores tipados."

English:

"Signal Forms allows form state management using signals, validations, and typed errors."

---

## 3. Add light / dark theme selector

Current problem:

The dashboard uses a dark theme, but there is no option to switch to a light theme.

Expected behavior:

- Add a visible option to switch between dark and light theme.
- Dark theme must be the default.
- The user's choice must be remembered when they return.
- Use `localStorage` only for visual preference persistence.
- The toggle must be in the top navbar, main dashboard, or a clear settings area.
- The change must apply to the entire application.
- It must not break contrast or accessibility.
- Both themes must look professional.
- The light theme must not look like a simple color inversion.
- The current dark mode must remain the default, but it can be polished.

Suggested implementation:

- Create or adjust a signal-based `ThemeService`.
- Allowed values:
  - `dark`
  - `light`
- Apply a class or attribute to `<html>` or `<body>`, for example:
  - `data-theme="dark"`
  - `data-theme="light"`
- Use CSS variables for base colors.
- Persist in `localStorage` with a clear key, for example:
  - `angular-showcase-theme`
- Add translations for:
  - "Theme"
  - "Dark"
  - "Light"
  - "Switch theme"
  - "Current theme"

---

## 4. Add primary color selector

Current problem:

The primary color is fixed as red. It is visually confused with `danger`, error, or destructive actions.

Expected behavior:

- Keep Angular red as the default primary color.
- Add an option to change the primary color from the UI.
- The user must be able to choose another visual variant so primary is not confused with danger.
- The selected primary color must be remembered when the user returns.
- `danger` must remain an independent semantic color.
- `primary` and `danger` must not look the same when the user chooses another primary color.
- The primary color change must apply to buttons, active links, highlights, borders, focus rings, featured cards, simple charts, and main UI elements.
- It must work in both dark and light themes.

Suggested primary color options:

- Angular Red: `#dd0031` default
- Blue: `#2563eb`
- Violet: `#7c3aed`
- Emerald: `#059669`
- Amber: `#d97706`
- Cyan: `#0891b2`

Suggested implementation:

- Create or adjust a `ThemeService` or `AppearanceService` with:
  - `theme`
  - `primaryColor`
- Use CSS variables:
  - `--color-primary`
  - `--color-primary-hover`
  - `--color-primary-soft`
  - `--color-primary-ring`
  - `--color-danger`
  - `--color-danger-soft`
- Danger must be independent, for example:
  - `--color-danger: #ef4444`
- Persist primary color in `localStorage`, for example:
  - `angular-showcase-primary-color`
- Add a visual selector in the navbar or dashboard:
  - circular color buttons
  - dropdown
  - simple popover
- Translate all related text.

---

## 5. Completely redesign the Data Explorer

Current problem:

The Data Explorer looks visually poor.

Specific issues:

- The table looks stuck to the left.
- Columns are too close together and leave too much empty space on the right.
- The design does not use the available width.
- The user has to scroll to see the page number.
- The table footer/paginator is not visible.
- The paginator does not adapt well to viewport size.
- Paginator buttons and labels do not change language.
- The row image is too small.
- Too little data is visible per row.
- There is no option to select how many items are displayed per page.
- The table does not feel like a professional product feature.

Expected behavior:

Design the Data Explorer as a real product section.

It must include:

- Section header with title, description, and main controls.
- Main card or panel that correctly uses the available width.
- Professional and responsive table.
- Well-distributed columns.
- Larger image in each row.
- More useful data per row.
- Footer/paginator always visible inside the section.
- The user must not have to scroll to the bottom of the whole page to see the paginator.
- The table must adapt to the viewport height.
- If there are many rows, only the table body must scroll, not the entire page.
- The table footer must behave like a sticky footer inside the table panel.
- The table header can be sticky if it improves the experience.
- The paginator must always be visible at the bottom of the panel.
- The paginator must be translated.
- There must be a page size selector.
- Page size options should include:
  - 10
  - 20
  - 25
  - 50
- The selected page size must affect the service request.
- Pagination must remain service-side, not local.
- Search must be translated and have a placeholder in both languages.
- Loading, empty, error, and retry states must be well designed.
- When the viewport changes size, the table must visually recalculate through CSS and continue using the space correctly.
- On mobile, it can switch to cards instead of a table if that improves the experience.

---

## 6. Data Explorer functional requirements

If using PokeAPI:

List endpoint:

```txt
https://pokeapi.co/api/v2/pokemon?limit={pageSize}&offset={offset}
```

Detail endpoint:

```txt
https://pokeapi.co/api/v2/pokemon/{name}
```

Rules:

- `pageSize` must come from the user's selector.
- `offset` must be calculated from current page and page size.
- When `pageSize` changes, return to page 1.
- When search changes, return to page 1.
- If search is exact by name or ID, clearly display that it is exact search if PokeAPI does not support partial search.
- Do not simulate local search as if it were backend search.
- If another public API is selected for real partial search, explain the change and keep preference for APIs without token or registration.
- Handle network errors.
- Handle record not found.
- Allow retry.
- Allow clearing the search.
- Sync query params if already implemented.
- Keep complete i18n.

---

## 7. Data Explorer visual requirements

The table must look better than the current version.

Expected layout:

```txt
[Section header]
[Toolbar: search | page size | refresh | total]
[Table panel]
  [Sticky table header]
  [Scrollable table body]
  [Sticky table footer / paginator]
[Detail panel / drawer / modal]
```

Suggested height behavior:

- The table panel should use something like:
  - `height: calc(100vh - Xpx)`
  - `min-height`
  - `max-height`
  - flex column
- The table must be inside a `flex-1 overflow-auto` container.
- The footer/paginator must be outside the table body internal scroll, inside the panel.
- The paginator must be `shrink-0`.
- Avoid making the whole page scroll only to see pagination.

Suggested columns:

- Image
- ID
- Name
- Types
- Height
- Weight
- Base experience
- Actions

If the initial list does not return all these fields, solve it in one of two ways:

Option A:

- Load details for the visible page items.
- Show image, types, height, weight, and base experience in the table.
- Do this only for the current visible page to avoid overloading the API.
- Handle partial loading per row.

Option B:

- Show in the table:
  - estimated image by ID derived from URL
  - ID derived from URL
  - name
  - URL
  - detail action
- Load complete data when opening the detail.
- Add better spacing, visual distribution, and badges to compensate.

Choose the option that best balances UX, performance, and complexity.

Preference:

Use Option A if performance remains acceptable and code stays clean.

---

## 8. Data Explorer row design

Each row must look organized and professional.

It must include:

- Larger image, minimum 48px x 48px, ideally 56px or 64px.
- Name with better typography.
- ID in visual format, for example `#025`.
- Types as badges.
- Height and weight with clear units.
- Base experience if available.
- Clear detail button or action.
- Elegant hover state.
- Keyboard-accessible focus.
- Row click or detail button.
- On mobile, use a card layout:
  - large image
  - name
  - types
  - main data
  - action

---

## 9. Data Explorer paginator

The paginator must be redesigned.

It must include:

- Previous button.
- Next button.
- Current page.
- Total pages, if it can be calculated.
- Total elements, if the API returns it.
- Page size selector.
- Translatable text, for example:
  - English: "Rows per page"
  - Spanish: "Filas por página"
  - English: "Page 1 of 12"
  - Spanish: "Página 1 de 12"
  - English: "Showing 1-10 of 1302"
  - Spanish: "Mostrando 1-10 de 1302"
- Disable previous on the first page.
- Disable next if there are no more results.
- Always remain visible at the bottom of the table panel.
- Look good on desktop and mobile.
- On mobile, it can split into two rows.

---

## 10. Data Explorer search

Search must improve visually and functionally.

It must include:

- Wide and comfortable input.
- Translatable placeholder.
- Clear-search button.
- Debounce.
- Loading while searching.
- Clear message when there are no results.
- If search is exact using PokeAPI, show translatable helper text:
  - English: "PokeAPI supports exact search by name or ID."
  - Spanish: "PokeAPI permite búsqueda exacta por nombre o ID."
- If partial search is implemented with another public API, document the reason with minimal comments or in the section description.

---

## 11. Data Explorer detail view

The detail view must look professional.

It can be:

- Side drawer.
- Modal.
- Right panel.
- Detail route.

Preference:

- Desktop: side panel or drawer.
- Mobile: full screen or adapted modal.

It must include:

- Large image.
- Name.
- ID.
- Types.
- Height.
- Weight.
- Base experience.
- Abilities.
- Main stats with visual bars.
- Close or back button.
- Loading state.
- Error state.
- Translated texts.

---

## 12. Tests and visual validation

After implementing:

- Run or prepare `pnpm test` if applicable.
- Run or prepare `pnpm build`.
- Check that there are no TypeScript errors.
- Check that no visible hardcoded texts remain outside the i18n system.
- Check that the sidebar does not cut long names.
- Check that Spanish changes all visible texts.
- Check that English changes all visible texts.
- Check that light and dark themes work.
- Check that the primary color can be changed.
- Check that danger is not confused with primary.
- Check that the Data Explorer looks good on:
  - Large desktop
  - Laptop
  - Tablet
  - Mobile
- Check that the paginator is always visible inside the panel.
- Check that page size affects the service request.
- Check that the detail view works correctly.

---

## 13. Recommended implementation order

Implement in this order:

1. Quick audit of the current state.
2. Complete i18n correction.
3. Sidebar fix for long names.
4. Implement or adjust `ThemeService` or `AppearanceService`.
5. Light/dark toggle with persistence.
6. Primary color selector with persistence.
7. Visual refactor of CSS tokens / Tailwind variables.
8. Complete Data Explorer layout redesign.
9. Paginator redesign with sticky footer.
10. Page size selector connected to the API.
11. Improved rows, images, and columns.
12. Improved search.
13. Improved detail view.
14. Tests and final validation.
15. Summary of changes.

---

## 14. Acceptance criteria

The implementation is correct when:

- No expanded sidebar label is cut off.
- Long labels display in two or more lines if needed.
- Every visible text switches correctly between English and Spanish.
- Educational comments inside code previews switch language if shown to the user.
- The selected language is remembered after reload.
- Dark theme is default.
- The user can switch to light theme.
- The selected theme is remembered after reload.
- The user can change the primary color.
- The selected primary color is remembered after reload.
- Danger color is independent from primary.
- The Data Explorer uses the available space correctly.
- The table no longer looks stuck or unbalanced.
- The paginator is always visible inside the table panel.
- The table body can scroll without hiding the paginator.
- The user can choose how many elements to see per page.
- Page size modifies the remote request.
- The table shows better visual information.
- Images are larger.
- The detail view looks professional.
- The app still builds successfully.

---

## 15. Expected Claude Code response

First respond with:

1. Brief diagnosis of the issues.
2. Files/components you will review.
3. Change plan by phases.
4. Risks or required decisions.
5. Confirmation on whether you will implement directly or need approval.

After approval, implement the changes.

When finished, provide:

1. Summary of changes.
2. Modified files.
3. Commands executed.
4. Build/test result.
5. Pending items or recommendations, if anything remains.
