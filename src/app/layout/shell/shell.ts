import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LayoutService } from '../../core/services/layout.service';
import { Sidebar } from '../sidebar/sidebar';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Sidebar, Navbar],
  template: `
    <div class="flex h-screen overflow-hidden bg-surface-900">
      @if (layout.mobileSidebarOpen()) {
        <div
          class="fixed inset-0 z-40 bg-black/60 lg:hidden"
          (click)="layout.closeMobileSidebar()"
          aria-hidden="true"
        ></div>
      }

      <app-sidebar />

      <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
        <app-navbar />
        <main class="flex-1 overflow-y-auto p-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class Shell {
  protected readonly layout = inject(LayoutService);
}
