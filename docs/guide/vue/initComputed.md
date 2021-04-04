## 源码分析vue computed

> 在阅读本文之前，建议先了解vue响应式原理和watch侦听器相关原理，可以看一下[源码分析vue响应式原理](https://jiuto.github.io/jiuto_blog/guide/vue/initData.html)
> 和[源码分析vue watch侦听器](https://jiuto.github.io/jiuto_blog/guide/vue/initWatch.html)，将有助理解computed。

### 用法示例

``` js
var vm = new Vue({
    el: '#app',
    data: {
        message: 'Hello'
    },
    computed: {
        reversedMessage: function () {
            return this.message.split('').reverse().join('')
        },
        copyMessage: {
            get: function(){
                return this.message
            }
        }
    }
})
```

### 找到initComputed

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

可以看到Vue是一个函数方法，调用该方法时会调用一个叫_init的初始化方法，并传入options参数，同时这个文件还执行了 initMixin 方法。

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
  if (opts.computed) initComputed(vm, opts.computed)
  // ...
}
```

### initComputed

``` js
const computedWatcherOptions = { lazy: true } // lazy为true，watcher的dirty为true

function initComputed (vm: Component, computed: Object) {
  // 初始化一个watchers常量，在vue实例上定义一个_computedWatchers属性，指向同一个空对象
  const watchers = vm._computedWatchers = Object.create(null)
  // 是否服务端渲染
  const isSSR = isServerRendering()

  // for in 循环 取得computed对象的每个属性
  for (const key in computed) {
    // computed对象属性的值
    const userDef = computed[key]
    // 这个值可以是一个函数，也可以是一个有get方法的对象，将这个函数或get方法赋值给getter用于计算属性结果
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    // 非生产环境且getter不存在 给出警告
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(
        `Getter is missing for computed property "${key}".`,
        vm
      )
    }

    // 非服务端渲染为每一个计算属性创建内部watcher实例
    if (!isSSR) {
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    // 组件定义的计算属性在组件原型中已经存在，这里需要在vue实例化时定义计算属性。
    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      // 非生产环境，需要对data、props、computed做属性重名校验
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      }
    }
  }
}
```

### defineComputed

``` js
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

export function defineComputed (
  target: any,
  key: string,
  userDef: Object | Function
) {
  // 是否服务端渲染，非服务的渲染需要缓存
  const shouldCache = !isServerRendering()

  // 这里做的就是根据传入的计算属性的值，完善一个用于defineProperty的初始化属性配置

  // 设置get，需要缓存调用 createComputedGetter 创建一个getter方法
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef)
    sharedPropertyDefinition.set = noop
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop
    sharedPropertyDefinition.set = userDef.set || noop
  }
  // 设置set，计算属性不能设值，非生产环境会报警告
  if (process.env.NODE_ENV !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        `Computed property "${key}" was assigned to but it has no setter.`,
        this
      )
    }
  }
  // 在vue实例上定义一个计算属性同名属性，传入配置
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

### createComputedGetter

``` js
function createComputedGetter (key) {
  // 返回一个computedGetter方法
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      // watcher.dirty 默认为true，调用evaluate会使dirty变为false
      // 只有当计算属性依赖的对象属性改变，set方法被调用时，会触发notify发布通知，通过观察值实例watcher的update方法，重置为true
      if (watcher.dirty) { 
        watcher.evaluate() // 调用watcher实例的evaluate方法，触发watcher实例的get方法，实际上就是调用上面initComputed的getter，
      }
      // Dep.target有值，则调用watcher实例的depend方法
      if (Dep.target) { // Dep.target通过pushTarget和popTarget方法更改，在调用watcher实例的get方法时，就会保持Dep.target指向当前watcher
        watcher.depend() // 收集依赖
      }
      return watcher.value // 返回这个计算属性的值
    }
  }
}
```

### 总结

来回顾一下[源码分析vue响应式原理](https://jiuto.github.io/jiuto_blog/guide/vue/initData.html)中的知识：

> 我们的data对象，有一个__ob__属性，对应一个Observer实例，Observer实例会重写data上的每一个属性，并通过闭包保存每个属性各自的dep数组，
> 而每一个dep数组，收集了这个属性的所有Watcher观察者实例，而每一个观察者实例各自有一个deps依赖集，反向收集闭包的dep。

假设我们有一个vue实例vm，vm.data上有一个A属性，vm.computed上有一个A'计算属性，值为`function(){return this.A}`。

那么A在initData方法中会生产一个观察者实例watcher a，A'在initComputed方法中会生产一个观察者实例watcher a'。

第一次调用vm.computed.A'时：

1. 触发A'的get，由于a'.dirty默认为true，调用a'.evaluate

2. 在a'.evaluate中，调用了a'.get

3. 在a'.get中，Dep.target设为a'，调用a'.getter，也就是`function(){return this.A}`，触发了A.get

4. 在A.get中，由于Dep.target指向a'，调用了A的闭包中的dep的depend方法，dep.depent调用了Dep.target也就是a'的addDep，a'.addDep又触发了dep.addSub，
总的来说，这一步完成了双方的观察者和依赖的收集

5. A.get执行完，回到a'.get，将Dep.target设为null，回到a'.evaluate，将a'.dirty设为false

第二次调用vm.computed.A'时，由于a'.dirty为false，直接返回缓存的a'.value。

当A被更改时，触发A的set，调用dep.notify，会调用a'.update，在update中a'.dirty将重置为true，下一次获取A'时就会重新调用a'.evaluate了。
