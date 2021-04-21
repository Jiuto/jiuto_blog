## 首屏加载优化

1. preload（提高优先级，优先加载本页资源）、prefetch（降低优先级，提前加载可能用到的资源）

2. 利用LocalStorage缓存资源

3. 图片资源压缩，icon资源使用雪碧图

#### 对于vue项目：

4. 分离打包，对于第三方js库的打包优化。

+ 生产环境是内网的话，把资源放内网，通过静态文件引入，如果有外网的话，通过CDN方式引入，不用占用访问外网的带宽，可以节省流量，通过CDN加速。

+ 利用webpack的externals设置外部拓展，使代码编译成通过require运行时加载资源，防止将一些import的第三方资源打包到bundle中。再通过CDN去引入这些资源，可以直接通过全局变量访问，省去import引入和Vue.use注册。

``` js
module.exports = {
  ...
  externals: {
    'vue': 'Vue',
    'vuex': 'Vuex',
    'vue-router': 'VueRouter',
    'element-ui': 'ELEMENT' // element-ui 变量名要使用 ELEMENT，因为element-ui的 umd 模块名是 ELEMENT
  }
  ...
}
```

+ 代码分离，把代码分离到不同的 bundle 中，然后可以按需加载或并行加载这些文件。代码分离可以用于获取更小的 bundle，以及控制资源加载优先级，如果使用合理，会极大影响加载时间。

通常我们使用 SplitChunksPlugin 去重和分离 chunk。

SplitChunksPlugin 插件可以将公共的依赖模块提取到已有的 entry chunk 中，或者提取到一个新生成的 chunk。

``` js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      /** chunks
       * 表示哪些代码需要优化，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为async
       * initial, all模式会将所有来自node_modules的模块分配到一个叫vendors的缓存组；
       * 所有重复引用至少两次的代码，会被分配到default的缓存组。
       * initial模式下会分开优化打包异步和非异步模块，而all会把异步和非异步同时进行优化打包。
       * 也就是说moduleA在indexA中异步引入，indexB中同步引入，initial下moduleA会出现在两个打包块中，而all只会出现一个。
       * **/
      chunks: 'async',
      minSize: 30000, // 表示在压缩前的最小模块大小，默认为30000
      minChunks: 1, // 表示被引用次数，默认为1
      maxAsyncRequests: 5, // 按需加载时候最大的并行请求数，默认为5
      maxInitialRequests: 3, // 一个入口最大的并行请求数，默认为3
      automaticNameDelimiter: '~', // 命名连接符
      name: true, // 拆分出来块的名字，默认由块名和hash值自动生成
      /** 缓存组
       * 缓存组的属性除上面所有属性外，还有test, priority, reuseExistingChunk
          test: 用于控制哪些模块被这个缓存组匹配到
          priority: 缓存组打包的先后优先级
          reuseExistingChunk: 如果当前代码块包含的模块已经有了，就不在产生一个新的代码块
       * 可以通过配置optimization.splitChunks.cacheGroups.default: false禁用default缓存组
      **/
      cacheGroups: {} 
    }
  }
}
// 引自 https://juejin.cn/post/6844903680307625997
```

5. vue-router使用懒加载，访问到当前页面才会加载相关资源

`component: resolve => require(["@/views/version/versionManage.vue"], resolve)`

6. 开启gizp压缩，引入webpack plugin `compression-webpack-plugin`

> gizp压缩是一种http请求优化方式，通过减少文件体积来提高加载速度。
> html、js、css文件甚至json数据都可以用它压缩，可以减小60%以上的体积。
> 前端配置gzip压缩，并且服务端使用nginx开启gzip，用来减小网络传输的流量大小。

7. 引入webpack plugin `uglifyjs-webpack-plugin`

8. 引入webpack plugin `mini-xss-extract-plugin`提取CSS到单独的文件, 并使用`optimize-css-assets-webpack-plugin`来压缩CSS文件
