import { Component, computed, resource, signal } from '@angular/core';
import {
  FormField,
  FormRoot,
  debounce,
  email,
  form,
  minLength,
  pattern,
  required,
  requiredError,
  submit,
  validateAsync,
} from '@angular/forms/signals';

interface RegModel {
  username: string;
  email: string;
  password: string;
}

const TAKEN_USERNAMES = ['admin', 'root', 'angular', 'user', 'test'];

@Component({
  selector: 'app-signal-forms',
  imports: [FormRoot, FormField],
  template: `
    <div class="max-w-6xl space-y-8">

      <!-- Header -->
      <div>
        <div class="flex items-center gap-3 mb-1">
          <h1 class="text-2xl font-bold text-neutral-100">Signal Forms</h1>
          <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-angular-red/15 text-angular-red border border-angular-red/25">Stable</span>
        </div>
        <p class="text-neutral-400 text-sm">
          <code class="text-angular-red">form()</code>,
          validators built-in, <code class="text-angular-red">validateAsync()</code>,
          <code class="text-angular-red">debounce()</code>, <code class="text-angular-red">submit()</code>
          — desde <code class="text-neutral-300">@angular/forms/signals</code>
        </p>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">

        <!-- LEFT: Form -->
        <div class="space-y-6">
          <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
            <div class="px-6 py-4 border-b border-neutral-800 bg-surface-800/50">
              <h2 class="text-sm font-semibold text-neutral-200">Registration Form</h2>
              <p class="text-xs text-neutral-500 mt-0.5">Signal Forms &#64;angular/forms/signals</p>
            </div>

            <form
              [formRoot]="regForm"
              (ngSubmit)="onSubmit()"
              class="p-6 space-y-5"
              novalidate
            >

              <!-- Username -->
              <div class="space-y-1.5">
                <label for="username" class="block text-sm font-medium text-neutral-300">
                  Username
                  <span class="text-angular-red ml-0.5">*</span>
                </label>
                <div class="relative">
                  <input
                    id="username"
                    type="text"
                    [formField]="regForm.username"
                    placeholder="e.g. john_doe"
                    class="w-full rounded-lg border px-3 py-2.5 text-sm bg-surface-800 text-neutral-100 placeholder-neutral-600 outline-none transition-colors
                      focus:ring-2 focus:ring-angular-red/30"
                    [class.border-red-500]="regForm.username().touched() && regForm.username().invalid()"
                    [class.border-green-500]="regForm.username().touched() && regForm.username().valid()"
                    [class.border-neutral-700]="!regForm.username().touched() || regForm.username().pending()"
                    [class.border-amber-400]="regForm.username().pending()"
                  />
                  <!-- Pending spinner -->
                  @if (regForm.username().pending()) {
                    <div class="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg class="h-4 w-4 animate-spin text-amber-400" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="31.4" stroke-dashoffset="10"/>
                      </svg>
                    </div>
                  }
                  @if (regForm.username().touched() && regForm.username().valid()) {
                    <div class="absolute right-3 top-1/2 -translate-y-1/2 text-green-400">
                      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                  }
                </div>
                @if (regForm.username().touched() && regForm.username().invalid()) {
                  <div class="space-y-0.5">
                    @for (err of regForm.username().errors(); track $index) {
                      <p class="text-xs text-red-400">{{ err.message ?? err.kind }}</p>
                    }
                  </div>
                }
                @if (regForm.username().pending()) {
                  <p class="text-xs text-amber-400/80">Checking availability…</p>
                }
                <p class="text-xs text-neutral-600">
                  Validators: required · minLength(3) · pattern · debounce(300ms) · validateAsync
                </p>
              </div>

              <!-- Email -->
              <div class="space-y-1.5">
                <label for="email" class="block text-sm font-medium text-neutral-300">
                  Email
                  <span class="text-angular-red ml-0.5">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  [formField]="regForm.email"
                  placeholder="you@example.com"
                  class="w-full rounded-lg border px-3 py-2.5 text-sm bg-surface-800 text-neutral-100 placeholder-neutral-600 outline-none transition-colors
                    focus:ring-2 focus:ring-angular-red/30"
                  [class.border-red-500]="regForm.email().touched() && regForm.email().invalid()"
                  [class.border-green-500]="regForm.email().touched() && regForm.email().valid()"
                  [class.border-neutral-700]="!regForm.email().touched()"
                />
                @if (regForm.email().touched() && regForm.email().invalid()) {
                  @for (err of regForm.email().errors(); track $index) {
                    <p class="text-xs text-red-400">{{ err.message ?? err.kind }}</p>
                  }
                }
                <p class="text-xs text-neutral-600">Validators: required · email</p>
              </div>

              <!-- Password -->
              <div class="space-y-1.5">
                <label for="password" class="block text-sm font-medium text-neutral-300">
                  Password
                  <span class="text-angular-red ml-0.5">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  [formField]="regForm.password"
                  placeholder="Min 8 chars"
                  class="w-full rounded-lg border px-3 py-2.5 text-sm bg-surface-800 text-neutral-100 placeholder-neutral-600 outline-none transition-colors
                    focus:ring-2 focus:ring-angular-red/30"
                  [class.border-red-500]="regForm.password().touched() && regForm.password().invalid()"
                  [class.border-green-500]="regForm.password().touched() && regForm.password().valid()"
                  [class.border-neutral-700]="!regForm.password().touched()"
                />
                @if (regForm.password().touched() && regForm.password().invalid()) {
                  @for (err of regForm.password().errors(); track $index) {
                    <p class="text-xs text-red-400">{{ err.message ?? err.kind }}</p>
                  }
                }
                <!-- Password strength bar -->
                @if (regForm.password().dirty()) {
                  <div class="flex gap-1 mt-1">
                    @for (i of [1,2,3,4]; track i) {
                      <div
                        class="h-1 flex-1 rounded-full transition-colors duration-300"
                        [class.bg-red-500]="i === 1 && passwordStrength() >= 1"
                        [class.bg-amber-500]="i === 2 && passwordStrength() >= 2"
                        [class.bg-yellow-400]="i === 3 && passwordStrength() >= 3"
                        [class.bg-green-500]="i === 4 && passwordStrength() >= 4"
                        [class.bg-surface-700]="passwordStrength() < i"
                      ></div>
                    }
                  </div>
                }
                <p class="text-xs text-neutral-600">Validators: required · minLength(8) · pattern (uppercase + number)</p>
              </div>

              <!-- Submit button -->
              <div class="pt-2">
                <button
                  type="submit"
                  [disabled]="regForm().submitting()"
                  class="w-full rounded-lg bg-angular-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-angular-dark-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  @if (regForm().submitting()) {
                    <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="31.4" stroke-dashoffset="10"/>
                    </svg>
                    Registering…
                  } @else {
                    Register
                  }
                </button>
              </div>

              <!-- Submit result -->
              @if (submitStatus() === 'success') {
                <div class="rounded-lg border border-green-800/40 bg-green-900/10 px-4 py-3 text-sm text-green-400 flex items-center gap-2">
                  <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Registration successful! Welcome, <strong>{{ regForm.username().value() }}</strong>.
                </div>
              }
              @if (submitStatus() === 'error') {
                <div class="rounded-lg border border-red-800/40 bg-red-900/10 px-4 py-3 text-sm text-red-400">
                  {{ submitError() }}
                </div>
              }

            </form>
          </div>
        </div>

        <!-- RIGHT: Live state + Code -->
        <div class="space-y-5">

          <!-- Live form state -->
          <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
            <div class="px-4 py-3 border-b border-neutral-800 bg-surface-800/50">
              <h3 class="text-xs font-semibold uppercase tracking-wider text-neutral-500">Live Form State</h3>
            </div>
            <div class="p-4 grid grid-cols-2 gap-3 text-xs">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-neutral-500">valid</span>
                  <span [class.text-green-400]="regForm().valid()" [class.text-red-400]="!regForm().valid()">
                    {{ regForm().valid() }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-neutral-500">invalid</span>
                  <span [class.text-red-400]="regForm().invalid()" [class.text-neutral-400]="!regForm().invalid()">
                    {{ regForm().invalid() }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-neutral-500">dirty</span>
                  <span [class.text-amber-400]="regForm().dirty()" [class.text-neutral-400]="!regForm().dirty()">
                    {{ regForm().dirty() }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-neutral-500">touched</span>
                  <span [class.text-blue-400]="regForm().touched()" [class.text-neutral-400]="!regForm().touched()">
                    {{ regForm().touched() }}
                  </span>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-neutral-500">pending</span>
                  <span [class.text-amber-400]="regForm().pending()" [class.text-neutral-400]="!regForm().pending()">
                    {{ regForm().pending() }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-neutral-500">submitting</span>
                  <span [class.text-blue-400]="regForm().submitting()" [class.text-neutral-400]="!regForm().submitting()">
                    {{ regForm().submitting() }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-neutral-500">submit</span>
                  <span class="text-neutral-300">{{ submitStatus() }}</span>
                </div>
              </div>
            </div>
            <!-- JSON model -->
            <div class="border-t border-neutral-800 px-4 py-3">
              <p class="text-xs text-neutral-600 mb-2 font-mono uppercase tracking-wider">model value</p>
              <pre class="text-xs text-neutral-300 font-mono leading-relaxed">{{ modelJson() }}</pre>
            </div>
          </div>

          <!-- Per-field state -->
          <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
            <div class="px-4 py-3 border-b border-neutral-800 bg-surface-800/50">
              <h3 class="text-xs font-semibold uppercase tracking-wider text-neutral-500">Per-field State</h3>
            </div>
            <div class="divide-y divide-neutral-800 text-xs font-mono">
              @for (f of fieldStates(); track f.name) {
                <div class="px-4 py-2.5 flex items-center gap-3">
                  <span class="w-20 text-neutral-400 shrink-0">{{ f.name }}</span>
                  <div class="flex flex-wrap gap-1.5">
                    @if (f.valid) {
                      <span class="rounded px-1.5 py-0.5 text-[10px] font-semibold bg-green-900/30 text-green-400 border border-green-800/30">valid</span>
                    }
                    @if (f.invalid) {
                      <span class="rounded px-1.5 py-0.5 text-[10px] font-semibold bg-red-900/30 text-red-400 border border-red-800/30">invalid</span>
                    }
                    @if (f.pending) {
                      <span class="rounded px-1.5 py-0.5 text-[10px] font-semibold bg-amber-900/30 text-amber-400 border border-amber-800/30">pending</span>
                    }
                    @if (f.dirty) {
                      <span class="rounded px-1.5 py-0.5 text-[10px] font-semibold bg-blue-900/30 text-blue-400 border border-blue-800/30">dirty</span>
                    }
                    @if (f.touched) {
                      <span class="rounded px-1.5 py-0.5 text-[10px] font-semibold bg-purple-900/30 text-purple-400 border border-purple-800/30">touched</span>
                    }
                  </div>
                  @if (f.errorCount > 0) {
                    <span class="ml-auto text-red-400/70">{{ f.errorCount }} error{{ f.errorCount > 1 ? 's' : '' }}</span>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Code snippet -->
          <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
            <div class="px-4 py-3 border-b border-neutral-800 bg-surface-800/50 flex items-center justify-between">
              <h3 class="text-xs font-semibold uppercase tracking-wider text-neutral-500">Signal Forms API</h3>
              <span class="text-[10px] text-neutral-600 font-mono">&#64;angular/forms/signals</span>
            </div>
            <pre class="overflow-x-auto text-xs leading-relaxed p-4 text-neutral-300 font-mono">{{ snippet }}</pre>
          </div>

        </div>
      </div>

      <!-- validateAsync callout -->
      <div class="rounded-xl border border-amber-800/30 bg-amber-900/5 px-5 py-4 flex gap-3">
        <div class="shrink-0 mt-0.5">
          <svg class="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 110 20A10 10 0 0112 2zm0 5a1 1 0 00-1 1v5a1 1 0 002 0V8a1 1 0 00-1-1zm0 9a1 1 0 100 2 1 1 0 000-2z"/>
          </svg>
        </div>
        <div class="text-xs text-neutral-400 leading-relaxed">
          <strong class="text-amber-400">validateAsync</strong> — the username field uses
          <code class="text-neutral-300">validateAsync()</code> with a simulated 700ms API call.
          Blocked usernames: <strong class="text-neutral-300">{{ takenList }}</strong>.
          The <code class="text-neutral-300">debounce: 500</code> option inside
          <code class="text-neutral-300">validateAsync</code> waits 500ms after each keystroke before firing.
        </div>
      </div>

    </div>
  `,
})
export class SignalForms {
  protected readonly takenList = TAKEN_USERNAMES.join(', ');

  protected readonly submitStatus = signal<'idle' | 'pending' | 'success' | 'error'>('idle');
  protected readonly submitError = signal('');

  private readonly _model = signal<RegModel>({ username: '', email: '', password: '' });

  protected readonly regForm = form(this._model, (fields) => {
    // Username
    required(fields.username);
    minLength(fields.username, 3, { message: 'Must be at least 3 characters' });
    pattern(fields.username, /^[a-z0-9_]+$/i, { message: 'Only letters, numbers, and underscores' });
    debounce(fields.username, 300);
    validateAsync(fields.username, {
      params: ({ value }) => value(),
      debounce: 500,
      factory: (paramsSignal) =>
        resource<{ available: boolean } | undefined, string | undefined>({
          params: () => {
            const v = paramsSignal();
            return v && v.length >= 3 ? v : undefined;
          },
          loader: async ({ params: req, abortSignal }) => {
            if (!req) return undefined;
            await new Promise<void>((res, rej) => {
              const t = setTimeout(res, 700);
              abortSignal.addEventListener('abort', () => {
                clearTimeout(t);
                rej(new Error('aborted'));
              });
            }).catch(() => undefined);
            if (abortSignal.aborted) return undefined;
            return { available: !TAKEN_USERNAMES.includes(req.toLowerCase()) };
          },
        }),
      onSuccess: (result) => {
        const r = result as { available: boolean } | undefined;
        if (!r || r.available) return null;
        return requiredError({ message: `Username "${this._model().username}" is already taken` });
      },
      onError: () => null,
    });

    // Email
    required(fields.email, { message: 'Email is required' });
    email(fields.email, { message: 'Enter a valid email address' });

    // Password
    required(fields.password, { message: 'Password is required' });
    minLength(fields.password, 8, { message: 'Must be at least 8 characters' });
    pattern(fields.password, /(?=.*[A-Z])(?=.*[0-9])/, {
      message: 'Must include at least one uppercase letter and one number',
    });
  });

  protected readonly passwordStrength = computed(() => {
    const pwd = this.regForm.password().value();
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  });

  protected readonly modelJson = computed(() =>
    JSON.stringify(this._model(), null, 2)
  );

  protected readonly fieldStates = computed(() => [
    {
      name: 'username',
      valid: this.regForm.username().valid(),
      invalid: this.regForm.username().invalid(),
      pending: this.regForm.username().pending(),
      dirty: this.regForm.username().dirty(),
      touched: this.regForm.username().touched(),
      errorCount: this.regForm.username().errors().length,
    },
    {
      name: 'email',
      valid: this.regForm.email().valid(),
      invalid: this.regForm.email().invalid(),
      pending: this.regForm.email().pending(),
      dirty: this.regForm.email().dirty(),
      touched: this.regForm.email().touched(),
      errorCount: this.regForm.email().errors().length,
    },
    {
      name: 'password',
      valid: this.regForm.password().valid(),
      invalid: this.regForm.password().invalid(),
      pending: this.regForm.password().pending(),
      dirty: this.regForm.password().dirty(),
      touched: this.regForm.password().touched(),
      errorCount: this.regForm.password().errors().length,
    },
  ]);

  protected async onSubmit(): Promise<void> {
    this.submitStatus.set('idle');
    this.submitError.set('');

    const success = await submit(this.regForm, {
      action: async () => {
        this.submitStatus.set('pending');
        await new Promise(r => setTimeout(r, 1500));
        this.submitStatus.set('success');
        return null;
      },
      onInvalid: () => {
        this.submitStatus.set('error');
        this.submitError.set('Please fix the validation errors above.');
      },
    });

    if (!success && this.submitStatus() !== 'error') {
      this.submitStatus.set('error');
      this.submitError.set('Submission was blocked by pending validators. Please wait and try again.');
    }
  }

  protected readonly snippet = `// 1. Define the model
const _model = signal<RegModel>({ username: '', email: '', password: '' });

// 2. Create the form with validators
const regForm = form(_model, (fields) => {
  required(fields.username);
  minLength(fields.username, 3);
  pattern(fields.username, /^[a-z0-9_]+$/i);
  debounce(fields.username, 300);       // debounce native input 300ms

  validateAsync(fields.username, {      // async username availability
    params: ({ value }) => value(),
    debounce: 500,                      // wait 500ms before firing
    factory: (params) => resource({ ... }),
    onSuccess: (result) => result?.available ? null : requiredError({ message: 'Taken' }),
    onError: () => null,
  });

  required(fields.email);
  email(fields.email);

  required(fields.password);
  minLength(fields.password, 8);
  pattern(fields.password, /(?=.*[A-Z])(?=.*[0-9])/);
});

// 3. Submit
await submit(regForm, {
  action: async (fieldTree) => {
    await api.register(fieldTree().value());
    return null; // success
  },
});

// 4. Template directives
// <form [formRoot]="regForm" (ngSubmit)="onSubmit()">
//   <input [formField]="regForm.username" />
//   @if (regForm.username().invalid()) { ... }
// </form>`;
}
