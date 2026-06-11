<div align="center">

[![EN](https://img.shields.io/badge/EN-English-aaa?style=for-the-badge)](README.md)&nbsp;&nbsp;![ES](https://img.shields.io/badge/ES-Español-2ea44f?style=for-the-badge)

</div>

# Angular 22 Showcase

Aplicación interactiva de playground y referencia que cubre las principales características de **Angular 22**. Cada sección demuestra una API o patrón específico con ejemplos en vivo — primitivas de signals, Resource API, Signal Forms, accesibilidad ARIA, y más.

<p align="center">
  <a href="https://angular.dev"><img src="https://img.shields.io/badge/Angular-v22-DD0031?style=flat-square&logo=angular&logoColor=white" alt="Angular v22"></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 6"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-24%2B-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js 24+"></a>
  <a href="https://pnpm.io"><img src="https://img.shields.io/badge/pnpm-11-F69220?style=flat-square&logo=pnpm&logoColor=white" alt="pnpm 11"></a>
  <img src="https://img.shields.io/badge/tests-57%20passing-6E9F18?style=flat-square&logo=vitest&logoColor=white" alt="57 tests en verde">
</p>
<p align="center">
  <img src="https://img.shields.io/badge/Windows-compatible-0078D4?style=flat-square&logo=windows&logoColor=white" alt="Windows">
  <img src="https://img.shields.io/badge/macOS-compatible-000000?style=flat-square&logo=apple&logoColor=white" alt="macOS">
  <img src="https://img.shields.io/badge/Linux-compatible-FCC624?style=flat-square&logo=linux&logoColor=black" alt="Linux">
</p>
<p align="center">
  <a href="https://github.com/issedgar"><img src="https://img.shields.io/badge/autor-issedgar-181717?style=flat-square&logo=github&logoColor=white" alt="autor issedgar"></a>
</p>

---

## Primeros pasos

**Requisitos previos:** Node.js ≥ 24.16.0 y pnpm ≥ 11.5.3.

```powershell
# 1. Clonar el repositorio
git clone <repo-url>
cd angular-22-app

# 2. Instalar dependencias
pnpm install

# 3. Iniciar el servidor de desarrollo
pnpm start
```

Abre `http://localhost:4200` en el navegador. La app se reconstruye automáticamente al modificar archivos.

> Si no tienes pnpm instalado: `npm install -g pnpm`  
> Si no tienes la versión correcta de Node: `nvm install 24 && nvm use 24`

---

## Capturas de pantalla

| Dashboard (oscuro) | Dashboard (claro) |
|---|---|
| ![Dashboard oscuro](docs/screenshots/new-dashboard-dark.png) | ![Dashboard claro](docs/screenshots/new-dashboard-light.png) |

| Data Explorer | Detalle Pokémon |
|---|---|
| ![Data Explorer](docs/screenshots/new-data-explorer-dark.png) | ![Detalle Pokémon](docs/screenshots/new-pokemon-detail-light.png) |

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Angular 22 |
| Lenguaje | TypeScript 6 (strict) |
| Estilos | Tailwind CSS 4 |
| Reactividad | Angular Signals — `signal()`, `computed()`, `linkedSignal()`, `debounced()` |
| Datos asíncronos | `resource()`, `rxResource()`, `httpResource()` |
| Formularios | Signal Forms (nuevo en v22) · Reactive Forms |
| i18n | Traducciones JSON en runtime — EN / ES |
| Routing | Angular Router con rutas lazy-loaded |
| Accesibilidad | `@angular/aria` v22 |
| Testing | Vitest + jsdom |
| Gestor de paquetes | pnpm 11.5.3 |
| Node.js | ≥ 24.16.0 |

---

## Secciones

| Ruta | Sección | Descripción |
|---|---|---|
| `/` | Dashboard | Hero, estadísticas, tarjetas de features con filtro |
| `/data-explorer` | Data Explorer | Explorador PokéAPI — paginación, búsqueda, vista detalle |
| `/signals` | Signals | `signal()`, `computed()`, `effect()`, `linkedSignal()`, `debounced()` |
| `/resources` | Resource API | `resource()`, `rxResource()`, `httpResource()`, ciclo de estados |
| `/signal-forms` | Signal Forms | API de formularios Angular 22 — validadores, async, estado de envío |
| `/reactive-forms` | Reactive Forms | `FormGroup`, validación cruzada, `FormArray`, `valueChanges → toSignal()` |
| `/templates` | Template Syntax | `@if`, `@for`, `@switch`, `@defer`, `@let` |
| `/router` | Router | `RouterLink`, `withComponentInputBinding()`, guards, `toSignal(events)` |
| `/di` | Inyección de dependencias | `inject()`, `InjectionToken`, `@Injectable`, factory defaults |
| `/aria` | ARIA / Accesibilidad | `AccordionGroup`, `Tabs`, `Listbox`, live regions |
| `/components-lab` | Components Lab | Botones, Badges, Cards, sistema de Toasts, Data table |
| `/performance` | Performance | `OnPush`, `input()` + `effect()`, `track`, pure pipes |

---

## Características

- **Tema claro / oscuro** — toggle en la navbar; preferencia persistida en `localStorage`.
- **6 presets de color primario** — Angular Red, Blue, Violet, Emerald, Amber, Cyan; aplicados en runtime vía CSS custom properties.
- **i18n EN / ES** — traducciones JSON en runtime con fallback automático a inglés.
- **Completamente lazy-loaded** — cada ruta de feature es un componente standalone cargado bajo demanda.
- **57 tests unitarios** — Vitest + jsdom cubriendo signals, reactive forms y components lab.
- **WCAG AA** — HTML semántico, focus states visibles, patrones ARIA vía `@angular/aria`.

---

## Comandos

```powershell
pnpm start                              # servidor de desarrollo
pnpm build                             # build de producción → dist/
pnpm test                              # ejecutar tests Vitest

pnpm ng generate component <name>      # generar componente standalone
pnpm ng generate service <name>        # generar servicio
pnpm ng generate guard <name>          # generar guard
```

> `angular.json` contiene `"packageManager": "npm"` como artefacto de configuración de Angular CLI.  
> El lockfile del proyecto es `pnpm-lock.yaml` — usar siempre pnpm.

---

## Estructura del proyecto

```
src/
  main.ts                   # punto de entrada bootstrapApplication
  styles.css                # estilos globales — @import 'tailwindcss'
  app/
    app.ts                  # componente raíz
    app.config.ts           # ApplicationConfig, APP_INITIALIZER
    app.routes.ts           # rutas lazy de nivel superior
    core/
      i18n/                 # TranslationService, TranslatePipe, language model
      models/               # tipos de dominio compartidos
      services/             # AppearanceService, LayoutService
    features/
      dashboard/
      data-explorer/
      signals/
      signal-forms/
      reactive-forms/
      resources/
      templates/
      router-demo/
      di-patterns/
      aria-accessibility/
      components-lab/
      performance/
    layout/
      shell/                # shell con sidebar + navbar
      navbar/
      sidebar/
public/
  assets/i18n/
    en.json                 # traducciones en inglés
    es.json                 # traducciones en español
```

---

## Notas técnicas Angular 22

- `resource()` usa `params:` (no `request:`); el loader recibe `{ params, abortSignal, previous }`.
- `rxResource()` usa `stream:` (no `loader:`) para la factory Observable.
- `ResourceStatus` es un union string — `'idle' | 'loading' | 'reloading' | 'resolved' | 'error' | 'local'`.
- `debounced()` es una primitiva de signal de primera clase en Angular 22.
- `@angular/aria` v22 — `AccordionPanel` expone un signal `visible()`.
- Las variables CSS de Tailwind v4 son custom properties en runtime; los colores se pueden cambiar vía `document.documentElement.style.setProperty`.
- `[data-theme="light"]` en `styles.css` invierte la escala neutral para que las clases dark-mode funcionen en modo claro.
