import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Documentazione',
  tagline: 'Claude Code Kit e Sagre & Eventi',
  favicon: 'img/favicon.svg',

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

  // TODO: placeholder, the production URL is still to be decided (one hostname, see PIANO.md).
  url: 'https://docs.example.com',
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

  // Each wiki is a docs instance with its own id, folder, route prefix and sidebar.
  // The preset does not create docs: the instances below are the only docs.
  presets: [
    [
      'classic',
      {
        docs: false,
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'claude-config',
        path: 'docs/claude-config',
        routeBasePath: 'claude-config',
        sidebarPath: './sidebars/claude-config.ts',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'sagreeventi',
        path: 'docs/sagreeventi',
        routeBasePath: 'sagreeventi',
        sidebarPath: './sidebars/sagreeventi.ts',
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Documentazione',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'claudeConfigSidebar',
          docsPluginId: 'claude-config',
          position: 'left',
          label: 'Claude Code Kit',
        },
        {
          type: 'docSidebar',
          sidebarId: 'sagreeventiSidebar',
          docsPluginId: 'sagreeventi',
          position: 'left',
          label: 'Sagre & Eventi',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Angelo Pirola. Realizzato con Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
