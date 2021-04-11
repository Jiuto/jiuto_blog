(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{397:function(t,s,e){"use strict";e.r(s);var a=e(42),n=Object(a.a)({},(function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h2",{attrs:{id:"首屏加载优化"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#首屏加载优化"}},[t._v("#")]),t._v(" 首屏加载优化")]),t._v(" "),e("ol",[e("li",[e("p",[t._v("preload（提高优先级，优先加载本页资源）、prefetch（降低优先级，提前加载可能用到的资源）")])]),t._v(" "),e("li",[e("p",[t._v("利用LocalStorage缓存资源")])]),t._v(" "),e("li",[e("p",[t._v("图片资源压缩，icon资源使用雪碧图")])])]),t._v(" "),e("h4",{attrs:{id:"对于vue项目"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#对于vue项目"}},[t._v("#")]),t._v(" 对于vue项目：")]),t._v(" "),e("ol",{attrs:{start:"4"}},[e("li",[t._v("分离打包，对于第三方js库的打包优化。")])]),t._v(" "),e("ul",[e("li",[e("p",[t._v("生产环境是内网的话，把资源放内网，通过静态文件引入，如果有外网的话，通过CDN方式引入，不用占用访问外网的带宽，可以节省流量，通过CDN加速。")])]),t._v(" "),e("li",[e("p",[t._v("利用webpack的externals设置，分离打包第三方资源，这样可以直接通过全局变量访问，省去import引入和Vue.use注册")])])]),t._v(" "),e("div",{staticClass:"language-js extra-class"},[e("pre",{pre:!0,attrs:{class:"language-js"}},[e("code",[t._v("module"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("exports "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("...")]),t._v("\n  externals"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'vue'")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Vue'")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'vuex'")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Vuex'")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'vue-router'")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'VueRouter'")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'element-ui'")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'ELEMENT'")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// element-ui 变量名要使用 ELEMENT，因为element-ui的 umd 模块名是 ELEMENT")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("...")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),e("ol",{attrs:{start:"5"}},[e("li",[t._v("vue-router使用懒加载，访问到当前页面才会加载相关资源")])]),t._v(" "),e("p",[e("code",[t._v('component: resolve => require(["@/views/version/versionManage.vue"], resolve)')])]),t._v(" "),e("ol",{attrs:{start:"6"}},[e("li",[t._v("开启gizp压缩，引入webpack plugin "),e("code",[t._v("compression-webpack-plugin")])])]),t._v(" "),e("blockquote",[e("p",[t._v("gizp压缩是一种http请求优化方式，通过减少文件体积来提高加载速度。\nhtml、js、css文件甚至json数据都可以用它压缩，可以减小60%以上的体积。\n前端配置gzip压缩，并且服务端使用nginx开启gzip，用来减小网络传输的流量大小。")])]),t._v(" "),e("ol",{attrs:{start:"7"}},[e("li",[e("p",[t._v("引入webpack plugin "),e("code",[t._v("uglifyjs-webpack-plugin")])])]),t._v(" "),e("li",[e("p",[t._v("引入webpack plugin "),e("code",[t._v("mini-xss-extract-plugin")]),t._v("提取CSS到单独的文件, 并使用"),e("code",[t._v("optimize-css-assets-webpack-plugin")]),t._v("来压缩CSS文件")])])])])}),[],!1,null,null,null);s.default=n.exports}}]);