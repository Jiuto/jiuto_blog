## 用Map写一个EventBus事件总线

> 本文所写的EventBus类代码可在[dc-utils](https://github.com/dc-ken-jiu/dc-utils/blob/master/src/eventBus.ts)中查看

---

### 前置知识

[Map文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)

[设计模式](https://www.cnblogs.com/tugenhua0707/p/5198407.html#_labe8)

### EventBus

``` js
class EventBus {
    constructor () {
      this.events = new Map()
    }
    // 监听事件
    addListener (type, cb) {
        if (!type || !cb) return; // 必传事件名与回调，此处未作处理直接return，可做一些抛错处理
        if (!this.events.has(type)) { // 该事件不存在时
            this.events.set(type, []) // 初始化一个空数组，用于保存回调
        }
        this.events.get(type).push(cb); // 保存回调
    }
    // 触发事件
    dispatchListener (type, params) {
        if (!type || !this.events.has(type)) return; // 必传事件名，事件不存在直接return
        let cbs = this.events.get(type); // 获取回调数组
        if (cbs) {
            cbs.forEach(cb => { // 遍历调用回调函数并传入参数
                cb.call(this, params) 
            });
        }
    }
    // 注销事件
    removeListener (type, cb) {
        if (!type || !this.events.has(type)) return; // 必传事件名，事件不存在直接return
        if (cb) { // 明确要删除的回调
            let cbs = this.events.get(type);
            for (let i = 0; i < cbs.length; i++) { // 遍历回调数组，找到目标回调并删除
                if(cbs[i] === cb) {
                    cbs.splice(i, 1);
                    break
                }
            }
        } else { // 未明确回调时，清空整个事件
            this.events.delete(type)
        }
    }
}
```

### 测试

``` js
let eventBus = new EventBus();
let fun1 = function () {
    console.log(1)
}
let fun2 = function () {
    console.log(2)
}
let fun3 = function () {
    console.log(3)
}
eventBus.addListener("type1",fun1)
eventBus.addListener("type1",fun2)
eventBus.addListener("type1",fun3)

eventBus.dispatchListener("type1")

eventBus.removeListener("type1",fun2)

eventBus.dispatchListener("type1")

let fun4 = function (v) {
    console.log(v)
}

eventBus.addListener("type2",fun4)

eventBus.dispatchListener("type2","this is a parameter")

eventBus.removeListener("type2")

eventBus.dispatchListener("type2","this is another parameter")

console.log(eventBus)
  
```

### 结果

<img :src="$withBase('/imgs/js/eventBus/example.png')" alt="example">
