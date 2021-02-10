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
                title: 'Vue',
                collapsable: false,
                children: [
                    '/guide/vue/nextTick',
                ]
            },
            {
                title: '其他',
                collapsable: false,
                children: [
                    '/guide/else/ele_expend',
                    '/guide/else/cli',
                    '/guide/else/utils',
                    '/guide/else/docker_verdaccio',
                    '/guide/else/docker_initSql',
                    '/guide/else/eslint_prettier',
                    '/guide/else/karma_mocha',
                ]
            }
        ]
    },
}