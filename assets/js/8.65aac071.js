(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{386:function(t,s,n){"use strict";n.r(s);var a=n(42),e=Object(a.a)({},(function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[n("h2",{attrs:{id:"event-loop-事件循环"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#event-loop-事件循环"}},[t._v("#")]),t._v(" event loop 事件循环")]),t._v(" "),n("h3",{attrs:{id:"event-loop"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#event-loop"}},[t._v("#")]),t._v(" event loop")]),t._v(" "),n("blockquote",[n("p",[t._v("ECMAScript中没有event loop，event loop是在"),n("a",{attrs:{href:"https://html.spec.whatwg.org/#event-loops",target:"_blank",rel:"noopener noreferrer"}},[t._v("HTML Standard"),n("OutboundLink")],1),t._v("定义的")])]),t._v(" "),n("p",[t._v("为什么要有event loop")]),t._v(" "),n("blockquote",[n("p",[t._v("为了协调事件，用户交互，脚本，渲染，网络等，用户代理必须使用所述的event loop")])]),t._v(" "),n("h3",{attrs:{id:"宏任务-macrotask-和-微任务-microtask"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#宏任务-macrotask-和-微任务-microtask"}},[t._v("#")]),t._v(" 宏任务 MacroTask 和 微任务 MicroTask")]),t._v(" "),n("ul",[n("li",[t._v("任务队列分为 MicroTask（也叫Task） 和 MacroTask：")])]),t._v(" "),n("blockquote",[n("p",[t._v("宿主环境提供的叫宏任务，由语言标准提供的叫微任务。")])]),t._v(" "),n("blockquote",[n("p",[t._v("宿主环境：")])]),t._v(" "),n("blockquote",[n("p",[t._v("简单来说就是能使javascript完美运行的环境，只要能完美运行javascript的载体就是javascript的宿主环境。目前我们常见的两种宿主环境有浏览器和node。宿主环境内所有的内建或自定义的变量/函数都是 global/window 这个全局对象的属性/方法，而由宿主环境提供的也叫宏任务。")])]),t._v(" "),n("blockquote",[n("p",[t._v("语言标准：")])]),t._v(" "),n("blockquote",[n("p",[t._v("我们都知道JavaScript是一种编程语言，但其实JavaScript由ECMA制定标准，称之为ECMAScript，所以由语言标准提供的就是微任务，比如ES6提供的promise。")])]),t._v(" "),n("blockquote",[n("p",[t._v("(引自https://www.jianshu.com/p/a697e9bfdaef)")])]),t._v(" "),n("p",[n("code",[t._v("宏任务 MacroTask ：Script、setTimeout、setImmediate、setInterval、I/O、UI rendering")])]),t._v(" "),n("p",[n("code",[t._v("微任务 MicroTask ：Promise、MutationObserver、process.nextTick、Object.observe")])]),t._v(" "),n("ul",[n("li",[t._v("js调用栈")])]),t._v(" "),n("blockquote",[n("p",[t._v("Javascript 有一个 main thread 主线程和 call-stack 调用栈(执行栈)，所有的任务都会被放到调用栈等待主线程执行。")])]),t._v(" "),n("ul",[n("li",[t._v("event loop 处理过程")])]),t._v(" "),n("ol",[n("li",[n("p",[t._v("在 MacroTask 队列中选择最早的任务，如果队列为空则跳到的microtasks步骤")])]),t._v(" "),n("li",[n("p",[t._v("将上一步选择的任务设为 event loop 的 currently running tasksk")])]),t._v(" "),n("li",[n("p",[t._v("执行该任务")])]),t._v(" "),n("li",[n("p",[t._v("执行完毕，将 event loop 的 currently running task 位置为 null")])]),t._v(" "),n("li",[n("p",[t._v("从 MacroTask 队列中移除已执行任务")])]),t._v(" "),n("li",[n("p",[t._v("Microtasks: 执行 MicroTask 任务检查点")])]),t._v(" "),n("li",[n("p",[t._v("选择性渲染视图（Update the rendering）")])]),t._v(" "),n("li",[n("p",[t._v("回到第一步")])])]),t._v(" "),n("ul",[n("li",[t._v("MicroTask 检查点")])]),t._v(" "),n("p",[t._v("当调用栈为空或者在 event loop 的第六步时，执行一个 MicroTask checkpoint，如果其flag（标识）为false，则执行：")]),t._v(" "),n("ol",[n("li",[n("p",[t._v("将 MicroTask checkpoint 的 flag 设为true")])]),t._v(" "),n("li",[n("p",[t._v("如果 MicroTask 队列为空跳到第八步")])]),t._v(" "),n("li",[n("p",[t._v("在 MicroTask 队列中选择最早的任务")])]),t._v(" "),n("li",[n("p",[t._v("将上一步选择的任务设为 event loop 的 currently running task")])]),t._v(" "),n("li",[n("p",[t._v("执行该任务")])]),t._v(" "),n("li",[n("p",[t._v("执行完毕，将 event loop 的 currently running task 位置为 null")])]),t._v(" "),n("li",[n("p",[t._v("从 MicroTask 队列中移除已执行任务，回到第二步")])]),t._v(" "),n("li",[n("p",[t._v("清理 IndexedDB 的事务")])]),t._v(" "),n("li",[n("p",[t._v("将 MicroTask checkpoint的flag设为flase")])])]),t._v(" "),n("ul",[n("li",[t._v("在不同的浏览器或者node环境下，执行顺序有所不同，以谷歌浏览器为例：")])]),t._v(" "),n("p",[t._v("当调用栈空闲后每次事件循环只会从 MacroTask 中读取一个最早的任务任务并执行，而在同一次事件循环内会清空 MicroTask 栈。")]),t._v(" "),n("p",[t._v("即， MacroTask 执行完后，将 MicroTask 队列中所有的任务按照先进先出的顺序全部执行。")]),t._v(" "),n("p",[t._v("一次事件循环完毕（执行完microtask队列里的任务），有可能会渲染更新。")]),t._v(" "),n("hr"),t._v(" "),n("p",[n("a",{attrs:{href:"https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver",target:"_blank",rel:"noopener noreferrer"}},[t._v("MutationObserver"),n("OutboundLink")],1),t._v(" 简单介绍")]),t._v(" "),n("p",[t._v("MutationObserver接口提供了监视对DOM树所做更改的能力。它被设计为旧的Mutation Events功能的替代品，该功能是DOM3 Events规范的一部分。")]),t._v(" "),n("div",{staticClass:"language-js extra-class"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[t._v("  "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// MutationObserver 创建一个微任务")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" observer "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("MutationObserver")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("666")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" counter "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" textNode "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" document"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("createTextNode")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("String")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("counter"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  \n  observer"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("observe")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("textNode"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      characterData"),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),t._v(" \n      "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 设为true以监视指定目标节点或子节点树中节点所包含的字符数据的变化")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  \n  counter "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("counter "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  textNode"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("data "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("String")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("counter"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 触发观测，执行回调，控制台输出666")]),t._v("\n")])])]),n("hr"),t._v(" "),n("h3",{attrs:{id:"实例"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#实例"}},[t._v("#")]),t._v(" 实例")]),t._v(" "),n("div",{staticClass:"language-js extra-class"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[t._v("  console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'1'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 调用栈")]),t._v("\n\n  "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("setTimeout")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 宏任务")]),t._v("\n      console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'2'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n      "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Promise")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("resolve")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n          console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'3'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n          "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("resolve")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n      "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("then")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 微任务")]),t._v("\n          console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'4'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n      "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n      "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("setTimeout")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 宏任务")]),t._v("\n          console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'5'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n      "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n      "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// MutationObserver 创建一个微任务")]),t._v("\n      "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" counter "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),t._v("\n      "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" observer "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("MutationObserver")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("6")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n      "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" textNode "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" document"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("createTextNode")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("String")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("counter"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n      observer"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("observe")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("textNode"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n          characterData"),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 设为true以监视指定目标节点或子节点树中节点所包含的字符数据的变化。")]),t._v("\n      "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n      counter "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("counter "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),t._v("\n      textNode"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("data "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("String")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("counter"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n  "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// new promise 会立即执行， then会分发到微任务")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Promise")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("resolve")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'7'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n      "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("resolve")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("then")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'8'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n  "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("setTimeout")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 宏任务")]),t._v("\n      console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'9'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n      "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Promise")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("resolve")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n          console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'10'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n          "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("resolve")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n      "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("then")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 微任务")]),t._v("\n          console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'11'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n      "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),n("p",[t._v("输出顺序：1、7、8、2、3、4、6、9、10、11、5")]),t._v(" "),n("ol",[n("li",[t._v("第一次事件循环")])]),t._v(" "),n("p",[t._v("MacroTask ：Script")]),t._v(" "),n("p",[t._v("MicroTask ：")]),t._v(" "),n("p",[t._v("从 MacroTask 中取出整个 Script 并执行：")]),t._v(" "),n("p",[t._v("执行console.log(1)，将setTimeout(function() { console.log('2'); ...})推入 MacroTask，\n执行new Promise，将then部分推入 MicroTask，将setTimeout(function() { console.log('9'); ...})推入 MacroTask")]),t._v(" "),n("p",[t._v("输入：1、7")]),t._v(" "),n("p",[t._v("此时任务栈情况：")]),t._v(" "),n("p",[t._v("MacroTask ：setTimeout(function() { console.log('2'); ...})、setTimeout(function() { console.log('9'); ...})")]),t._v(" "),n("p",[t._v("MicroTask ：then(function() { console.log('8') })")]),t._v(" "),n("p",[t._v("清空 MicroTask")]),t._v(" "),n("p",[t._v("输出：8")]),t._v(" "),n("p",[t._v("此时任务栈情况：")]),t._v(" "),n("p",[t._v("MacroTask ：setTimeout(function() { console.log('2'); ...})、setTimeout(function() { console.log('9'); ...})")]),t._v(" "),n("p",[t._v("MicroTask ：")]),t._v(" "),n("ol",{attrs:{start:"2"}},[n("li",[t._v("第二次事件循环")])]),t._v(" "),n("p",[t._v("从 MacroTask 中取出setTimeout(function() { console.log('2'); ...})并执行：")]),t._v(" "),n("p",[t._v("执行console.log(2)、执行new Promise，将then部分推入 MicroTask，将setTimeout(function() { console.log('5'); ...})推入 MacroTask，将MutationObserver推入 MicroTask")]),t._v(" "),n("p",[t._v("输出：2、3")]),t._v(" "),n("p",[t._v("此时任务栈情况：")]),t._v(" "),n("p",[t._v("MacroTask ：setTimeout(function() { console.log('9'); ...})、setTimeout(function() { console.log('5'); ...})")]),t._v(" "),n("p",[t._v("MicroTask ：then(function() { console.log('4') })、MutationObserver")]),t._v(" "),n("p",[t._v("清空 MicroTask")]),t._v(" "),n("p",[t._v("输出：4、6")]),t._v(" "),n("p",[t._v("此时任务栈情况：")]),t._v(" "),n("p",[t._v("MacroTask ：setTimeout(function() { console.log('9'); ...})、setTimeout(function() { console.log('5'); ...})")]),t._v(" "),n("p",[t._v("MicroTask ：")]),t._v(" "),n("ol",{attrs:{start:"3"}},[n("li",[t._v("第三次事件循环")])]),t._v(" "),n("p",[t._v("从 MacroTask 中取出setTimeout(function() { console.log('9'); ...})并执行：")]),t._v(" "),n("p",[t._v("执行console.log(9)、执行new Promise，将then部分推入 MicroTask")]),t._v(" "),n("p",[t._v("输出： 9、10")]),t._v(" "),n("p",[t._v("MacroTask ：setTimeout(function() { console.log('5'); ...})")]),t._v(" "),n("p",[t._v("MicroTask ：then(function() { console.log('11') })")]),t._v(" "),n("p",[t._v("清空 MicroTask")]),t._v(" "),n("p",[t._v("输出：11")]),t._v(" "),n("p",[t._v("此时任务栈情况：")]),t._v(" "),n("p",[t._v("MacroTask ：setTimeout(function() { console.log('5'); ...})")]),t._v(" "),n("p",[t._v("MicroTask")]),t._v(" "),n("ol",{attrs:{start:"4"}},[n("li",[t._v("第四次事件循环")])]),t._v(" "),n("p",[t._v("从 MacroTask 中取出setTimeout(function() { console.log('5'); ...})并执行：")]),t._v(" "),n("p",[t._v("执行console.log(5)")]),t._v(" "),n("p",[t._v("输出：5")]),t._v(" "),n("p",[t._v("MicroTask 为空")]),t._v(" "),n("p",[t._v("此时任务栈情况：")]),t._v(" "),n("p",[t._v("MacroTask ：")]),t._v(" "),n("p",[t._v("MicroTask ：")]),t._v(" "),n("hr"),t._v(" "),n("h3",{attrs:{id:"参考"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#参考"}},[t._v("#")]),t._v(" 参考")]),t._v(" "),n("p",[n("a",{attrs:{href:"https://github.com/aooy/blog/issues/5",target:"_blank",rel:"noopener noreferrer"}},[t._v("从event loop规范探究javaScript异步及浏览器更新渲染时机"),n("OutboundLink")],1)]),t._v(" "),n("p",[n("a",{attrs:{href:"https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/",target:"_blank",rel:"noopener noreferrer"}},[t._v("Tasks, microtasks, queues and schedules"),n("OutboundLink")],1)]),t._v(" "),n("p",[n("a",{attrs:{href:"https://juejin.cn/post/6844903764202094606#heading-36",target:"_blank",rel:"noopener noreferrer"}},[t._v("一次弄懂Event Loop"),n("OutboundLink")],1)])])}),[],!1,null,null,null);s.default=e.exports}}]);