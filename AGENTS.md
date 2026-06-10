# AGENTS.md

## Project Context

Angular 22 application named `angular-22-app` using TypeScript 6, RxJS 7, Tailwind CSS 4, Vitest, jsdom, and pnpm 11.5.3.

This file is the project-level instruction source for coding agents. Keep guidance compact, enforceable, and aligned with Angular's official developer skill guidance.

## Required Stack

| Layer | Technology |
|---|---|
| Framework | Angular 22 |
| Language | TypeScript strict mode |
| Package manager | pnpm only |
| Styling | Tailwind CSS 4 + component CSS |
| Forms | Prefer Signal Forms for new forms; use Reactive Forms for complex or existing form flows |
| State | Angular signals, `computed()`, `linkedSignal()`, and `resource()` when appropriate |
| Routing | Angular Router with lazy-loaded feature routes |
| Tests | Vitest + jsdom |
| Build | Angular CLI / `@angular/build` |

Do not introduce another framework, package manager, UI library, CSS framework, test runner, or state library unless explicitly requested.

## Commands

Always use pnpm for this project.

```powershell
pnpm install
pnpm start
pnpm build
pnpm test
pnpm ng <command>
pnpm ng generate <schematic> <name>
```

Do not use `npm install`, `npm run`, `yarn`, `bun`, or global `ng` commands. Prefer project scripts, `pnpm ng ...`, and Angular CLI schematics.

## Angular Skill Alignment

- Always analyze the actual Angular version before giving guidance or generating code.
- This project targets Angular 22; use modern Angular defaults and APIs.
- Use Angular CLI for scaffolding components, services, directives, pipes, routes, guards, and other Angular artifacts.
- After code generation or meaningful code changes, run `pnpm build` and fix build errors before considering the task complete.
- For new Angular projects only, do not force a CLI version unless the user explicitly requests one. For this existing project, use the installed project CLI through pnpm.
- When Angular behavior is uncertain, prefer official Angular documentation or installed project behavior over assumptions.

## Response and Workflow Rules

- Respond in Spanish unless another language is explicitly requested.
- Keep answers concise, technical, and developer-oriented.
- Before writing code, state assumptions and convert vague requirements into verifiable success criteria.
- Ask before broad architectural changes.
- Show only relevant diffs or modified blocks when proposing code changes.
- If multiple files change, separate each change by file path.
- Make the smallest change that solves the request.
- Only touch files directly related to the request.
- Every changed line must be traceable to the requested task.

## Environment Defaults

- OS: Windows.
- Shell: PowerShell. Use PowerShell syntax unless another shell is requested.
- Node.js is managed with nvm.
- Check `.nvmrc` when present; otherwise use the active LTS version compatible with Angular 22.
- Use official Angular and pnpm workflows.
- Do not use Bun or Deno.

## TypeScript Rules

- Use strict type checking.
- Prefer type inference when the type is obvious.
- Use explicit types when they improve clarity, contracts, or safety.
- Avoid `any`; use specific types, `unknown`, or generics.
- Prefer `const`; use `let` only when reassignment is required. Never use `var`.
- Prefer `async/await`; avoid `.then()` chains.
- Handle errors explicitly; avoid silent catches and unhandled promises.
- Use English for all code identifiers, file names, directories, branches, and commits.

## Angular Rules

- Use standalone components, directives, and pipes. Do not create NgModules.
- Do not set `standalone: true` in decorators; it is the default in modern Angular.
- Use `inject()` instead of constructor injection.
- Use signals for local state.
- Use `computed()` for derived state.
- Use `linkedSignal()` for writable state that depends on another signal when it fits the model.
- Use `resource()` for async signal-based data when it is appropriate for the feature and supported by the project.
- Use `effect()` only for side effects; do not use it to propagate state.
- Update signals with `set()` or `update()`; do not use `mutate()`.
- Use `input()` and `output()` instead of `@Input()` and `@Output()`.
- Do not use `@HostBinding` or `@HostListener`; use the `host` object in the decorator.
- Keep components small and focused on one responsibility.
- Prefer inline templates for small components.
- Use external templates/styles only when the component is large enough to justify them.
- When using external templates/styles, use paths relative to the component TypeScript file.
- Use `NgOptimizedImage` for static images. Do not use it for inline base64 images.

## Templates

- Keep templates simple and avoid complex expressions.
- Use native control flow: `@if`, `@for`, and `@switch`.
- Do not use `*ngIf`, `*ngFor`, or `*ngSwitch` in new code.
- Use the async pipe for observables.
- Do not assume globals such as `new Date()` are available in templates.
- Do not use `ngClass`; use `class` bindings.
- Do not use `ngStyle`; use `style` bindings.
- Always provide stable `track` expressions for `@for`.

## Forms and Validation

- For new forms in Angular 22, prefer Signal Forms when they are available and fit the requirement.
- Use Reactive Forms for complex forms, existing form flows, or when Signal Forms would add uncertainty.
- Avoid template-driven forms unless the form is intentionally simple and explicitly justified.
- Keep form models strongly typed.
- Validate user input before using it.
- Show clear validation and error states.
- Re-validate server-side when a backend is involved.
- Do not trust client-provided data if a backend is involved.

## Services, Data, and Dependency Injection

- Services must have a single responsibility.
- Use `providedIn: 'root'` for singleton services.
- Use `inject()` in services, guards, interceptors, and components.
- Keep business logic out of components when it grows beyond presentation logic.
- Keep transformations pure and predictable.
- Avoid duplicated HTTP or state logic.
- Prefer typed API contracts and DTOs.
- Use `InjectionToken` for configurable dependencies when needed.

## Routing and Rendering

- Implement lazy loading for feature routes.
- Keep routes small and organized by feature.
- Use guards only when needed and keep them focused.
- Prefer `CanMatch` for access control that should prevent route matching/loading.
- Use resolvers only when pre-fetching is required for route activation.
- Do not preload or eagerly import large feature areas without a reason.
- Consider CSR, SSR, SSG, and hydration implications before changing rendering strategy.

## Styling and Animations

- Use Tailwind CSS 4 as the primary utility styling approach when applicable.
- Use component CSS for local, component-specific styles.
- Prefer native CSS animations and transitions before Angular's legacy animation DSL.
- Preserve existing formatting and project conventions.
- Use 2-space indentation.
- Use single quotes in TypeScript.
- Use double quotes in JSON and HTML attributes.
- End files with a trailing newline.

## Accessibility

- Code must satisfy WCAG AA minimums.
- It must pass AXE checks.
- Maintain visible focus states.
- Ensure sufficient color contrast.
- Use semantic HTML first, ARIA only when needed.
- For custom Accordion, Listbox, Combobox, Menu, Tabs, Toolbar, Tree, or Grid patterns, follow ARIA authoring requirements carefully.
- Manage focus correctly in dialogs, menus, overlays, and dynamic content.
- All interactive elements must be keyboard accessible.

## Performance

- Keep components small and change detection-friendly.
- Prefer signals and computed state for synchronous UI state.
- Avoid unnecessary subscriptions.
- Clean up manual subscriptions when required.
- Lazy-load feature routes and heavy code paths.
- Optimize static images with `NgOptimizedImage`.
- Avoid adding dependencies for small utilities.

## Testing

- Use Vitest and jsdom for tests.
- Add or update tests when behavior changes.
- Keep tests focused on observable behavior.
- Avoid brittle tests tied to implementation details.
- Use Angular testing utilities and TestBed only when needed.
- Use component harness patterns for robust component interaction when applicable.
- Use router testing utilities when testing navigation behavior.

## Comments

- Add comments only for non-obvious logic, workarounds, or important gotchas.
- Do not add decorative or redundant comments.
- Write code comments in English.

## Git

- Commit messages must be in English and follow Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `style:`, `perf:`.
- Branch names must be in English and kebab-case, for example `feature/user-auth`.
- Do not suggest committing generated files, build outputs, dependencies, secrets, or local environment files.

## Security and Secrets

- Never expose, hardcode, log, or commit secrets, tokens, passwords, API keys, private URLs, or `.env` values.
- Use environment variables for configuration and credentials.
- Prefer secure defaults for authentication, authorization, validation, and error handling.
- Sanitize untrusted content before rendering.

## Final Checklist

Before completing any task, verify:

- [ ] The actual Angular version and project setup were considered.
- [ ] pnpm was used for all package and Angular commands.
- [ ] Angular CLI was used for scaffolding when applicable.
- [ ] `pnpm build` was run after meaningful code changes, or the reason for not running it was stated.
- [ ] TypeScript has no avoidable type issues.
- [ ] No `any` was introduced without a strong reason.
- [ ] Components remain standalone and focused.
- [ ] Signals, `computed()`, `input()`, `output()`, and `inject()` are used where appropriate.
- [ ] Signal Forms or Reactive Forms were chosen intentionally based on the form need.
- [ ] New routes are lazy-loaded when feature-level.
- [ ] Templates use native control flow.
- [ ] Accessibility basics are covered.
- [ ] No unnecessary dependencies were added.
- [ ] No secrets or local environment values were exposed.
