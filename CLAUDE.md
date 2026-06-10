@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Use **pnpm** for all commands. Do not use npm, yarn, bun, or a global `ng`.

```powershell
pnpm install          # install dependencies
pnpm start            # dev server (ng serve, port 4200)
pnpm build            # production build
pnpm test             # run tests (Vitest + jsdom via Angular CLI builder)
pnpm ng generate component <name>   # scaffold a component
pnpm ng generate service <name>     # scaffold a service
pnpm ng generate guard <name>       # scaffold a guard
```

After any meaningful code change run `pnpm build` and fix all errors before considering the task done.

> Note: `angular.json` has `"packageManager": "npm"` in the CLI block — this is an Angular CLI config artifact. The project lockfile is `pnpm-lock.yaml`; always use pnpm.

## Architecture

Angular 22 standalone application. No NgModules. Single entry point at `src/main.ts`.

```
src/
  main.ts            # bootstrapApplication(App, appConfig)
  styles.css         # global styles — @import 'tailwindcss'
  app/
    app.ts           # root component (standalone)
    app.config.ts    # ApplicationConfig — providers go here
    app.routes.ts    # top-level Routes array
```

Feature routes should be added to `app.routes.ts` using lazy loading (`loadComponent` / `loadChildren`). Feature folders live under `src/app/<feature>/`.

## Key Conventions

**Reactivity**
- Use `signal()` for local state, `computed()` for derived state.
- Use `linkedSignal()` for writable state that depends on another signal.
- Use `resource()` for async signal-based data fetching.
- Use `effect()` only for side effects; never to propagate state.
- Update signals with `.set()` or `.update()`; never `.mutate()`.

**Components**
- All components, directives, and pipes are standalone — do not set `standalone: true` (it is the default).
- Use `inject()` instead of constructor injection.
- Use `input()` / `output()` instead of `@Input()` / `@Output()`.
- Use the `host` object in the decorator instead of `@HostBinding` / `@HostListener`.

**Templates**
- Use native control flow: `@if`, `@for` (always with `track`), `@switch`.
- Never use `*ngIf`, `*ngFor`, `*ngSwitch`, `ngClass`, or `ngStyle` in new code.

**Forms**
- New forms → Signal Forms (Angular 22+).
- Complex or existing forms → Reactive Forms.
- Avoid template-driven forms.

**Styling**
- Tailwind CSS 4 via `@import 'tailwindcss'` (no config file needed).
- Component-scoped CSS for local styles.

**Testing**
- Vitest + jsdom, driven by `@angular/build:unit-test`.
- No separate `vitest.config.ts` — configuration lives in `angular.json`.
- Use `TestBed` and Angular testing utilities only when needed; prefer plain Vitest for pure logic.

**Agent skills installed** (`.agents/skills/`): `angular-developer`, `frontend-design`, `tailwind-design-system`, `web-design-guidelines`, `emil-design-eng`. Consult them for domain-specific guidance.
