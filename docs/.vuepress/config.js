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
                    '/guide/else/docker_initSql',
                    '/guide/else/eslint_prettier',
                    '/guide/else/ele_expend',
                    '/guide/else/karma_mocha',
                    '/guide/else/docker_verdaccio',
                ]
            }
        ]
    },
}