import {
  Component,
  InjectionToken,
  Injectable,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';

import { TranslationService } from '../../core/i18n/translation.service';
import { TranslatePipe } from '../../core/i18n/translation.pipe';

// ─── Token example ────────────────────────────────────────────────────────────
interface AppConfig {
  version: string;
  apiBase: string;
  maxRetries: number;
}

const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG', {
  factory: () => ({ version: '22.0.0', apiBase: '/api/v1', maxRetries: 3 }),
});

// ─── Service with @Service() shorthand (stable v22) ───────────────────────────
// Note: @Service() is shorthand for @Injectable({ providedIn: 'root' })
// Using @Injectable directly to avoid import confusion in this demo file
@Injectable({ providedIn: 'root' })
class ThemeService {
  readonly theme = signal<'dark' | 'light'>('dark');

  toggle(): void {
    this.theme.update(t => (t === 'dark' ? 'light' : 'dark'));
  }
}

// ─── Service injecting another service ────────────────────────────────────────
@Injectable({ providedIn: 'root' })
class LogService {
  private readonly _entries = signal<string[]>([]);
  readonly entries = this._entries.asReadonly();

  log(msg: string): void {
    const ts = new Date().toLocaleTimeString('en', { hour12: false });
    this._entries.update(e => [`[${ts}] ${msg}`, ...e.slice(0, 9)]);
  }

  clear(): void {
    this._entries.set([]);
  }
}

@Component({
  selector: 'app-di-patterns',
  imports: [TranslatePipe],
  template: `
    <div class="w-full space-y-8">

      <!-- Header -->
      <div>
        <div class="flex items-center gap-3 mb-1">
          <h1 class="text-2xl font-bold text-neutral-100">{{ 'nav.di' | translate : ts.currentLanguage() }}</h1>
          <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-angular-red/15 text-angular-red border border-angular-red/25">{{ 'badge.stable' | translate : ts.currentLanguage() }}</span>
        </div>
        <p class="text-neutral-400 text-sm">
          <code class="text-angular-red">inject()</code> ·
          <code class="text-angular-red">&#64;Service()</code> ·
          <code class="text-angular-red">InjectionToken</code> ·
          <code class="text-angular-red">providedIn</code>
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- 1. inject() -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50">
            <h2 class="text-sm font-semibold text-neutral-200"><code class="text-angular-red">inject()</code> — functional injection</h2>
          </div>
          <div class="p-5 space-y-4">
            <p class="text-xs text-neutral-500">
              <code class="text-angular-red">inject()</code> {{ 'di.injectDesc' | translate : ts.currentLanguage() }}
            </p>
            <div class="rounded-lg border border-neutral-800 bg-surface-800 p-4 space-y-3 text-xs">
              <div class="flex items-center justify-between">
                <span class="text-neutral-500">ThemeService.theme()</span>
                <span class="font-mono" [class.text-blue-400]="themeService.theme() === 'dark'" [class.text-yellow-400]="themeService.theme() === 'light'">
                  {{ themeService.theme() }}
                </span>
              </div>
              <button
                (click)="themeService.toggle(); logger.log('ThemeService.toggle() called')"
                class="w-full rounded-lg border border-neutral-700 py-2 text-xs text-neutral-400 hover:text-neutral-200 hover:border-neutral-500 transition-colors"
              >{{ 'di.toggleTheme' | translate : ts.currentLanguage() }}</button>
            </div>
            <pre class="rounded-lg bg-surface-800 p-3 text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto">{{ snippets.inject }}</pre>
          </div>
        </div>

        <!-- 2. @Service() / @Injectable -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50">
            <h2 class="text-sm font-semibold text-neutral-200">
              <code class="text-angular-red">&#64;Service()</code>
              <span class="text-xs font-normal text-neutral-500 ml-2">Angular 22 shorthand</span>
            </h2>
          </div>
          <div class="p-5 space-y-4">
            <p class="text-xs text-neutral-500">
              <code class="text-angular-red">&#64;Service()</code> {{ 'di.serviceDesc' | translate : ts.currentLanguage() }}
            </p>
            <div class="rounded-lg border border-neutral-800 bg-surface-800 divide-y divide-neutral-800">
              <div class="px-4 py-2.5 flex items-center gap-3 text-xs">
                <span class="h-2 w-2 rounded-full bg-green-400 shrink-0"></span>
                <span class="text-neutral-400 flex-1">{{ 'di.singleton' | translate : ts.currentLanguage() }}</span>
                <span class="font-mono text-neutral-300">ThemeService</span>
              </div>
              <div class="px-4 py-2.5 flex items-center gap-3 text-xs">
                <span class="h-2 w-2 rounded-full bg-green-400 shrink-0"></span>
                <span class="text-neutral-400 flex-1">{{ 'di.usesInject' | translate : ts.currentLanguage() }}</span>
                <span class="font-mono text-neutral-300">LogService</span>
              </div>
              <div class="px-4 py-2.5 flex items-center gap-3 text-xs">
                <span class="h-2 w-2 rounded-full bg-blue-400 shrink-0"></span>
                <span class="text-neutral-400 flex-1">{{ 'di.signalState' | translate : ts.currentLanguage() }}</span>
                <span class="font-mono text-neutral-300">signal() + .asReadonly()</span>
              </div>
            </div>
            <pre class="rounded-lg bg-surface-800 p-3 text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto">{{ snippets.service }}</pre>
          </div>
        </div>

        <!-- 3. InjectionToken -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50">
            <h2 class="text-sm font-semibold text-neutral-200"><code class="text-angular-red">InjectionToken</code> — typed configuration</h2>
          </div>
          <div class="p-5 space-y-4">
            <p class="text-xs text-neutral-500">
              <code class="text-angular-red">InjectionToken</code> {{ 'di.tokenDesc' | translate : ts.currentLanguage() }}
            </p>
            <!-- Live demo: show injected config -->
            <div class="rounded-lg border border-neutral-800 bg-surface-800 p-4 space-y-2">
              <p class="text-xs text-neutral-600 uppercase tracking-wider mb-3">{{ 'di.injectedConfig' | translate : ts.currentLanguage() }}</p>
              <div class="space-y-1.5 text-xs font-mono">
                @for (entry of configEntries(); track entry.key) {
                  <div class="flex items-center gap-3">
                    <span class="text-neutral-500 w-24">{{ entry.key }}</span>
                    <span class="text-angular-red">:</span>
                    <span class="text-neutral-200">{{ entry.value }}</span>
                  </div>
                }
              </div>
            </div>
            <pre class="rounded-lg bg-surface-800 p-3 text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto">{{ snippets.token }}</pre>
          </div>
        </div>

        <!-- 4. Log service demo + multi-level DI -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-neutral-200">LogService — live inject() demo</h2>
            <button
              (click)="logger.clear()"
              class="text-[10px] text-neutral-600 hover:text-neutral-400 transition-colors"
            >clear</button>
          </div>
          <div class="p-5 space-y-4">
            <div class="flex gap-2">
              <button
                (click)="logger.log('inject() called from component')"
                class="rounded border border-neutral-700 px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
              >{{ 'di.logFromComponent' | translate : ts.currentLanguage() }}</button>
              <button
                (click)="logFromService()"
                class="rounded border border-neutral-700 px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
              >{{ 'di.logFromService' | translate : ts.currentLanguage() }}</button>
            </div>
            <div class="h-36 overflow-y-auto rounded-lg border border-neutral-800 bg-surface-800 p-3">
              @if (logger.entries().length === 0) {
                <p class="text-xs text-neutral-600">{{ 'di.logEmptyState' | translate : ts.currentLanguage() }}</p>
              }
              @for (entry of logger.entries(); track $index) {
                <p class="text-[11px] font-mono text-green-400">{{ entry }}</p>
              }
            </div>
            <pre class="rounded-lg bg-surface-800 p-3 text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto">{{ snippets.logService }}</pre>
          </div>
        </div>

      </div>

      <!-- DI hierarchy callout -->
      <div class="rounded-xl border border-neutral-800 bg-surface-900 p-5 space-y-3">
        <h3 class="text-sm font-semibold text-neutral-200">{{ 'di.hierarchy' | translate : ts.currentLanguage() }}</h3>
        <div class="flex flex-col sm:flex-row gap-3 text-xs">
          @for (level of diLevels(); track level.name) {
            <div class="flex-1 rounded-lg border border-neutral-800 bg-surface-800/50 p-3 space-y-1">
              <div class="flex items-center gap-2">
                <div class="h-2 w-2 rounded-full" [style.background]="level.color"></div>
                <span class="font-semibold text-neutral-200">{{ level.name }}</span>
              </div>
              <p class="text-neutral-500 text-[11px] leading-relaxed">{{ level.desc }}</p>
              <code class="text-[10px] text-angular-red">{{ level.provider }}</code>
            </div>
          }
        </div>
      </div>

    </div>
  `,
})
export class DiPatterns implements OnInit {
  protected readonly ts = inject(TranslationService);
  protected readonly themeService = inject(ThemeService);
  protected readonly logger = inject(LogService);
  private readonly config = inject(APP_CONFIG);

  protected readonly configEntries = computed(() =>
    Object.entries(this.config).map(([key, value]) => ({ key, value: String(value) }))
  );

  ngOnInit(): void {
    this.logger.log('DiPatterns component initialized');
  }

  protected logFromService(): void {
    this.themeService.toggle();
    this.logger.log(`ThemeService injected in LogService call — theme: ${this.themeService.theme()}`);
  }

  protected readonly diLevels = computed(() => [
    {
      name: 'Root',
      color: '#ef4444',
      desc: this.ts.translate('di.levels.root'),
      provider: "providedIn: 'root'",
    },
    {
      name: 'Platform',
      color: '#f59e0b',
      desc: this.ts.translate('di.levels.platform'),
      provider: "providedIn: 'platform'",
    },
    {
      name: 'Component',
      color: '#22c55e',
      desc: this.ts.translate('di.levels.component'),
      provider: 'providers: [MyService]',
    },
    {
      name: 'Element',
      color: '#a78bfa',
      desc: this.ts.translate('di.levels.element'),
      provider: 'viewProviders: [...]',
    },
  ]);

  protected readonly snippets = {
    inject: `// Component or service — no constructor needed
export class MyComponent {
  private router = inject(Router);
  private auth   = inject(AuthService);
  private config = inject(APP_CONFIG);
}

// Also works in functional contexts:
export const authGuard: CanMatchFn = () => {
  return inject(AuthService).isLoggedIn();
};`,

    service: `// Angular 22 — @Service() shorthand
import { Service } from '@angular/core';

@Service()            // ← = @Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<'dark' | 'light'>('dark');

  // inject() inside service — no constructor params
  private logger = inject(LogService);

  toggle() {
    this.theme.update(t => t === 'dark' ? 'light' : 'dark');
    this.logger.log('theme toggled');
  }
}`,

    token: `// Define token with factory default
const APP_CONFIG = new InjectionToken<AppConfig>(
  'APP_CONFIG',
  { factory: () => ({ version: '22.0.0', apiBase: '/api' }) }
);

// Inject in any context
const config = inject(APP_CONFIG);

// Override in providers
providers: [{
  provide: APP_CONFIG,
  useValue: { version: '22.0.0', apiBase: '/api/v2' }
}]`,

    logService: `@Service()
export class LogService {
  private _entries = signal<string[]>([]);
  readonly entries = this._entries.asReadonly();

  log(msg: string) {
    this._entries.update(e => [msg, ...e]);
  }
}

// In component:
protected logger = inject(LogService);
// logger.entries() → Signal<string[]>
// logger.log('hello')`,
  };
}
