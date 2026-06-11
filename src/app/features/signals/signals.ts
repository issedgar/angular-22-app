import { Component, computed, debounced, effect, linkedSignal, signal } from '@angular/core';

type Category = 'fruits' | 'vegetables' | 'grains';

const CATALOG: Record<Category, string[]> = {
  fruits: ['Apple', 'Banana', 'Cherry', 'Mango', 'Peach'],
  vegetables: ['Carrot', 'Broccoli', 'Spinach', 'Pepper', 'Tomato'],
  grains: ['Rice', 'Wheat', 'Oats', 'Barley', 'Corn'],
};

const CATEGORIES: Category[] = ['fruits', 'vegetables', 'grains'];

@Component({
  selector: 'app-signals',
  imports: [],
  template: `
    <div class="max-w-5xl space-y-6">

      <!-- Page header -->
      <div>
        <h1 class="text-2xl font-bold text-neutral-100">Signals</h1>
        <p class="mt-1 text-sm text-neutral-500">
          Angular 22's reactive primitives — signal(), computed(), effect(), linkedSignal(), debounced()
        </p>
      </div>

      <!-- ── 1. signal() ────────────────────────────────────── -->
      <section class="overflow-hidden rounded-xl border border-neutral-800 bg-surface-800" aria-labelledby="s-signal">
        <header class="flex items-center gap-3 border-b border-neutral-800 px-5 py-3.5">
          <h2 id="s-signal" class="font-mono text-sm font-semibold text-neutral-100">signal()</h2>
          <span class="rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">STABLE</span>
          <span class="ml-auto hidden text-xs text-neutral-500 sm:block">Writable reactive value</span>
        </header>
        <div class="grid lg:grid-cols-2">
          <!-- Demo -->
          <div class="space-y-5 border-b border-neutral-800 p-5 lg:border-b-0 lg:border-r">
            <!-- Counter value -->
            <div class="rounded-lg bg-surface-950 p-5 text-center">
              <p class="mb-1 font-mono text-xs text-neutral-600">count()</p>
              <p class="font-mono text-5xl font-bold transition-colors" [class]="countColor()">{{ count() }}</p>
            </div>
            <!-- Controls -->
            <div class="flex items-center gap-2">
              <button (click)="decrement()" type="button"
                class="flex-1 rounded-lg border border-neutral-700 py-2 text-sm font-semibold text-neutral-300 transition-colors hover:bg-neutral-700">
                − 1
              </button>
              <button (click)="increment()" type="button"
                class="flex-1 rounded-lg bg-angular-red py-2 text-sm font-semibold text-white transition-colors hover:bg-angular-dark-red">
                + 1
              </button>
              <button (click)="resetCount()" type="button"
                class="rounded-lg border border-neutral-700 px-4 py-2 text-xs text-neutral-500 transition-colors hover:text-neutral-200">
                Reset
              </button>
            </div>
            <!-- History -->
            <div>
              <p class="mb-2 font-mono text-xs text-neutral-600">history (last 5)</p>
              <div class="flex flex-wrap items-center gap-1 font-mono text-sm">
                @for (h of history(); track $index; let last = $last) {
                  <span class="text-neutral-300">{{ h }}</span>
                  @if (!last) { <span class="text-neutral-700">→</span> }
                }
              </div>
            </div>
          </div>
          <!-- Code -->
          <pre class="m-0 overflow-auto bg-surface-950 p-5 text-xs font-mono leading-relaxed text-neutral-300">{{ snippets.signal }}</pre>
        </div>
      </section>

      <!-- ── 2. computed() ───────────────────────────────────── -->
      <section class="overflow-hidden rounded-xl border border-neutral-800 bg-surface-800" aria-labelledby="s-computed">
        <header class="flex items-center gap-3 border-b border-neutral-800 px-5 py-3.5">
          <h2 id="s-computed" class="font-mono text-sm font-semibold text-neutral-100">computed()</h2>
          <span class="rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">STABLE</span>
          <span class="ml-auto hidden text-xs text-neutral-500 sm:block">Read-only derived state — lazy &amp; memoized</span>
        </header>
        <div class="grid lg:grid-cols-2">
          <!-- Demo -->
          <div class="space-y-4 border-b border-neutral-800 p-5 lg:border-b-0 lg:border-r">
            <p class="font-mono text-xs text-neutral-500">
              Derived from <code class="text-angular-red">count = {{ count() }}</code>
              <span class="text-neutral-700 ml-2">(change it above ↑)</span>
            </p>
            <div class="grid grid-cols-3 gap-3">
              <div class="rounded-lg bg-surface-950 p-4 text-center">
                <p class="mb-1 font-mono text-[10px] text-neutral-600">count²</p>
                <p class="font-mono text-2xl font-bold text-blue-400">{{ squared() }}</p>
              </div>
              <div class="rounded-lg bg-surface-950 p-4 text-center">
                <p class="mb-1 font-mono text-[10px] text-neutral-600">isEven</p>
                <p class="font-mono text-sm font-bold" [class]="isEven() ? 'text-emerald-400' : 'text-rose-400'">
                  {{ isEven() }}
                </p>
              </div>
              <div class="rounded-lg bg-surface-950 p-4 text-center">
                <p class="mb-1 font-mono text-[10px] text-neutral-600">sign</p>
                <p class="font-mono text-xs font-bold"
                  [class]="sign() === 'positive' ? 'text-emerald-400' : sign() === 'negative' ? 'text-rose-400' : 'text-neutral-500'">
                  {{ sign() }}
                </p>
              </div>
            </div>
          </div>
          <!-- Code -->
          <pre class="m-0 overflow-auto bg-surface-950 p-5 text-xs font-mono leading-relaxed text-neutral-300">{{ snippets.computed }}</pre>
        </div>
      </section>

      <!-- ── 3. effect() ────────────────────────────────────── -->
      <section class="overflow-hidden rounded-xl border border-neutral-800 bg-surface-800" aria-labelledby="s-effect">
        <header class="flex items-center gap-3 border-b border-neutral-800 px-5 py-3.5">
          <h2 id="s-effect" class="font-mono text-sm font-semibold text-neutral-100">effect()</h2>
          <span class="rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">STABLE</span>
          <span class="ml-auto hidden text-xs text-neutral-500 sm:block">Side effects — runs when dependencies change</span>
        </header>
        <div class="grid lg:grid-cols-2">
          <!-- Demo -->
          <div class="border-b border-neutral-800 p-5 lg:border-b-0 lg:border-r">
            <div class="mb-3 flex items-center justify-between">
              <p class="font-mono text-xs text-neutral-500">Effect runs whenever <code class="text-angular-red">count</code> changes</p>
              <button (click)="clearEffectLog()" type="button"
                class="text-xs text-neutral-600 transition-colors hover:text-neutral-400">
                Clear
              </button>
            </div>
            <div class="h-44 overflow-y-auto rounded-lg bg-surface-950 p-3 font-mono text-xs space-y-0.5" aria-live="polite" aria-label="Effect log">
              @if (effectLog().length === 0) {
                <p class="text-neutral-700">No entries — change count above ↑</p>
              }
              @for (entry of effectLog(); track $index) {
                <p class="text-emerald-400/80">{{ entry }}</p>
              }
            </div>
          </div>
          <!-- Code -->
          <pre class="m-0 overflow-auto bg-surface-950 p-5 text-xs font-mono leading-relaxed text-neutral-300">{{ snippets.effect }}</pre>
        </div>
      </section>

      <!-- ── 4. linkedSignal() ──────────────────────────────── -->
      <section class="overflow-hidden rounded-xl border border-neutral-800 bg-surface-800" aria-labelledby="s-linked">
        <header class="flex items-center gap-3 border-b border-neutral-800 px-5 py-3.5">
          <h2 id="s-linked" class="font-mono text-sm font-semibold text-neutral-100">linkedSignal()</h2>
          <span class="rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">STABLE</span>
          <span class="ml-auto hidden text-xs text-neutral-500 sm:block">Writable derived signal — auto-resets with source</span>
        </header>
        <div class="grid lg:grid-cols-2">
          <!-- Demo -->
          <div class="space-y-4 border-b border-neutral-800 p-5 lg:border-b-0 lg:border-r">
            <div>
              <p class="mb-2 font-mono text-xs text-neutral-500">category <span class="text-neutral-700">(source signal)</span></p>
              <div class="flex flex-wrap gap-2">
                @for (cat of categories; track cat) {
                  <button
                    (click)="category.set(cat)"
                    type="button"
                    class="rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors"
                    [class]="category() === cat
                      ? 'bg-angular-red text-white'
                      : 'bg-surface-700 text-neutral-400 hover:text-neutral-200'"
                  >{{ cat }}</button>
                }
              </div>
            </div>
            <div>
              <p class="mb-2 font-mono text-xs text-neutral-500">
                selectedItem <span class="text-neutral-700">(linkedSignal — resets on category change)</span>
              </p>
              <div class="flex flex-wrap gap-2">
                @for (item of availableItems(); track item) {
                  <button
                    (click)="selectedItem.set(item)"
                    type="button"
                    class="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
                    [class]="selectedItem() === item
                      ? 'border-blue-500/40 bg-blue-500/15 text-blue-300'
                      : 'border-transparent bg-surface-700 text-neutral-400 hover:text-neutral-200'"
                  >{{ item }}</button>
                }
              </div>
            </div>
            <div class="rounded-lg bg-surface-950 px-4 py-3 font-mono text-xs leading-5">
              <span class="text-neutral-600">category     = </span><span class="text-angular-red">"{{ category() }}"</span><br>
              <span class="text-neutral-600">selectedItem = </span><span class="text-blue-300">"{{ selectedItem() }}"</span>
            </div>
          </div>
          <!-- Code -->
          <pre class="m-0 overflow-auto bg-surface-950 p-5 text-xs font-mono leading-relaxed text-neutral-300">{{ snippets.linkedSignal }}</pre>
        </div>
      </section>

      <!-- ── 5. debounced() — EXPERIMENTAL ─────────────────── -->
      <section class="overflow-hidden rounded-xl border border-neutral-800 bg-surface-800" aria-labelledby="s-debounced">
        <header class="flex items-center gap-3 border-b border-neutral-800 px-5 py-3.5">
          <h2 id="s-debounced" class="font-mono text-sm font-semibold text-neutral-100">debounced()</h2>
          <span class="rounded border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400">EXPERIMENTAL</span>
          <span class="ml-auto hidden text-xs text-neutral-500 sm:block">Delays signal propagation — Resource-based</span>
        </header>
        <div class="grid lg:grid-cols-2">
          <!-- Demo -->
          <div class="space-y-4 border-b border-neutral-800 p-5 lg:border-b-0 lg:border-r">
            <input
              type="text"
              [value]="textInput()"
              (input)="textInput.set($any($event.target).value)"
              placeholder="Type something…"
              class="w-full rounded-lg border border-neutral-700 bg-surface-950 px-4 py-2.5 font-mono text-sm text-neutral-100 placeholder-neutral-600 transition-colors focus:border-angular-red/50 focus:outline-none focus:ring-1 focus:ring-angular-red/30"
              aria-label="Debounced input demo"
            />
            <div class="space-y-3">
              <!-- Immediate -->
              <div class="flex items-start gap-3">
                <span class="shrink-0 rounded bg-surface-700 px-2 py-0.5 font-mono text-[10px] text-neutral-500">immediate</span>
                <code class="break-all font-mono text-sm text-neutral-300">
                  @if (textInput()) { "{{ textInput() }}" }
                  @else { <span class="text-neutral-700">empty</span> }
                </code>
              </div>
              <!-- Debounced -->
              <div class="flex items-start gap-3">
                <span class="shrink-0 rounded bg-surface-700 px-2 py-0.5 font-mono text-[10px]"
                  [class]="debouncedText.isLoading() ? 'text-amber-400' : 'text-neutral-500'">
                  {{ debouncedText.isLoading() ? 'debouncing…' : 'debounced' }}
                </span>
                <code class="break-all font-mono text-sm">
                  @if (debouncedText.isLoading()) {
                    <span class="inline-flex items-center gap-1.5 text-amber-400/70">
                      <svg class="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      waiting 600 ms…
                    </span>
                  } @else if (debouncedText.value()) {
                    <span class="text-neutral-300">"{{ debouncedText.value() }}"</span>
                  } @else {
                    <span class="text-neutral-700">empty</span>
                  }
                </code>
              </div>
            </div>
          </div>
          <!-- Code -->
          <pre class="m-0 overflow-auto bg-surface-950 p-5 text-xs font-mono leading-relaxed text-neutral-300">{{ snippets.debounced }}</pre>
        </div>
      </section>

    </div>
  `,
})
export class Signals {
  // ── signal() ──────────────────────────────────────────────
  protected readonly count = signal(0);
  protected readonly history = signal<number[]>([0]);

  // ── computed() ────────────────────────────────────────────
  protected readonly squared = computed(() => this.count() ** 2);
  protected readonly isEven = computed(() => this.count() % 2 === 0);
  protected readonly sign = computed<'positive' | 'negative' | 'zero'>(() => {
    const n = this.count();
    return n > 0 ? 'positive' : n < 0 ? 'negative' : 'zero';
  });
  protected readonly countColor = computed(() => {
    const n = this.count();
    return n > 0 ? 'text-emerald-400' : n < 0 ? 'text-rose-400' : 'text-neutral-100';
  });

  // ── effect() ──────────────────────────────────────────────
  protected readonly effectLog = signal<string[]>([]);

  // ── linkedSignal() ────────────────────────────────────────
  protected readonly category = signal<Category>('fruits');
  protected readonly availableItems = computed(() => CATALOG[this.category()]);
  protected readonly selectedItem = linkedSignal(() => this.availableItems()[0]);
  protected readonly categories = CATEGORIES;

  // ── debounced() — EXPERIMENTAL ────────────────────────────
  protected readonly textInput = signal('');
  protected readonly debouncedText = debounced(this.textInput, 600);

  protected readonly snippets = {
    signal: `import { signal } from '@angular/core';

const count = signal(0);

count.set(5);               // direct set
count.update(n => n + 1);   // functional update (6)

count()            // read: 6
count.asReadonly() // expose as read-only Signal<number>`,

    computed: `import { computed } from '@angular/core';

// Pure, lazy, memoized — re-runs only when deps change
const squared = computed(() => count() ** 2);
const isEven  = computed(() => count() % 2 === 0);

const sign = computed<'positive'|'negative'|'zero'>(() => {
  const n = count();
  return n > 0 ? 'positive' : n < 0 ? 'negative' : 'zero';
});

// read-only — no .set() or .update()`,

    effect: `import { effect } from '@angular/core';

// Must be called in injection context
// Runs ONCE immediately, then on every dep change
// Only for side effects — never to propagate state

effect(() => {
  console.log('count changed:', count());
  // DOM writes, analytics, localStorage…
});`,

    linkedSignal: `import { linkedSignal } from '@angular/core';

const category = signal<Category>('fruits');
const items    = computed(() => CATALOG[category()]);

// Writable signal that resets when source changes
const selected = linkedSignal(() => items()[0]);

selected.set('Banana');   // manual override — works

// When category changes → selected resets to items()[0]
// computed() would be read-only
// signal()   would never auto-reset`,

    debounced: `// EXPERIMENTAL — API may change
import { debounced } from '@angular/core';

const input   = signal('');
const delayed = debounced(input, 600); // ms

delayed.value()      // Signal<T | undefined>
delayed.isLoading()  // true while timer is running
delayed.status()     // ResourceStatus

// typing → isLoading() = true
// 600ms of silence → value() resolves`,
  };

  constructor() {
    // history effect — tracks count changes
    effect(() => {
      const n = this.count();
      this.history.update(h => {
        if (h[h.length - 1] === n) return h;
        return [...h.slice(-4), n];
      });
    });

    // log effect — demonstrates side-effect behavior
    effect(() => {
      const n = this.count();
      const t = new Date().toLocaleTimeString('en-GB', { hour12: false });
      this.effectLog.update(log => [...log.slice(-9), `[${t}] count = ${n}`]);
    });
  }

  protected increment(): void { this.count.update(n => n + 1); }
  protected decrement(): void { this.count.update(n => n - 1); }
  protected resetCount(): void { this.count.set(0); }
  protected clearEffectLog(): void { this.effectLog.set([]); }
}
