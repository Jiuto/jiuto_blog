module.exports = {
    base: "/jiuto_blog/",
    title: "Jiuto's blog",
    description: 'Just playing around',
    head: [
		['link', { rel: 'icon', href: 'favicon.ico' }]
	],
    themeConfig: {
        displayAllHeaders: true,
		sidebarDepth: 0,
        nav: [
          { text: 'GitHub', link: 'https://github.com/Jiuto' },
        ],
        sidebar: [
            {
                title: 'JavaScript',
                collapsable: false,
                children: [
                    '/guide/js/eventBus',
                    '/guide/js/promise',
                    '/guide/js/babble_capture',
                    '/guide/js/debounce_throttle',
                ]
            },
            {
                title: 'CSS',
                collapsable: false,
                children: [
                    '/guide/css/flex',
                    '/guide/css/layout',
                ]
            },
            {
                title: 'Vue',
                collapsable: false,
                children: [
                    '/guide/vue/nextTick',
                ]
            },
            {
                title: 'webpack',
                collapsable: false,
                children: [
                    '/guide/webpack/webpack_template',
                    '/guide/webpack/babeltry',
                    '/guide/webpack/plugin_loader',
                ]
            },
            {
                title: '其他',
                collapsable: false,
                children: [
                    '/guide/else/ele_expend',
                    '/guide/else/cli',
                    '/guide/else/utils',
                    '/guide/else/auto_deploy',
                    '/guide/else/docker_verdaccio',
                    '/guide/else/docker_initSql',
                    '/guide/else/eslint_prettier',
                    '/guide/else/karma_mocha',
                ]
            }
        ]
    },
}