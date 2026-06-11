import {
  Component,
  computed,
  resource,
  signal,
} from '@angular/core';
import { httpResource } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, delay, of, throwError } from 'rxjs';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

const FAKE_POSTS: Post[] = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  userId: 1,
  title: `Post ${i + 1}: ${['Signals', 'Resources', 'Forms', 'Router', 'DI', 'Templates'][i]}`,
  body: `Demo post body for item ${i + 1}. This data comes from a local resource() with simulated async loading.`,
}));

@Component({
  selector: 'app-resources',
  template: `
    <div class="w-full space-y-8">

      <!-- Header -->
      <div>
        <div class="flex items-center gap-3 mb-1">
          <h1 class="text-2xl font-bold text-neutral-100">Resource API</h1>
          <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-angular-red/15 text-angular-red border border-angular-red/25">Stable</span>
        </div>
        <p class="text-neutral-400 text-sm">
          <code class="text-angular-red">resource()</code>,
          <code class="text-angular-red">rxResource()</code>,
          <code class="text-angular-red">httpResource()</code>
          — reactive async data with signals
        </p>
      </div>

      <!-- Comparison table -->
      <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
        <div class="px-5 py-4 border-b border-neutral-800 bg-surface-800/50">
          <h2 class="text-sm font-semibold text-neutral-200">Resource Types Overview</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="border-b border-neutral-800">
                <th class="px-4 py-3 text-left font-semibold text-neutral-400">API</th>
                <th class="px-4 py-3 text-left font-semibold text-neutral-400">Import</th>
                <th class="px-4 py-3 text-left font-semibold text-neutral-400">Loader</th>
                <th class="px-4 py-3 text-left font-semibold text-neutral-400">Use case</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-800/60">
              <tr class="hover:bg-surface-800/30">
                <td class="px-4 py-3 font-mono text-angular-red">resource()</td>
                <td class="px-4 py-3 text-neutral-400 font-mono">&#64;angular/core</td>
                <td class="px-4 py-3 text-neutral-300">Promise</td>
                <td class="px-4 py-3 text-neutral-400">Custom fetch, IndexedDB, Web Workers</td>
              </tr>
              <tr class="hover:bg-surface-800/30">
                <td class="px-4 py-3 font-mono text-angular-red">rxResource()</td>
                <td class="px-4 py-3 text-neutral-400 font-mono">&#64;angular/core/rxjs-interop</td>
                <td class="px-4 py-3 text-neutral-300">Observable</td>
                <td class="px-4 py-3 text-neutral-400">RxJS interop, WebSocket, SSE</td>
              </tr>
              <tr class="hover:bg-surface-800/30">
                <td class="px-4 py-3 font-mono text-angular-red">httpResource()</td>
                <td class="px-4 py-3 text-neutral-400 font-mono">&#64;angular/common/http</td>
                <td class="px-4 py-3 text-neutral-300">HttpClient</td>
                <td class="px-4 py-3 text-neutral-400">REST APIs — simplest HTTP fetching</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section 1: resource() -->
      <section class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="flex h-7 w-7 items-center justify-center rounded-full bg-angular-red/15 border border-angular-red/25 text-xs font-bold text-angular-red">1</div>
          <h2 class="text-base font-semibold text-neutral-200">
            <code class="text-angular-red">resource()</code>
            <span class="ml-2 text-xs font-normal text-neutral-500">— Promise-based, params-driven</span>
          </h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Demo -->
          <div class="rounded-xl border border-neutral-800 bg-surface-900 p-5 space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Live Demo</span>
              <div class="flex items-center gap-2">
                <span class="text-xs text-neutral-600">delay:</span>
                <select
                  class="rounded border border-neutral-700 bg-surface-800 px-2 py-1 text-xs text-neutral-300"
                  [value]="resourceDelay()"
                  (change)="resourceDelay.set(+$any($event.target).value)"
                >
                  <option value="0">0ms</option>
                  <option value="500">500ms</option>
                  <option value="1500">1500ms</option>
                </select>
              </div>
            </div>

            <!-- Status badge -->
            <div class="flex items-center gap-2">
              <div
                class="h-2 w-2 rounded-full"
                [class.bg-amber-400]="localResource.isLoading()"
                [class.animate-pulse]="localResource.isLoading()"
                [class.bg-green-400]="localResource.status() === 'resolved'"
                [class.bg-red-400]="localResource.status() === 'error'"
                [class.bg-neutral-600]="localResource.status() === 'idle'"
              ></div>
              <span class="text-xs font-mono text-neutral-400">
                status: <span class="text-neutral-200">{{ statusLabel(localResource.status()) }}</span>
              </span>
              <button
                (click)="localResource.reload()"
                class="ml-auto rounded border border-neutral-700 px-2 py-0.5 text-xs text-neutral-400 hover:text-neutral-200 hover:border-neutral-500 transition-colors"
              >reload()</button>
            </div>

            @if (localResource.isLoading()) {
              <div class="space-y-2 animate-pulse">
                @for (_ of [1,2,3]; track $index) {
                  <div class="h-10 rounded-lg bg-surface-700"></div>
                }
              </div>
            } @else if (localResource.error()) {
              <div class="rounded-lg bg-red-900/10 border border-red-800/30 p-3 text-xs text-red-400">
                Error: {{ localResource.error() }}
              </div>
            } @else if (localResource.hasValue()) {
              <div class="space-y-2">
                @for (post of localResource.value(); track post.id) {
                  <div class="rounded-lg border border-neutral-800 bg-surface-800 px-3 py-2">
                    <p class="text-xs font-semibold text-neutral-200">{{ post.title }}</p>
                    <p class="text-xs text-neutral-500 mt-0.5 line-clamp-1">{{ post.body }}</p>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Code -->
          <div class="rounded-xl border border-neutral-800 bg-surface-900 overflow-hidden">
            <div class="px-4 py-2 border-b border-neutral-800 bg-surface-800/50 text-xs text-neutral-500 font-mono">resource()</div>
            <pre class="p-4 text-xs text-neutral-300 font-mono leading-relaxed overflow-x-auto">{{ snippets.resource }}</pre>
          </div>
        </div>
      </section>

      <!-- Section 2: rxResource() -->
      <section class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="flex h-7 w-7 items-center justify-center rounded-full bg-angular-red/15 border border-angular-red/25 text-xs font-bold text-angular-red">2</div>
          <h2 class="text-base font-semibold text-neutral-200">
            <code class="text-angular-red">rxResource()</code>
            <span class="ml-2 text-xs font-normal text-neutral-500">— Observable loader, RxJS interop</span>
          </h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Demo -->
          <div class="rounded-xl border border-neutral-800 bg-surface-900 p-5 space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Live Demo</span>
              <label class="flex items-center gap-2 text-xs text-neutral-400 cursor-pointer">
                <input
                  type="checkbox"
                  [checked]="rxShouldFail()"
                  (change)="rxShouldFail.set($any($event.target).checked)"
                  class="accent-angular-red"
                />
                Simulate error
              </label>
            </div>

            <div class="flex items-center gap-2">
              <div
                class="h-2 w-2 rounded-full"
                [class.bg-amber-400]="rxRes.isLoading()"
                [class.animate-pulse]="rxRes.isLoading()"
                [class.bg-green-400]="rxRes.status() === 'resolved'"
                [class.bg-red-400]="rxRes.status() === 'error'"
              ></div>
              <span class="text-xs font-mono text-neutral-400">
                status: <span class="text-neutral-200">{{ statusLabel(rxRes.status()) }}</span>
              </span>
              <button
                (click)="rxRes.reload()"
                class="ml-auto rounded border border-neutral-700 px-2 py-0.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
              >reload()</button>
            </div>

            @if (rxRes.isLoading()) {
              <div class="space-y-2 animate-pulse">
                @for (_ of [1,2]; track $index) {
                  <div class="h-12 rounded-lg bg-surface-700"></div>
                }
              </div>
            } @else if (rxRes.error()) {
              <div class="rounded-lg bg-red-900/10 border border-red-800/30 p-3 text-xs text-red-400">
                Observable error: {{ rxRes.error() }}
              </div>
            } @else if (rxRes.hasValue()) {
              <div class="space-y-2">
                @for (todo of (rxRes.value() ?? []); track todo.id) {
                  <div class="rounded-lg border border-neutral-800 bg-surface-800 px-3 py-2 flex items-center gap-2">
                    <div
                      class="h-3.5 w-3.5 rounded-full border shrink-0"
                      [class.border-green-500]="todo.completed"
                      [class.bg-green-500]="todo.completed"
                      [class.border-neutral-600]="!todo.completed"
                    ></div>
                    <p class="text-xs text-neutral-200">{{ todo.title }}</p>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Code -->
          <div class="rounded-xl border border-neutral-800 bg-surface-900 overflow-hidden">
            <div class="px-4 py-2 border-b border-neutral-800 bg-surface-800/50 text-xs text-neutral-500 font-mono">rxResource()</div>
            <pre class="p-4 text-xs text-neutral-300 font-mono leading-relaxed overflow-x-auto">{{ snippets.rxResource }}</pre>
          </div>
        </div>
      </section>

      <!-- Section 3: httpResource() -->
      <section class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="flex h-7 w-7 items-center justify-center rounded-full bg-angular-red/15 border border-angular-red/25 text-xs font-bold text-angular-red">3</div>
          <h2 class="text-base font-semibold text-neutral-200">
            <code class="text-angular-red">httpResource()</code>
            <span class="ml-2 text-xs font-normal text-neutral-500">— HttpClient, reactive URL</span>
          </h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Demo -->
          <div class="rounded-xl border border-neutral-800 bg-surface-900 p-5 space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Live Demo — JSONPlaceholder</span>
              <div class="flex items-center gap-1">
                <button
                  (click)="prevPage()"
                  [disabled]="httpPage() <= 1"
                  class="rounded border border-neutral-700 px-2 py-0.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors disabled:opacity-40"
                >←</button>
                <span class="text-xs text-neutral-400 px-1">page {{ httpPage() }}</span>
                <button
                  (click)="httpPage.update(p => p + 1)"
                  class="rounded border border-neutral-700 px-2 py-0.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
                >→</button>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <div
                class="h-2 w-2 rounded-full"
                [class.bg-amber-400]="httpPosts.isLoading()"
                [class.animate-pulse]="httpPosts.isLoading()"
                [class.bg-green-400]="httpPosts.status() === 'resolved'"
                [class.bg-red-400]="httpPosts.status() === 'error'"
              ></div>
              <span class="text-xs font-mono text-neutral-400">
                status: <span class="text-neutral-200">{{ statusLabel(httpPosts.status()) }}</span>
              </span>
              <button
                (click)="httpPosts.reload()"
                class="ml-auto rounded border border-neutral-700 px-2 py-0.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
              >reload()</button>
            </div>

            @if (httpPosts.isLoading()) {
              <div class="space-y-2 animate-pulse">
                @for (_ of [1,2,3]; track $index) {
                  <div class="h-12 rounded-lg bg-surface-700"></div>
                }
              </div>
            } @else if (httpPosts.error()) {
              <div class="rounded-lg bg-red-900/10 border border-red-800/30 p-3 text-xs text-red-400">
                HTTP error: {{ httpPosts.error() }}
              </div>
            } @else if (httpPosts.hasValue()) {
              <div class="space-y-2">
                @for (post of (httpPosts.value() ?? []); track post.id) {
                  <div class="rounded-lg border border-neutral-800 bg-surface-800 px-3 py-2">
                    <div class="flex items-center justify-between mb-0.5">
                      <p class="text-xs font-semibold text-neutral-200 line-clamp-1">{{ post.title }}</p>
                      <span class="text-[10px] font-mono text-neutral-600 shrink-0 ml-2">#{{ post.id }}</span>
                    </div>
                    <p class="text-xs text-neutral-500 line-clamp-1">{{ post.body }}</p>
                  </div>
                }
              </div>
            }

            <!-- URL display -->
            <div class="rounded border border-neutral-800 bg-surface-800/50 px-3 py-2">
              <p class="text-[10px] text-neutral-600 mb-0.5 font-semibold uppercase tracking-wider">Reactive URL</p>
              <p class="text-xs font-mono text-neutral-400 break-all">{{ httpUrl() }}</p>
            </div>
          </div>

          <!-- Code -->
          <div class="rounded-xl border border-neutral-800 bg-surface-900 overflow-hidden">
            <div class="px-4 py-2 border-b border-neutral-800 bg-surface-800/50 text-xs text-neutral-500 font-mono">httpResource()</div>
            <pre class="p-4 text-xs text-neutral-300 font-mono leading-relaxed overflow-x-auto">{{ snippets.httpResource }}</pre>
          </div>
        </div>
      </section>

      <!-- Section 4: Resource status reference -->
      <section class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="flex h-7 w-7 items-center justify-center rounded-full bg-angular-red/15 border border-angular-red/25 text-xs font-bold text-angular-red">4</div>
          <h2 class="text-base font-semibold text-neutral-200">ResourceStatus values</h2>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          @for (s of statusValues; track s.label) {
            <div class="rounded-xl border border-neutral-800 bg-surface-900 p-3 text-center space-y-1.5">
              <div class="h-2 w-2 rounded-full mx-auto" [style.background]="s.color"></div>
              <p class="text-xs font-mono font-semibold text-neutral-200">{{ s.label }}</p>
              <p class="text-[10px] text-neutral-500 leading-tight">{{ s.desc }}</p>
            </div>
          }
        </div>
      </section>

    </div>
  `,
})
export class Resources {
  // ── resource() demo ──────────────────────────────────────────
  protected readonly resourceDelay = signal(500);

  protected readonly localResource = resource<Post[], number>({
    params: () => this.resourceDelay(),
    loader: async ({ params: delay, abortSignal }) => {
      await new Promise<void>((res, rej) => {
        const t = setTimeout(res, delay);
        abortSignal.addEventListener('abort', () => { clearTimeout(t); rej(new Error('aborted')); });
      });
      return FAKE_POSTS;
    },
  });

  // ── rxResource() demo ─────────────────────────────────────────
  protected readonly rxShouldFail = signal(false);

  protected readonly rxRes = rxResource<Todo[], boolean>({
    params: () => this.rxShouldFail(),
    stream: ({ params: shouldFail }: { params: boolean; abortSignal: AbortSignal }): Observable<Todo[]> => {
      const todos: Todo[] = [
        { id: 1, title: 'Learn Angular signals', completed: true, userId: 1 },
        { id: 2, title: 'Build with rxResource()', completed: true, userId: 1 },
        { id: 3, title: 'Ship the showcase app', completed: false, userId: 1 },
      ];
      const obs = shouldFail
        ? throwError(() => 'Simulated Observable error')
        : of(todos);
      return obs.pipe(delay(600));
    },
  });

  // ── httpResource() demo ───────────────────────────────────────
  protected readonly httpPage = signal(1);

  protected readonly httpUrl = computed(
    () => `https://jsonplaceholder.typicode.com/posts?_page=${this.httpPage()}&_limit=3`
  );

  protected readonly httpPosts = httpResource<Post[]>(
    () => this.httpUrl()
  );

  // ── helpers ──────────────────────────────────────────────────
  protected prevPage(): void {
    this.httpPage.update(p => (p > 1 ? p - 1 : 1));
  }

  protected statusLabel(s: string): string {
    const labels: Record<string, string> = {
      idle: 'Idle',
      loading: 'Loading',
      reloading: 'Reloading',
      resolved: 'Resolved',
      error: 'Error',
      local: 'Local',
    };
    return labels[s] ?? s;
  }

  protected readonly statusValues = [
    { label: 'Idle', color: '#6b7280', desc: 'No params / never fetched' },
    { label: 'Loading', color: '#f59e0b', desc: 'Initial fetch in progress' },
    { label: 'Reloading', color: '#f59e0b', desc: 'Fetching with prior value' },
    { label: 'Resolved', color: '#22c55e', desc: 'Value is available' },
    { label: 'Error', color: '#ef4444', desc: 'Loader threw an error' },
    { label: 'Local', color: '#a78bfa', desc: 'Value set locally' },
  ];

  protected readonly snippets = {
    resource: `const delay = signal(500);

const posts = resource<Post[], number>({
  params: () => delay(),          // reactive params
  loader: async ({ params, abortSignal }) => {
    await sleep(params);          // simulate fetch
    return FAKE_POSTS;
  },
});

// In template:
// posts.isLoading()  → boolean Signal
// posts.hasValue()   → boolean Signal
// posts.value()      → Post[] | undefined
// posts.error()      → unknown
// posts.status()     → ResourceStatus
// posts.reload()     → re-trigger loader`,

    rxResource: `import { rxResource } from '@angular/core/rxjs-interop';

const shouldFail = signal(false);

const todos = rxResource<Todo[], boolean>({
  params: () => shouldFail(),
  loader: ({ params: fail }): Observable<Todo[]> => {
    const src = fail
      ? throwError(() => 'Network error')
      : of(MY_TODOS);
    return src.pipe(delay(600));  // Observable loader
  },
});

// Same API: isLoading(), hasValue(), error(), reload()`,

    httpResource: `import { httpResource } from '@angular/common/http';

const page = signal(1);

const posts = httpResource<Post[]>(
  // Reactive URL factory — refetches when page() changes
  () => \`https://api.example.com/posts?page=\${page()}\`
);

// Or with full request object:
const data = httpResource<Data>(() => ({
  url: '/api/data',
  params: { page: page() },
  headers: { Authorization: token() },
}));`,
  };
}
