## 源码阅读vuex

### Vue.use

在vue项目中使用路由时，需要通过`Vue.use(Vuex)`注册状态管理。

在vue源码文件[vue/src/core/index.js](https://github.com/vuejs/vue/blob/dev/src/core/index.js)中，调用了`initGlobalAPI(Vue)`方法，
在[vue/src/core/global-api/index.js](https://github.com/vuejs/vue/blob/dev/src/core/global-api/index.js)中，定义并导出了`initGlobalAPI`方法，
在`initGlobalAPI`方法中调用了`initUse(Vue)`，在[vue/src/core/global-api/use.js](https://github.com/vuejs/vue/blob/dev/src/core/global-api/use.js)中，找到`initUse`，
在这里定义了`Vue.use`。

``` js
export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    // 获取已经注册的插件列表
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    // 避免重复注册
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // 获取其他参数
    const args = toArray(arguments, 1)
    // 向参数数组首部推入当前vue实例
    args.unshift(this)
    // 当组件有install方法时调用install，或者当组件本身是一个可调用的方法时，调用组件方法，以此完成注册动作
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    // 向已注册数组增加注册组件
    installedPlugins.push(plugin)
    
    return this
  }
}
```

在[vue/src/shared/util.js](https://github.com/vuejs/vue/blob/dev/src/shared/util.js)中，找到`toArray`方法，用于将一个类数组对象转换成数组。

``` js
export function toArray (list: any, start?: number): Array<any> {
  start = start || 0
  let i = list.length - start
  const ret: Array<any> = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}
```

### install + applyMixin

在vuex源码[vue-router/src/store.js](https://github.com/vuejs/vuex/blob/dev/src/store.js)中导出了install方法。

``` js
import applyMixin from './mixin'
export function install (_Vue) {
  // 避免重复注册
  if (Vue && _Vue === Vue) {
    if (__DEV__) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    }
    return
  }
  Vue = _Vue
  applyMixin(Vue)
}
```

install 做了重复注册校验，并调用了applyMixin方法，applyMixin来自[vue-router/src/mixin.js](https://github.com/vuejs/vuex/blob/dev/src/mixin.js)。

``` js
export default function (Vue) {
  const version = Number(Vue.version.split('.')[0])

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}
```

applyMixin 做了一个版本判断，如果vue版本大于等于2，则在vue的beforeCreate生命周期混入一个vuexInit方法，如果版本小于2，则重写了vue的_init方法，将vuexInit加到_init参数options的init属性上，然后执行原来的_init内容。

vuexInit的内容也很简单，判断当前vue实例上有没有store，有的话就将$store指向this.$options.store，如果这个store是一个方法，就执行拿到它的结果再赋值，如果当前vue实例没有store，就从父组件拿。这就保证了全局只有一个sotre，达到所有组件共用状态的目的。

### Store

来看一下通常我们是怎么使用vuex的：

``` js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
new Vue({
  el: '#app',
  store
})
```

可以看到Vue实例化传入的store对象，是通过`new Vuex.Store({})`实例化生成的，那么接下来，就看一下Store构造函数。

源码跟install方法在同一个文件中：[vue-router/src/store.js](https://github.com/vuejs/vuex/blob/dev/src/store.js)

``` js
export class Store {
  constructor (options = {}) {
    // 如果还未注册，在有window.Vue的情况下，会自动注册
    if (!Vue && typeof window !== 'undefined' && window.Vue) {
      install(window.Vue)
    }
    // 开发环境下的一些报错
    if (__DEV__) {
      assert(Vue, `must call Vue.use(Vuex) before creating a store instance.`)
      assert(typeof Promise !== 'undefined', `vuex requires a Promise polyfill in this browser.`)
      assert(this instanceof Store, `store must be called with the new operator.`)
    }

    const {
      // 插件数组，vuex 插件暴露出每次 mutation 的钩子
      plugins = [],
      // 严格模式设置，在严格模式下，无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误。
      strict = false
    } = options

    // 各种内部属性初始化
    this._committing = false // 用来判断严格模式下是否是用mutation修改state
    this._actions = Object.create(null)
    this._actionSubscribers = []
    this._mutations = Object.create(null)
    this._wrappedGetters = Object.create(null)
    this._modules = new ModuleCollection(options) // 从根module开始注册每一个module，并且在这里进行实例化
    this._modulesNamespaceMap = Object.create(null)
    this._subscribers = []
    this._watcherVM = new Vue() // 实例化一个vue，来使用侦听器
    this._makeLocalGettersCache = Object.create(null)

    // 为dispatch、commit绑定当前store实例
    const store = this
    const { dispatch, commit } = this
    this.dispatch = function boundDispatch (type, payload) {
      return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit (type, payload, options) {
      return commit.call(store, type, payload, options)
    }

    // 设置严格模式
    this.strict = strict

    // state指向根module的state属性
    const state = this._modules.root.state

    // 初始化根module，递归注册所有子modle
    // 在 registerGetter 方法中会收集所有module的getter到 _wrappedGetters
    installModule(this, state, [], this._modules.root)

    // 通过vm重设store，新建Vue对象使用Vue内部的响应式实现注册state以及computed
    resetStoreVM(this, state)

    // 调用插件，Vuex 插件就是一个函数，它接收 store 作为唯一参数
    plugins.forEach(plugin => plugin(this))

    // devtools
    const useDevtools = options.devtools !== undefined ? options.devtools : Vue.config.devtools
    if (useDevtools) {
      devtoolPlugin(this)
    }
  }

  // get、set、一堆其他方法
}
```

ModuleCollection方法在[vue-router/src/module/module-collection.js](https://github.com/vuejs/vuex/blob/dev/src/module/module-collection.js)

``` js
export default class ModuleCollection {
  constructor (rawRootModule) {
    // register root module (Vuex.Store options)
    this.register([], rawRootModule, false)
  }
  get (path) {
    return path.reduce((module, key) => {
      return module.getChild(key)
    }, this.root)
  }
  register (path, rawModule, runtime = true) {
    if (__DEV__) {
      assertRawModule(path, rawModule)
    }

    // 实例化Module
    const newModule = new Module(rawModule, runtime)
    // 将根module挂到 store._modules.root上
    if (path.length === 0) {
      this.root = newModule
    } 
    // 对于子module
    else {
      // 给父module添加子module
      const parent = this.get(path.slice(0, -1))
      parent.addChild(path[path.length - 1], newModule)
    }

    // 递归注册嵌套子module
    if (rawModule.modules) {
      forEachValue(rawModule.modules, (rawChildModule, key) => {
        this.register(path.concat(key), rawChildModule, runtime)
      })
    }
  }

  // ... 其他方法
}
```

Module类在[vue-router/src/module/module.js](https://github.com/vuejs/vuex/blob/dev/src/module/module.js)

``` js
export default class Module {
  constructor (rawModule, runtime) {
    this.runtime = runtime
    // Store some children item
    this._children = Object.create(null)
    // Store the origin module object which passed by programmer
    this._rawModule = rawModule
    const rawState = rawModule.state

    // Store the origin module's state
    this.state = (typeof rawState === 'function' ? rawState() : rawState) || {}
  }
  getChild (key) {
    return this._children[key]
  }
  addChild (key, module) {
    this._children[key] = module
  }
  // ... 其他方法
}
```

关于插件的部分可以看API[vuex插件](https://vuex.vuejs.org/zh/guide/plugins.html)

另外可以看到构造函数主要执行了installModule和resetStoreVM方法，来分别看一下。

### installModule

> Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割：

``` js
const moduleA = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

``` js
function installModule (store, rootState, path, module, hot) {
  // 从 Store 构造函数中，我们可以看到根module传入的path是一个空数组
  const isRoot = !path.length
  const namespace = store._modules.getNamespace(path) // 获取当前module的命名空间

  if (module.namespaced) {
    // 防止重复命名空间
    if (store._modulesNamespaceMap[namespace] && __DEV__) {
      console.error(`[vuex] duplicate namespace ${namespace} for the namespaced module ${path.join('/')}`)
    }
    // 在_modulesNamespaceMap中存数 namespace - module 键值对
    store._modulesNamespaceMap[namespace] = module
  }

  // 设置子state
  if (!isRoot && !hot) {
    // 获取path中最后一个module的父state
    const parentState = getNestedState(rootState, path.slice(0, -1))
    // 获取path中最后一个module的名称
    const moduleName = path[path.length - 1]
    // 使用_withCommit执行回调是为了避免enableStrictMode设置的观察者触发回调报错，在resetStoreVM的部分会进行设置
    store._withCommit(() => {
      // 重名校验
      if (__DEV__) {
        if (moduleName in parentState) {
          console.warn(
            `[vuex] state field "${moduleName}" was overridden by a module with the same name at "${path.join('.')}"`
          )
        }
      }
      // 关联父子state，通过Vue.set将module设置成响应式的
      Vue.set(parentState, moduleName, module.state)
    })
  }

  const local = module.context = makeLocalContext(store, namespace, path)

  // 遍历注册mutation
  module.forEachMutation((mutation, key) => {
    const namespacedType = namespace + key
    registerMutation(store, namespacedType, mutation, local)
  })
  // 遍历注册action
  module.forEachAction((action, key) => {
    const type = action.root ? key : namespace + key
    const handler = action.handler || action
    registerAction(store, type, handler, local)
  })
  // 遍历注册getter
  module.forEachGetter((getter, key) => {
    const namespacedType = namespace + key
    registerGetter(store, namespacedType, getter, local)
  })
  // 遍历子module，递归调用installModule注册所有子modle
  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child, hot)
  })
}
function getNestedState (state, path) {
  return path.reduce((state, key) => state[key], state)
}
```

+ forEachXXX

这里的每一个forEachXXX方法都接收了一个回调函数，都是调用的forEachValue方法，这个方法在[vue-router/src/util.js](https://github.com/vuejs/vuex/blob/dev/src/util.js)里。

``` js
export function forEachValue (obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}
```

这个方法对Object实例的每个属性遍历调用回调，传入值和属性名。

也就是说，遍历子module递归调用installModule时，path数组拼接的其实就是module的名称，也就是上面`modules: { a: moduleA, b: moduleB }`的a、b。

+ registerGetter

``` js
function registerGetter (store, type, rawGetter, local) {
  // 重复getter校验
  if (store._wrappedGetters[type]) {
    if (__DEV__) {
      console.error(`[vuex] duplicate getter key: ${type}`)
    }
    return
  }
  // 把每个getter包装一层方法后，挂载到store._wrappedGetters对象上
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  }
}
```

+ getNestedState

对于非根module的情况，getNestedState方法接收根state和path数组下标0~length-1的数组，通过reduce方法，从根state开始嵌套查找子state，该方法最终用于返回实际path最后一个module的父state。

+ makeLocalContext 为同一个命名空间初始化自己的 state、mutation、action、getter

> 默认情况下，模块内部的 action、mutation 和 getter 是注册在全局命名空间的——这样使得多个模块能够对同一 mutation 或 action 作出响应。

``` js
function makeLocalContext (store, namespace, path) {
  const noNamespace = namespace === ''

  const local = {
    dispatch: noNamespace ? store.dispatch : (_type, _payload, _options) => {
      const args = unifyObjectStyle(_type, _payload, _options)
      const { payload, options } = args
      let { type } = args

      if (!options || !options.root) {
        type = namespace + type
        if (__DEV__ && !store._actions[type]) {
          console.error(`[vuex] unknown local action type: ${args.type}, global type: ${type}`)
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : (_type, _payload, _options) => {
      const args = unifyObjectStyle(_type, _payload, _options)
      const { payload, options } = args
      let { type } = args

      if (!options || !options.root) {
        type = namespace + type
        if (__DEV__ && !store._mutations[type]) {
          console.error(`[vuex] unknown local mutation type: ${args.type}, global type: ${type}`)
          return
        }
      }

      store.commit(type, payload, options)
    }
  }

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? () => store.getters
        : () => makeLocalGetters(store, namespace)
    },
    state: {
      get: () => getNestedState(store.state, path)
    }
  })

  return local
}
```

+ unifyObjectStyle 用于格式化参数

``` js
function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload
    payload = type
    type = type.type
  }

  if (__DEV__) {
    assert(typeof type === 'string', `expects string as the type, but found ${typeof type}.`)
  }

  return { type, payload, options }
}
```

在[Vuex.Store 实例方法](https://vuex.vuejs.org/zh/api/#getters-2)中，我们可以看到dispatch和commit的传参有两种格式，unifyObjectStyle方法用于标准化参数对象。

<img :src="$withBase('/imgs/vue/vuex/api.png')" alt="api">

+ 关于响应式可以看这里：[源码分析vue响应式原理](https://jiuto.github.io/jiuto_blog/guide/vue/initData.html)

### resetStoreVM

``` js
function resetStoreVM (store, state, hot) {
  const oldVm = store._vm

  // bind store public getters
  store.getters = {}
  // reset local getters cache
  store._makeLocalGettersCache = Object.create(null)
  const wrappedGetters = store._wrappedGetters
  const computed = {}

  // 遍历
  forEachValue(wrappedGetters, (fn, key) => {
    // 将每个wrappedGetter函数包装成()=>fn(store)，并挂载到computed对象上
    computed[key] = partial(fn, store)
    // 通过Object.defineProperty重写getters，使得当我们使用例如：this.$store.getters.user时，是通过store._vm[user]来获取的
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
      enumerable: true 
    })
  })

  // 创建一个vue实例，来保存state，并将上面的computed设置为计算属性
  // 在实例化vue期间将Vue.config.silent设为true，是为了避免实例化过程中的警告
  const silent = Vue.config.silent
  Vue.config.silent = true
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  })
  Vue.config.silent = silent

  // 严格模式下，只能通过mutation修改state
  if (store.strict) {
    enableStrictMode(store)
  }

  if (oldVm) {
    if (hot) {
      // 使用_withCommit避免enableStrictMode设置的观察者回调报错，解除$$state对state的引用
      store._withCommit(() => {
        oldVm._data.$$state = null
      })
    }
    // 销毁旧vue实例
    Vue.nextTick(() => oldVm.$destroy())
  }
}
```

+ partial

partial方法在[vue-router/src/util.js](https://github.com/vuejs/vuex/blob/dev/src/util.js)里。

``` js
export function partial (fn, arg) {
  return function () {
    return fn(arg)
  }
}
```

+ enableStrictMode

``` js
function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, () => {
    if (__DEV__) {
      assert(store._committing, `do not mutate vuex store state outside mutation handlers.`)
    }
  }, { deep: true, sync: true })
}
```

通过vue的$watch创建一个watcher，当$$state的set被触发时，会触发notify通知watcher调用回调，也就是上面的第二个入参，当_committing为true，会报`do not mutate vuex store state outside mutation handlers.`

+ 在回过来看Store的 get、set、_withCommit 就很好理解了

``` js
export class Store {
  constructor (options = {}) {
    // ...
  }

  get state () {
    return this._vm._data.$$state
  }

  set state (v) {
    if (__DEV__) {
      assert(false, `use store.replaceState() to explicit replace store state.`)
    }
  }

  // 在_committing为true的情况下执行回调，然后回复_committing
  _withCommit (fn) {
    const committing = this._committing
    this._committing = true
    fn()
    this._committing = committing
  }
}
```

### Store 的其他方法

> 未完待续
