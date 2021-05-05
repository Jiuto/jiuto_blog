## 面试路漫漫

> 一个菜鸡的面试之路记录，持续更新，后面要尽量提炼拓展出一些文章。

### 4.15 晚上电话面试50min ALCN

#### ES6及之后版本添加的特性

**ES2015/ES6**

let/const、Promise、Module、Class、箭头函数、函数参数默认值、字符串模板\`$\{data\}\`、结构赋值`{name} = data;`与`[a, b] = [1, 2];`、延展操作符`...`、
对象属性简写`var obj = { name, age, city };`、

[let、const和块级作用域](https://jiuto.github.io/jiuto_blog/guide/js/let_const.html)

[ES6 Module](https://jiuto.github.io/jiuto_blog/guide/js/module.html)

**ES2016**

`Array.prototype.includes()`返回布尔值、指数运算符`**`（`2**10` 同 `Math.pow(2,10)`）

**ES2017**

async/await、Object.values()返回属性值数组、Object.entries()返回对象可枚举属性的键值对数组、String.prototype.padStart和String.prototype.padEnd、
函数参数列表结尾允许逗号、Object.getOwnPropertyDescriptors()、SharedArrayBuffer对象、Atomics对象

**ES2018**

异步迭代（await可以和for...of循环一起使用）、Promise.finally()、Rest/Spread 属性（为对象解构提供了和数组一样的Rest参数）、
正则表达式命名捕获组、正则表达式反向断言、正则表达式dotAll模式、正则表达式 Unicode 转义、非转义序列的模板字符串

**ES2019**

行分隔符（U + 2028）和段分隔符（U + 2029）符号现在允许在字符串文字中，与JSON匹配、更加友好的 JSON.stringify、Array.prototype.flat()和Array.prototype.flatMap()、
String的trimStart()方法和trimEnd()方法、Object.fromEntries()、Symbol.prototype.description、String.prototype.matchAll、Function.prototype.toString()现在返回精确字符，包括空格和注释、修改 catch 绑定、BigInt（七种基本数据类型，分别是： String、Number、Boolean、Null、Undefined、Symbol、BigInt）

**ES2020**

可选链操作符（Optional Chaining）`obj?.first?.second`、空位合并操作符（`a ?? b` 同 `a !== undefined && a !== null ? a : b`）、Promise.allSettled、
String.prototype.matchAll、Dynamic import（支持await）、BigInt、globalThis

**ES2021**

String.prototype.replaceAll()、Promise.any()、WeakRefs、逻辑赋值运算符（`a ||= b` 同 `a || (a = b)`，还有`&&=`、`??=`）、数字分隔符_(下划线)

[ES6、ES7、ES8、ES9、ES10新特性一览](https://juejin.cn/post/6844903811622912014#heading-35)

[ES2020新特性](https://juejin.cn/post/6844904080955932679#heading-0)

[ES2021新特性](https://juejin.cn/post/6919682252808912904#heading-0)

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

Vuex 使用 commit-mutations 和 dispatch-actions 提交更新，通过 mapState 或者直接通过 this.$store 来读取数据，在组件内可以用commit和dispatch。

redux每个组件都要显式地用 connect 把需要的 props 和 dispatch 连接起来，在组件中只能dispatch。

从实现原理上来说，最大的区别是两点：

Redux 使用的是不可变数据，而Vuex的数据是可变的。Redux每次都是用新的state替换旧的state，而Vuex是直接修改。

Redux 在检测数据变化的时候，是通过 diff 的方式比较差异的，而Vuex其实和Vue的原理一样，是通过 getter/setter来比较的。

#### html5 增加了哪些

+ 语义化标签

例如：header、footer、nav、article、section、aside

有利于阅读和维护、有利于SEO搜索引擎识别页面结构、有利于无障碍设备解析

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

#### let/const/块级作用域

声明所在的块级作用域内有效，不存在变量提升，存在暂时性死区，不可重复声明，不会绑定全局对象

#### 前端优化

首屏加载优化：

webpack 分离打包、mini-xss-extract-plugin、uglifyjs-webpack-plugin、vue-router异步加载、LocalStorage缓存资源、图片压缩/雪碧图、cdn、gzip、link标签的preload（提高优先级，优先加载本页资源）/prefetch（降低优先级，提前加载可能用到的资源）

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

beforeMount => mounted 这个阶段从 `{ { message } } => 真实内容`，添加$el

beforeUpdate => updated

beforeDestroy => destroyed

activated => deactivated

> 未完待续

#### 水平垂直居中

水平行内：text-align

水平块级：margin: 0 auto;、flex、position + transform、position + margin

垂直行内：line-height、table-cell + vertical-align

垂直块级：flex、position + transform、position + margin、table-cell + vertical-align、伪元素 + content

[水平居中、垂直居中](https://jiuto.github.io/jiuto_blog/guide/css/center.html)

#### webpack基础配置

mode、devtool、entry、output、resolve(alias、extensions)、module.rules(babel-loader、style-loader、css-loader、less-loader、less-loader、url-loader)、plugins(html-webpack-plugin、mini-css-extract-plugin)

---

### 4.16 上午到场面试50min AH

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

``` html
<style>
    #bg {
        margin: 100px;
        height: 100px;
        width: 100px;
        background-color: cadetblue;
    }
</style>
<div id="bg"></div>
<script>
    var bg = document.getElementById("bg"),
        count = 1;
    setInterval(function(){
        count++;
        bg.style.transform = 'rotate(' + count + 'deg)'
    },8)
</script>
```

#### 同时发起多个请求

Promise.all

#### vue computed 和 watch 区别

需要经过计算获取值，可以使用computed，需要在值发生变化的时候执行回调则用watch。

计算属性的结果会被缓存，除非依赖的响应式 property 变化才会重新计算。

computed本质是在vue实例上定义一个计算属性同名属性，我们设置的computed的方法是这个属性的get方法，而watch设置的方法是watcher实例的callback回调。

[源码分析vue computed](https://jiuto.github.io/jiuto_blog/guide/vue/initComputed.html)

#### 如何创建一个没有原型的对象

Object.create(null)

#### BFC

[BFC 块格式化上下文](https://jiuto.github.io/jiuto_blog/guide/css/bfc.html)

#### vuex原理

[源码阅读vuex](https://jiuto.github.io/jiuto_blog/guide/vue/vuex.html)

> 未完待续

#### 需要大屏经验 three、d3

---

### 4.16 下午到场笔试+15min面试 KH

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

---

### 4.16 下午到场面试四轮 HLW

#### vue 的 data 为什么要写return

> 当一个组件被定义，data 必须声明为返回一个初始数据对象的函数，因为组件可能被用来创建多个实例。
> 如果 data 仍然是一个纯粹的对象，则所有的实例将共享引用同一个数据对象！
> 通过提供 data 函数，每次创建一个新实例后，我们能够调用 data 函数，从而返回初始数据的一个全新副本数据对象。

#### vue3.0

组合式API(Vue3 composion api,VCA)（setup、ref响应式引用）、生命周期（on+Hook名，接收回调）、watch、computed、v-model、Teleport 组件、对v-if/v-else自动生成key...

底层优化：proxy、静态提升（把一些静态的不会变的节点用变量缓存起来，提供下次 re-render 直接调用。如果没有做这个动作，当 render 重新执行时，即使标签是静态的，也会被重新创建，这就会产生性能消耗。）

基于函数的API有利于支持TypeScript、Tree-shaking。

[Vue3丨从 5 个维度来讲 Vue3 变化](https://juejin.cn/post/6910009240053055496#heading-29)

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

Action 提交的是 mutation，而不是直接变更状态， Action 可以包含任意异步操作， Action 通过 store.dispatch 方法触发。

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

> + 每个Vue文件都将对应一个唯一的id，该id可以根据文件路径名和内容hash生成
> + 编译template标签时时为每个标签添加了当前组件的id，如<div class="demo"></div>会被编译成<div class="demo" data-v-27e4e96e></div>
> + 编译style标签时，会根据当前组件的id通过属性选择器和组合选择器输出样式，如.demo{color: red;}会被编译成.demo[data-v-27e4e96e]{color: red;}
>
> ( 涉及vue-loader相关源码，引自[从vue-loader源码分析CSS Scoped的实现](https://juejin.cn/post/6844903949900742670)。)

#### 直接打开url怎么做

在路由守卫beforeEach中判断token与白名单

#### promise如何从resolve到reject

resolve(new Error('error'))

#### 给console对象增加一个log1方法

console.prototype.log1 = function (){}

#### 需要状态码调试经验

---

### 4.19 下午到场两轮两小时技术面 GWG

> 重复问题：水平/垂直居中、ES6、promise、vue生命周期、vue3.0、性能优化、http协议、VirtualDOM作用和优点

#### 说一下flex布局

[flex布局](https://jiuto.github.io/jiuto_blog/guide/css/flex.html)

#### 在循环里使用promise

在循环中把promise保存到数组里，循环外使用Promise.all()传入数组

#### 浏览器渲染原理

[浏览器渲染机制](https://jiuto.github.io/jiuto_blog/guide/browser/render.html)

---

### 4.22 下午50min视频面试+coding ZJ

#### 给多个li增加事件处理程序，如果有加载更多，怎么做其他li的事件绑定

``` html
<ul id="ul">
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
</ul>
<script>
    // 用jquery的on方法
    $('ul').on('click', 'li', function () {
        console.log(123)
    });
    // 遍历挨个儿绑定
    var ul = document.getElementById("ul"),
        lis = ul.children;
    for (let i = 0; i < lis.length; i++) {
        let li = lis[i];
        li.addEventListener("click",function(event){
            console.log(event.target)
        })
    }
    // 通过冒泡，给父元素绑定事件处理程序
    var ul = document.getElementById("ul");
    ul.addEventListener("click",function(event){
        console.log(event.target) // li ie用 event.srcElement
        console.log(event.currentTarget) // ul ie没有这个属性
    })
</script>
```

#### vue 和 react 事件委托

``` html
<div id="app">
    <ul @click="handleClick">
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
    </ul>
</div>
<script>
    new Vue({
        el: "#app",
        methods: {
            handleClick(e){
                console.log(e.target)
            }
        }
    });
</script>
```

``` html
<div id="root"></div>
<script type="text/babel">
    function handleClick(e) {
        console.log(e.target)
    }
    var element = (
        <ul onClick={handleClick}>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
        </ul> 
    );
    ReactDOM.render(
        element,
        document.getElementById('root')
    );
</script>
```

#### document.querySelectorAll("div")，返回的是什么，怎么遍历

NodeList对象，for循环遍历、`Array.prototype.slice.call(nodeList)`、`Array.from(nodeList)`

#### http2有哪些特点，这些特点有哪些应用

> 未完待续

#### 讲一下 VirtualDOM ，有什么优点，除了浏览器还在哪些方面有应用

VirtualDOM 是根据真实的DOM节点树，抽象出来的一棵用 JavaScript 对象描述节点的抽象树。

1. 通过 VirtualDOM ，可以对比前后节点变化了哪些变化，做到局部更新视图，减少 DOM 操作。
Virtual DOM的优势不在于单次的操作，而是在大量、频繁的数据更新下，能够对视图进行合理、高效的更新。

2. 由于 Virtual DOM 是以 JavaScript 对象为基础而不依赖真实平台环境，所以使它具有了跨平台的能力，比如说浏览器平台、Weex、Node 等。

vue-server-renderer服务端渲染、WEEX（可以使用 JavaScript 语言和前端开发经验来开发移动应用）。

#### 数组降维+去重+排序（从大到小）

``` js
var arr = [[22, 33, 11], [55, 33, 6, 7], 8, 9, 6], 
    arr1;
// 降维

// 方法一 递归

// 方法二 Array.prototype.concat.apply([], arr)
arr1 = Array.prototype.concat.apply([], arr); // 返回新数组 [22, 33, 11, 55, 33, 6, 7, 8, 9, 6]

// 方法三 arr.flat()
arr1 = arr.flat(); // 返回新数组 [22, 33, 11, 55, 33, 6, 7, 8, 9, 6]

// 去重

// 方法一 两层for循环

// 方法二 一层for循环+一层indexOf

// 方法三 先排序再for循环 比较相邻两个值是否相等

// 方法四 filter+indexOf
arr1 = arr1.filter(function(item, index, array){
    return array.indexOf(item) === index;
}) // indexOf 返回首个匹配的下标，filter 返回新数组， [22, 33, 11, 55, 6, 7, 8, 9]

// 方法五 先排序再filter
arr1 = arr1.sort((a,b)=> a-b).filter(function(item, index, array){
    return !index || item !== array[index - 1]
}) // sort 对原数组排序，filter 返回新数组， [6, 7, 8, 9, 11, 22, 33, 55]

// 方法六 Object键值对+filter

// 方法七 Set+Array.from
arr1 = Array.from(new Set(arr1)) // 返回新数组 [22, 33, 11, 55, 6, 7, 8, 9]
arr1 = [...new Set(arr1)] // 简化 [22, 33, 11, 55, 6, 7, 8, 9]

// 方法八 Map+filter
var map = new Map()
arr1 = arr1.filter((item) => !map.has(item) && map.set(item, true)) // [22, 33, 11, 55, 6, 7, 8, 9]

// 排序

// sort+reverse
arr1.sort((a,b)=> a-b).reverse() // [6, 7, 8, 9, 11, 22, 33, 55]

// 各种排序算法

console.log(arr1)
```

#### XMLHttpRequest 和 fetch 

**什么是Ajax**

Ajax是一种异步请求数据的web开发技术，不需要重新刷新页面，通过Ajax异步请求加载后台数据，进行局部更新。

**Ajax原理**

依赖浏览器提供的XMLHttpRequest对象，让浏览器异步发起或接收HTTP请求，期间浏览器做其他事情，等收到XHR响应再渲染页面。

**XMLHttpRequest和fetch的使用**

``` js
// XMLHttpRequest
let xhr;
if (window.XMLHttpRequest) {
  xhr = new XMLHttpRequest()
} else if (window.ActiveXObject) { // IE 6 and older
  xhr = new ActiveXObject('Microsoft.XMLHTTP')
}
xhr.open("POST","test.html",true); // 第三个参数 async， true 表示异步， false 表示同步 
xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");  
xhr.send("fname=Henry&lname=Ford");
xhr.onreadystatechange = function(){ 
    if (xhr.readyState==4 &&xhr.status==200)  { 
        console.log(xhr.responseText);  
    }
} 
/** readyState：
 * 0：未初始化 -- 尚未调用.open()方法；
 * 1：启动 -- 已经调用.open()方法，但尚未调用.send()方法；
 * 2：发送 -- 已经调用.send()方法，但尚未接收到响应；
 * 3：接收 -- 已经接收到部分响应数据；
 * 4：完成 -- 已经接收到全部响应数据，而且已经可以在客户端使用了；
*/

// fetch 使用 Promise 语法结构
fetch('/users.json', {
    method: 'post', 
    mode: 'no-cors', // 跨域配置
    data: {}
})
  .then((r) => r.json())
  .then((data) => console.log(data))
  .catch((e) => console.log('error'))
```

**$.ajax、axios、XMLHttpRequest和fetch的区别**

$.ajax 和 axios 是对 XMLHttpRequest 的封装， fetch 是底层API，可以代替XHR。

> + fetch只对网络请求报错，对400，500都当做成功的请求，需要封装去处理
> + fetch默认不会带cookie，需要添加配置项。
> + fetch不支持abort，不支持超时控制，使用setTimeout及Promise.reject的实现超时控制并不能阻止请求过程继续在后台运行，造成了流量的浪费。
> + fetch没有办法原生监测请求的进度，而XHR可以。

#### service worker 是什么

> Service workers 本质上充当 Web 应用程序、浏览器与网络（可用时）之间的代理服务器。[Service Worker API](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API)

#### 网络工具怎么封装的

``` js
import axios from "axios";

//对axios的配置
axios.defaults.timeout = 10000;
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";

/**
 * @param {*} url
 * 使用get
 */
export const baseGet = (url, config= {}) => {
    config.method = "get";
    config.url = url;
    return base(config);
};

/**
 * @param {*} url
 * @param {*} data
 * 使用post
 */
export const basePost = (url, data, config = {}) => {
    config.method = "post";
    config.url = url;
    config.data = data;
    return base(config);
};

/**
 * 请求基础配置
 */
export const base = (config = {}) => {
    if (!config.url) return;

    //取消请求
    const CancelToken = axios.CancelToken;
    let cancel;
    config.cancelToken = new CancelToken(function executor(c) {
        cancel = c;
    });

    //返回结果
    let res = axios.request(config).catch((error) => {
        if (error.response) {
            return Promise.reject(error.response.data);
        }
        error.message && (error.msg = error.message);
        return Promise.reject(error);
    });

    res.cancel = cancel;

    return res;
}

export default axios
```

#### 了解过reactNative吗

> 使用 React 来创建 Android 和 iOS 的原生应用

#### 用户缓存怎么做的，有什么办法优化

``` js
const defaultValue = {
  currentPage: '0',
  tagAry: new Array(),
  subCurrentPage: "",
  activeIndex: "",
  menuList: new Array(),
  token: "",
  uids: "",
  uname: "",
  userid:"",
  ucompany:"",
  logStatus: 'login',//登录: login  登出: logOut mock:mock
}
function getStorageValue(name) {
  let value = window.sessionStorage.getItem(name);
  let initValue = defaultValue[name] || ''
  if (value) {
    try {
      value = JSON.parse(value)
    } catch (e) {
      value = initValue;
    }
  } else {
    value = initValue;
  }
  return value;
}
let token = getStorageValue("token");
let uids = getStorageValue("uids");
let uname = getStorageValue("uname");
let userid = getStorageValue('userid');
let ucompany = getStorageValue('ucompany');
let currentPage = getStorageValue("currentPage");
let tagAry = getStorageValue("tagAry");
let subCurrentPage = getStorageValue("subCurrentPage");
let activeIndex = getStorageValue("activeIndex");
let menuList = getStorageValue("menuList");
let logStatus = getStorageValue("logStatus");
let localStorage = {
  state: {
    token,
    //用户账号
    uids,
    //用户名
    uname,
    //用户id
    userid,
    //用户公司
    ucompany,
    //导航条高亮
    currentPage,
    //tag导航数组
    tagAry,
    //tag条高亮
    subCurrentPage,
    //侧边栏高亮
    activeIndex,
    //侧边栏
    menuList,
    //登录状态
    logStatus,
    //判断浏览器
    browser:'',
  },
  mutations: {
    //设置本地存储
    'SET_SESSIONSTORAGE': (state, { name, content }) => {
      window.sessionStorage.setItem(name, JSON.stringify(content));
      state[name] = content;
    },
    //移除本地存储
    'REMOVE_SESSIONSTORAGE': (state, name) => {
      window.sessionStorage.removeItem(name);
      if (name == "tagAry" || name == "menuList") {
        state[name] = [];
      } else {
        state[name] = defaultValue[name] || '';
      }
    },
  },
  actions: {
  }
}
export default localStorage;
```

可以让后端通过cookie中的token自己获取用户信息，避免所有需要校验用户的接口都要带用户id。

#### 讲一下http缓存，除了http缓存，还有哪些缓存

+ [浏览器缓存](https://jiuto.github.io/jiuto_blog/guide/network/cache.html)

+ cookie、sessionStorage、localStorage

#### 你知道哪些排序算法

冒泡排序、选择排序、插入排序、快速排序、希尔排序

[前端笔试&面试爬坑系列---算法](https://juejin.cn/post/6844903656865677326#heading-8)

---

### 4.22 晚上37min电话面试 AL

> 重复问题：水平/垂直居中、vue3.0、响应式原理、ES6

#### vue响应式原理之后，如何更新页面

渲染Watcher执行`update->run->get`，调用了`vm._update->vm.__patch__->patch`。

节点相同判断通过sameVnode方法。

patch：

+ 新节点不存在，则销毁旧节点，结束patch；
+ 旧节点不存在，则创建新节点；
+ 旧节点存在且新旧相同，进行patchVnode；
+ 旧节点存在且新旧不同，创建新节点；

patchVnode：

+ 新节点有文本节点，且与旧文本节点不同，则替换文本；
+ 新节点不存在文本节点：
+ 都有子节点且子节点不同，进行updateChildren；
+ 仅新节点有子节点，增加节点；
+ 仅旧节点有子节点，删除节点；
+ 均无子节点，清空文本；

updateChildren：

+ 首首、尾尾、首尾、尾首比较；
+ 上述四种不匹配，则查找相同key，没找到则新增节点；
+ 找到相同key但节点不同，则新增节点；
+ 找到相同key但节点相同，则移动；
+ 直到新节点列表或旧节点列表有一个遍历完，对多余的旧节点进行删除，新节点进行增加；

[源码阅读vue VirtualDOM 和 diff](https://jiuto.github.io/jiuto_blog/guide/vue/patch.html)

#### webpack构建流程

1. 从配置文件和Shell语句中读取与合并参数，根据参数初始化compiler对象，加载插件

2. 执行compiler对象的run方法开始执行编译，每一次新的编译都会实例化一个compilation对象，记录本次编译的基本信息，进入make hook（生成modules）

3. 通过compilation.addEntry，找到配置中的entry找出所有的入口文件，从入口文件出发，递归找出依赖的依赖

4. 通过loader将依赖转换成标准的js，通过Parser.parse再转换成AST，解析成AST最大作用就是收集模块依赖关系，webpack会遍历AST对象将依赖记录在module.dependencies，最后遍历module.dependencies解析依赖生成module，make阶段结束，得到项目所依赖的所有modules

5. 执行compilation.seal方法生成chunks，把entry中对应的每个module都生成一个新的chunk，遍历module.dependencies，将其依赖的模块也加入到上一步生成的chunk中，若某个module是动态引入的，为其创建一个新的chunk，接着遍历依赖

6. 遍历chunk，生成源码，调用emitAsset将其存在compilation.assets（最终的文件列表），compilation.seal结束，compilation结束

7. 进入emit hook，这是修改最终文件的最后一个机会

8. 遍历 compilation.assets 生成所有文件，然后触发钩子done，结束构建流程。

简单地说：

1. 读取与合并配置参数，加载 Plugin，实例化 Compiler

2. 从 Entry 出发，用 Loader 翻译每个Module，递归地进行编译处理并得到依赖关系

3. 将编译后的 Module 组合成 Chunk，将 Chunk 转换成文件，输出到文件系统中

[吐血整理」再来一打Webpack面试题](https://juejin.cn/post/6844904094281236487#heading-3)

[Webpack源码解读：理清编译主流程](https://juejin.cn/post/6844903987129352206#heading-6)

[webpack构建流程分析](https://juejin.cn/post/6844904000169607175#heading-15)

#### 数组求和：实现一个function getIndex(arr,sum)，找出数组中和为sum的下标

``` js
function getIndex (arr,sum) {
    let map = new Map();
    for(let i = 0; i < arr.length; i++){
        map.set(arr[i],i);
        let target = map.get(sum-arr[i]);
        if(target && target !== i) return [target,i]
    }
}
console.log(getIndex([1,2,3,4,5],8)) // 2,4
console.log(getIndex([1,2,3,4,5],9)) // 3,4
```

#### git add/commit/push前后的回滚操作，以及回滚后提交记录的变化

+ 修改 commit ，`git commit --amend`进入vim编辑器，可修改commit注释

+ add 前，`git checkout -- <file>`撤销上一次对文件的操作

+ add 后 commit 前，`git reset HEAD <file>`

+ add + commit 后 push 前：`git reset --soft HEAD^`

> + `HEAD^`表示上一个版本，即上一次的commit，也可以写成`HEAD~1`，如果要撤回两次commit，可以使用`HEAD~2`。
> + `--soft`不删除工作空间改动代码 ，撤销commit，不撤销add
> + `--hard`删除工作空间改动代码，撤销commit且撤销add

+ push 后，执行`git log`查看日志，找到版本号

1. `git reset --hard 版本号`(回退到目标记录) + `git push origin master --force`(回退后记录比远程靠前，要--force)

2. `git revert -n 版本号`(revert会生成新的记录，而不是回到目标记录，-n表示--no-commit，如果不带这个参数会自动提交一条commit) + `git push`

---

### 4.25 晚上76min视频面试+coding KS

> 重复问题：水平/垂直居中、BFC、浏览器缓存、let/const

#### 盒模型

content+padding+border+margin

border-box：content+padding+border

content-box：content

#### flex:1 是什么的简写

flex属性是flex-grow（放大）, flex-shrink（缩小） 和 flex-basis（定义在分配多余空间之前，元素占据的主轴空间）的简写

flex: 1 === flex: 1 1 0

#### rem、em、100%、vm

rem：参考根元素font-size

em：参考物父元素font-size

%：参考父元素百分比

vh：参考视口高度均分100份

vw：参考视口宽度均分100份

vm：参考视口宽高中较小值来均分100份

#### 基本数据类型有哪些

String、Number、Boolean、Null、Undefined、Symbol、BigInt

#### 对象类型判断

如何判断一个array类型？ 

`Object.prototype.toString.call([])`、`[] instanceof Array`、`[].constructor`、`Array.isArray([])`

typeof [] 返回什么：object

#### new操作符做了什么

[手写 new 操作符](https://jiuto.github.io/jiuto_blog/guide/js/new.html)

1. 得到一个新的Object的实例
2. 实例的方法this指向这个实例本身
3. 每个实例的__proto__指向构造函数的原型对象
4. 当return 一个Object/Function/Array/Date/RegExp/Error的实例，new操作符得到的就是return的结果

`typeof new String(1)` 返回什么：object

`typeof String(1)` 返回什么：string

为什么可以这样调用substr？

`new String(1).substr()`

因为 new 让实例的__proto__指向了String.prototype

`String(1).substr()` 

js中有三个基本包装类型：String、Number、Boolean，每当读取一个基本类型的时候，后台就会创建一个对应的基本包装类型对象，从而让我们能够调用一些方法来操作这些数据。（装箱）

（拆箱：valueOf()方法和toString()方法）

#### 如何使对象属性不可改

``` js
Object.freeze(obj)

Object.defineProperty(obj, "key", {
  enumerable: false, //为true属性才会出现在对象的枚举属性中即被for...in 或 Object.keys 方法枚举到。默认为false。
  configurable: false, //为true该属性的描述符才能够被改变，同时该属性也能从对应的对象上被删除。默认为false。
  writable: false, //为true时，属性的值value才能被赋值运算符改变。默认为false。
  value: "val", //该属性对应的值。可以是任何有效的JavaScript值（数值，对象，函数等）。默认为undefined。
  // get、set
});
```

#### margin合并

在CSS中，两个相邻的盒子会存在外边距margin合并的现象：

1. margin合并的前提：

+ 外边距合并只出现在两个紧紧相邻的盒子(父子关系或兄弟关系)，如果两个盒子间存在border或padding则无法合并

+ 外边距合并只发生在普通文档流中垂直方向上相邻的块级元素，而水平方向上的两个相邻的盒子则不会发生外边距合并

2. 两个盒子外边距合并后的实际边距：

+ 两个盒子的margin均为正值，外边距合并后的实际边距为二者中较大的值

+ 两个盒子的margin均为负值，外边距合并后实际边距为二者中较小的值

+ 两个盒子的margin一个为正值、一个为负值，外边距合并后实际边距为二者之和

#### 行内元素的padding、margin

padding四个方向生效，margin左右生效

#### for in、for of、Object.keys区别

for in 可以遍历对象，拿到属性名，可以遍历数组，拿到下标，for of 只能遍历数组，拿到值，Object.keys返回对象属性名数组

#### for in 能不能遍历原型

> for...in语句以任意顺序遍历一个对象的除Symbol以外的可枚举属性。

for in 可以遍历原型，要拿自身对象可以搭配使用hasOwnProperty

``` js
var triangle = {a: 1, b: 2, c: 3};

function ColoredTriangle() {
  this.color = 'red';
}

ColoredTriangle.prototype = triangle;

var obj = new ColoredTriangle();

for (var prop in obj) {
  if (obj.hasOwnProperty(prop)) {
    console.log(`obj.${prop} = ${obj[prop]}`);
  }
}
```

#### 跨域

[跨域](https://jiuto.github.io/jiuto_blog/guide/network/cross.html)

什么是跨域？ scheme(协议)、host(主机)和port(端口)都相同则为同源。

可以跨域的标签有哪些？ `<img>`、`<link>`、`<script>`、`<audio>`、`<video>`

跨域方式有哪些？ CORS、Nginx 反向代理、jsonp

CORS怎么做？ 简单请求（`Origin`不在`Access-Control-Allow-Origin`）、非简单请求（预检请求）

application/json属于哪种？ 非简单请求

跨域能携带cookie吗？ `Access-Control-Allow-Credentials:true`+`xhr.withCredentials = true;`

#### SameSite

**SameSite** 这个属性可以让 Cookie 在**跨站**请求时不会被发送，从而可以阻止跨站请求伪造攻击（CSRF）。

> 跨站和跨域是不同的。
>
> Cookie中的「同站」判断：
> 只要两个 URL 的 eTLD+1 相同即可，不需要考虑协议和端口。
> 其中，eTLD 表示有效顶级域名，注册于 Mozilla 维护的公共后缀列表（Public Suffix List）中，例如，.com、.co.uk、.github.io 等。
> eTLD+1 则表示，有效顶级域名+二级域名，例如 taobao.com 等。

例如：
> www.taobao.com 和 www.baidu.com 是跨站，www.a.taobao.com 和 www.b.taobao.com 是同站，a.github.io 和 b.github.io 是跨站(注意是跨站)。

SameSite有三种取值：

`Strict` 仅允许一方请求携带 Cookie，即浏览器将只发送相同站点请求的 Cookie，即当前网页 URL 与请求目标 URL 完全一致。

`Lax` 允许部分第三方请求携带 Cookie

`None` 无论是否跨站都会发送 Cookie

之前默认是 None 的，Chrome80 后默认是 Lax。

#### 事件模型

[冒泡与捕获](https://jiuto.github.io/jiuto_blog/guide/js/babble_capture.html)

#### 事件循环

[event loop 事件循环](https://jiuto.github.io/jiuto_blog/guide/browser/eventloop.html)

#### await/async

await命令后面是一个promise对象，如果不是，会被转换一个立即resolve的promise对象。

await 返回的是什么？ resolve的值

reject怎么办？ try catch

#### preload/prefetch、defer/async

preload（提高优先级，优先加载本页资源）、prefetch（降低优先级，提前加载可能用到的资源）

`<link rel="preload" href="./app.js" as="script">`
`<link rel="prefetch" href="./vendor-async.js">`

+ `<script src="index.js"></script>`没有 defer 或 async，浏览器会立即加载并执行指定的脚本，也就是说不等待后续载入的文档元素，读到就加载并执行。
+ `<script async src="index.js"></script>`async 属性表示异步执行引入的 JavaScript，与 defer 的区别在于，如果已经加载好，就会开始执行。
+ `<script defer src="index.js"></script>`defer 属性表示延迟执行js，设置了defer的js加载不会阻塞dom构建，即js加载时HTML并未停止解析，这两个过程是并行的，都完成后才会执行由defer-script加载的脚本。
+ 在加载多个JS脚本的时候，async是无顺序的加载，而defer是有顺序的加载。

#### DNS 预解析

DNS 实现域名到IP的映射，通过域名访问站点，每次请求都要做DNS解析。
在解析过程中，按照浏览器缓存、系统缓存、路由器缓存、ISP(运营商)DNS缓存、根域名服务器、顶级域名服务器、主域名服务器的顺序，逐步读取缓存，直到拿到IP地址。

DNS Prefetch 是一种 DNS 预解析技术，浏览器会在加载网页时对网页中的域名进行解析并缓存，当用户单击连接时就无需再进行DNS的解析。

Chromium使用超链接的href属性来查找要预解析的主机名。当遇到a标签，Chromium会自动将href中的域名解析为IP地址，这个解析过程是与用户浏览网页并行处理的。
但是为了确保安全性，在HTTPS页面中不会自动解析。

手动解析：

`<link rel="dns-prefetch" href="http://www.spreadfirefox.com/">`

`<meta http-equiv="x-dns-prefetch-control" content="on">`

禁用隐式dns预解析：

`<meta http-equiv="x-dns-prefetch-control" content="off">`

#### 实现防止重复请求

设一个flag标识。（节流也算一种思路）

#### 实现可执行 one(add(two()))与two(add(one())) 的 add、one、two

``` js
function add(a){
    return function(b){
        return a+b
    }
}
function one(a){
    return typeof a === 'function' ? a(1) : 1
}
function two(a){
    return typeof a === 'function' ? a(2) : 2
}
```

---

### 4.26 晚上40min语言面试 WY

> 重复问题：响应式原理、vdom diff、git撤销提交、react和vue区别、vuex原理

#### 多页面打包是怎么配置的？

[webpack多页面打包方法工具和模板](https://jiuto.github.io/jiuto_blog/guide/webpack/webpack_template.html)

#### v-if和v-show区别，怎么考虑什么时候用哪个？

v-if 会重新渲染和销毁，v-show 只是样式层面的隐藏。

从开闭的频率和初始化两方面考虑。

#### 知道哪些可以实现动画效果的方法？

+ JavaScript：通过定时器间歇改变元素样式、[window.requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)
+ CSS3：transition、transform、animation；
+ HTML5：canvas、svg、webgl

#### ECharts 原理

> 未完待续

#### 对node的应用场景和优缺点？

+ Node.js是一个基于V8引擎的事件驱动I/O的服务端JavaScript运行环境。
+ 单进程、单线程
+ 事件驱动
+ 非阻塞I/O(遇到I/O创建线程执行)

"异步机制，事件驱动-回调+事件"

优点：高并发、适合I/O密集型应用。

缺点：只支持单核CPU，不能充分利用CPU、可靠性低，（由于单进程、单线程）一旦代码某个环节崩溃，整个系统都崩溃（解决方案：1.Nnigx反向代理，负载均衡，开多个进程，绑定多个端口；2.开多个进程监听同一个端口，使用cluster模块）、 开源组件库质量参差不齐，更新快，向下不兼容、Debug不方便，错误没有stack trace

应用场景：RESTful API、统一Web应用的UI层、大量Ajax请求的应用

[node系列之 优缺点及适用场景讨论](https://zhuanlan.zhihu.com/p/26288894)

#### koa的机制

> 未完待续

---

### 4.28 下午3小时到场面试3轮技术+1轮hr TYZN

> http1/2、ES6 模块化、Vue2/3、Vue/react、浏览器缓存(cookie、sessionStorage、localStorage)、nodejs特点

#### http0.9

> 只允许客户端发送GET这一种请求，且不支持请求头。
> 由于没有协议头，造成了HTTP/0.9协议只支持一种内容，即纯文本。
> 不过网页仍然支持用HTML语言格式化，同时无法插入图片。
> 一次HTTP/0.9的传输首先要建立一个由客户端到Web服务器的TCP连接，由客户端发起一个请求，然后由Web服务器返回页面内容，然后连接会关闭。
> 如果请求的页面不存在，也不会返回任何错误码。

#### csp

> 添加 Content-Security-Policy  HTTP头部到一个页面，并配置相应的值，以控制用户代理（浏览器等）可以为该页面获取哪些资源。

[内容安全策略( CSP )](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)

#### web安全、跨站请求伪造

[web 安全](https://jiuto.github.io/jiuto_blog/guide/network/security.html)

#### webpack 性能优化

持久化缓存（hash,chunkhash和contenthash）、cache（缓存生成的 webpack 模块和 chunk，用来改善构建速度）、懒加载、压缩插件、分离打包

#### babel 原理、预设

> 未完待续

#### Tree-shaking原理

**定义**

Tree-shaking 是指将没有使用到的代码删去，比如我们在项目中引入了某些依赖，但只使用了其中的部分功能，通过 Tree-shaking 可以将没有用到的代码删除。

**意义**

> javascript绝大多数情况需要通过网络进行加载，然后执行，加载的文件大小越小，整体执行时间更短，所以去除无用代码以减少文件体积，对javascript来说更有意义。

**DCE**

DCE（dead code elimination），无用代码消除。

> Tree-shaking 是 DCE 的一种新的实现，和传统的 DCE 的方法又不太一样，传统的 DCE 消灭不可能执行的代码，而 Tree-shaking 更关注宇消除没有用到的代码。
>
> Dead Code 一般具有以下几个特征：
> + 代码不会被执行，不可到达
> + 代码执行的结果不会被用到
> + 代码只会影响死变量（只写不读）

js中，由代码压缩优化工具 uglify 完成DCE。

**原理**

Tree-shaking原理依赖于ES6的模块特性。

> ES6模块依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析，这就是tree-shaking的基础。
>
> 所谓静态分析就是不执行代码，从字面量上对代码进行分析，ES6之前的模块化，比如我们可以动态require一个模块，只有执行后才知道引用的什么模块，这个就不能通过静态分析去做优化。

**工具**

Rollup、Webpack、Closure compiler

Webpack4 中的 Tree-shakingg 相关配置：

在`package.json`中设置`"sideEffects": false`，表示项目中导入引入的都是没有副作用的函数或类，可以安全地删除未用到的export。

对于有副作用的导出文件，可以这样设置来告知webpack`"sideEffects": [ "./src/some-side-effectful-file.js" ]`。

也可以通过 module.rules 配置设置 sideEffects。

#### Vue/React设计思想

> vue的整体思想仍然是拥抱经典的html(结构)+css(表现)+js(行为)的形式，vue鼓励开发者使用template模板，并提供指令供开发者使用(v-if、v-show、v-for等等)，因此在开发vue应用的时候会有一种在写经典web应用（结构、表现、行为分离）的感觉。另一方面，在针对组件数据上，vue2.0通过Object.defineProperty对数据做到了更细致的监听，精准实现组件级别的更新。
>
> react整体上是函数式的思想，组件使用jsx语法，all in js，将html与css全都融入javaScript，jsx语法相对来说更加灵活。
> 当组件调用setState或props变化的时候，组件内部render会重新渲染，子组件也会随之重新渲染，可以通过shouldComponentUpdate或者PureComponent可以避免不必要的重新渲染。

#### 设计模式

[Javascript常用的设计模式详解](https://www.cnblogs.com/tugenhua0707/p/5198407.html)

[JavaScript 常见设计模式解析](https://juejin.cn/post/6844903474535071752#heading-0)

[JavaScript 中常见设计模式整理](https://juejin.cn/post/6844903607452581896)

#### 递归的特点

调用自身、相同的步骤、必须有出口...

#### 尾递归优化

**尾调用**

尾调用优化：只保留内层函数的调用帧。

尾调用优化，节约内存，防止栈溢出。

只有不再用到外层函数的内部变量，内层函数的调用帧才会取代外层函数的调用帧，否则就无法进行“尾调用优化”。

**尾递归**

函数调用自身称为递归，尾调用自身就称为尾递归。

递归本身就非常耗内存，因为要保存多个调用帧，容易栈溢出（stack overflow）。尾递归优化，只保存一个调用帧。

尾递归的实现：把所有用到的内部变量改写成函数的参数。

**斐波那契数列尾递归改写**

``` js
function Fibonacci(n){
    if(n<=1) {return 1}
    return Fibonacci(n-1)+Fibonacci(n-2)
}
console.log(Fibonacci(10)) // 89
console.log(Fibonacci(100)) // 堆栈溢出

function Fibonacci2(n,ac1=1,ac2=1){
    if(n<=1) {return ac2}
    return Fibonacci2(n-1,ac2,ac1+ac2)
}
console.log(Fibonacci2(10)) // 89
console.log(Fibonacci2(100)) // 573147844013817200000
```

**严格模式**

ES6的尾递归优化只在严格模式下开启，因为严格模式下禁用函数内部的caller和arguments变量。

**尾递归优化实现**

1. 利用trampoline蹦床函数，将递归转换为循环。

``` js
function trampoline(f){
    while(f && f instanceof Function){
        f=f()
    }
    return f
}
function sum(x,y){
    if(y>0){
        return sum.bind(null,x+1,y-1)
    }else{
        return x;
    }
}
trampoline(sum(1,10000))
```

2. 利用tco，将递归转换为循环。

``` js
function tco(f) {
    var value;
    var active=false;
    var accumulated=[];
    return function accumulator(){
        accumulated.push(arguments); // 每一项都是一轮递归的arguments
        if(!active){
            active=true;
            while(accumulated.length){
                value = f.apply(this,accumulated.shift())
            }
            active=false;
            return value;
        }
    }
}
var sum = tco(function sum(x,y){
    if(y>0){
        return sum(x+1,y-1)
    }else{
        return x;
    }
})
sum(1,10000)
```

每一次return的sum由于active处于true状态，返回的都是undefined，避免了递归，而每次调用sum都增加了accumulated的长度。

> 摘自《ES6标准入门》P124-132

#### 手写编程题

百元买百鸡、青蛙跳台阶

> 未完待续

---

### 其他

#### dom列表倒置

``` html
<ul id="ul">
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
    <li>6</li>
</ul>
<script>
    var ul = document.getElementById("ul"),
        flag = document.createDocumentFragment(),
        arr;

    arr = Array.from(ul.children); // 类数组转换，也可用Array.prototype.slice.call(ul.children)
    arr.reverse(); // 倒置原数组，reverse会改变原数组，不会生成新的数组
    ul.innerHTML = ""; // 清空ul
    // 将倒置后的节点按顺序添加到空节点上
    arr.forEach((item)=>{
        flag.appendChild(item)
    })
    // 最后一次性添加到ul上
    ul.appendChild(flag);
</script>
```

#### webpack缓存

``` js
// webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: {
      main:"main.js",
      sub:"sub.js"
  },
  output: {
    path: "/dist",
    filename: "[name].[hash].js"
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: `index.html`,
        filename: `index.html`,
        chunks: ["vendors", "index"],
        hash:true,
        minify: {
            html5: true,
            collapseWhitespace: true,
            preserveLineBreaks: false,
            minifyCSS: true,
            minifyJS: true,
            removeComments: true,
        },
    })
  ]
};
```

#### 快速排序

``` js
function quickSort(arr) {
    if(arr.length<=1) return arr
    var left = [],
        right = [],
        pos = arr.splice(0,1);
    for(let i = 0; i < arr.length; i++) {
        arr[i] <= pos ? left.push(arr[i]) : right.push(arr[i])
    }
    return quickSort(left).concat(pos,quickSort(right))
}
var array = [5,8,23,57,1,56,88,6,43]
console.log(quickSort(array)) // [1, 5, 6, 8, 23, 43, 56, 57, 88]
console.log(array) // [8, 23, 57, 1, 56, 88, 6, 43]
```

平均时间复杂度O(logn)，最坏时间复杂度O(n²)，空间复杂度O(nlogn)，不是稳定。

假设有两个相同的数A和B，在排序之前A在B的前面，经过排序之后B跑到了A的前面，就叫做排序的不稳定性。

#### 斐波那契数列

0 1 1 2 3 5 8 ...

``` js
function fibonacci(n) {
    return n === 0 || n === 1 ? n : fibonacci(n-1) + fibonacci(n-2)
}
function memory(fn) {
    var m = new Map();
    return function(n) {
        if(m.get(n)) {
            return m.get(n)
        }else{
            let rtn = fn(n);
            m.set(n, rtn);
            return rtn
        }
    }
}
var newFibonacci = memory(fibonacci);
console.log(newFibonacci(7))
```

#### css 样式隔离

命名空间、css Modules(一种构建步骤中的一个进程)、CSS in JS、[Shadow DOM](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_shadow_DOM)

#### gitlab 权限控制

[Gitlab管理用户、组、权限](https://www.cnblogs.com/zangxueyuan/p/9222014.html)

#### 手写一个 isEqual

``` js
var eq, deepEq;
eq = function(a, b, aStack, bStack) {
  if (a === b) return a !== 0 || 1 / a === 1 / b; // 排除 0 === -0，使这种情况下返回false
  if (a == null || b == null) return false; // === 失败的情况下，排除 null == undefined
  if (a !== a) return b !== b; // 由于NaN!==NaN，另作判断，当a、b都为NaN时返回true
  var type = typeof a;
  if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
  return deepEq(a, b, aStack, bStack);
};

deepEq = function (a, b, aStack, bStack) {
    //如果a，b是_的一个实例的话，需要先把他们解包出来再进行比较。
	if (a instanceof _) a = a._wrapped;
	if (b instanceof _) b = b._wrapped;

	var className = toString.call(a);
	if (className !== toString.call(b)) return false;
	switch (className) {
		//如果a，b为正则表达式，那么转化为字符串判断是否相等即可。
		case '[object RegExp]':
		case '[object String]':
			// var a = new String('12'),b = new String('12');
            // a === b // false
			return '' + a === '' + b;
		case '[object Number]':
			//数字对象转化为数字进行比较，并且要考虑new Number(NaN) === new Number(NaN)应该要成立的情况。
			if (+a !== +a) return +b !== +b;
			//排除0 === -0 的情况。
			return +a === 0 ? 1 / +a === 1 / b : +a === +b;
		case '[object Date]':
		//Date类型以及Boolean类型都可以转换为number类型进行比较。
		//在变量前加一个加号“+”，可以强制转换为数值型。
		//在Date型变量前加一个加号“+”可以将Date转化为毫秒形式；Boolean类型同上（转换为0或者1）。
		case '[object Boolean]':
			return +a === +b;
		case '[object Symbol]':
			return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
	}

	var areArrays = className === '[object Array]';
	//如果不是数组对象。
	if (!areArrays) {
		if (typeof a != 'object' || typeof b != 'object') return false;
		//比较两个非数组对象的构造函数。
		var aCtor = a.constructor, bCtor = b.constructor;
		if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
			_.isFunction(bCtor) && bCtor instanceof bCtor)
			&& ('constructor' in a && 'constructor' in b)) {
			return false;
		}
	}

	//初次调用eq函数时，aStack以及bStack均未被传递，在循环递归的时候，会被传递进来。
	//aStack和bStack存在的意义在于循环引用对象之间的比较。
	aStack = aStack || [];
	bStack = bStack || [];
	var length = aStack.length;
	
	while (length--) {
		if (aStack[length] === a) return bStack[length] === b;
	}

	//初次调用eq函数时，就把两个参数放入到参数堆栈中去，保存起来方便递归调用时使用。
	aStack.push(a);
	bStack.push(b);

	//如果是数组对象。
	if (areArrays) {
		length = a.length;
		//长度不等，直接返回false认定为数组不相等。
		if (length !== b.length) return false;
		while (length--) {
			//递归调用。
			if (!eq(a[length], b[length], aStack, bStack)) return false;
		}
	} else {
		//对比纯对象
		var keys = _.keys(a), key;
		length = keys.length;
		//对比属性数量，如果数量不等，直接返回false。
		if (_.keys(b).length !== length) return false;
		while (length--) {
			key = keys[length];
			if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
		}
	}

    //循环递归结束，把a，b堆栈中的元素推出。
	aStack.pop();
	bStack.pop();
	return true;
};
```

[如何判断JavaScript中的两变量是否相等？](https://juejin.cn/post/6844903569502502920#heading-8)
