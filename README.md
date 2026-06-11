# Angular 22 Showcase

An interactive playground and reference application covering the key features of **Angular 22**. Each section demonstrates a specific API or pattern with live, editable examples — signal primitives, the Resource API, Signal Forms, ARIA accessibility, and more.

---

## Screenshots

| Dashboard (dark) | Dashboard (light) |
|---|---|
| ![Dashboard dark](review/phase6-dashboard-dark.png) | ![Dashboard light](review/phase6-dashboard-light.png) |

| Data Explorer | Pokémon Detail |
|---|---|
| ![Data Explorer](review/phase6-data-explorer-dark.png) | ![Pokémon Detail](review/phase6-pokemon-detail-light.png) |

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Angular 22 |
| Language | TypeScript 6 (strict) |
| Styling | Tailwind CSS 4 |
| Reactivity | Angular Signals — `signal()`, `computed()`, `linkedSignal()`, `debounced()` |
| Async data | `resource()`, `rxResource()`, `httpResource()` |
| Forms | Signal Forms (new in v22) · Reactive Forms |
| i18n | Runtime JSON translations — EN / ES |
| Routing | Angular Router with lazy-loaded feature routes |
| Accessibility | `@angular/aria` v22 |
| Testing | Vitest + jsdom |
| Package manager | pnpm 11.5.3 |
| Node.js | ≥ 24.16.0 |

---

## Sections

| Route | Section | Description |
|---|---|---|
| `/` | Dashboard | Hero, stats, filterable feature cards |
| `/data-explorer` | Data Explorer | PokéAPI browser — pagination, search, detail view |
| `/signals` | Signals | `signal()`, `computed()`, `effect()`, `linkedSignal()`, `debounced()` |
| `/resources` | Resource API | `resource()`, `rxResource()`, `httpResource()`, status lifecycle |
| `/signal-forms` | Signal Forms | Angular 22 form API — validators, async, submit state |
| `/reactive-forms` | Reactive Forms | `FormGroup`, cross-field validation, `FormArray`, `valueChanges → toSignal()` |
| `/templates` | Template Syntax | `@if`, `@for`, `@switch`, `@defer`, `@let` |
| `/router` | Router | `RouterLink`, `withComponentInputBinding()`, guards, `toSignal(events)` |
| `/di` | Dependency Injection | `inject()`, `InjectionToken`, `@Injectable`, factory defaults |
| `/aria` | ARIA / Accessibility | `AccordionGroup`, `Tabs`, `Listbox`, live regions |
| `/components-lab` | Components Lab | Buttons, Badges, Cards, Toast system, Data table |
| `/performance` | Performance | `OnPush`, `input()` + `effect()`, `track`, pure pipes |

---

## Features

- **Light / dark theme** — toggle via the navbar; preference persisted in `localStorage`.
- **6 primary color presets** — Angular Red, Blue, Violet, Emerald, Amber, Cyan; applied at runtime via CSS custom properties.
- **EN / ES i18n** — runtime JSON translations with automatic fallback to English.
- **Fully lazy-loaded** — every feature route is a standalone component loaded on demand.
- **57 unit tests** — Vitest + jsdom covering signals, reactive forms, and component lab.
- **WCAG AA** — semantic HTML, visible focus states, ARIA patterns via `@angular/aria`.

---

## Getting started

```powershell
# Install dependencies
pnpm install

# Start the dev server (http://localhost:4200)
pnpm start
```

---

## Commands

```powershell
pnpm start                              # dev server
pnpm build                             # production build → dist/
pnpm test                              # run Vitest unit tests

pnpm ng generate component <name>      # scaffold a standalone component
pnpm ng generate service <name>        # scaffold a service
pnpm ng generate guard <name>          # scaffold a guard
```

> `angular.json` contains `"packageManager": "npm"` as an Angular CLI config artifact.  
> The project lockfile is `pnpm-lock.yaml` — always use pnpm.

---

## Project structure

```
src/
  main.ts                   # bootstrapApplication entry point
  styles.css                # global styles — @import 'tailwindcss'
  app/
    app.ts                  # root component
    app.config.ts           # ApplicationConfig, APP_INITIALIZER
    app.routes.ts           # top-level lazy routes
    core/
      i18n/                 # TranslationService, TranslatePipe, language model
      models/               # shared domain types
      services/             # AppearanceService, LayoutService
    features/
      dashboard/
      data-explorer/
      signals/
      signal-forms/
      reactive-forms/
      resources/
      templates/
      router-demo/
      di-patterns/
      aria-accessibility/
      components-lab/
      performance/
    layout/
      shell/                # app shell with sidebar + navbar
      navbar/
      sidebar/
public/
  assets/i18n/
    en.json                 # English translations
    es.json                 # Spanish translations
```

---

## Key Angular 22 notes

- `resource()` uses `params:` (not `request:`); loader receives `{ params, abortSignal, previous }`.
- `rxResource()` uses `stream:` (not `loader:`) for the Observable factory.
- `ResourceStatus` is a string union — `'idle' | 'loading' | 'reloading' | 'resolved' | 'error' | 'local'`.
- `debounced()` is a first-class signal primitive in Angular 22.
- `@angular/aria` v22 — `AccordionPanel` exposes a `visible()` signal.
- Tailwind v4 CSS variables are runtime custom properties; colors can be swapped via `document.documentElement.style.setProperty`.
- `[data-theme="light"]` in `styles.css` inverts the neutral scale so dark-mode utility classes work in light mode.
