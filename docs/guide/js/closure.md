## 理解js闭包

### 闭包和作用域链

> 闭包是指有权访问另一个函数作用域中的变量的函数。（《JavaScript高级程序设计》7.2闭包）

> 所有的JavaScript函数都是闭包：它们都是对象，它们都关联到作用域链。（《JavaScript权威指南》8.6闭包）
>
> 和其他大多数现代编程语言一样，JavaScript也采用词法作用域（lexical scoping），也就是说，函数的执行依赖于变量作用域，
> 这个作用域是在函数定义时决定的，而不是函数调用时决定的。（《JavaScript权威指南》8.6闭包）
>
> 每一段JavaScript代码（全局代码或函数）都有一个与之关联的作用域链（scope chain）。
> 这个作用域链是一个对象列表或者链表，这组对象定义了这段代码”作用域中“的变量。（《JavaScript权威指南》3.10.3作用域链）

当JavaScript需要查找变量的x的值的时候，它会从作用域链中的第一个对象开始查找，
如果这个对象没有名为x的属性，就会继续查找链上下一个对象，最后到全局作用域，如果全都没有找到就会抛出一个引用错误（ReferenceError）异常。

### 实例

``` js
var count = 0;
function closure() {
    var count = 1;
    return function(){
        return count += 5
    }
}
var f = closure();
console.log(f()) // 6
console.log(f()) // 11
```

closure函数返回了一个匿名函数，将其赋值给f，多次调用f，closure函数内的count累计增加。

由于作用域是在函数定义时决定而不是函数调用时决定的，f return的变量是closure函数作用域内的count，而不是全局作用域的count。

---

``` js
var str = 'IIFE（立即执行函数表达式）同样创建闭包';
(function IIFE(){
  console.log(str);
})();
```

IIFE（立即执行函数表达式）同样创建闭包，可以访问全局作用域和当前函数的变量作用域。

---

再看一个经典的例子

``` js
for(var i = 0; i < 5; i ++){
  setTimeout(function() {
    console.log(i)
  }, 1000)
}
```

由于setTimeout属于宏任务（相关知识看这里[event loop 事件循环](https://jiuto.github.io/jiuto_blog/guide/browser/eventloop.html)），
所以当5次循环结束，i变成5，才会执行回调函数，
又因为5个回调函数均为1000ms延时，且它们被推入macrotask栈的时间几乎相同，
所以结果是1秒后输出五个5。

---

如何使输出结果变成0、1、2、3、4？

1. 方法一

``` js
for(var i = 0; i < 5; i ++){
    setTimeout(function(n) {
        console.log(n)
    }, 1000, i)
}
```

2. 方法二

``` js
for(let i = 0; i < 5; i ++){
    setTimeout(function() {
        console.log(i)
    }, 1000)
}
```

3. 方法三

``` js
for(var i = 0; i < 5; i ++){
    (function(n){
        setTimeout(function() {
            console.log(n)
        }, 1000)
    })(i)
}
```

4. 方法四

``` js
var fun = function(n){
    setTimeout(function() {
        console.log(n)
    }, 1000)
}
for(var i = 0; i < 5; i ++){
    fun(i)
}
```

其实方法一、三、四的道理是一样的，原来的回调函数打印的i是直接通过闭包取的全局作用域的i，而这三种方法本质上都是将i的值作为函数的入参传入，使得打印的时候直接取函数作用域内的入参。

方法二利用了ES6的let，let声明的变量只在let命令所在的代码块内有效，5次循环其实就有5个代码块，每个代码块都有一个自己的let变量。

---

如何使输出结果之间间隔1s？

1. 方法一

``` js
var fun = function(n){
    setTimeout(function() {
        console.log(new Date(), n)
    }, 1000*n)
}
for(var i = 0; i < 5; i++){
    fun(i)
}
//Tue Mar 16 2021 23:52:38 GMT+0800 (中国标准时间) 0
//Tue Mar 16 2021 23:52:39 GMT+0800 (中国标准时间) 1
//Tue Mar 16 2021 23:52:40 GMT+0800 (中国标准时间) 2
//Tue Mar 16 2021 23:52:41 GMT+0800 (中国标准时间) 3
//Tue Mar 16 2021 23:52:42 GMT+0800 (中国标准时间) 4
```

方法一直接利用下标间距为1设置不同的延时。
但当循环体不是i++而是i+=x时，延时就得麻烦的进行1000*n/x计算了。

2. 方法二

``` js
const fun = gap => new Promise((resolve,reject) => {
    setTimeout(resolve, gap);
});
(async () => {
    for (var i = 0; i < 5; i++) {
        if(i!==0) await fun(1000);
        console.log(new Date(), i);
    }
})();
//Tue Mar 16 2021 23:53:15 GMT+0800 (中国标准时间) 0
//Tue Mar 16 2021 23:53:16 GMT+0800 (中国标准时间) 1
//Tue Mar 16 2021 23:53:17 GMT+0800 (中国标准时间) 2
//Tue Mar 16 2021 23:53:18 GMT+0800 (中国标准时间) 3
//Tue Mar 16 2021 23:53:19 GMT+0800 (中国标准时间) 4
```

直接利用await/async、Promise去等待1s然后打印。

### 参考

《JavaScript高级程序设计》

《JavaScript权威指南》

闭包相关的面试题可以参考：

[破解前端面试（80% 应聘者不及格系列）：从闭包说起](https://juejin.cn/post/6844903474212143117#heading-0)
