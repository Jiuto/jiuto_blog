## 源码阅读vue-router

### Vue.use

在vue项目中使用路由时，需要通过`Vue.use(VueRouter)`注册路由。

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

### install

在vue-router源码[vue-router/src/install.js](https://github.com/vuejs/vue-router/blob/dev/src/install.js)中导出了install方法。

``` js
export function install (Vue) {
  // install 只能调用一次
  if (install.installed && _Vue === Vue) return
  install.installed = true

  _Vue = Vue

  const isDef = v => v !== undefined

  const registerInstance = (vm, callVal) => {
    // 调用 vm.$options._parentVnode.data.registerRouteInstance(vm, callVal)
    let i = vm.$options._parentVnode
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal)
    }
  }

  // 给每个组件混入钩子函数
  Vue.mixin({
    beforeCreate () {
      // 判断是否为根组件，只有根组件才有router对象
      if (isDef(this.$options.router)) {
        // 设置根路由
        this._routerRoot = this
        // 设置router对象
        this._router = this.$options.router
        // 初始化路由
        this._router.init(this)
        // 定义_route属性，指向当前路由对象
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        // 非根组件，层层指向根路由
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
  })

  // 在Vue原型对象上定义$router
  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this._routerRoot._router }
  })
  // 在Vue原型对象上定义$route
  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route }
  })

  // 全局注册组件
  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)

  // use the same hook merging strategy for route hooks
  const strats = Vue.config.optionMergeStrategies
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
}
```

> 注：`defineReactive`方法在[源码分析vue响应式原理](https://jiuto.github.io/jiuto_blog/guide/vue/initData.html)中分析过。

### VueRouter 构造函数

在项目中注册路由后，下一步就是实例化路由。

``` js
var router = new VueRouter({
  mode: 'hash',
  routes: [
    { path: '/', component: Home },
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
  ]
})
```

在vue-router源码[vue-router/src/index.js](https://github.com/vuejs/vue-router/blob/dev/src/index.js)中，看一下构造函数做了什么。

``` js
export default class VueRouter {
  static install: () => void
  static version: string
  static isNavigationFailure: Function
  static NavigationFailureType: any
  static START_LOCATION: Route

  app: any
  apps: Array<any>
  ready: boolean
  readyCbs: Array<Function>
  options: RouterOptions
  mode: string
  history: HashHistory | HTML5History | AbstractHistory
  matcher: Matcher
  fallback: boolean
  beforeHooks: Array<?NavigationGuard>
  resolveHooks: Array<?NavigationGuard>
  afterHooks: Array<?AfterNavigationHook>

  constructor (options: RouterOptions = {}) {
    this.app = null
    this.apps = []
    this.options = options
    this.beforeHooks = []
    this.resolveHooks = []
    this.afterHooks = []
    this.matcher = createMatcher(options.routes || [], this)

    // 设置路由方式，默认为hash
    let mode = options.mode || 'hash'
    this.fallback =
      mode === 'history' && !supportsPushState && options.fallback !== false
    if (this.fallback) {
      mode = 'hash'
    }
    if (!inBrowser) {
      mode = 'abstract'
    }
    this.mode = mode

    switch (mode) {
      case 'history':
        this.history = new HTML5History(this, options.base)
        break
      case 'hash':
        this.history = new HashHistory(this, options.base, this.fallback)
        break
      case 'abstract':
        this.history = new AbstractHistory(this, options.base)
        break
      default:
        if (process.env.NODE_ENV !== 'production') {
          assert(false, `invalid mode: ${mode}`)
        }
    }
  }

  // ... 各种方法
}
```

构造函数主要调用了createMatcher方法，并设置了mode，生成相应的history对象。

### createMatcher

在vue-router源码[vue-router/src/create-matcher.js](https://github.com/vuejs/vue-router/blob/dev/src/create-matcher.js)中

``` js
export function createMatcher (
  routes: Array<RouteConfig>,
  router: VueRouter
): Matcher {
  const { pathList, pathMap, nameMap } = createRouteMap(routes)

  function addRoutes (routes) {
    // 用到了 pathList, pathMap, nameMap 
    // ...
  }

  function addRoute (parentOrRoute, route) {
    // 用到了 pathList, pathMap, nameMap 
    // ...
  }

  function getRoutes () {
    // 用到了 pathList, pathMap
    // ...
  }

  function match (
    raw: RawLocation,
    currentRoute?: Route,
    redirectedFrom?: Location
  ): Route {
    // 用到了 pathList, pathMap, nameMap 
    // ...
  }

  // ... 一些其他内部方法

  return {
    match,
    addRoute,
    getRoutes,
    addRoutes
  }
}
```

createMatcher返回了一个具有`match, addRoute, getRoutes, addRoutes`四个方法的Matcher对象，
内部主要调用了createRouteMap方法，返回具有`pathList, pathMap, nameMap`三个方法的对象，通过闭包保存这三个方法，
使Matcher对象能够使用这三个方法。

### createRouteMap

在vue-router源码[vue-router/src/create-route-map.js](https://github.com/vuejs/vue-router/blob/dev/src/create-route-map.js)中

``` js
export function createRouteMap (
  routes: Array<RouteConfig>,
  oldPathList?: Array<string>,
  oldPathMap?: Dictionary<RouteRecord>,
  oldNameMap?: Dictionary<RouteRecord>,
  parentRoute?: RouteRecord
): {
  pathList: Array<string>,
  pathMap: Dictionary<RouteRecord>,
  nameMap: Dictionary<RouteRecord>
} {
  // 创建映射表
  // pathList用于控制路由匹配优先级
  const pathList: Array<string> = oldPathList || []
  const pathMap: Dictionary<RouteRecord> = oldPathMap || Object.create(null)
  const nameMap: Dictionary<RouteRecord> = oldNameMap || Object.create(null)

  // 变量路由配置，为映射表添加路由记录
  routes.forEach(route => {
    addRouteRecord(pathList, pathMap, nameMap, route, parentRoute)
  })

  // 确保通配符"*"始终在路径列表的末尾
  for (let i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0])
      l--
      i--
    }
  }

  // 开发环境，如果路由path首个字符不为'/'报警告
  if (process.env.NODE_ENV === 'development') {
    const found = pathList
      .filter(path => path && path.charAt(0) !== '*' && path.charAt(0) !== '/')
    if (found.length > 0) {
      const pathNames = found.map(path => `- ${path}`).join('\n')
      warn(false, `Non-nested routes must include a leading slash character. Fix the following routes: \n${pathNames}`)
    }
  }

  return {
    pathList,
    pathMap,
    nameMap
  }
}
```

### init

``` js
beforeCreate () {
    // 判断是否为根组件，只有根组件才有router对象
    if (isDef(this.$options.router)) {
        // 设置根路由
        this._routerRoot = this
        // 设置router对象
        this._router = this.$options.router
        // 初始化路由
        this._router.init(this)
        // 定义_route属性，指向当前路由对象
        Vue.util.defineReactive(this, '_route', this._router.history.current)
    } else {
        // 非根组件，指向父组件的根路由，最终指向根组件
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
    }
    registerInstance(this, this)
}
```

当组件调用beforeCreate钩子时，会进行初始化路由，也就是VueRouter的init方法。

``` js
init (app: any /* Vue component instance */) {
    // 非生产环境为注册路由报警告
    process.env.NODE_ENV !== 'production' &&
      assert(
        install.installed,
        `not installed. Make sure to call \`Vue.use(VueRouter)\` ` +
          `before creating root instance.`
      )

    // 保存组件实例
    this.apps.push(app)

    // 当组件被销毁时，从apps中移除组件实例
    app.$once('hook:destroyed', () => {
      const index = this.apps.indexOf(app)
      if (index > -1) this.apps.splice(index, 1)
      // 当根组件被销毁时，this.app重新指向apps数组中的首个组件实例
      if (this.app === app) this.app = this.apps[0] || null
      // apps数组没有组件实例时，重置history
      if (!this.app) this.history.teardown()
    })

    // 已设置过根组件，直接return
    if (this.app) {
      return
    }

    this.app = app

    const history = this.history

    if (history instanceof HTML5History || history instanceof HashHistory) {
      const handleInitialScroll = routeOrError => {
        const from = history.current
        const expectScroll = this.options.scrollBehavior
        const supportsScroll = supportsPushState && expectScroll

        if (supportsScroll && 'fullPath' in routeOrError) {
          handleScroll(this, routeOrError, from, false)
        }
      }
      // history.setupListeners 用于注册 popstate 和 hashchange 实际的监听器
      const setupListeners = routeOrError => {
        history.setupListeners()
        handleInitialScroll(routeOrError)
      }
      // 路由跳转
      history.transitionTo(
        history.getCurrentLocation(),
        setupListeners,
        setupListeners
      )
    }
    // listen 用于挂载 this.cb 回调，这个回调会变量apps数组，对每个组件实例的_route赋值，会触发 dep.notify()
    history.listen(route => {
      this.apps.forEach(app => {
        app._route = route
      })
    })
}
```

has模式：history.getCurrentLocation()返回getHash()

在vue-router源码[vue-router/src/history/hash.js](https://github.com/vuejs/vue-router/blob/dev/src/history/hash.js)中

``` js
function getHash (): string {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  let href = window.location.href
  const index = href.indexOf('#')
  // empty path
  if (index < 0) return ''

  href = href.slice(index + 1)

  return href
}
```

history模式：history.getCurrentLocation()返回getLocation(this.base)

在vue-router源码[vue-router/src/history/html5.js](https://github.com/vuejs/vue-router/blob/dev/src/history/html5.js)中

``` js
function getLocation (base: string): string {
  let path = window.location.pathname
  if (base && path.toLowerCase().indexOf(base.toLowerCase()) === 0) {
    path = path.slice(base.length)
  }
  return (path || '/') + window.location.search + window.location.hash
}
```

### transitionTo

在vue-router源码[vue-router/src/history/base.js](https://github.com/vuejs/vue-router/blob/dev/src/history/base.js)中

``` js
transitionTo (
    location: RawLocation,
    onComplete?: Function,
    onAbort?: Function
  ) {
    let route
    try {
      // 匹配新路由
      route = this.router.match(location, this.current)
    } catch (e) {
      this.errorCbs.forEach(cb => {
        cb(e)
      })
      throw e
    }
    // 将原来的路由赋值给prev
    const prev = this.current
    // 调用confirmTransition 确认跳转
    this.confirmTransition(
      route,
      // 成功回调
      () => {
        // updateRoute 方法将this.current指向新路由，在这里会执行this.cb（也就是在listen中传入的回调）
        this.updateRoute(route)
        // 执行setupListeners
        onComplete && onComplete(route)
        // 更新url
        this.ensureURL()
        // 遍历调用afterHooks钩子
        this.router.afterHooks.forEach(hook => {
          hook && hook(route, prev)
        })
        // this.ready默认为false，也就是说readyCbs回调只执行一次
        if (!this.ready) {
          this.ready = true
          this.readyCbs.forEach(cb => {
            cb(route)
          })
        }
      },
      // 错误处理
      err => {
        if (onAbort) {
          onAbort(err)
        }
        if (err && !this.ready) {
          if (!isNavigationFailure(err, NavigationFailureType.redirected) || prev !== START) {
            this.ready = true
            this.readyErrorCbs.forEach(cb => {
              cb(err)
            })
          }
        }
      }
    )
}
```

#### match

回到createMatcher方法看一看match是怎么匹配路由的

``` js
function match (
    raw: RawLocation,
    currentRoute?: Route,
    redirectedFrom?: Location
  ): Route {
    /** normalizeLocation序列化，返回一个Location对象
     * {
     *  _normalized: true,
     *  path,
     *  query,
     *  hash
     * }
    */
    const location = normalizeLocation(raw, currentRoute, false, router)

    const { name } = location
    // 命名路由
    if (name) {
      // 从nameMap映射表中匹配路由记录
      const record = nameMap[name]
      // 非生产环境没有匹配结果报警告
      if (process.env.NODE_ENV !== 'production') {
        warn(record, `Route with name '${name}' does not exist`)
      }
      // 没有匹配结果
      if (!record) return _createRoute(null, location)
      
      // 生产参数名列表
      const paramNames = record.regex.keys
        .filter(key => !key.optional)
        .map(key => key.name)
      // 初始化location.params
      if (typeof location.params !== 'object') {
        location.params = {}
      }
      // 补充location中缺失的参数
      if (currentRoute && typeof currentRoute.params === 'object') {
        for (const key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key]
          }
        }
      }
      // 校验参数
      location.path = fillParams(record.path, location.params, `named route "${name}"`)
      return _createRoute(record, location, redirectedFrom)
    } 
    // 非命名路由
    else if (location.path) {
      location.params = {}
      for (let i = 0; i < pathList.length; i++) {
        // 通过pathList和pathMap映射表找到路由记录
        const path = pathList[i]
        const record = pathMap[path]
        if (matchRoute(record.regex, location.path, location.params)) {
          return _createRoute(record, location, redirectedFrom)
        }
      }
    }
    // 没有在映射表中匹配到路由记录
    return _createRoute(null, location)
}
```

#### _createRoute 和 createRoute

``` js
function _createRoute (
    record: ?RouteRecord,
    location: Location,
    redirectedFrom?: Location
  ): Route {
    // 重定向
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    // 别名
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    return createRoute(record, location, redirectedFrom, router)
  }

  return {
    match,
    addRoute,
    getRoutes,
    addRoutes
  }
}
```

createRoute在vue-router源码[vue-router/src/util/route.js](https://github.com/vuejs/vue-router/blob/dev/src/util/route.js)中

``` js
export function createRoute (
  record: ?RouteRecord,
  location: Location,
  redirectedFrom?: ?Location,
  router?: VueRouter
): Route {
  const stringifyQuery = router && router.options.stringifyQuery
  // 克隆query参数
  let query: any = location.query || {}
  try {
    query = clone(query)
  } catch (e) {}
  // 创建路由对象
  const route: Route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery),
    matched: record ? formatMatch(record) : []
  }
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery)
  }
  // 冻结路由对象，使其不可修改
  return Object.freeze(route)
}
// 获取完整path
function getFullPath (
  { path, query = {}, hash = '' },
  _stringifyQuery
): string {
  const stringify = _stringifyQuery || stringifyQuery
  return (path || '/') + stringify(query) + hash
}
// 获取包含当前路由的所有嵌套路由记录列表
function formatMatch (record: ?RouteRecord): Array<RouteRecord> {
  const res = []
  while (record) {
    res.unshift(record)
    record = record.parent
  }
  return res
}
```

#### confirmTransition

回到transitionTo路由跳转方法，看一下confirmTransition确认跳转。

``` js
// 用于对比路由记录
function resolveQueue (
  current: Array<RouteRecord>,
  next: Array<RouteRecord>
): {
  updated: Array<RouteRecord>,
  activated: Array<RouteRecord>,
  deactivated: Array<RouteRecord>
} {
  let i
  const max = Math.max(current.length, next.length)
  for (i = 0; i < max; i++) {
    // 对比找到不同时中止循环
    if (current[i] !== next[i]) {
      break
    }
  }
  return {
    updated: next.slice(0, i), // 可复用
    activated: next.slice(i), // 需要重新渲染
    deactivated: current.slice(i) // 失活
  }
}
confirmTransition (route: Route, onComplete: Function, onAbort?: Function) {
    // 获取当前路由
    const current = this.current
    // 保存路由
    this.pending = route
    
    // 中止
    const abort = err => {
      if (!isNavigationFailure(err) && isError(err)) {
        if (this.errorCbs.length) {
          this.errorCbs.forEach(cb => {
            cb(err)
          })
        } else {
          warn(false, 'uncaught error during route navigation:')
          console.error(err)
        }
      }
      onAbort && onAbort(err)
    }

    const lastRouteIndex = route.matched.length - 1
    const lastCurrentIndex = current.matched.length - 1
    // 相同路由不跳转
    if (
      isSameRoute(route, current) &&
      lastRouteIndex === lastCurrentIndex &&
      route.matched[lastRouteIndex] === current.matched[lastCurrentIndex]
    ) {
      // 用replace的方式更新url
      this.ensureURL()
      return abort(createNavigationDuplicatedError(current, route))
    }

    // 通过对比路由的嵌套路由记录列表，找到可复用的组件，失活的组件，需要渲染的组件
    const { updated, deactivated, activated } = resolveQueue(
      this.current.matched,
      route.matched
    )

    // 路由守卫数组
    const queue: Array<?NavigationGuard> = [].concat(
      // 失活的组件钩子
      extractLeaveGuards(deactivated),
      // 全局 beforeEach 钩子
      this.router.beforeHooks,
      // 复用的组件钩子
      extractUpdateHooks(updated),
      // 执行需要重新渲染的组件的 beforeEnter 钩子
      activated.map(m => m.beforeEnter),
      // 解析异步路由组件
      resolveAsyncComponents(activated)
    )

    // 迭代器，用于执行路由守卫钩子
    const iterator = (hook: NavigationGuard, next) => {
      // 路由不相等，中止跳转
      if (this.pending !== route) {
        return abort(createNavigationCancelledError(current, route))
      }
      try {
        // 执行钩子
        hook(route, current, (to: any) => {
          // to 是项目中在路由守卫中调用next()时的参数
          // 客户端执行next(false)，中止跳转，更新url
          if (to === false) {
            this.ensureURL(true)
            abort(createNavigationAbortedError(current, route))
          } 
          // next参数为Error实例，中止跳转，更新url
          else if (isError(to)) {
            this.ensureURL(true)
            abort(to)
          } 
          // 
          else if (
            typeof to === 'string' ||
            (typeof to === 'object' &&
              (typeof to.path === 'string' || typeof to.name === 'string'))
          ) {
            // next('/') 或者 next({ path: '/' }) -> 重定向
            abort(createNavigationRedirectedError(current, route))
            if (typeof to === 'object' && to.replace) {
              this.replace(to)
            } else {
              this.push(to)
            }
          } else {
            // 执行step(index + 1)，即调用queue中的下一个钩子
            next(to)
          }
        })
      } catch (e) {
        abort(e)
      }
    }

    runQueue(queue, iterator, () => {
      // 这是queue每个step执行完毕后执行的回调
      const enterGuards = extractEnterGuards(activated)
      const queue = enterGuards.concat(this.router.resolveHooks)
      // 接下来执行 需要重新渲染的组件的路由守卫钩子
      runQueue(queue, iterator, () => {
        // 需要重新渲染的组件的路由守卫钩子执行完毕的回调
        if (this.pending !== route) {
          return abort(createNavigationCancelledError(current, route))
        }
        // 重置pending
        this.pending = null
        // 执行跳转完成回调
        onComplete(route)
        if (this.router.app) {
          this.router.app.$nextTick(() => {
            handleRouteEntered(route)
          })
        }
      })
    })
}
```

在vue-router源码[vue-router/src/util/async.js](https://github.com/vuejs/vue-router/blob/dev/src/util/async.js)中

``` js
export function runQueue (queue: Array<?NavigationGuard>, fn: Function, cb: Function) {
  const step = index => {
    if (index >= queue.length) {
      cb()
    } else {
      if (queue[index]) {
        fn(queue[index], () => {
          step(index + 1)
        })
      } else {
        step(index + 1)
      }
    }
  }
  step(0)
}
```

#### queue 路由守卫数组

1. `extractLeaveGuards(deactivated)`失活的组件钩子

``` js
function extractLeaveGuards (deactivated: Array<RouteRecord>): Array<?Function> {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
}
```

``` js
function extractGuards (
  records: Array<RouteRecord>,
  name: string,
  bind: Function,
  reverse?: boolean
): Array<?Function> {
  const guards = flatMapComponents(records, (def, instance, match, key) => {
    // 获得钩子数组
    const guard = extractGuard(def, name)
    // 绑定this
    if (guard) {
      return Array.isArray(guard)
        ? guard.map(guard => bind(guard, instance, match, key))
        : bind(guard, instance, match, key)
    }
  })
  // reverse 为 true 翻转钩子数组，表示这类钩子从子组件开始执行
  return flatten(reverse ? guards.reverse() : guards)
}
// 给每个钩子函数绑定this指向组件实例 
function bindGuard (guard: NavigationGuard, instance: ?_Vue): ?NavigationGuard {
  if (instance) {
    return function boundRouteGuard () {
      return guard.apply(instance, arguments)
    }
  }
}
// 返回组件指定的钩子数组
function extractGuard (
  def: Object | Function,
  key: string
): NavigationGuard | Array<NavigationGuard> {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    def = _Vue.extend(def)
  }
  return def.options[key]
}
```

在vue-router源码[vue-router/src/util/resolve-components.js](https://github.com/vuejs/vue-router/blob/dev/src/util/resolve-components.js)中

``` js
export function flatMapComponents (
  matched: Array<RouteRecord>,
  fn: Function
): Array<?Function> {
  return flatten(matched.map(m => {
    // 返回每个组件相关参数给回调
    return Object.keys(m.components).map(key => fn(
      m.components[key],
      m.instances[key],
      m, 
      key
    ))
  }))
}
// 数组降维
export function flatten (arr: Array<any>): Array<any> {
  return Array.prototype.concat.apply([], arr)
}
```

2. `this.router.beforeHooks`全局 beforeEach 钩子

beforeEach在VueRouter方法中注册

``` js
class VueRouter {
  beforeEach (fn: Function): Function {
    return registerHook(this.beforeHooks, fn)
  }
}
function registerHook (list: Array<any>, fn: Function): Function {
  list.push(fn)
  return () => {
    const i = list.indexOf(fn)
    if (i > -1) list.splice(i, 1)
  }
}
```

3. `extractUpdateHooks(updated)`复用的组件钩子

``` js
function extractUpdateHooks (updated: Array<RouteRecord>): Array<?Function> {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
}
```

4. 执行`activated.map(m => m.beforeEnter)`需要重新渲染的组件的 beforeEnter 钩子

5. `resolveAsyncComponents(activated)`解析异步路由组件

通常我们设置路由时，有时候会这样写`{ component:resolve => require(['@/views/user/index'], resolve) }`

在vue-router源码[vue-router/src/util/resolve-components.js](https://github.com/vuejs/vue-router/blob/dev/src/util/resolve-components.js)中

``` js
export function resolveAsyncComponents (matched: Array<RouteRecord>): Function {
  return (to, from, next) => {
    let hasAsync = false
    let pending = 0
    let error = null

    flatMapComponents(matched, (def, _, match, key) => {
      // 如果def是一个函数且没有cid，我们假定它为异步组件
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true
        pending++

        // 成功回调
        const resolve = once(resolvedDef => {
          if (isESModule(resolvedDef)) {
            resolvedDef = resolvedDef.default
          }
          // 传入的是构造函数，则用Vue.extend创建一个组件
          def.resolved = typeof resolvedDef === 'function'
            ? resolvedDef
            : _Vue.extend(resolvedDef)
          // 将组件放到路由记录里
          match.components[key] = resolvedDef
          // 等待计数-1
          pending--
          // 全部解析完毕则下一步
          if (pending <= 0) {
            next()
          }
        })

        // 失败回调
        const reject = once(reason => {
          const msg = `Failed to resolve async component ${key}: ${reason}`
          process.env.NODE_ENV !== 'production' && warn(false, msg)
          if (!error) {
            error = isError(reason)
              ? reason
              : new Error(msg)
            next(error)
          }
        })

        let res
        try {
          // 执行异步组件函数
          res = def(resolve, reject)
        } catch (e) {
          reject(e)
        }
        if (res) {
          // 执行回调
          if (typeof res.then === 'function') {
            res.then(resolve, reject)
          } else {
            // new syntax in Vue 2.3
            const comp = res.component
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject)
            }
          }
        }
      }
    })
    // 不是异步组件直接下一步
    if (!hasAsync) next()
  }
}
function once (fn) {
  let called = false
  return function (...args) {
    if (called) return
    called = true
    return fn.apply(this, args)
  }
}
```

6. 1-5的钩子执行完之后，就开始执行第一个runQueue的回调

``` js
runQueue(queue, iterator, () => {
    // 这是queue每个step执行完毕后执行的回调
    const enterGuards = extractEnterGuards(activated)
    const queue = enterGuards.concat(this.router.resolveHooks)
    // 接下来执行 需要重新渲染的组件的路由守卫钩子
    runQueue(queue, iterator, () => {
        // 需要重新渲染的组件的路由守卫钩子执行完毕的回调
        if (this.pending !== route) {
            return abort(createNavigationCancelledError(current, route))
        }
        // 重置pending
        this.pending = null
        // 执行跳转完成回调
        onComplete(route)
        if (this.router.app) {
            this.router.app.$nextTick(() => {
                handleRouteEntered(route)
            })
        }
    })
})
```

``` js
function extractEnterGuards (
  activated: Array<RouteRecord>
): Array<?Function> {
  return extractGuards(
    activated,
    'beforeRouteEnter',
    (guard, _, match, key) => {
      return bindEnterGuard(guard, match, key)
    }
  )
}
function bindEnterGuard (
  guard: NavigationGuard,
  match: RouteRecord,
  key: string
): NavigationGuard {
  return function routeEnterGuard (to, from, next) {
    return guard(to, from, cb => {
      // cb是函数，推进路由记录的enteredCbs
      if (typeof cb === 'function') {
        if (!match.enteredCbs[key]) {
          match.enteredCbs[key] = []
        }
        match.enteredCbs[key].push(cb)
      }
      next(cb)
    })
  }
}
```

`const enterGuards = extractEnterGuards(activated)`返回beforeRouteEnter钩子。

`const queue = enterGuards.concat(this.router.resolveHooks)`拼接resolveHooks钩子。

runQueue开始执行新的queue。

7. 执行beforeRouteEnter

> beforeRouteEnter 守卫 不能 访问 this，因为守卫在导航确认前被调用，因此即将登场的新组件还没被创建。
>
> 不过，你可以通过传一个回调给 next来访问组件实例。在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数。

``` js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // 通过 `vm` 访问组件实例
  })
}
```

> 注意 beforeRouteEnter 是支持给 next 传递回调的唯一守卫。对于 beforeRouteUpdate 和 beforeRouteLeave 来说，this 已经可用了，所以不支持传递回调，因为没有必要了。

8. 执行resolveHooks

9. 7-8完成后执行第二个runQueue的回调，

``` js
runQueue(queue, iterator, () => {
    // 需要重新渲染的组件的路由守卫钩子执行完毕的回调
    if (this.pending !== route) {
        return abort(createNavigationCancelledError(current, route))
    }
    // 重置pending
    this.pending = null
    // 执行跳转完成回调
    onComplete(route)
    if (this.router.app) {
        this.router.app.$nextTick(() => {
            handleRouteEntered(route) // 这里会执行enteredCbs中的回调
        })
    }
})
```

在vue-router源码[vue-router/src/util/route.js](https://github.com/vuejs/vue-router/blob/dev/src/util/route.js)中

``` js
export function handleRouteEntered (route: Route) {
  for (let i = 0; i < route.matched.length; i++) {
    const record = route.matched[i]
    for (const name in record.instances) {
      const instance = record.instances[name]
      const cbs = record.enteredCbs[name]
      if (!instance || !cbs) continue
      delete record.enteredCbs[name]
      for (let i = 0; i < cbs.length; i++) {
        if (!instance._isBeingDestroyed) cbs[i](instance)
      }
    }
  }
}
```

#### 完整的导航解析流程

> 1. 导航被触发。
> 2. 在失活的组件里调用 beforeRouteLeave 守卫。
> 3. 调用全局的 beforeEach 守卫。
> 4. 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
> 5. 在路由配置里调用 beforeEnter。
> 6. 解析异步路由组件。
> 7. 在被激活的组件里调用 beforeRouteEnter。
> 8. 调用全局的 beforeResolve 守卫 (2.5+)。
> 9. 导航被确认。
> 10. 调用全局的 afterEach 钩子。
> 11. 触发 DOM 更新。
> 12. 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。

### 参考

[VueRouter 源码深度解析](https://juejin.cn/post/6844903647378145294#heading-6)

[导航守卫](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E7%BB%84%E4%BB%B6%E5%86%85%E7%9A%84%E5%AE%88%E5%8D%AB)
