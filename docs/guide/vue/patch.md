## 源码阅读vue VirtualDOM 和 diff

### 是什么

VirtualDOM 是根据真实的DOM节点树，抽象出来的一棵用 JavaScript 对象描述节点的抽象树。

通过 VirtualDOM ，可以对比前后节点变化了哪些变化，做到局部更新视图，减少 DOM 操作。

> Virtual DOM的优势不在于单次的操作，而是在大量、频繁的数据更新下，能够对视图进行合理、高效的更新。

> 由于 Virtual DOM 是以 JavaScript 对象为基础而不依赖真实平台环境，所以使它具有了跨平台的能力，比如说浏览器平台、Weex、Node 等。

对比过程通过 patch 来实现，而 patch 的核心是 diff 算法。

### 找到 patch

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
lifecycleMixin(Vue)
// ...

export default Vue
```

可以看到Vue是一个函数方法，调用该方法时会调用一个叫_init的初始化方法，并传入options参数，同时这个文件还执行了 initMixin 和 lifecycleMixin 方法。

在[vue/src/core/instance/init.js](https://github.com/vuejs/vue/blob/dev/src/core/instance/init.js)中，

``` js
// ...
import { initState } from './state'
import { extend, mergeOptions, formatComponentName } from '../util/index'

export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this

    // ...

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
```

看到_init方法就是在initMixin方法中定义的，在_init方法中，声明了常量vm并赋值当前实例，接受了options并做了处理，还调用了$mount方法。

在[vue/src/platforms/web/runtime/index.js](https://github.com/vuejs/vue/blob/dev/src/platforms/web/runtime/index.js)中，

``` js
Vue.prototype.__patch__ = inBrowser ? patch : noop

Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```

看到$mount方法返回mountComponent的执行结果。

同时在这个文件中还定义了__patch__。

在[vue/src/core/instance/lifecycle.js](https://github.com/vuejs/vue/blob/dev/src/core/instance/lifecycle.js)中，

``` js
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  // ...

  let updateComponent
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const startTag = `vue-perf-start:${id}`
      const endTag = `vue-perf-end:${id}`

      mark(startTag)
      const vnode = vm._render()
      mark(endTag)
      measure(`vue ${name} render`, startTag, endTag)

      mark(startTag)
      vm._update(vnode, hydrating)
      mark(endTag)
      measure(`vue ${name} patch`, startTag, endTag)
    }
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }

  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)

  //...
}
```

在mountComponent中声明了一个Watcher对象，在[源码分析vue watch侦听器](https://jiuto.github.io/jiuto_blog/guide/vue/initWatch.html)中我们已经了解到，
构造函数传入的第二个参数expOrFn会赋值给Watcher实例的getter并在get方法中调用，而get在run中调用，run在update中调用，update则通过dep.notify()调用，当data对象的某个属性改变时，通过这个属性的setter就会触发notify()通知，从而达到更新视图的目的。

而这里的第二个参数实际上就是`() => { vm._update(vm._render(), hydrating) }`。

同样在lifecycle.js文件中，可以找到lifecycleMixin，在这里定义了_update，_update调用了`vm.__patch__`。

``` js
export function lifecycleMixin (Vue: Class<Component>) {
  Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const restoreActiveInstance = setActiveInstance(vm)
    vm._vnode = vnode
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    restoreActiveInstance()
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  }
  //...
}
```

回到__patch__的定义，`Vue.prototype.__patch__ = inBrowser ? patch : noop`，在浏览器环境下，__patch__指向下面这个patch函数。

在[vue/src/platforms/web/runtime/patch.js](https://github.com/vuejs/vue/blob/dev/src/platforms/web/runtime/patch.js)中，

``` js
export const patch: Function = createPatchFunction({ nodeOps, modules })
```

发现patch函数通过createPatchFunction函数返回。

在[vue/src/core/vdom/patch.js](https://github.com/vuejs/vue/blob/dev/src/core/vdom/patch.js)中，可以找到createPatchFunction，并看到该方法返回的patch函数。

### patch

``` js
const hooks = ['create', 'activate', 'update', 'remove', 'destroy']
export function createPatchFunction (backend) {
    let i, j
    const cbs = {}

    const { modules, nodeOps } = backend

    for (i = 0; i < hooks.length; ++i) {
        cbs[hooks[i]] = []
        for (j = 0; j < modules.length; ++j) {
            if (isDef(modules[j][hooks[i]])) {
                cbs[hooks[i]].push(modules[j][hooks[i]])
            }
        }
    }
    // ...

    return function patch (oldVnode, vnode, hydrating, removeOnly) {
        // vnode不存在
        if (isUndef(vnode)) {
            // oldVnode存在，直接调用DestroyHook
            if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
            // 直接return
            return
        }

        let isInitialPatch = false
        const insertedVnodeQueue = []

        // oldVnode不存在，则创建根节点，设置标志位isInitialPatch为true
        if (isUndef(oldVnode)) {
            isInitialPatch = true
            createElm(vnode, insertedVnodeQueue)
        } 
        // oldVnode存在
        else {
            // 标记oldVnode是否有nodeType
            const isRealElement = isDef(oldVnode.nodeType)
            // 旧节点不是真实节点并且新旧节点符合sameVnode，则调用patchVnode修改旧节点
            if (!isRealElement && sameVnode(oldVnode, vnode)) {
                patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
            } 
            // 新旧节点不同
            else {
                if (isRealElement) {
                    // 服务端渲染相关处理
                    // 略...

                    // 非服务端渲染，创建一个空节点替换oldVnode
                    oldVnode = emptyNodeAt(oldVnode)
                }

                // 将oldVnode的真实节点赋值给常量oldElm
                const oldElm = oldVnode.elm
                // 将旧父节点赋值给常量parentElm
                const parentElm = nodeOps.parentNode(oldElm)

                // 创建新节点
                createElm(
                    vnode,
                    insertedVnodeQueue,
                    oldElm._leaveCb ? null : parentElm,
                    nodeOps.nextSibling(oldElm)
                )

                if (isDef(vnode.parent)) {
                    /*组件根节点被替换，遍历更新父节点element*/
                    let ancestor = vnode.parent
                    const patchable = isPatchable(vnode)
                    while (ancestor) {
                        for (let i = 0; i < cbs.destroy.length; ++i) {
                            cbs.destroy[i](ancestor)
                        }
                        ancestor.elm = vnode.elm
                        if (patchable) {
                            for (let i = 0; i < cbs.create.length; ++i) {
                                cbs.create[i](emptyNode, ancestor)
                            }
                            const insert = ancestor.data.hook.insert
                            if (insert.merged) {
                                for (let i = 1; i < insert.fns.length; i++) {
                                    insert.fns[i]()
                                }
                            }
                        } else {
                            registerRef(ancestor)
                        }
                        ancestor = ancestor.parent
                    }
                }

                // 移除旧父节点
                if (isDef(parentElm)) {
                    removeVnodes([oldVnode], 0, 0)
                } else if (isDef(oldVnode.tag)) {
                    invokeDestroyHook(oldVnode) // 调用destroy钩子
                }
            }
        }
        
        // 调用insert 钩子
        invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
        return vnode.elm
    }
}
```

nodeOps 是[vue/src/platforms/web/runtime/node-ops.js](https://github.com/vuejs/vue/blob/dev/src/platforms/web/runtime/node-ops.js)导出的所有方法的一个集合。

modules 来自[vue/src/platforms/web/runtime/modules/index.js](https://github.com/vuejs/vue/blob/dev/src/platforms/web/runtime/modules/index.js)。

``` js
function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}
function sameInputType (a, b) {
  if (a.tag !== 'input') return true
  let i
  const typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type
  const typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}
```

``` js
export const isTextInputType = makeMap('text,number,password,search,email,tel,url')
```

``` js
export function makeMap (
  str: string,
  expectsLowerCase?: boolean
): (key: string) => true | void {
  const map = Object.create(null)
  const list: Array<string> = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? val => map[val.toLowerCase()]
    : val => map[val]
}
```

### createElm

``` js
function createElm (
    vnode,
    insertedVnodeQueue,
    parentElm,
    refElm,
    nested,
    ownerArray,
    index
  ) {
    // 略
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      vnode = ownerArray[index] = cloneVNode(vnode)
    }
    // 略
    vnode.isRootInsert = !nested 

    // 创建组件节点
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    const data = vnode.data
    const children = vnode.children
    const tag = vnode.tag
    // 元素节点
    if (isDef(tag)) {
      // 略
      if (process.env.NODE_ENV !== 'production') {
        if (data && data.pre) {
          creatingElmInVPre++
        }
        if (isUnknownElement(vnode, creatingElmInVPre)) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          )
        }
      }

      // 创建虚拟节点对应的元素节点
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode)
      // set scope id attribute for scoped CSS.
      setScope(vnode)

      // if 部分略
      if (__WEEX__) {
        const appendAsTree = isDef(data) && isTrue(data.appendAsTree)
        if (!appendAsTree) {
          if (isDef(data)) {
            invokeCreateHooks(vnode, insertedVnodeQueue)
          }
          insert(parentElm, vnode.elm, refElm)
        }
        createChildren(vnode, children, insertedVnodeQueue)
        if (appendAsTree) {
          if (isDef(data)) {
            invokeCreateHooks(vnode, insertedVnodeQueue)
          }
          insert(parentElm, vnode.elm, refElm)
        }
      } 
      else {
        // 遍历子节点，创建虚拟子节点对应的元素节点
        createChildren(vnode, children, insertedVnodeQueue)
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue) // 调用create钩子
        }
        // 将元素节点挂到父元素上
        insert(parentElm, vnode.elm, refElm)
      }

      if (process.env.NODE_ENV !== 'production' && data && data.pre) {
        creatingElmInVPre--
      }
    } 
    // 创建注释节点并插入
    else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text)
      insert(parentElm, vnode.elm, refElm)
    } 
    // 创建文本节点并插入
    else {
      vnode.elm = nodeOps.createTextNode(vnode.text)
      insert(parentElm, vnode.elm, refElm)
    }
}
```

``` js
function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
        if (process.env.NODE_ENV !== 'production') {
            checkDuplicateKeys(children)
        }
        for (let i = 0; i < children.length; ++i) {
            createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i)
        }
    } else if (isPrimitive(vnode.text)) {
        nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
    }
}
function insert (parent, elm, ref) {
    if (isDef(parent)) {
        if (isDef(ref)) {
            if (nodeOps.parentNode(ref) === parent) {
                nodeOps.insertBefore(parent, elm, ref)
            }
        } else {
            nodeOps.appendChild(parent, elm)
        }
    }
}
```

> 组件节点和insertedVnodeQueue暂不深入

### patchVnode

``` js
  function patchVnode (
    oldVnode,
    vnode,
    insertedVnodeQueue,
    ownerArray,
    index,
    removeOnly
  ) {
    // 两个节点相同直接返回
    if (oldVnode === vnode) {
      return
    }

    // 略
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      vnode = ownerArray[index] = cloneVNode(vnode)
    }
    const elm = vnode.elm = oldVnode.elm
    
    // 略
    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue)
      } else {
        vnode.isAsyncPlaceholder = true
      }
      return
    }

    /**
     * 如果新旧节点isStatic都为true，且key相同，
     * 并且新节点是isCloned或者是isOnce（标记了v-once表示只渲染一次），
     * 则替换回旧节点的componentInstance。
    */
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance
      return
    }

    // data.hook.prepatch 钩子存在则调用
    let i
    const data = vnode.data
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode)
    }

    const oldCh = oldVnode.children
    const ch = vnode.children
    // 调用update钩子
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
      if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode) // data.hook.update 钩子存在则调用
    }
    // 不存在文本节点
    if (isUndef(vnode.text)) {
        // 新旧节点都有子节点且子节点不同，则调用updateChildren
        if (isDef(oldCh) && isDef(ch)) {
            if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
        } 
        // 仅新节点有子节点
        else if (isDef(ch)) {
            // 非生产环境重复key值校验警告
            if (process.env.NODE_ENV !== 'production') {
                checkDuplicateKeys(ch) 
            }
            // 清空文本
            if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
            // 添加节点
            addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
        } 
        // 仅旧节点有子节点，则删除节点
        else if (isDef(oldCh)) {
            removeVnodes(oldCh, 0, oldCh.length - 1)
        } 
        // 均无子节点，需要清空文本
        else if (isDef(oldVnode.text)) {
            nodeOps.setTextContent(elm, '')
        }
    }
    // 存在文本节点，且新旧节点文本不同，替换文本内容
    else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text)
    }
    // data.hook.postpatch 钩子存在则调用
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
    }
}
```

### updateChildren （diff）

``` js
function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    let oldStartIdx = 0
    let newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    let oldKeyToIdx, idxInOld, vnodeToMove, refElm

    // <transition-group>
    const canMove = !removeOnly

    // 非生产环境重复key值校验警告
    if (process.env.NODE_ENV !== 'production') {
      checkDuplicateKeys(newCh)
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        // 旧子节点列表首个节点为空， oldStartVnode 右移， oldStartIdx +1
        oldStartVnode = oldCh[++oldStartIdx]
      } else if (isUndef(oldEndVnode)) {
        // 旧子节点列表末尾节点为空， oldEndVnode 左移， oldEndIdx -1
        oldEndVnode = oldCh[--oldEndIdx]
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        // 新旧列表首个节点符合sameVnode，进行patchVnode
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        // oldStartVnode 右移， oldStartIdx +1
        oldStartVnode = oldCh[++oldStartIdx]
        // newStartVnode 右移， newStartIdx +1
        newStartVnode = newCh[++newStartIdx]
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        // 新旧列表末尾节点符合sameVnode，进行patchVnode
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        // oldEndVnode 左移， oldEndIdx -1
        oldEndVnode = oldCh[--oldEndIdx]
        // newEndVnode 左移， newEndIdx -1
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newEndVnode)) {
        // 旧子节点列表首个节点 和 新子节点列表末尾节点 符合sameVnode，进行patchVnode
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        // 将旧子节点列表首个节点，插到末尾
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
        // oldStartVnode 右移， oldStartIdx +1
        oldStartVnode = oldCh[++oldStartIdx]
        // newEndVnode 左移， newEndIdx -1
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldEndVnode, newStartVnode)) {
        // 旧子节点列表末尾节点 和 新子节点列表首个节点 符合sameVnode，进行patchVnode
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        // 将旧子节点列表末尾节点，插到列表最前
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        // oldEndVnode 左移， oldEndIdx -1
        oldEndVnode = oldCh[--oldEndIdx]
        // newStartVnode 右移， newStartIdx +1
        newStartVnode = newCh[++newStartIdx]
      } else {
        // 非首尾两两对比四种结果的情况
        // 初始化 oldKeyToIdx 为一个key值与下标的哈希表
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        // 如果新子节点列表首个节点存在key值，到哈希表中查找，否则到旧子节点列表中根据sameVnode查找，得到下标
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
        // 没有找到下标则创建新节点
        if (isUndef(idxInOld)) { 
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        } 
        // 找到下标
        else {
          // 找到下标对应的旧子节点
          vnodeToMove = oldCh[idxInOld]
          if (sameVnode(vnodeToMove, newStartVnode)) {
            // 找的的旧子节点 和 新子节点列表首个节点 符合sameVnode，进行patchVnode
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
            // 将该旧子节点设为undefined
            oldCh[idxInOld] = undefined
            // 将该旧子节点插到列表最前
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
          } else {
            // 不符合sameVnode，也就是相同的key但元素不同，则创建新节点
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
          }
        }
        // newStartVnode 右移， newStartIdx +1
        newStartVnode = newCh[++newStartIdx]
      }
    }
    // 旧子节点列表遍历完毕
    if (oldStartIdx > oldEndIdx) {
      // 获取新子节点剩余节点右边节点，用于insert时参照位置
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
      // 批量调用createElm增加新子节点列表剩余节点
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } 
    // 新子节点列表遍历完毕
    else if (newStartIdx > newEndIdx) {
      // 删除剩余旧子节点列表
      removeVnodes(oldCh, oldStartIdx, oldEndIdx)
    }
}
```

``` js
function createKeyToOldIdx (children, beginIdx, endIdx) {
    let i, key
    const map = {}
    for (i = beginIdx; i <= endIdx; ++i) {
        key = children[i].key
        if (isDef(key)) map[key] = i
    }
    return map
}
function findIdxInOld (node, oldCh, start, end) {
    for (let i = start; i < end; i++) {
      const c = oldCh[i]
      if (isDef(c) && sameVnode(node, c)) return i
    }
}
function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx)
    }
}
function removeVnodes (vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx]
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch)
          invokeDestroyHook(ch)
        } else { // Text node
          removeNode(ch.elm)
        }
      }
    }
}
```

### 总结

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

``` js
export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node
  //...
}
```

### 参考

[VirtualDOM与diff(Vue实现)](https://github.com/answershuto/learnVue/blob/master/docs/VirtualDOM%E4%B8%8Ediff(Vue%E5%AE%9E%E7%8E%B0).MarkDown)
