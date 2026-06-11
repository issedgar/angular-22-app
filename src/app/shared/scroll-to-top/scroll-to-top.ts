import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-scroll-to-top',
  template: `
    @if (visible()) {
      <!-- Mobile: pill pegado al borde derecho -->
      <button
        (click)="scrollToTop()"
        type="button"
        aria-label="Volver al inicio"
        class="sm:hidden fixed right-0 top-1/2 -translate-y-1/2 z-50
               flex items-center justify-center
               h-10 w-8 rounded-l-lg
               text-white shadow-lg
               transition-all duration-300
               hover:w-10 active:scale-95"
        style="background: color-mix(in srgb, var(--color-angular-red) 70%, transparent); backdrop-filter: blur(4px);"
      >
        <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
          <path d="M5 15l7-7 7 7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Desktop: FAB circular esquina inferior derecha -->
      <button
        (click)="scrollToTop()"
        type="button"
        aria-label="Volver al inicio"
        class="hidden sm:flex fixed bottom-6 right-6 z-50
               h-12 w-12 rounded-full
               items-center justify-center
               text-white shadow-lg
               transition-all duration-300
               hover:scale-110 active:scale-95"
        style="background: color-mix(in srgb, var(--color-angular-red) 70%, transparent); backdrop-filter: blur(4px);"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
          <path d="M5 15l7-7 7 7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    }
  `,
})
export class ScrollToTop {
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly visible = signal(false);

  constructor() {
    afterNextRender(() => {
      const container = this.doc.getElementById('main-content');
      if (!container) return;

      const onScroll = () => this.visible.set(container.scrollTop > 300);
      container.addEventListener('scroll', onScroll, { passive: true });

      this.destroyRef.onDestroy(() => container.removeEventListener('scroll', onScroll));
    });
  }

  protected scrollToTop(): void {
    this.doc.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
