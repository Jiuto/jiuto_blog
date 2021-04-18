## 面试路漫漫

> 一个菜鸡的面试之路记录，持续更新中

### 4.15 晚上电话面试50min 阿里菜鸟

#### vue和react的不同

+ 监听数据变化的实现原理不同

Vue 通过 getter/setter 以及一些函数的劫持，能精确知道数据变化，不需要特别的优化就能达到很好的性能

React 默认是通过比较引用的方式进行的，如果不优化（PureComponent/shouldComponentUpdate）可能导致大量不必要的VDOM的重新渲染

+ 数据流

Vue 组件与DOM之间可以通过 v-model 双向绑定

react 组件=>Dom单向数据流，使用onChange/setState()

+ Vue组合不同功能的方式是通过 mixin，而在React中通过高阶组件

+ 组件通信

Vue props/event，provide/inject跨越层级

React props传递数据和回调，context跨越层级

+ 渲染方式不同

React是在组件中通过原生JS实现模板中的常见语法，比如插值，条件，循环等

Vue是在template模板中，通过指令比如v-if、v-for来实现

+ vuex 和 redux

Vue 使用 commit-mutations 和 dispatch-actions 提交更新，通过 mapState 或者直接通过 this.$store 来读取数据，在组件内可以用commit和dispatch。

redux每个组件都要显式地用 connect 把需要的 props 和 dispatch 连接起来，在组件中只能dispatch。

从实现原理上来说，最大的区别是两点：

Redux 使用的是不可变数据，而Vuex的数据是可变的。Redux每次都是用新的state替换旧的state，而Vuex是直接修改。

Redux 在检测数据变化的时候，是通过 diff 的方式比较差异的，而Vuex其实和Vue的原理一样，是通过 getter/setter来比较的。

#### html5 增加了哪些

+ 语义化标签

例如：header、footer、nav、article、section、aside

有利于阅读和维护、有利于SEO搜索引擎识别页面结构、有利于设备解析（盲人阅读）

+ 表单功能增强

input标签多种类型，如：number 类型，可以设置 min 和 max 属性，password 类型，可以设置 minLength 和 maxLength

form表单增强，如：通用属性 placeholder、autofocus

+ 视频/音频-video/audio

媒体标签内部，还可以通过 source 标签来进行多种类型的兼容

+ 画布 Canvas

+ 拖放

在拖动目标上触发事件 (源元素):

ondragstart - 用户开始拖动元素时触发

ondrag - 元素正在拖动时触发

ondragend - 用户完成元素拖动后触发

释放目标时触发的事件:

ondragenter - 当被鼠标拖动的对象进入其容器范围内时触发此事件

ondragover - 当某被拖动的对象在另一对象容器范围内拖动时触发此事件

ondragleave - 当被鼠标拖动的对象离开其容器范围内时触发此事件

ondrop - 在一个拖动过程中，释放鼠标键时触发此事件

+ LocalStorage 和 SessionStorage

+ Web Worker

#### es6 增加了哪些

let/const/块级作用域、解构赋值、Symbol、Set/Map、Proxy、Promise、async、Class、Module

[let、const和块级作用域](https://jiuto.github.io/jiuto_blog/guide/js/let_const.html)

[ES6 Module](https://jiuto.github.io/jiuto_blog/guide/js/module.html)

#### let/const/块级作用域

声明所在的块级作用域内有效，不存在变量提升，存在暂时性死区，不可重复声明，不会绑定全局对象

#### 前端优化

首屏加载优化：

webpack 分离打包、mini-xss-extract-plugin、uglifyjs-webpack-plugin、vue-router异步加载、LocalStorage缓存资源、图片压缩/雪碧图、cdn、gzip、script标签的preload（提高优先级，优先加载本页资源）/prefetch（降低优先级，提前加载可能用到的资源）

[首屏加载优化](https://jiuto.github.io/jiuto_blog/guide/else/optimization.html)

页面减少回流和重绘

[浏览器渲染机制](https://jiuto.github.io/jiuto_blog/guide/browser/render.html)

#### vue响应式原理

data对象，有一个__ob__属性，对应一个Observer实例，Observer实例会重写data上的每一个属性，并通过闭包保存每个属性各自的dep数组，
而每一个dep数组，收集了这个属性的所有Watcher观察者实例，而每一个观察者实例各自有一个deps依赖集，反向收集闭包的dep。

``` js
Object.defineProperty(obj, "key", {
  enumerable: false, //为true属性才会出现在对象的枚举属性中即被for...in 或 Object.keys 方法枚举到。默认为false。
  configurable: false, //为true该属性的描述符才能够被改变，同时该属性也能从对应的对象上被删除。默认为false。
  writable: false, //为true时，属性的值value才能被赋值运算符改变。默认为false。
  value: "static", //该属性对应的值。可以是任何有效的JavaScript值（数值，对象，函数等）。默认为undefined。
  // get、set
});
```

[简单实现vue响应式原理](https://jiuto.github.io/jiuto_blog/guide/vue/responsive.html)

[源码分析vue响应式原理](https://jiuto.github.io/jiuto_blog/guide/vue/initData.html)

#### vue生命周期

beforeCreate => created 这个阶段进行数据观测，created可以拿到$data

beforeMount => mounted 这个阶段从`{{message}} => 真实内容`，添加$el

beforeUpdate => updated

beforeDestroy => destroyed

activated => deactivated

#### 水平垂直居中

水平行内：text-align

水平块级：margin: 0 auto;、flex、position + transform、position + margin

垂直行内：line-height、table-cell + vertical-align

垂直块级：flex、position + transform、position + margin、table-cell + vertical-align、伪元素 + content

[水平居中、垂直居中](https://jiuto.github.io/jiuto_blog/guide/css/center.html)

#### webpack基础配置

mode、devtool、entry、output、resolve(alias、extensions)、module.rules(babel-loader、style-loader、css-loader、less-loader、less-loader、url-loader)、plugins(html-webpack-plugin、mini-css-extract-plugin)

### 4.16 上午到场面试50min 安恒

#### 回流、重塑

[浏览器渲染机制](https://jiuto.github.io/jiuto_blog/guide/browser/render.html)

#### 防抖、节流

防抖是多次触发重新计时，节流是一定时间内多次触发只执行一次

[防抖与节流](https://jiuto.github.io/jiuto_blog/guide/js/debounce_throttle.html)

#### http1/http2

http1：可靠传输（TCP可靠传输）、无状态（这里的状态是指通信过程的上下文信息，每次请求都是独立、无关的，默认不需要保留状态信息）、灵活可扩展（语义自有和传输形式多样）、请求-应答（一来一回）

http1缺点：队头阻塞导致的网络延迟、无状态导致的http头部过大、明文传输、不支持服务器推送

http2（HTTP-SPDY-SSL-TCP）：二进制传输、Header压缩、多路复用、支持服务器推送、安全性提高（https）

http2缺点：TCP/TCP+TLS建立连接的延时、丢包重传导致的队头阻塞

https：TLS/SSL依赖于三类基本算法：对称加密（数据加密）、非对称加密（身份认证和密钥协商）、散列函数（验证信息完整性）

[http、https](https://jiuto.github.io/jiuto_blog/guide/network/http.html)

#### 两列定宽中间自适应（圣杯、双飞翼）

[常见布局](https://jiuto.github.io/jiuto_blog/guide/css/layout.html)

#### 背景图旋转实现

定时器 + transform

> 未完待续

#### 同时发起多个请求

Promise.all

#### vue computed 和 watch 区别

需要经过计算获取值，可以使用computed，需要在值发生变化的时候执行回调则用watch。

计算属性的结果会被缓存，除非依赖的响应式 property 变化才会重新计算。

computed本质是在vue实例上定义一个计算属性同名属性，我们设置的computed的方法是这个属性的get方法，而watch设置的方法是watcher实例的callback回调。

> 未完待续

#### 如何创建一个没有原型的对象

Object.create(null)

#### for in 为什么不能遍历原型

for...in语句以任意顺序遍历一个对象的除Symbol以外的可枚举属性。

#### BFC

[BFC 块格式化上下文](https://jiuto.github.io/jiuto_blog/guide/css/bfc.html)

#### vuex原理

> 未完待续

#### 需要大屏经验 three、d3

### 4.16 下午到场笔试+15min面试 匡汇 

#### promise的三种状态

pending（进行中）、fulfilled（已成功）、rejected（已失败）

状态只有两种转变可能，从pending到fulfilled，或者从pending到rejected。

#### cookie、sessionStorage、localStorage

**使用**

`document.cookie`

`sessionStorage.setItem(name,value);`、`sessionStorage.getItem(name);`、`sessionStorage.removeItem(name);`、
`sessionStorage.valueOf();`、`sessionStorage.属性名`、`sessionStorage.clear();`

localStorage同sessionStorage

**cookie** 

可设置失效时间，默认关闭浏览器失效；可存放4KB左右数据；会携带在HTTP头中；

**localStorage**

除非被手动清除，否则永久保存；可保存5MB数据；不参与通信，仅存于客户端；

**sessionStorage**

仅在当前会话有效；可保存5MB数据；不参与通信，仅存于客户端；

### 4.16 下午到场面试四轮 好洛维

#### vue 的 data 为什么要写return

> 当一个组件被定义，data 必须声明为返回一个初始数据对象的函数，因为组件可能被用来创建多个实例。
> 如果 data 仍然是一个纯粹的对象，则所有的实例将共享引用同一个数据对象！
> 通过提供 data 函数，每次创建一个新实例后，我们能够调用 data 函数，从而返回初始数据的一个全新副本数据对象。

#### vue3.0

> 未完待续

#### data更改为什么视图没有更新

触发视图更新要通过setter来触发notify。

``` js
var vm = new Vue({
    el: '#app',
    data: {
        obj: {
            text: 'hello world',
        },
        arr: [0,1,2]
    },
    mounted() {
        this.change()
    },
    methods: {
        change() {
            // 以下三种方式不会触发setter
            // this.obj.text1 = "hi";
            // Object.assign(this.obj, { text2: "hi" });
            // this.obj = Object.assign(this.obj, { text3: "hi" });
            // obj更改，但视图不会更改
            // console.log(this.obj); 
            
            // 重写对象，触发setter
            // this.obj = {
            //     ...this.obj,
            //     text4:'hi'
            // }

            // 触发setter
            this.$set(this.obj,'text5','hi')

            // 以下两种方式不会触发setter
            // this.arr[0] = 4
            // this.arr[3] = 3
            // arr更改，但视图不会更改
            // console.log(this.arr);

            // 重写数组，触发setter
            this.arr = [...this.arr,3]
        }
    }
});
```

#### vue如何重写7个数组

``` js
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
// 重写了上述七个数组方法，使得使用这七个方法改变数组能够触发notify方法发布通知以便更新视图
methodsToPatch.forEach(function (method) {
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    ob.dep.notify()
    return result
  })
})
```

``` js
observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
}
```

push/unshift/splice能够向数组添加新的值，对新添加的值遍历执行observe方法，增加一个Observer实例。

同时每个方法都要触发notify发布通知观察者更新。

#### 平时aixos怎么封装，怎么处理状态码

[jiuto_axios](https://github.com/Jiuto/jiuto_axios)

使用拦截器

``` js
axios.interceptors.response.use(
    res => {
        // ...
        return res;
    },
    error => {
        if (error.message.indexOf('timeout') != '-1') {
            handleMessage('warning', '请求超时');
        } else if (error.message.indexOf('Network') != '-1') {
            handleMessage('warning', '网段不在服务器的开放的网段内');
        }
        if (error && error.response) {
            switch (error.response.status) {
                case 400:
                handleMessage('error', '请求错误')
                break
                case 401:
                handleMessage('error', '未授权，请登录')
                break
                case 403:
                handleMessage('error', '拒绝访问')
                break
                case 404:
                handleMessage('error', '请求地址出错')
                break
                case 408:
                handleMessage('error', '请求超时')
                break
                case 500:
                handleMessage('error', '服务器内部错误')
                break
                case 501:
                handleMessage('error', '服务未实现')
                break
                case 502:
                handleMessage('error', '网关错误')
                break
                case 503:
                handleMessage('error', '服务不可用')
                break
                case 504:
                handleMessage('error', '网关超时')
                break
                case 505:
                handleMessage('error', 'HTTP版本不受支持')
                break
                default:
            }
        }
        return Promise.reject(error)
    }
}
```

#### vuex使用

更改 Vuex 的 store 中的状态的唯一方法是提交 mutation ， mutation 必须是同步函数，通过 commit 触发。

更新视图同样需要使用`Vue.set`，需要用新对象替换老对象。

Action 提交的是 mutation，而不是直接变更状态， Action 可以包含任意异步操作， Action 通过 store.dispatch 方法触发

``` js
const SOME_MUTATION = 'SOME_MUTATION'
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    SOME_MUTATION (state, payload) {
      // 变更状态
      state.count++
      // 其他传递的参数 { num: 10 }
      console.log(payload)
    }
  },
  actions: {
    // Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象（但它不是 store 本身），因此你可以调用 context.commit 提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters。
    actionA ({ commit }) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                commit('SOME_MUTATION')
                resolve()
            }, 1000)
        })
    },
    // 可以搭配 async / await
    async actionB ({ dispatch, commit }) {
        await dispatch('actionA') // 等待 actionA 完成
        commit('gotOtherData', await getOtherData())
    }
  }
})
store.commit('SOME_MUTATION', { num: 10 })
store.commit({
  type: 'SOME_MUTATION',
  num: 10
})
store.dispatch('actionA').then(() => {
  // ...
})
```

[Vuex](https://vuex.vuejs.org/zh/guide/state.html)

#### scoped

在style标签上加上scoped属性，实现标签内的样式仅在当前模板输出的HTML标签上生效。

> 未完待续

#### 直接打开url怎么做

在路由守卫beforeEach中判断token与白名单

#### promise如何从resolve到reject

resolve(new Error('error'))

#### 给console对象增加一个log1方法

console.prototype.log1 = function (){}

#### 原来公司的权限是怎么实现的

> 未完待续

#### 需要状态码调试经验
