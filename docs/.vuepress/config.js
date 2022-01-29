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
                    '/guide/js/clone',
                    '/guide/js/module',
                    '/guide/js/template',
                    '/guide/js/closure',
                    '/guide/js/proto',
                    '/guide/js/new',
                    '/guide/js/bind',
                    '/guide/js/apply_call',
                    '/guide/js/let_const',
                    '/guide/js/curry',
                ]
            },
            {
                title: 'CSS',
                collapsable: false,
                children: [
                    '/guide/css/flex',
                    '/guide/css/layout',
                    '/guide/css/bfc',
                    '/guide/css/stacking_context',
                    '/guide/css/center',
                    '/guide/css/grid',
                    '/guide/css/css3',
                ]
            },
            {
                title: 'Vue',
                collapsable: false,
                children: [
                    '/guide/vue/nextTick',
                    '/guide/vue/responsive',
                    '/guide/vue/initData',
                    '/guide/vue/initWatch',
                    '/guide/vue/patch',
                    '/guide/vue/initComputed',
                    '/guide/vue/router',
                    '/guide/vue/vuex',
                ]
            },
            {
                title: 'webpack',
                collapsable: false,
                children: [
                    '/guide/webpack/webpack_template',
                    '/guide/webpack/babeltry',
                    '/guide/webpack/plugin_loader',
                    '/guide/webpack/babel_plugin',
                ]
            },
            {
                title: '浏览器',
                collapsable: false,
                children: [
                    '/guide/browser/eventloop',
                    '/guide/browser/render',
                ]
            },
            {
                title: '网络与安全',
                collapsable: false,
                children: [
                    '/guide/network/http',
                    '/guide/network/cache',
                    '/guide/network/cross',
                    '/guide/network/security',
                ]
            },
            {
                title: '算法',
                collapsable: false,
                children: [
                    '/guide/algorithm/editDistance',
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
                    '/guide/else/optimization',
                    '/guide/else/docker',
                    '/guide/else/interview',
                ]
            }
        ]
    },
}