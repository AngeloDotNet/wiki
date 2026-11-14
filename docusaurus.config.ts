// Loads the global typings of the classic theme (@theme/Layout props, theme config). They were
// loaded through the preset before; without this reference tsc uses the generic declaration.
/// <reference types="@docusaurus/theme-classic" />
import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import {wikis} from './src/data/wikis';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Versione x.y.z mostrata nel footer. Se la CI passa APP_VERSION (tag di rilascio X.Y.Z, senza «v»; un prefisso «v» eventuale è tollerato)
// vince quella; un valore che non sia esattamente X.Y.Z viene scartato. Altrimenti si usa VERSION,
// aggiornato dopo ogni commit da scripts/bump-version.mjs.
const tagVersion = (process.env.APP_VERSION ?? '').trim().replace(/^v/, '');
const appVersion = /^\d+\.\d+\.\d+$/.test(tagVersion)
  ? tagVersion
  : readFileSync(resolve(process.cwd(), 'VERSION'), 'utf8').trim();

// La data di ultimo aggiornamento si mostra quando è disponibile in uno dei due modi:
// - .git presente (build locale): Docusaurus legge la cronologia git;
// - last-update.json presente (workflow): le date sono già nel front matter (scripts/inject-last-update.mjs).
// Il container non ha .git: senza il file del workflow la data non viene mostrata.
const lastUpdateAvailable =
  existsSync(resolve(process.cwd(), '.git')) || existsSync(resolve(process.cwd(), 'last-update.json'));

const config: Config = {
  title: 'Documentazione',
  tagline: 'Claude Code Kit, Sagre & Eventi e License Manager',
  favicon: 'img/favicon.svg',

  // Metadati di default per motori di ricerca e condivisioni. Ogni pagina può sovrascriverli
  // con la propria `description` nel front matter.
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'description',
        content: 'Wiki di Claude Code Kit, Sagre & Eventi e License Manager: regole, plugin, API e deployment.',
      },
    },
  ],

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  // Docusaurus v4 compatibility flags, with "faster" disabled: @docusaurus/faster pulls in
  // lightningcss (MPL-2.0), which is not allowed without explicit approval (core.md §3).
  future: {
    v4: {
      removeLegacyPostBuildHeadAttribute: true,
      useCssCascadeLayers: true,
      siteStorageNamespacing: true,
      fasterByDefault: false,
      mdx1CompatDisabledByDefault: true,
    },
  },

  url: 'http://wiki.aepserver.it',
  baseUrl: '/',

  onBrokenLinks: 'throw',

  // The documents are plain Markdown (they contain text such as <percorso del template>
  // that MDX would read as JSX), so .md files are parsed as CommonMark.
  markdown: {
    format: 'detect',
  },

  // Single language: the documentation is in Italian.
  i18n: {
    defaultLocale: 'it',
    locales: ['it'],
  },

  // Theme and plugins are declared one by one (no preset). The classic theme provides the
  // layout, navbar, footer and styles; the codeblock theme adds GitHub code references.
  themes: [
    [
      '@docusaurus/theme-classic',
      {
        customCss: ['./src/css/custom.css'],
      },
    ],
    'docusaurus-theme-github-codeblock',
    // Ricerca locale: indice generato al build, nessuna richiesta a servizi esterni.
    // Indicizza i Markdown di tutte le wiki (cartelle e route da src/data/wikis.ts).
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['it'],
        docsDir: wikis.map((wiki) => wiki.folder),
        docsRouteBasePath: wikis.map((wiki) => wiki.routeBasePath),
        // Usato fuori dalle pagine docs (per esempio il 404). Non ci sono versioni, quindi non cambia nulla.
        docsPluginIdForPreferredVersion: wikis[0].id,
        indexBlog: false,
        indexPages: false,
      },
    ],
  ],

  // Each wiki is a docs instance with its own id, folder, route prefix and sidebar.
  // The instances below are the only docs; there is no blog.
  plugins: [
    '@docusaurus/plugin-content-pages',
    '@docusaurus/plugin-sitemap',
    '@docusaurus/plugin-css-cascade-layers',
    ...wikis.map((wiki) => [
      '@docusaurus/plugin-content-docs',
      {
        id: wiki.id,
        path: wiki.folder,
        routeBasePath: wiki.routeBasePath,
        sidebarPath: wiki.sidebarPath,
        // Data di ultimo aggiornamento, quando disponibile (vedi lastUpdateAvailable).
        showLastUpdateTime: lastUpdateAvailable,
      },
    ]),
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Documentazione',
      items: wikis.map((wiki) => ({
        type: 'docSidebar' as const,
        sidebarId: wiki.sidebarId,
        docsPluginId: wiki.id,
        position: 'left' as const,
        label: wiki.title,
      })),
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Angelo Pirola.<br />Realizzato con Docusaurus. Versione ${appVersion}.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    // Options of docusaurus-theme-github-codeblock. Runme is an external tool: off by default here.
    codeblock: {
      showGithubLink: true,
      githubLinkLabel: 'Vedi su GitHub',
      showRunmeLink: false,
    },
  },
};

export default config;
