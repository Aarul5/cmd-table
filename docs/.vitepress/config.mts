import { defineConfig } from 'vitepress'

export default defineConfig({
    title: "cmd-table",
    description: "Enterprise-grade CLI tables for Node.js",
    themeConfig: {
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Guide', link: '/guide/getting-started' }
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
                text: 'Interactivity',
                items: [
                    { text: 'Interactive TUI', link: '/guide/interactive' },
                    { text: 'Async & SQL', link: '/guide/async' },
                    { text: 'SQL Integration', link: '/guide/sql' }
                ]
            },
            {
                text: 'Advanced',
                items: [
                    { text: 'Visualizations', link: '/guide/visuals' },
                    { text: 'Integrations', link: '/guide/integrations' },
                    { text: 'Exporting', link: '/guide/exports' },
                    { text: 'CLI Tool', link: '/guide/cli' }
                ]
            },
            {
                text: 'Reference',
                items: [
                    { text: 'API Quick Reference', link: '/guide/api' }
                ]
            }
        ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/Aarul5/cmd-table' }
        ]
    }
})
