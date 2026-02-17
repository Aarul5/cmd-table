import { defineConfig } from 'vitepress'

export default defineConfig({
    title: "cmd-table",
    description: "Enterprise-grade CLI tables for Node.js",
    themeConfig: {
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Guide', link: '/guide/getting-started' },
            { text: 'API', link: '/api/' }
        ],

        sidebar: [
            {
                text: 'Introduction',
                items: [
                    { text: 'What is cmd-table?', link: '/guide/introduction' },
                    { text: 'Getting Started', link: '/guide/getting-started' }
                ]
            },
            {
                text: 'Core Concepts',
                items: [
                    { text: 'Columns & Layout', link: '/guide/columns' },
                    { text: 'Styling & Themes', link: '/guide/styling' },
                    { text: 'Data Operations', link: '/guide/data-ops' }
                ]
            },
            {
                text: 'Interactvity',
                items: [
                    { text: 'Interactive TUI', link: '/guide/interactive' },
                    { text: 'Async Loading', link: '/guide/async' }
                ]
            },
            {
                text: 'Advanced',
                items: [
                    { text: 'Visualizations', link: '/guide/visuals' },
                    { text: 'Integrations', link: '/guide/integrations' },
                    { text: 'Exporting', link: '/guide/exports' }
                ]
            }
        ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/Aarul5/cmd-table' }
        ]
    }
})
