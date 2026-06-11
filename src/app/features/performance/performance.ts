import { ChangeDetectionStrategy, Component, Pipe, PipeTransform, computed, effect, input, signal } from '@angular/core';

interface ListItem {
  id: number;
  name: string;
  score: number;
}

// Pure pipe — only re-runs when input reference changes
@Pipe({ name: 'formatScore', pure: true })
class FormatScorePipe implements PipeTransform {
  transform(score: number, precision = 1): string {
    return `${score.toFixed(precision)} pts`;
  }
}

// Child component with OnPush — only re-renders when inputs change
@Component({
  selector: 'app-onpush-child',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormatScorePipe],
  template: `
    <div class="rounded-lg border border-neutral-800 bg-surface-800 px-4 py-3 flex items-center justify-between text-xs">
      <span class="text-neutral-300 font-medium">{{ label() }}</span>
      <div class="flex items-center gap-3">
        <span class="font-mono text-angular-red">{{ value() | formatScore }}</span>
        <span class="text-[10px] text-neutral-600">#{{ renderCount() }}</span>
      </div>
    </div>
  `,
})
class OnPushChild {
  readonly label = input('OnPush child');
  readonly value = input(0);
  protected readonly renderCount = signal(0);
  constructor() {
    effect(() => {
      this.value(); // track value changes
      this.renderCount.update(n => n + 1);
    });
  }
}

@Component({
  selector: 'app-performance',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OnPushChild, FormatScorePipe],
  template: `
    <div class="max-w-6xl mx-auto space-y-8">

      <!-- Header -->
      <div>
        <div class="flex items-center gap-3 mb-1">
          <h1 class="text-2xl font-bold text-neutral-100">Performance</h1>
          <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-angular-red/15 text-angular-red border border-angular-red/25">Stable</span>
        </div>
        <p class="text-neutral-400 text-sm">
          OnPush · Signals · Zoneless · <code class="text-angular-red">&#64;defer</code> · <code class="text-angular-red">track</code> · Pure pipes · Lazy routes
        </p>
      </div>

      <!-- Summary grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        @for (tip of perfTips; track tip.title) {
          <div class="rounded-xl border border-neutral-800 bg-surface-900 p-4 space-y-2">
            <div class="flex items-center gap-2">
              <span class="text-xl leading-none">{{ tip.icon }}</span>
              <p class="text-xs font-semibold text-neutral-200">{{ tip.title }}</p>
            </div>
            <p class="text-[11px] text-neutral-500 leading-relaxed">{{ tip.desc }}</p>
            <code class="text-[10px] text-angular-red">{{ tip.code }}</code>
          </div>
        }
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- 1. OnPush + signals -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50">
            <h2 class="text-sm font-semibold text-neutral-200">
              OnPush + Signals
              <span class="ml-2 text-[10px] font-mono text-neutral-600">ChangeDetectionStrategy.OnPush</span>
            </h2>
          </div>
          <div class="p-5 space-y-4">
            <p class="text-xs text-neutral-500">
              OnPush skips change detection unless an input reference changes or a signal emits.
              This component uses <code class="text-angular-red">ChangeDetectionStrategy.OnPush</code>.
            </p>
            <div class="space-y-3">
              <div class="flex gap-2 flex-wrap">
                <button
                  (click)="score.update(s => s + 10)"
                  class="rounded border border-neutral-700 px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
                >+10 score (signal)</button>
                <button
                  (click)="unrelatedUpdate()"
                  class="rounded border border-neutral-700 px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
                >Unrelated update</button>
              </div>
              <div class="rounded-lg border border-neutral-800 bg-surface-800 p-4 space-y-2 text-xs">
                <div class="flex justify-between">
                  <span class="text-neutral-500">score (signal)</span>
                  <span class="font-mono text-angular-red">{{ score() | formatScore }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-neutral-500">derived (computed)</span>
                  <span class="font-mono text-neutral-300">{{ grade() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-neutral-500">render count (parent)</span>
                  <span class="font-mono text-neutral-500">{{ parentRenders }}</span>
                </div>
              </div>
              <app-onpush-child [label]="'OnPush child'" [value]="score()" />
            </div>
            <pre class="rounded-lg bg-surface-800 p-3 text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto">{{ snippets.onpush }}</pre>
          </div>
        </div>

        <!-- 2. track in @for -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50">
            <h2 class="text-sm font-semibold text-neutral-200">
              <code class="text-angular-red">track</code> in <code class="text-angular-red">&#64;for</code>
            </h2>
          </div>
          <div class="p-5 space-y-4">
            <p class="text-xs text-neutral-500">
              <code class="text-angular-red">track</code> gives Angular a stable identity per item,
              allowing it to reuse DOM nodes instead of recreating them on every render.
            </p>
            <div class="flex gap-2 flex-wrap">
              <button
                (click)="shuffleList()"
                class="rounded border border-neutral-700 px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
              >Shuffle</button>
              <button
                (click)="addListItem()"
                class="rounded border border-neutral-700 px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
              >Add item</button>
              <button
                (click)="removeLastItem()"
                class="rounded border border-neutral-700 px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
              >Remove last</button>
            </div>
            <div class="space-y-1.5 max-h-52 overflow-y-auto">
              @for (item of listItems(); track item.id) {
                <div class="rounded-lg border border-neutral-800 bg-surface-800 px-3 py-2 flex items-center gap-3 text-xs">
                  <span class="w-6 font-mono text-neutral-600 text-[10px]">{{ item.id }}</span>
                  <span class="flex-1 text-neutral-300">{{ item.name }}</span>
                  <span class="font-mono text-angular-red">{{ item.score | formatScore }}</span>
                </div>
              }
            </div>
            <pre class="rounded-lg bg-surface-800 p-3 text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto">{{ snippets.track }}</pre>
          </div>
        </div>

        <!-- 3. Pure pipe -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50">
            <h2 class="text-sm font-semibold text-neutral-200">
              Pure Pipe
              <span class="ml-2 text-[10px] font-mono text-neutral-600">pure: true (default)</span>
            </h2>
          </div>
          <div class="p-5 space-y-4">
            <p class="text-xs text-neutral-500">
              Pure pipes only re-execute when the input reference changes.
              Angular memoizes the result — identical inputs return the cached output instantly.
            </p>
            <div class="rounded-lg border border-neutral-800 bg-surface-800 p-4 space-y-3">
              <div class="flex items-center gap-3 text-xs">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="0.1"
                  [value]="pipeInput()"
                  (input)="pipeInput.set(+$any($event.target).value)"
                  class="flex-1 accent-angular-red"
                />
                <span class="font-mono text-neutral-300 w-20 text-right">
                  {{ pipeInput() | formatScore: 2 }}
                </span>
              </div>
              <p class="text-[11px] text-neutral-600">The pipe only recomputes when the slider value changes reference.</p>
            </div>
            <pre class="rounded-lg bg-surface-800 p-3 text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto">{{ snippets.pipe }}</pre>
          </div>
        </div>

        <!-- 4. @defer -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50">
            <h2 class="text-sm font-semibold text-neutral-200">
              <code class="text-angular-red">&#64;defer</code> triggers
            </h2>
          </div>
          <div class="p-5 space-y-4">
            <p class="text-xs text-neutral-500">
              <code class="text-angular-red">&#64;defer</code> splits templates into separate chunks,
              loaded on demand. Use triggers to control <em>when</em> to load.
            </p>
            <div class="space-y-2">
              @for (trigger of deferTriggers; track trigger.name) {
                <div class="rounded-lg border border-neutral-800 bg-surface-800/50 px-4 py-2.5 flex items-start gap-3 text-xs">
                  <code class="shrink-0 text-angular-red w-32">{{ trigger.name }}</code>
                  <p class="text-neutral-500 leading-relaxed">{{ trigger.desc }}</p>
                </div>
              }
            </div>
            <pre class="rounded-lg bg-surface-800 p-3 text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto">{{ snippets.defer }}</pre>
          </div>
        </div>

      </div>

      <!-- Lazy routes callout -->
      <div class="rounded-xl border border-blue-800/20 bg-blue-900/5 px-5 py-4 space-y-2">
        <p class="text-xs font-semibold text-blue-400">Lazy routes — all features in this app</p>
        <div class="font-mono text-[11px] text-neutral-500 space-y-0.5">
          <p>route: 'signals'         → loadComponent: () => import('./features/signals/signals')</p>
          <p>route: 'resources'       → loadComponent: () => import('./features/resources/resources')</p>
          <p>route: 'performance'     → loadComponent: () => import('./features/performance/performance')</p>
          <p class="text-neutral-600">... and every other feature chunk</p>
        </div>
        <p class="text-[11px] text-neutral-600">Each feature is fetched from the network only when the route is first visited. Check the Network tab.</p>
      </div>

    </div>
  `,
})
export class Performance {
  protected readonly score = signal(50);
  protected readonly pipeInput = signal(123.456);
  protected parentRenders = 0;

  protected readonly grade = computed(() => {
    const s = this.score();
    if (s >= 90) return 'A+';
    if (s >= 80) return 'A';
    if (s >= 70) return 'B';
    if (s >= 60) return 'C';
    return 'D';
  });

  private _nextId = 10;
  protected readonly listItems = signal<ListItem[]>([
    { id: 1, name: 'Angular signals', score: 98.5 },
    { id: 2, name: 'Zoneless rendering', score: 95.2 },
    { id: 3, name: 'OnPush strategy', score: 91.0 },
    { id: 4, name: 'Lazy loading', score: 88.7 },
    { id: 5, name: 'Pure pipes', score: 82.1 },
  ]);

  protected unrelatedUpdate(): void {
    this.parentRenders++;
  }

  protected shuffleList(): void {
    this.listItems.update(items => [...items].sort(() => Math.random() - 0.5));
  }

  protected addListItem(): void {
    const id = ++this._nextId;
    this.listItems.update(items => [
      ...items,
      { id, name: `Feature #${id}`, score: Math.round(Math.random() * 40 + 60) },
    ]);
  }

  protected removeLastItem(): void {
    this.listItems.update(items => items.slice(0, -1));
  }

  protected readonly perfTips = [
    { icon: '⚡', title: 'Signals', desc: 'Fine-grained reactivity — only affected nodes re-render.', code: 'signal(), computed()' },
    { icon: '🔀', title: 'OnPush', desc: 'Skip change detection for components with stable inputs.', code: 'ChangeDetectionStrategy.OnPush' },
    { icon: '🦥', title: '@defer', desc: 'Split heavy template blocks into lazy chunks.', code: '@defer (on viewport)' },
    { icon: '🔑', title: 'track', desc: 'Stable DOM keys prevent full list re-renders on shuffle.', code: '@for (x of y; track x.id)' },
  ];

  protected readonly deferTriggers = [
    { name: 'on idle',       desc: 'Load when the browser finishes higher-priority work (requestIdleCallback).' },
    { name: 'on viewport',   desc: 'Load when the placeholder enters the visible viewport (IntersectionObserver).' },
    { name: 'on interaction',desc: 'Load on the first click or focus on the placeholder.' },
    { name: 'on hover',      desc: 'Load when the user hovers over the placeholder.' },
    { name: 'on timer(2s)',  desc: 'Load after a fixed delay.' },
    { name: 'when expr()',   desc: 'Load when a boolean expression or signal becomes true.' },
    { name: 'on immediate',  desc: 'Load as soon as possible after the view renders.' },
  ];

  protected readonly snippets = {
    onpush: `@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent {
  // Signals trigger CD automatically
  count = signal(0);
  // computed() is memoized — no extra renders
  doubled = computed(() => this.count() * 2);
}`,

    track: `// Bad — Angular destroys/recreates all DOM nodes
@for (item of items(); track $index) { ... }

// Good — Angular reuses existing DOM nodes by id
@for (item of items(); track item.id) { ... }

// With shuffle: only moved nodes are touched`,

    pipe: `@Pipe({ name: 'formatScore', pure: true })
export class FormatScorePipe implements PipeTransform {
  transform(score: number, precision = 1): string {
    return score.toFixed(precision) + ' pts';
  }
}

// In template — memoized per unique input value
{{ score | formatScore: 2 }}`,

    defer: `@defer (on viewport) {
  <heavy-chart [data]="data()" />
} @placeholder {
  <div class="skeleton h-64" />
} @loading (minimum 200ms) {
  <spinner />
}

// Reduces initial bundle and parsing time`,
  };
}
