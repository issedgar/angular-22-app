import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell').then(m => m.Shell),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
        title: 'Dashboard',
      },
      {
        path: 'data-explorer',
        loadComponent: () => import('./features/data-explorer/data-explorer').then(m => m.DataExplorer),
        title: 'Data Explorer',
      },
      {
        path: 'data-explorer/:name',
        loadComponent: () => import('./features/data-explorer/pokemon-detail/pokemon-detail').then(m => m.PokemonDetail),
        title: 'Pokémon Detail',
      },
      {
        path: 'signals',
        loadComponent: () => import('./features/signals/signals').then(m => m.Signals),
        title: 'Signals',
      },
      {
        path: 'signal-forms',
        loadComponent: () => import('./features/signal-forms/signal-forms').then(m => m.SignalForms),
        title: 'Signal Forms',
      },
      {
        path: 'reactive-forms',
        loadComponent: () => import('./features/reactive-forms/reactive-forms').then(m => m.ReactiveForms),
        title: 'Reactive Forms',
      },
      {
        path: 'resources',
        loadComponent: () => import('./features/resources/resources').then(m => m.Resources),
        title: 'Resource API',
      },
      {
        path: 'templates',
        loadComponent: () => import('./features/templates/templates').then(m => m.Templates),
        title: 'Template Syntax',
      },
      {
        path: 'router',
        loadComponent: () => import('./features/router-demo/router-demo').then(m => m.RouterDemo),
        title: 'Router',
      },
      {
        path: 'di',
        loadComponent: () => import('./features/di-patterns/di-patterns').then(m => m.DiPatterns),
        title: 'Dependency Injection',
      },
      {
        path: 'aria',
        loadComponent: () => import('./features/aria-accessibility/aria-accessibility').then(m => m.AriaAccessibility),
        title: 'ARIA / Accessibility',
      },
      {
        path: 'components-lab',
        loadComponent: () => import('./features/components-lab/components-lab').then(m => m.ComponentsLab),
        title: 'Components Lab',
      },
      {
        path: 'performance',
        loadComponent: () => import('./features/performance/performance').then(m => m.Performance),
        title: 'Performance',
      },
    ],
  },
];
