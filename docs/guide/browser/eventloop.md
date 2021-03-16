## event loop 事件循环

### event loop

> ECMAScript中没有event loop，event loop是在[HTML Standard](https://html.spec.whatwg.org/#event-loops)定义的

为什么要有event loop

> 为了协调事件，用户交互，脚本，渲染，网络等，用户代理必须使用所述的event loop

### 宏任务 MacroTask 和 微任务 MicroTask

+ 任务队列分为 MicroTask（也叫Task） 和 MacroTask：

> 宿主环境提供的叫宏任务，由语言标准提供的叫微任务。
>
> 宿主环境：
>
> 简单来说就是能使javascript完美运行的环境，只要能完美运行javascript的载体就是javascript的宿主环境。目前我们常见的两种宿主环境有浏览器和node。宿主环境内所有的内建或自定义的变量/函数都是 global/window 这个全局对象的属性/方法，而由宿主环境提供的也叫宏任务。
>
> 语言标准：
>
> 我们都知道JavaScript是一种编程语言，但其实JavaScript由ECMA制定标准，称之为ECMAScript，所以由语言标准提供的就是微任务，比如ES6提供的promise。
>
> (引自https://www.jianshu.com/p/a697e9bfdaef)

`宏任务 MacroTask ：Script、setTimeout、setImmediate、setInterval、I/O、UI rendering`

`微任务 MicroTask ：Promise、MutationObserver、process.nextTick、Object.observe`

+ js调用栈

> Javascript 有一个 main thread 主线程和 call-stack 调用栈(执行栈)，所有的任务都会被放到调用栈等待主线程执行。

+ event loop 处理过程

1. 在 MacroTask 队列中选择最早的任务，如果队列为空则跳到的microtasks步骤

2. 将上一步选择的任务设为 event loop 的 currently running tasksk

3. 执行该任务

4. 执行完毕，将 event loop 的 currently running task 位置为 null

5. 从 MacroTask 队列中移除已执行任务

6. Microtasks: 执行 MicroTask 任务检查点

7. 选择性渲染视图（Update the rendering）

8. 回到第一步

+ MicroTask 检查点

当调用栈为空或者在 event loop 的第六步时，执行一个 MicroTask checkpoint，如果其flag（标识）为false，则执行：

1. 将 MicroTask checkpoint 的 flag 设为true

2. 如果 MicroTask 队列为空跳到第八步

3. 在 MicroTask 队列中选择最早的任务

4. 将上一步选择的任务设为 event loop 的 currently running task

5. 执行该任务

6. 执行完毕，将 event loop 的 currently running task 位置为 null

7. 从 MicroTask 队列中移除已执行任务，回到第二步

8. 清理 IndexedDB 的事务

9. 将 MicroTask checkpoint的flag设为flase

+ 在不同的浏览器或者node环境下，执行顺序有所不同，以谷歌浏览器为例：

当调用栈空闲后每次事件循环只会从 MacroTask 中读取一个最早的任务任务并执行，而在同一次事件循环内会清空 MicroTask 栈。

即， MacroTask 执行完后，将 MicroTask 队列中所有的任务按照先进先出的顺序全部执行。

一次事件循环完毕（执行完microtask队列里的任务），有可能会渲染更新。

---

[MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver) 简单介绍

MutationObserver接口提供了监视对DOM树所做更改的能力。它被设计为旧的Mutation Events功能的替代品，该功能是DOM3 Events规范的一部分。

``` js
  // MutationObserver 创建一个微任务
  const observer = new MutationObserver(function(){console.log(666)});
  let counter = 1;
  const textNode = document.createTextNode(String(counter));
  
  observer.observe(textNode, {
      characterData: true 
      // 设为true以监视指定目标节点或子节点树中节点所包含的字符数据的变化
  });
  
  counter = (counter + 1) % 2;
  textNode.data = String(counter); // 触发观测，执行回调，控制台输出666
```

---

### 实例

``` js
  console.log('1'); // 调用栈

  setTimeout(function() { // 宏任务
      console.log('2');
      new Promise(function(resolve) {
          console.log('3');
          resolve();
      }).then(function() { // 微任务
          console.log('4')
      })
      setTimeout(()=>{ // 宏任务
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

  setTimeout(function() { // 宏任务
      console.log('9');
      new Promise(function(resolve) {
          console.log('10');
          resolve();
      }).then(function() { // 微任务
          console.log('11')
      })
  })
```

输出顺序：1、7、8、2、3、4、6、9、10、11、5

1. 第一次事件循环

MacroTask ：Script

MicroTask ：

从 MacroTask 中取出整个 Script 并执行：

执行console.log(1)，将setTimeout(function() { console.log('2'); ...})推入 MacroTask，
执行new Promise，将then部分推入 MicroTask，将setTimeout(function() { console.log('9'); ...})推入 MacroTask

输入：1、7

此时任务栈情况：

MacroTask ：setTimeout(function() { console.log('2'); ...})、setTimeout(function() { console.log('9'); ...})

MicroTask ：then(function() { console.log('8') })

清空 MicroTask

输出：8

此时任务栈情况：

MacroTask ：setTimeout(function() { console.log('2'); ...})、setTimeout(function() { console.log('9'); ...})

MicroTask ：

2. 第二次事件循环

从 MacroTask 中取出setTimeout(function() { console.log('2'); ...})并执行：

执行console.log(2)、执行new Promise，将then部分推入 MicroTask，将setTimeout(function() { console.log('5'); ...})推入 MacroTask，将MutationObserver推入 MicroTask

输出：2、3

此时任务栈情况：

MacroTask ：setTimeout(function() { console.log('9'); ...})、setTimeout(function() { console.log('5'); ...})

MicroTask ：then(function() { console.log('4') })、MutationObserver

清空 MicroTask

输出：4、6

此时任务栈情况：

MacroTask ：setTimeout(function() { console.log('9'); ...})、setTimeout(function() { console.log('5'); ...})

MicroTask ：

3. 第三次事件循环

从 MacroTask 中取出setTimeout(function() { console.log('9'); ...})并执行：

执行console.log(9)、执行new Promise，将then部分推入 MicroTask

输出： 9、10

MacroTask ：setTimeout(function() { console.log('5'); ...})

MicroTask ：then(function() { console.log('11') })

清空 MicroTask

输出：11

此时任务栈情况：

MacroTask ：setTimeout(function() { console.log('5'); ...})

MicroTask 

4. 第四次事件循环

从 MacroTask 中取出setTimeout(function() { console.log('5'); ...})并执行：

执行console.log(5)

输出：5

MicroTask 为空

此时任务栈情况：

MacroTask ：

MicroTask ：

---

### 参考

[从event loop规范探究javaScript异步及浏览器更新渲染时机](https://github.com/aooy/blog/issues/5)

[Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

[一次弄懂Event Loop](https://juejin.cn/post/6844903764202094606#heading-36)
