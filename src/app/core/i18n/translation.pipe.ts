import { Pipe, PipeTransform, inject } from '@angular/core';

import { TranslationService } from './translation.service';

/**
 * Pure pipe. Pass `ts.currentLanguage()` as the second arg so Angular
 * invalidates the result when the language signal changes.
 *
 * Usage: {{ 'nav.dashboard' | translate : ts.currentLanguage() }}
 */
@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform {
  private readonly ts = inject(TranslationService);

  transform(key: string, _lang?: string): string {
    return this.ts.translate(key);
  }
}
