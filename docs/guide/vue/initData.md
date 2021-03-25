## 源码分析vue响应式原理

> 经过上篇[简单实现vue响应式原理](https://jiuto.github.io/jiuto_blog/guide/vue/responsive.html)之后，
> 我们已经大概了解了响应式是怎么通过发布-订阅模式来实现的，这篇主要就是看看vue的源码是怎么初始化data的。

### 找到initData

在vue源码入口文件[vue/src/core/index.js](https://github.com/vuejs/vue/blob/dev/src/core/index.js)中，可以看到`import Vue from './instance/index'`，导入了Vue这个对象。


在[vue/src/core/instance/index.js](https://github.com/vuejs/vue/blob/dev/src/core/instance/index.js)中，

``` js
import { initMixin } from './init'
//...

function Vue (options) {
  //...
  this._init(options)
}

initMixin(Vue)
// ...

export default Vue

```

可以看到Vue是一个函数方法，调用该方法时会调用一个叫_init的初始化方法，并传入options参数，同时这个文件还执行了initMixin方法。

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

本篇我们不对options做深入研究，但是要知道实例化Vue时传入的对象参数可以在这里取到。

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
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  // ...
}
```

当实例化Vue，如

``` js
new Vue({
    el: 'app',
    data: {
        text: 'hello world',
    }
});
```

传入的data就是这里的opts.data，当它存在时，调用initData，否则调用observe方法，并初始化_data属性为空对象。

### initData

observe方法我们后面会再讲，上面我们已经找到了initData方法，来看一下。

``` js
function initData (vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
}
```

声明data对象，赋值为vm.$options.data。

当data为函数时调用getData(data, vm)，结果赋值给data和vm._data。否则判断data是否存在，存在就将vm._data设置为data，不存在则讲data和vm._data都设为空对象。

``` js
export function getData (data: Function, vm: Component): any {
  // #7573 disable dep collection when invoking data getters
  pushTarget()
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, `data()`)
    return {}
  } finally {
    popTarget()
  }
}
```

[vue/src/core/observer/dep.js](https://github.com/vuejs/vue/blob/dev/src/core/observer/dep.js)：

``` js
Dep.target = null
const targetStack = []

export function pushTarget (target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget () {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}
```

可以发现实际上getData主要就是执行并返回了`data.call(vm, vm)`，当data为函数时，将data方法的this指向当前vue实例，调用data方法并传入该vue实例。

接着往下

``` js
function initData (vm: Component) {
  // ...
  // 判断data是否为一个Object实例，如果不是，赋值为空对象，并在非生产环境报警告：data函数返回的值必须是一个object
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }
  // ...
}
```

[vue/src/shared/util.js](https://github.com/vuejs/vue/blob/dev/src/shared/util.js)

``` js
export function isPlainObject (obj: any): boolean {
  return _toString.call(obj) === '[object Object]'
}
```

继续往下

``` js
function initData (vm: Component) {
  // ...
  // 获取属性名数组
  const keys = Object.keys(data)
  // 获取props
  const props = vm.$options.props
  // 获取methods
  const methods = vm.$options.methods
  // 遍历属性
  let i = keys.length
  while (i--) {
    const key = keys[i]
    // 非生产环境，方法名和属性名重名警告
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    // 非生产环境，props和属性名重名警告
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(key)) {
      // 过滤 $ 或者 _开头的属性，将其余属性代理到实例的_data属性上。
      proxy(vm, `_data`, key)
    }
  }
  // 调用observe方法
  observe(data, true /* asRootData */)
}
```

[vue/src/core/util/lang.js](https://github.com/vuejs/vue/blob/dev/src/core/util/lang.js)

``` js
export function isReserved (str: string): boolean {
  const c = (str + '').charCodeAt(0)
  return c === 0x24 || c === 0x5F
}
```

[vue/src/core/instance/state.js](https://github.com/vuejs/vue/blob/dev/src/core/instance/state.js)

``` js
export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

### observe

[vue/src/core/observer/index.js](https://github.com/vuejs/vue/blob/dev/src/core/observer/index.js)

``` js
export let shouldObserve: boolean = true

export function observe (value: any, asRootData: ?boolean): Observer | void {
  // 确保传入的value也就是上面的data是一个对象
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  // 定义一个ob变量
  let ob: Observer | void
  // 判断data对象是否已经存在__ob__属性，并且为Observer的实例，如果存在就将其赋值给ob
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } 
  /**
   * 否则判断：
   * 当shouldObserve为true（该值默认为true，需要通过toggleObserving改变），
   * 且非服务的渲染，
   * 且data为数组或者Object的实例，
   * 且data对象是可拓展的，
   * 且data对象不是vue的实例 
   * 
   * 满足上述条件，用data对象生成一个Observer实例并赋值给ob
  */
  else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    // 如果是根data，ob对象的vmCount属性值计数+1
    ob.vmCount++
  }
  // 返回ob
  return ob
}
```

[vue/src/shared/util.js](https://github.com/vuejs/vue/blob/dev/src/shared/util.js)

``` js
export function isObject (obj: mixed): boolean %checks {
  return obj !== null && typeof obj === 'object'
}
```

### Observer 构造函数

``` js
import { arrayMethods } from './array'
import Dep from './dep'

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

// 通过__proto__将原型对象上原生数组方法覆盖成vue改写后的数组方法
function protoAugment (target, src: Object) {
  target.__proto__ = src
}

// 变量改写过的七个数组方法，挨个儿定义到data对象上，以便覆盖原型链上的原生数组方法
function copyAugment (target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}

export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // 将当前data作为根data的vue实例计数

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    // 通过Object.defineProperty方法，在data上定义一个__ob__属性
    def(value, '__ob__', this)
    // 当data为数组时
    if (Array.isArray(value)) {
      // 判断是否有__proto__
      if (hasProto) {
        // 通过__proto__将原型对象上原生数组方法覆盖成vue改写后的数组方法
        protoAugment(value, arrayMethods)
      } else {
        // 变量改写过的七个数组方法，挨个儿定义到data对象上，以便覆盖原型链上的原生数组方法
        copyAugment(value, arrayMethods, arrayKeys)
      }
      // 调用observeArray方法
      this.observeArray(value)
    } else {
      // 当data为对象，调用walk
      this.walk(value)
    }
  }

  // 对data的每个属性调用defineReactive
  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  // 遍历数组，挨个儿调用observe方法
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
```

[vue/src/core/util/lang.js](https://github.com/vuejs/vue/blob/dev/src/core/util/lang.js)

``` js
export function def (obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}
```

[vue/src/core/util/env.js](https://github.com/vuejs/vue/blob/dev/src/core/util/env.js)

``` js
export const hasProto = '__proto__' in {}
```

[vue/src/core/observer/array.js](https://github.com/vuejs/vue/blob/dev/src/core/observer/array.js)

vue重写了数组的七个原型方法`'push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'`

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

### defineReactive

``` js
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  // 声明一个常量dep为Dep实例，这里形成闭包
  const dep = new Dep()
  
  const property = Object.getOwnPropertyDescriptor(obj, key)
  // 如果该属性不能重写则直接返回
  if (property && property.configurable === false) {
    return
  }

  // 缓存getter和setter
  const getter = property && property.get
  const setter = property && property.set
  // 如果getter不存在只有setter，并且没有传入val值，从data上取值赋值给val变量
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  // shallow为false则需要调用observe递归子对象，返回的Observer对象赋值给childOb
  let childOb = !shallow && observe(val)
  // 重写属性
  Object.defineProperty(obj, key, {
    enumerable: true, // 可枚举
    configurable: true, // 可配置
    get: function reactiveGetter () {
      // 原getter存在则执行
      const value = getter ? getter.call(obj) : val
      // Dep.target存在
      if (Dep.target) {
        // 则调用depend收集观察者
        dep.depend()
        // 有子对象收集子对象观察者
        if (childOb) {
          childOb.dep.depend()
          // 值为数组则深度遍历以收集观察者
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      // 原getter存在则执行
      const value = getter ? getter.call(obj) : val
      // 值为变化或为NaN直接返回
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      // 非生产环境有customSetter则调用
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // 有getter无setter直接返回
      if (getter && !setter) return
      // 原setter存在则调用
      if (setter) {
        setter.call(obj, newVal)
      } else { // 不存在直接更新值
        val = newVal
      }
      // shallow为false则需要调用observe递归子对象，返回的Observer对象赋值给childOb
      childOb = !shallow && observe(newVal)
      // 调用dep实例的notify方法发布通知
      dep.notify()
    }
  })
}

// 深度遍历数组，存在__ob__的就需要收集观察者
function dependArray (value: Array<any>) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}
```

### Dep 构造函数

[vue/src/core/observer/dep.js](https://github.com/vuejs/vue/blob/dev/src/core/observer/dep.js)：

``` js
export default class Dep {
  static target: ?Watcher; // Dep.target是构造函数Dep的静态属性，也就是说全局只有一个target
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = [] // subs数组用于存储观察者对象
  }

  // 增加观察者
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  // 移除观察者
  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  // 如果Dep.target存在，则调用该观察者实例的addDep方法，给Watcher的deps数组增加dep
  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  // 发布通知
  notify () {
    const subs = this.subs.slice()
    // config.async 不为true时需要排序
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id)
    }
    // 挨个儿调用观察者的update方法
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}
```

[vue/src/shared/util.js](https://github.com/vuejs/vue/blob/dev/src/shared/util.js)

``` js
export function remove (arr: Array<any>, item: any): Array<any> | void {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}
```

### Watcher 构造函数

[vue/src/core/observer/watcher.js](https://github.com/vuejs/vue/blob/dev/src/core/observer/watcher.js)

先梳理一下，我们的data对象，有一个__ob__属性，对应一个Observer实例，Observer实例会重写data上的每一个属性，并通过闭包保存每个属性各自的dep数组，
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

> watch的部分其实也已经通过Watcher构造函数了解了很多了，`queueWatcher`的部分这里就不展开了，到Vue.watch源码分析的部分再讲。
