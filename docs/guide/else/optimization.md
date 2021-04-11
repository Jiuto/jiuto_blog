## 首屏加载优化

1. preload（提高优先级，优先加载本页资源）、prefetch（降低优先级，提前加载可能用到的资源）

2. 利用LocalStorage缓存资源

3. 图片资源压缩，icon资源使用雪碧图

#### 对于vue项目：

4. 分离打包，对于第三方js库的打包优化。

+ 生产环境是内网的话，把资源放内网，通过静态文件引入，如果有外网的话，通过CDN方式引入，不用占用访问外网的带宽，可以节省流量，通过CDN加速。

+ 利用webpack的externals设置，分离打包第三方资源，这样可以直接通过全局变量访问，省去import引入和Vue.use注册

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

5. vue-router使用懒加载，访问到当前页面才会加载相关资源

`component: resolve => require(["@/views/version/versionManage.vue"], resolve)`

6. 开启gizp压缩，引入webpack plugin `compression-webpack-plugin`

> gizp压缩是一种http请求优化方式，通过减少文件体积来提高加载速度。
> html、js、css文件甚至json数据都可以用它压缩，可以减小60%以上的体积。
> 前端配置gzip压缩，并且服务端使用nginx开启gzip，用来减小网络传输的流量大小。

7. 引入webpack plugin `uglifyjs-webpack-plugin`

8. 引入webpack plugin `mini-xss-extract-plugin`提取CSS到单独的文件, 并使用`optimize-css-assets-webpack-plugin`来压缩CSS文件
