import { APP_INITIALIZER, ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { TranslationService } from './core/i18n/translation.service';
import { AppearanceService } from './core/services/appearance.service';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const ts = inject(TranslationService);
        const appearance = inject(AppearanceService);
        return async () => {
          appearance.initialize();
          await ts.initialize();
        };
      },
      multi: true,
    },
  ],
};
