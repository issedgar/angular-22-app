import { Component, computed, inject, signal } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { filter, map } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-router-demo',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="w-full space-y-8">

      <!-- Header -->
      <div>
        <div class="flex items-center gap-3 mb-1">
          <h1 class="text-2xl font-bold text-neutral-100">Router</h1>
          <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-angular-red/15 text-angular-red border border-angular-red/25">Stable</span>
        </div>
        <p class="text-neutral-400 text-sm">
          Route params · Guards · Lazy loading · Router events · <code class="text-angular-red">withComponentInputBinding()</code>
        </p>
      </div>

      <!-- Current route info -->
      <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
        <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50">
          <h2 class="text-sm font-semibold text-neutral-200">Current Route State</h2>
        </div>
        <div class="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
          <div class="space-y-1">
            <p class="text-neutral-600 uppercase tracking-wider text-[10px]">URL</p>
            <p class="text-neutral-200 break-all">{{ currentUrl() }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-neutral-600 uppercase tracking-wider text-[10px]">Route path</p>
            <p class="text-neutral-200">{{ routePath() }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-neutral-600 uppercase tracking-wider text-[10px]">Title</p>
            <p class="text-neutral-200">{{ routeTitle() }}</p>
          </div>
        </div>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- 1. RouterLink + RouterLinkActive -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50">
            <h2 class="text-sm font-semibold text-neutral-200">
              <code class="text-angular-red">routerLink</code> + <code class="text-angular-red">routerLinkActive</code>
            </h2>
          </div>
          <div class="p-5 space-y-4">
            <p class="text-xs text-neutral-500">Declarative navigation with active state detection.</p>
            <nav class="flex flex-col gap-1">
              @for (link of navLinks; track link.path) {
                <a
                  [routerLink]="link.path"
                  routerLinkActive="bg-angular-red/10 text-angular-red border-angular-red/30"
                  [routerLinkActiveOptions]="{ exact: link.exact }"
                  class="rounded-lg border border-transparent px-3 py-2 text-sm text-neutral-400 hover:text-neutral-200 hover:border-neutral-700 transition-colors no-underline flex items-center gap-2"
                >
                  <span class="text-base leading-none">{{ link.icon }}</span>
                  {{ link.label }}
                  <span class="ml-auto text-[10px] font-mono text-neutral-600">{{ link.path }}</span>
                </a>
              }
            </nav>
            <pre class="rounded-lg bg-surface-800 p-3 text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto">{{ snippets.routerLink }}</pre>
          </div>
        </div>

        <!-- 2. Route params -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50">
            <h2 class="text-sm font-semibold text-neutral-200">
              Route params + <code class="text-angular-red">withComponentInputBinding()</code>
            </h2>
          </div>
          <div class="p-5 space-y-4">
            <p class="text-xs text-neutral-500">
              With <code class="text-angular-red">withComponentInputBinding()</code> in
              <code class="text-neutral-300">provideRouter()</code>, route params map
              directly to <code class="text-angular-red">input()</code> signals.
            </p>
            <div class="rounded-lg border border-neutral-800 bg-surface-800 p-4 space-y-3 text-xs">
              <p class="text-neutral-400">Try navigating to <code class="text-neutral-200">/data-explorer/:name</code>:</p>
              <div class="flex flex-wrap gap-2">
                @for (name of pokemonLinks; track name) {
                  <a
                    [routerLink]="['/data-explorer', name]"
                    class="rounded border border-neutral-700 px-2.5 py-1 text-xs text-neutral-400 hover:text-angular-red hover:border-angular-red/40 transition-colors no-underline capitalize"
                  >{{ name }}</a>
                }
              </div>
            </div>
            <pre class="rounded-lg bg-surface-800 p-3 text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto">{{ snippets.inputBinding }}</pre>
          </div>
        </div>

        <!-- 3. Guards -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50">
            <h2 class="text-sm font-semibold text-neutral-200">Guards — <code class="text-angular-red">CanMatch</code> · <code class="text-angular-red">CanActivate</code></h2>
          </div>
          <div class="p-5 space-y-4">
            <p class="text-xs text-neutral-500">Functional guards with <code class="text-angular-red">inject()</code>. No class required.</p>
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-sm text-neutral-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  [checked]="isLoggedIn()"
                  (change)="isLoggedIn.set($any($event.target).checked)"
                  class="accent-angular-red"
                />
                Simulate logged in
              </label>
              <button
                (click)="tryProtectedRoute()"
                class="rounded-lg border px-4 py-2 text-xs font-medium transition-colors"
                [class.border-angular-red]="isLoggedIn()"
                [class.text-angular-red]="isLoggedIn()"
                [class.hover:bg-angular-red]="isLoggedIn()"
                [class.border-neutral-700]="!isLoggedIn()"
                [class.text-neutral-400]="!isLoggedIn()"
              >Navigate to protected route</button>
              @if (guardMessage()) {
                <div
                  class="rounded-lg px-3 py-2 text-xs"
                  [class.bg-green-900]="isLoggedIn()"
                  [class.text-green-400]="isLoggedIn()"
                  [class.bg-red-900]="!isLoggedIn()"
                  [class.text-red-400]="!isLoggedIn()"
                  [class.bg-opacity-10]="true"
                >{{ guardMessage() }}</div>
              }
            </div>
            <pre class="rounded-lg bg-surface-800 p-3 text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto">{{ snippets.guard }}</pre>
          </div>
        </div>

        <!-- 4. Router events -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-neutral-200">Router Events</h2>
            <button
              (click)="clearLog()"
              class="text-[10px] text-neutral-600 hover:text-neutral-400 transition-colors"
            >clear</button>
          </div>
          <div class="p-5 space-y-4">
            <p class="text-xs text-neutral-500">
              <code class="text-angular-red">router.events</code> is an Observable — use
              <code class="text-neutral-300">toSignal()</code> to bridge to signals.
            </p>
            <div class="h-36 overflow-y-auto rounded-lg border border-neutral-800 bg-surface-800 p-3 space-y-1">
              @if (navLog().length === 0) {
                <p class="text-xs text-neutral-600">Navigate between routes to see events…</p>
              }
              @for (entry of navLog(); track $index) {
                <div class="flex items-center gap-2 text-[11px] font-mono">
                  <span class="text-neutral-600 shrink-0">{{ entry.time }}</span>
                  <span class="text-green-400">NavigationEnd</span>
                  <span class="text-neutral-400 truncate">{{ entry.url }}</span>
                </div>
              }
            </div>
            <pre class="rounded-lg bg-surface-800 p-3 text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto">{{ snippets.events }}</pre>
          </div>
        </div>

      </div>

      <!-- Lazy loading callout -->
      <div class="rounded-xl border border-blue-800/30 bg-blue-900/5 px-5 py-4 flex gap-3">
        <div class="shrink-0 mt-0.5">
          <svg class="h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 110 20A10 10 0 0112 2zm1 11V8a1 1 0 10-2 0v5a1 1 0 00.45.83l3 2a1 1 0 101.1-1.66L13 13z"/>
          </svg>
        </div>
        <div class="text-xs text-neutral-400 leading-relaxed">
          <strong class="text-blue-400">Lazy loading</strong> — every feature route in this app uses
          <code class="text-neutral-300">loadComponent: () =&gt; import(...)</code> in
          <code class="text-neutral-300">app.routes.ts</code>. Each chunk loads on demand.
          You can verify this in the Network tab — chunks are fetched only when the route is first visited.
        </div>
      </div>

    </div>
  `,
})
export class RouterDemo {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly isLoggedIn = signal(false);
  protected readonly guardMessage = signal('');

  protected readonly navLog = signal<{ time: string; url: string }[]>([]);

  protected readonly navLinks = [
    { path: '/', label: 'Dashboard', icon: '🏠', exact: true },
    { path: '/signals', label: 'Signals', icon: '⚡', exact: false },
    { path: '/signal-forms', label: 'Signal Forms', icon: '📝', exact: false },
    { path: '/resources', label: 'Resource API', icon: '🌐', exact: false },
  ];

  protected readonly pokemonLinks = ['pikachu', 'bulbasaur', 'charizard', 'mewtwo'];

  protected readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  protected readonly routePath = computed(() => {
    const url = this.currentUrl();
    return url.split('?')[0];
  });

  protected readonly routeTitle = computed(() => {
    let snapshot = this.route.snapshot;
    while (snapshot.firstChild) snapshot = snapshot.firstChild;
    return (snapshot.data['title'] as string) ?? '—';
  });

  constructor() {
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(e => {
        const end = e as NavigationEnd;
        const now = new Date().toLocaleTimeString('en', { hour12: false });
        this.navLog.update(log => [
          { time: now, url: end.urlAfterRedirects },
          ...log.slice(0, 19),
        ]);
      });
  }

  protected tryProtectedRoute(): void {
    if (this.isLoggedIn()) {
      this.guardMessage.set('✓ Guard passed — navigation allowed.');
    } else {
      this.guardMessage.set('✗ Guard blocked — redirected to login.');
    }
    setTimeout(() => this.guardMessage.set(''), 3000);
  }

  protected clearLog(): void {
    this.navLog.set([]);
  }

  protected readonly snippets = {
    routerLink: `<!-- Declarative navigation -->
<a [routerLink]="'/dashboard'"
   routerLinkActive="active-class"
   [routerLinkActiveOptions]="{ exact: true }">
  Dashboard
</a>

<!-- Programmatic -->
const router = inject(Router);
router.navigate(['/user', userId]);
router.navigateByUrl('/dashboard?tab=1');`,

    inputBinding: `// app.config.ts
provideRouter(routes, withComponentInputBinding())

// Route definition
{ path: 'user/:id', loadComponent: ... }

// Component — param auto-mapped to input()
export class UserDetail {
  readonly id = input<string>('');  // ← ':id' param
}`,

    guard: `// Functional guard — no class needed
export const authGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn()
    ? true
    : router.createUrlTree(['/login']);
};

// Route config
{
  path: 'admin',
  canMatch: [authGuard],
  loadComponent: () => import('./admin'),
}`,

    events: `import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd } from '@angular/router';

// Bridge RxJS events to a signal
const lastNav = toSignal(
  inject(Router).events.pipe(
    filter(e => e instanceof NavigationEnd),
    map(e => e.urlAfterRedirects)
  ),
  { initialValue: '/' }
);`,
  };
}
