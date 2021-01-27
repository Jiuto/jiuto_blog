## vue中$nextTick的实现

### 前置知识：宏任务 macrotask 和 微任务 microtask

任务队列分为 microtask 和 macrotask，且在node和不同的浏览器环境执行方式不同。

> 宿主环境提供的叫宏任务，由语言标准提供的叫微任务。
> 宿主环境：
> 简单来说就是能使javascript完美运行的环境，只要能完美运行javascript的载体就是javascript的宿主环境。目前我们常见的两种宿主环境有浏览器和node。宿主环境内所有的内建或自定义的变量/函数都是 global/window 这个全局对象的属性/方法，而由宿主环境提供的也叫宏任务。
> 语言标准：
> 我们都知道JavaScript是一种编程语言，但其实JavaScript由ECMA制定标准，称之为ECMAScript，所以由语言标准提供的就是微任务，比如ES6提供的promise。

`宏任务：macrotask：setTimeout、setImmediate`
`微任务： microtask：Promise、MutationObserver`

这里只讨论浏览器环境下接收范围比较广的，例如谷歌浏览器：

当调用栈空闲后每次事件循环只会从 macrotask 中读取一个任务并执行，而在同一次事件循环内会将 microtask 队列中所有的任务全部执行完毕，且要先于 macrotask。

---

+ [MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver) 简单介绍

MutationObserver接口提供了监视对DOM树所做更改的能力。它被设计为旧的Mutation Events功能的替代品，该功能是DOM3 Events规范的一部分。

``` js
  // MutationObserver 创建一个微任务
  const observer = new MutationObserver(function(){console.log(666)})
  let counter = 1
  const textNode = document.createTextNode(String(counter))
  
  observer.observe(textNode, {
      characterData: true 
      // 设为true以监视指定目标节点或子节点树中节点所包含的字符数据的变化
  })
  
  counter = (counter + 1) % 2
  textNode.data = String(counter)
```

---

+ macrotask 和 microtask 执行过程实例(现场演示，看文档的同学可以自己试着跑一下)

``` js
  console.log('1');

  setTimeout(function() {
      console.log('2');
      new Promise(function(resolve) {
          console.log('3');
          resolve();
      }).then(function() {
          console.log('4')
      })
      setTimeout(()=>{
          console.log('5')
      })
      // MutationObserver 创建一个微任务
      let counter = 1
      const observer = new MutationObserver(function(){console.log(6)})
      const textNode = document.createTextNode(String(counter))
      observer.observe(textNode, {
          characterData: true // 设为true以监视指定目标节点或子节点树中节点所包含的字符数据的变化。
      })
      counter = (counter + 1) % 2
      textNode.data = String(counter)
  })

  // new promise 会立即执行， then会分发到微任务
  new Promise(function(resolve) {
      console.log('7');
      resolve();
  }).then(function() {
      console.log('8')
  })

  setTimeout(function() {
      console.log('9');
      new Promise(function(resolve) {
          console.log('10');
          resolve();
      }).then(function() {
          console.log('11')
      })
  })
```

event loop 的原理大家可以看看下面这两篇文章

[Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

[一次弄懂Event Loop](https://juejin.cn/post/6844903764202094606#heading-36)

---

### 引出问题：为什么使用$nextTick

在vue项目中，可以用 setTimeout 替换 $nextTick，形如用 setTimeout(cb, 0) 代替 $nextTick(cb)，既然可以使用 setTimeout 替换 $nextTick 那么为什么不用 setTimeout 呢？

原因就在于 setTimeout 并不是最优的选择，$nextTick 的意义就是它会选择一条最优的解决方案，即优先选择微任务。

> 在 macrotask 中两个不同的任务之间可能穿插着UI的重渲染，那么我们只需要在 microtask 中把所有在UI重渲染之前需要更新的数据全部更新，这样只需要一次重渲染就能得到最新的DOM了，所以要优先选用 microtask 去更新数据状态而不是 macrotask。

---

### nextTick 的实现

1. $nextTick

``` js
Vue.prototype.$nextTick = function (fn: Function) {
	return nextTick(fn, this)
}
```

我们常用的 $nextTick 方法实际上就是对 nextTick 函数的封装。

2. 整体结构

打开[/src/core/util/next-tick.js](https://github.com/vuejs/vue/blob/dev/src/core/util/next-tick.js)文件可以看到文件大体结构如下：

``` js
    // 从外部导入一些方法 noop、handleError、isIE、isIOS、isNative
    import ... 

    // 声明一些变量
    export let isUsingMicroTask = false // 导出一个变量，标志是否使用微任务
    const callbacks = [] // nextTick的回调函数队列
    let pending = false // 标志回调队列callbacks是否处于等待刷新的状态，初始false，代表回调队列为空，不需要等待刷新

    // 声明 flushCallbacks 函数
    function flushCallbacks () {...} // 清空回调队列函数（先进先出），作为setTimeout、setImmediate、Promise、MutationObserver等的回调函数

    // 声明 timerFunc 函数
    let timerFunc // timerFunc 函数采用合适的策略将 flushCallbacks 作为回调注册一个微任务或宏任务
    if(){...}else if(){...}else if(){...}else{...} // 采用合适的策略补充 timerFunc 函数


    // 导出 nextTick 函数主体
    export function nextTick (cb, ctx) {...}
```

3. flushCallbacks 函数

``` js
    // 清空回调队列函数（先进先出）
    // 作为setTimeout、setImmediate、Promise、MutationObserver等的回调函数
    function flushCallbacks () {
      pending = false // 将变量 pending 重置为 false 
      const copies = callbacks.slice(0) // 备份
      callbacks.length = 0 // 清空  
      for (let i = 0; i < copies.length; i++) {
        copies[i]()
      }
	  // 疑点：为什么备份并在遍历 copies 数组之前将 callbacks 数组清空，将pending重置？
    }
```

4. timerFunc 函数 - 本部分即最优解的实现

``` js
	// timerFunc 函数采用合适的策略将 flushCallbacks 作为回调注册一个微任务或宏任务
    let timerFunc

    if (typeof Promise !== 'undefined' && isNative(Promise)) {
      const p = Promise.resolve()
      timerFunc = () => {
        p.then(flushCallbacks)
        if (isIOS) setTimeout({})
      }
      isUsingMicroTask = true
    } 
```


`if (isIOS) setTimeout({})` 这一行是一个解决怪异问题的变通方法。

在一些 UIWebViews 中存在很奇怪的问题，即 microtask 没有被刷新，
对于这个问题的解决方案就是让浏览做一些其他的事情，比如注册一个 (macro)task， 
即使这个 (macro)task 什么都不做，这样就能够间接触发 microtask 的刷新。



如果宿主环境不支持 Promise，我们就需要降级处理。

vue曾经采用的是这样的降级顺序 `Promise > setImmediate > MessageChannel > setTimeout`

后来改成了 `（dev分支）是 Promise > MutationObserver > setImmediate > setTimeout`


``` js
    else if (!isIE && typeof MutationObserver !== 'undefined' && (
      isNative(MutationObserver) ||
      MutationObserver.toString() === '[object MutationObserverConstructor]'
    )) {
      let counter = 1
      const observer = new MutationObserver(flushCallbacks)
      const textNode = document.createTextNode(String(counter))
      observer.observe(textNode, {
        characterData: true
      })
      timerFunc = () => {
        counter = (counter + 1) % 2
        textNode.data = String(counter)
      }
      isUsingMicroTask = true
    }
```

`setImmediate`拥有比`setTimeout`更好的性能，因为`setTimeout`在将回调注册为 macrotask 之前要不停的做超时检测，而`setImmediate`则不需要。
但是`setImmediate`的缺陷也很明显，就是它的兼容性问题，到目前为止只有IE浏览器实现了它。


``` js
    else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
      timerFunc = () => {
        setImmediate(flushCallbacks)
      }
    } else {
      timerFunc = () => {
        setTimeout(flushCallbacks, 0)
      }
    }
```

5. nextTick 主体

``` js
    function nextTick (cb, ctx) {
      let _resolve // 用于无回调函数时

	    //向回调函数队列添加一个新的函数
      callbacks.push(() => {
        if (cb) {
          try {
            cb.call(ctx) 
            //对于 $nextTick 方法来讲，传递给 $nextTick 的回调函数的作用域,
            //就是当前组件实例对象
          } catch (e) {
            handleError(e, ctx, 'nextTick')
          }
        } else if (_resolve) {
          _resolve(ctx)
          // 当 flushCallbacks 函数开始执行 callbacks 数组中的函数时，
          // 如果没有传递 cb 参数，则直接调用 _resolve 函数
        }
      })

      if (!pending) {...}

      if (!cb && typeof Promise !== 'undefined') {...}
    }
```

``` js
	    // 注册微任务/宏任务
      if (!pending) {
      	pending = true
        timerFunc() 
      }
```

pending初始值为false，第一次调用nextTick时，设pending为true，代表此时回调队列不为空，正在等待刷新，后面再调用nextTick时，就不会再注册新的微任务/宏任务。
调用timerFunc函数，将flushCallbacks注册为微任务/宏任务，但此时 flushCallbacks 函数并不会执行，需等待调用栈被清空之后才会执行，即实现了等数据准备完（例1中可视为data1改变后），再实行更新（打印data1）

``` js
      // 无回调函数情况
      if (!cb && typeof Promise !== 'undefined') {
        return new Promise(resolve => {
          _resolve = resolve
        })
      }
```

在使用 $nextTick 方法时是可以省略回调函数这个参数的，这时 $nextTick 方法会返回一个 promise 实例对象。
当 nextTick 函数没有接收到 cb 参数时，会检测当前宿主环境是否支持 Promise，如果支持则直接返回一个 Promise 实例对象，并且将 resolve 函数赋值给 _resolve 变量


+ 例1：解释nextTick实现过程

``` js
    var data1 = 'data1'

    let cb1 = function(){
      // do sth
      console.log('this is callback: '+data1)
    }

    let cb2 = function(){
      console.log('this is callback2')
    }

    console.log(data1)

    nextTick(cb1,this)
    nextTick(cb2,this) // 此时callback栈内已搜集所有回调函数

    data1="data1 changed"

    let p = nextTick() // 无cb

```

+ 例2：回答疑点：为什么备份并在遍历 copies 数组之前将 callbacks 数组清空？

``` js
    let cb3 = function(){
      console.log('this is callback3')
    }
    var data2 = 'data2'

    nextTick(function(){
      data2 = 'new data2'
      nextTick(cb3,this)
    },this)

```

嵌套nextTick的时候（不推荐这么写），使子nextTick行为不受影响。
第一次执行 flushCallbacks 时，先重置pending并清空callback，再执行函数:
``` js
function(){
    data2 = 'new data2'
    nextTick(cb3,this)
}
```
当nextTick(cb3,this)执行时，callback已清空，
所以cb3被push后回调队列为 [ cb3 ]，
pending为false，
所以会将 flushCallbacks 函数注册为一个新的 microtask

---

#### 参考

[宿主环境提供的叫宏任务，由语言标准提供的叫微任务](https://www.jianshu.com/p/a697e9bfdaef)

[MutationObserver API](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)

[vue技术内幕](http://caibaojian.com/vue-design/art/8vue-reactive-dep-watch.html#nexttick-%E7%9A%84%E5%AE%9E%E7%8E%B0)

