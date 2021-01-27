module.exports = {
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
            }
        ]
    },
}