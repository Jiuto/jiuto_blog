## 源码分析vue watch侦听器

> 在阅读侦听器源码之前，建议先看一下响应式相关的源码[源码分析vue响应式原理](https://jiuto.github.io/jiuto_blog/guide/vue/initData.html)，有助理解。

### 侦听器的几种用法

``` html
<div id="app">
    <input v-model="text1">
    <input v-model="text2">
    <input v-model="text3.val">
    <input v-model="text4.val">
</div>
```

``` js
var vm = new Vue({
    el: '#app',
    data: {
        text1: 'Hello 1',
        text2: 'Hello 2',
        text3: {
            val: 'Hello 3',
        },
        text4: {
            val: 'Hello 4',
        },
    },
    watch: {
        text1: 'fun',
        text2: function(newVal, oldVal){
            console.log('newVal:', newVal)
            console.log('oldVal:', oldVal)
        },
        'text3.val': {
            handler: function(newVal, oldVal){
                console.log('newVal:', newVal)
                console.log('oldVal:', oldVal)
            },
            deep: true,
            immediate: true,
        },
        text4: [
            'fun',
            function(newVal, oldVal){
                console.log('newVal:', newVal)
                console.log('oldVal:', oldVal)
            },
            {
                handler: function(newVal, oldVal){
                    console.log('newVal:', newVal)
                    console.log('oldVal:', oldVal)
                },
                deep: true,
                immediate: true,
            },
        ]
    },
    methods: {
        fun (newVal, oldVal) { 
            console.log('newVal:', newVal)
            console.log('oldVal:', oldVal)
        }
    }
})
```

### vm.$watch API

[vm.$watch( expOrFn, callback, [options] )](https://cn.vuejs.org/v2/api/#vm-watch)

+ 参数：

+ {string | Function} expOrFn
+ {Function | Object} callback
+ {Object} [options]

    {boolean} deep 为了发现对象内部值的变化，可以在选项参数中指定 deep: true。注意监听数组的变更不需要这么做

    {boolean} immediate 在选项参数中指定 immediate: true 将立即以表达式的当前值触发回调

+ 返回值：{Function} unwatch

### 源码分析

#### vue实例化入口

在vue源码入口文件[vue/src/core/index.js](https://github.com/vuejs/vue/blob/dev/src/core/index.js)中，可以看到`import Vue from './instance/index'`，导入了Vue这个对象。


在[vue/src/core/instance/index.js](https://github.com/vuejs/vue/blob/dev/src/core/instance/index.js)中，

``` js
import { initMixin } from './init'
import { stateMixin } from './state'
//...

function Vue (options) {
  //...
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
// ...

export default Vue
```

可以看到Vue是一个函数方法，调用该方法时会调用一个叫_init的初始化方法，并传入options参数，同时这个文件还执行了 initMixin 和 stateMixin 方法。

#### initMixin 和 _init

在[vue/src/core/instance/init.js](https://github.com/vuejs/vue/blob/dev/src/core/instance/init.js)中，

``` js
// ...
import { initState } from './state'
import { extend, mergeOptions, formatComponentName } from '../util/index'

export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this

    // ...

    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    // ...
    initState(vm)

    // ...
  }
}
```

看到_init方法就是在initMixin方法中定义的，在_init方法中，声明了常量vm并赋值当前实例，接受了options并做了处理，还调用了initState方法。

#### initState

在[vue/src/core/instance/state.js](https://github.com/vuejs/vue/blob/dev/src/core/instance/state.js)中，

``` js
import {
  set,
  del,
  observe,
  defineReactive,
  toggleObserving
} from '../observer/index'

export function initState (vm: Component) {
  // ...
  const opts = vm.$options
  // ...
  if (opts.watch && opts.watch !== nativeWatch) { 
    initWatch(vm, opts.watch)
  }
}
```

[vue/src/core/util/env.js](https://github.com/vuejs/vue/blob/dev/src/core/util/env.js)

``` js
// Firefox has a "watch" function on Object.prototype...
export const nativeWatch = ({}).watch
```

如果watch存在，并排除火狐浏览器Object对象原生watch方法，则调用initWatch方法。

#### initWatch

``` js
function initWatch (vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key]
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}
```

initWatch方法根据传入的watch对象的每一个属性，调用了createWatcher，传入当前实例，属性名，属性值。

回忆一下最开始提到的这种写法：

``` js
//...
    text4: [
        'fun',
        function(newVal, oldVal){
            console.log('newVal:', newVal)
            console.log('oldVal:', oldVal)
        },
        {
            handler: function(newVal, oldVal){
                console.log('newVal:', newVal)
                console.log('oldVal:', oldVal)
            },
            deep: true,
            immediate: true,
        },
    ]
//...
```

于是可以理解，如果属性值是数组，则进行遍历，以同一个key不同handler多次调用createWatcher。

#### createWatcher

``` js
function createWatcher (
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  return vm.$watch(expOrFn, handler, options)
}
```

[vue/src/shared/util.js](https://github.com/vuejs/vue/blob/dev/src/shared/util.js)

``` js
export function isPlainObject (obj: any): boolean {
  return _toString.call(obj) === '[object Object]'
}
```

回忆一下最开始提到的这种写法：

``` js
//...
    text1: 'fun',
    'text3.val': {
        handler: function(newVal, oldVal){
            console.log('newVal:', newVal)
            console.log('oldVal:', oldVal)
        },
        deep: true,
        immediate: true,
    }
//...
```

如果handler是否为一个Object实例，将handler对象的handler属性的值，作为vm.$watch的第二个参数，原入参handler对象作为第三个参数。

如果handler是一个字符串，则从实例对象上获取这个属性，作为第二个参数。

#### stateMixin

``` js
export function stateMixin (Vue: Class<Component>) {
  //...

  Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this
    // 如果传进来的第二个参数还是对象，则回到createWatcher
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    // 实例化Watcher观察者实例
    const watcher = new Watcher(vm, expOrFn, cb, options)
    // 如果设置了immediate，直接调用一次回调
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value)
      } catch (error) {
        handleError(error, vm, `callback for immediate watcher "${watcher.expression}"`)
      }
    }
    // 返回unwatchFn方法，可通过闭包伪删除当前观察者实例
    return function unwatchFn () {
      watcher.teardown()
    }
  }
}
```

#### Watcher 构造函数

[vue/src/core/observer/watcher.js](https://github.com/vuejs/vue/blob/dev/src/core/observer/watcher.js)

回忆一下[源码分析vue响应式原理](https://jiuto.github.io/jiuto_blog/guide/vue/initData.html)中，
我们的data对象，有一个__ob__属性，对应一个Observer实例，Observer实例会重写data上的每一个属性，并通过闭包保存每个属性各自的dep数组，
而每一个dep数组，收集了这个属性的所有Watcher观察者实例，而每一个观察者实例各自有一个deps依赖集，反向收集闭包的dep。

理解这个之后，我们再来稍微看一下Watcher

``` js
export default class Watcher {
  vm: Component;
  expression: string;
  cb: Function;
  id: number;
  deep: boolean;
  user: boolean;
  lazy: boolean;
  sync: boolean;
  dirty: boolean;
  active: boolean;
  deps: Array<Dep>;
  newDeps: Array<Dep>;
  depIds: SimpleSet;
  newDepIds: SimpleSet;
  before: ?Function;
  getter: Function;
  value: any;

  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm
    if (isRenderWatcher) {
      vm._watcher = this
    }
    // _watcher存放观察者实例
    vm._watchers.push(this)
    // options
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
      this.before = options.before
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // 注意：Watcher实例的id是递增的
    this.active = true
    this.dirty = this.lazy
    this.deps = [] // 已添加的依赖数组
    this.newDeps = [] // 一个缓存数组，用于保存即将要添加的依赖
    this.depIds = new Set() // 已添加的依赖id数组
    this.newDepIds = new Set() // 一个缓存数组，用于保存即将要添加的依赖id
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
    // expOrFn 可能是一个函数，也可能是字符串表达对象上的属性，如”a.b“，需要通过parsePath解析，返回也是一个函数
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = noop
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
    // lazy为false执行get初始化
    this.value = this.lazy
      ? undefined
      : this.get()
  }

  // 获取监听属性的值，收集dep依赖
  get () {
    // 修改Dep.target指向当前Watcher
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      // 执行getter获取监听的data属性，同时触发该属性对应的dep依赖的depend()方法，通过该方法调用addDep
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // 如果设置了深度监听
      if (this.deep) {
        traverse(value) // 调用traverse对数组和对象类型进行递归遍历，触发每一个getter
      }
      // 修改Dep.target为null
      popTarget()
      this.cleanupDeps()
    }
    return value
  }

  // 增加依赖，在dep依赖的depend()方法中调用，
  addDep (dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) { 
      // 将依赖增加到缓存里
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      // 调用dep依赖的addSub收集当前观察者
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

  // 清空缓存依赖
  cleanupDeps () {
    // 遍历依赖数组
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      // 不在缓存里的dep需要调用dep依赖的removeSub删除当前观察者
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    // 把newDepIds和newDeps设置给depIds和deps并清空缓存
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }

  // 更新
  update () {
    // lazy为true，设置dirty为true
    if (this.lazy) {
      this.dirty = true
    } 
    // 同步则执行run
    else if (this.sync) {
      this.run()
    }
    // 异步执行queueWatcher推送到观察者队列，最终会通过nextTick调用到run方法
    else {
      queueWatcher(this)
    }
  }

  // 更新值并执行回调
  run () {
    // active默认为true
    if (this.active) {
      const value = this.get()
      // 值不等时，或值是数组或对象时，或深度监听时
      if (
        value !== this.value ||
        isObject(value) ||
        this.deep
      ) {
        // 给this.value赋最新的值
        const oldValue = this.value
        this.value = value
        // 执行Watcher的回调
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }

  // 触发get，将dirty设置为false
  evaluate () {
    this.value = this.get()
    this.dirty = false
  }

  // 遍历deps执行每个dep依赖的depend方法
  depend () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }

  // 伪删除当前Watcher实例
  teardown () {
    if (this.active) {
      // 当_isBeingDestroyed为false，从当前vue实例的观察者实例数组中移除自身
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this)
      }
      // 遍历deps执行每个dep依赖的removeSub，从而移除当前watch
      let i = this.deps.length
      while (i--) {
        this.deps[i].removeSub(this)
      }
      // 设置active为false
      this.active = false
    }
  }
}
```

关于expOrFn的理解，API文档上有这样一个例子可以帮助理解：

``` js
// 键路径
vm.$watch('a.b.c', function (newVal, oldVal) {
  // 做点什么
})

// 函数
vm.$watch(
  function () {
    // 表达式 `this.a + this.b` 每次得出一个不同的结果时
    // 处理函数都会被调用。
    // 这就像监听一个未被定义的计算属性
    return this.a + this.b
  },
  function (newVal, oldVal) {
    // 做点什么
  }
)
```

[vue/src/core/util/lang.js](https://github.com/vuejs/vue/blob/dev/src/core/util/lang.js)

``` js
const bailRE = new RegExp(`[^${unicodeRegExp.source}.$_\\d]`)
export function parsePath (path: string): any {
  if (bailRE.test(path)) {
    return
  }
  const segments = path.split('.')
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}
```

[vue/src/core/observer/traverse.js](https://github.com/vuejs/vue/blob/dev/src/core/observer/traverse.js)：

``` js
const seenObjects = new Set()

export function traverse (val: any) {
  _traverse(val, seenObjects)
  seenObjects.clear()
}

function _traverse (val: any, seen: SimpleSet) {
  let i, keys
  const isA = Array.isArray(val)
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  // 避免重复遍历
  if (val.__ob__) {
    const depId = val.__ob__.dep.id
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }
  // 深度遍历数组和对象
  if (isA) {
    i = val.length
    while (i--) _traverse(val[i], seen)
  } else {
    keys = Object.keys(val)
    i = keys.length
    while (i--) _traverse(val[keys[i]], seen)
  }
}
```

#### queueWatcher

[vue/src/core/observer/scheduler.js](https://github.com/vuejs/vue/blob/dev/src/core/observer/scheduler.js)：

``` js
const queue: Array<Watcher> = [] // 观察者队列
let has: { [key: number]: ?true } = {} // 用于保存观察者id的对象
let waiting = false // 用于判断上一轮nextTick的清空观察者任务是否执行完毕
let flushing = false // 用于判断是否正在清空观察者队列
let index = 0 // 正在清空的观察者在队列中的下标

export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    // 如果不是正在清空队列，直接将新传入的观察者推到队尾
    if (!flushing) {
      queue.push(watcher)
    }
    // 如果正在清空队列
    else {
      let i = queue.length - 1
      /** 正在清空的观察者不是队列最后一个，并且最后一个观察者id大于传入的id，
       * （注意，在Watcher构造函数部分我们知道观察者实例的id是递增的数字，所以我们可以进行上述比较）
       * 那么我们就需要将观察者插入到队列的中间。
       * 如果正在清空最后一个观察者，那么效果其实和上面的if是一样的，插入队尾，
       * 在下一轮nextTick进行清空。*/
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // 上一轮清空已经完毕
    if (!waiting) {
      waiting = true
      // 设置同步则直接调用
      if (process.env.NODE_ENV !== 'production' && !config.async) {
        flushSchedulerQueue()
        return
      }
      // 异步则将清空方法传给nextTick
      nextTick(flushSchedulerQueue)
    }
  }
}
```

flushSchedulerQueue 清空观察者队列

``` js
export const MAX_UPDATE_COUNT = 100
const activatedChildren: Array<Component> = []

// 重置状态
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0
  has = {}
  if (process.env.NODE_ENV !== 'production') {
    circular = {}
  }
  waiting = flushing = false
}
// 执行清空队列
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow()
  flushing = true
  let watcher, id

  /** 清空观察者队列前做好排序以确保：
   * 1. 父组件比子组件先更新，因为父组件比子组件先创建
   * 2. user watchers 比 render watcher 先更新
   * 3. 如果一个父组件的watcher正在清空，而子组件被销毁，那么子组件的watcher略过
  */
  queue.sort((a, b) => a.id - b.id)

  // 因为在清空过程中队列仍然可以改变，所有每轮循环动态取队列长度
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    if (watcher.before) {
      watcher.before()
    }
    id = watcher.id
    // 在这里从has中清除当前watcher的id
    has[id] = null
    // 执行watcher的run方法，执行回调
    watcher.run()
    // in dev build, check and stop circular updates.
    // 非生成环境，如果此处has中又有这个watcher id
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      // 记录本次清空队列已对这个watcher执行清空操作的次数
      circular[id] = (circular[id] || 0) + 1
      // 如果超过设置的最大限制100次，要报警告，提示可能有死循环
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? `in watcher with expression "${watcher.expression}"`
              : `in a component render function.`
          ),
          watcher.vm
        )
        break
      }
    }
  }

  // 重置状态前保存副本
  const activatedQueue = activatedChildren.slice()
  const updatedQueue = queue.slice()

  resetSchedulerState()

  // 调用组件的 updated/activated 钩子
  callActivatedHooks(activatedQueue)
  callUpdatedHooks(updatedQueue)

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush')
  }
}
```

> 关于生命周期的部分就不展开了
