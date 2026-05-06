import { defineConfig } from 'vitepress';

export default defineConfig({
  base: '/cmd-table/',
  title: 'cmd-table',
  description:
    'Modern CLI tables for Node.js — interactive TUI, sparklines, async pagination, CSV/JSON/HTML, TypeScript-first.',
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['meta', { name: 'theme-color', content: '#d946ef' }],
    ['meta', { property: 'og:title', content: 'cmd-table' }],
    [
      'meta',
      {
        property: 'og:description',
        content:
          'Modern CLI tables for Node.js — interactive TUI, sparklines, async pagination, CSV/JSON/HTML, TypeScript-first.',
      },
    ],
    ['meta', { property: 'og:type', content: 'website' }],
  ],

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Recipes', link: '/guide/recipes' },
      { text: 'API', link: '/guide/api' },
      {
        text: 'Ecosystem',
        items: [
          { text: 'Jest Reporter', link: '/guide/jest-reporter' },
          { text: 'Vitest Reporter', link: '/guide/vitest-reporter' },
          { text: 'oclif Integration', link: '/guide/oclif' },
        ],
      },
      {
        text: 'v1.5.3',
        items: [
          {
            text: 'Changelog',
            link: 'https://github.com/Aarul5/cmd-table/blob/main/packages/cmd-table/CHANGELOG.md',
          },
          {
            text: 'npm',
            link: 'https://www.npmjs.com/package/cmd-table',
          },
          {
            text: 'Issues',
            link: 'https://github.com/Aarul5/cmd-table/issues',
          },
        ],
      },
    ],

    sidebar: [
      {
        text: 'Welcome',
        collapsed: false,
        items: [
          { text: 'What is cmd-table?', link: '/guide/introduction' },
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'From cli-table3', link: '/guide/migration' },
        ],
      },
      {
        text: 'Build',
        collapsed: false,
        items: [
          { text: 'Columns & Layout', link: '/guide/columns' },
          { text: 'Styling & Themes', link: '/guide/styling' },
          { text: 'Data Operations', link: '/guide/data-ops' },
          { text: 'Visualizations', link: '/guide/visuals' },
          { text: 'Exports', link: '/guide/exports' },
          { text: 'Integrations', link: '/guide/integrations' },
        ],
      },
      {
        text: 'Power',
        collapsed: false,
        items: [
          { text: 'Interactive TUI', link: '/guide/interactive' },
          { text: 'Async Data', link: '/guide/async' },
          { text: 'SQL', link: '/guide/sql' },
          { text: 'CLI Tool', link: '/guide/cli' },
        ],
      },
      {
        text: 'Reference',
        collapsed: false,
        items: [
          { text: 'Recipes', link: '/guide/recipes' },
          { text: 'API Quick Reference', link: '/guide/api' },
        ],
      },
      {
        text: 'Ecosystem',
        collapsed: false,
        items: [
          { text: 'Jest Reporter', link: '/guide/jest-reporter' },
          { text: 'Vitest Reporter', link: '/guide/vitest-reporter' },
          { text: 'oclif Integration', link: '/guide/oclif' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Aarul5/cmd-table' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/cmd-table' },
    ],

    search: {
      provider: 'local',
    },

    editLink: {
      pattern:
        'https://github.com/Aarul5/cmd-table/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Arul',
    },

    outline: {
      level: [2, 3],
      label: 'On this page',
    },
  },
});
