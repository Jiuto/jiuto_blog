## 手写 bind

### bind 方法

[Function.prototype.bind()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

[Function.length](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/length)

先看一看bind方法的返回结果：

``` js
console.log(typeof Function.prototype.bind()); // function
console.log(Function.prototype.bind().name); // "bound "
console.log(Function.prototype.bind.length); // 1
console.log(Function.prototype.bind().length); // 0
```

bind方法返回一个名为`"bound "`的函数（下面统称为bound函数），bing函数的形参个数为1，当bind没有传参时，bound的形参个数为0。

试试给bind传参：

``` js
var obj = {
    name: 'Jiuto'
}
function original(a,b,c){
    console.log(a)
    console.log(b)
    console.log(c)
    console.log(this)
    return 'some'
}

var bound = original.bind(obj,1,2);
var boundResult = bound(3); // 执行 original函数 输出 1 2 3 { name: 'Jiuto' }
console.log(boundResult); // some 返回original函数的返回值

console.log(original.name); // original
console.log(bound.name); // 'bound original'

console.log(original.bind.length); // 1 
console.log(original.bind().length); // 3 返回original函数的形参个数

var newBoundResult = new bound(2); // 执行 original 输出 1 2 2 originnal的实例
console.log(newBoundResult) // originnal的实例
console.log(typeof newBoundResult) // object
```

1. 调用bound方法会执行原函数（即调用bind的函数original），并返回原函数的执行结果。
2. 原函数的this将指向bind方法的第一个入参。
3. 执行原函数时，入参由bind（去掉一个入参）和bound函数的入参拼接而来。
4. 有原函数时，bound的名称时"bound"+空格+原函数名，没有原函数时为"bound"+空格。
5. bing函数的形参个数为1，bound函数的形参个数不定，为原函数的形参个数。

``` js
var obj = {
    name: 'Jiuto'
}
function original(a,b,c){
    console.log(this)
    this.a=a;
    return 'some'
}
original.prototype.getA=function(){
    return this.a
}
var bound = original.bind(obj,1,2);
var newBoundResult = new bound(2); // 执行 original 输出 1 2 2 originnal的实例
console.log(newBoundResult) // originnal的实例
console.log(Object.prototype.toString.call(newBoundResult)) // [object Object]
console.log(newBoundResult.getA()) // 1
```

6. 当使用new操作符调用bound函数时，将得到原函数的实例，并且继承原函数原型对象上的方法。

再改动一下原函数的返回结果

``` js
var obj = {
    name: 'Jiuto'
}
function original(a,b,c){
    console.log(a)
    console.log(b)
    console.log(c)
    console.log(this)
    this.a=a
    return [{some:'some'}]
}
original.prototype.getA=function(){
    return this.a
}

var bound = original.bind(obj,1,2);
var newBoundResult = new bound(2); // 执行 original 输出 1 2 2 originnal的实例
console.log(newBoundResult) // [{some:'some'}]
console.log(Object.prototype.toString.call(newBoundResult)) // [object Array]
console.log(newBoundResult.getA()) // newBoundResult.getA is not a function
```

这怎么解释呢？

在[手写 new 操作符](https://jiuto.github.io/jiuto_blog/guide/js/new.html)这篇文章中，我们发现new操作符有这样一条表现：

当return 一个Object/Function/Array/Date/RegExp/Error的实例，new操作符得到的就是return的结果。

也就是说，当原函数返回Object/Function/Array/Date/RegExp/Error的实例时，我们调用`nwe bound()`得到的是原函数的返回结果。

有兴趣的同学可以测试一下：

``` js
var obj = {
    name: 'Jiuto'
}
function original(a){
    this.a=a
    // return 'some' // {a:1}
    // return 1 // {a:1}
    // return true // {a:1}
    // return null // {a:1}
    // return undefined // {a:1}
    // return Symbol('s') // {a:1}
    // return [{some:'some'}] // [{some:'some'}]
    // return {} // {}
    // return function(){} // function(){}
    // return new Date() // Fri Mar 19 2021 23:14:34 GMT+0800 (中国标准时间)
    // return /\s/ // /\s/
    return new Error('error') // Error: error
}
var bound = original.bind(obj);
var newBoundResult = new bound(1);
console.log(newBoundResult) // [{some:'some'}]
```

所以第6点应该是：

6. 当使用new操作符调用bound函数时：

当原函数返回的不是Object/Function/Array/Date/RegExp/Error的实例时，将得到原函数的实例，并且继承原函数原型对象上的方法，

当原函数返回Object/Function/Array/Date/RegExp/Error的实例时，我们调用`nwe bound()`得到的是原函数的返回结果。

``` js
var another_bound = original.bind()
another_bound(1,2,3) // 执行 original 输出 1 2 3 Window

var null_bound = original.bind(null)
null_bound(1,2,3) // 执行 original 输出 1 2 3 Window

var undefined_bound = original.bind(undefined)
undefined_bound(1,2,3) // 执行 original 输出 1 2 3 Window
```

当bind没有入参或者第一个入参为null或undefined时，原函数的this指向Window对象。

### 实现

简单实现bind

``` js
Function.prototype.myBind = function bind(thisArg){
    // 判断原函数
    if(typeof this !== 'function'){
        throw new TypeError(this + ' must be a function');
    }
    // 保持原函数
    var original_func = this;
    // 获取bind方法入参中除新的this指向以外的其他参数
    var bind_params = Array.prototype.slice.call(arguments, 1);
    // 反参bound函数
    var bound = function(){
        // 获取bound的入参并拼接 bind_params 
        var bound_params = Array.prototype.slice.call(arguments);
        var params = bind_params.concat(bound_params);
        // 利用apply方法修改this指向，传入拼接后的参数，执行原函数并返回执行结果。
        return original_func.apply(thisArg, params);
    };
    return bound;
}
```

我们回顾以下new操作符的实现：

``` js
function newOperator(ctor){
    // 校验构造函数
    if(typeof ctor !== 'function'){
      throw ctor + 'is not a constructor';
    }
    // 设置 new.target
    newOperator.target = ctor;
    // 创建实例对象
    var rtn_obj = Object.create(ctor.prototype);
    // 获取其他参数
    var params = Array.prototype.slice.call(arguments, 1);
    // 传入参数、绑定this、获取构造函数返回的结果
    var instance = ctor.apply(rtn_obj, params);
    
    // 判断构造函数返回的类型
    var isObject = typeof instance === 'object' && instance !== null;
    var isFunction = typeof instance === 'function';
    if(isObject || isFunction){
        return instance;
    }
    
    return rtn_obj;
}
```

当执行`new bound()`时，bound函数将是这样调用的：`ctor.apply(rtn_obj, params)`

也就是说，此时bound内部的this已经指向了new操作符返回的实例。

因此，在bound内部需要另作判断。

``` js
Function.prototype.myBind = function bind(thisArg){
    // ...
    var bound = function(){
        // 获取bound的入参并拼接 bind_params 
        var bound_params = Array.prototype.slice.call(arguments);
        var params = bind_params.concat(bound_params);
        // 使用new操作符时，此时bound内部的this已经指向了new操作符返回的实例
        if(this instanceof bound){

            // 将原函数的原型对象复制一份，指给bound的原型对象，但此时实例已经生成了，需要重新设置一遍原型对象，这样bound的实例就能调用原函数的原型对象的方法
            bound.prototype = Object.create(original_func.prototype);
            this.__proto__ = bound.prototype;

            // 以bound实例为this，传入拼接后的参数，执行原函数，并将原函数的返回结果保存在result变量
            var result = original_func.apply(this, params);

            // 判断原函数的返回结果类型
            // 当原函数返回Object/Function/Array/Date/RegExp/Error的实例时，将这个结果返回给new的instance变量
            var isObject = typeof result === 'object' && result !== null;
            var isFunction = typeof result === 'function';
            if(isObject || isFunction){
                return result;
            }
            // 类型不符合时直接返回bound的实例
            return this;
        }
        // 未使用new操作符时
        else{
            // 利用apply方法修改this指向，传入拼接后的参数，执行原函数并返回执行结果。
            return original_func.apply(thisArg, params);
        }
    };
    return bound;
}
```

增加函数名和形参个数设置

``` js
Function.prototype.myBind = function bind(thisArg){
    // ...

    // 设置bound函数名
    Object.defineProperties(bound, {
        'length': {
            value: original_func.length,
        },
        'name': {
            value: 'bound ' + original_func.name,
        }
    });
    return bound;
}
```

最终实现：

``` js
Function.prototype.myBind = function bind(thisArg){
    // 判断原函数
    if(typeof this !== 'function'){
        throw new TypeError(this + ' must be a function');
    }
    // 保持原函数
    var original_func = this;
    // 获取bind方法入参中除新的this指向以外的其他参数
    var bind_params = Array.prototype.slice.call(arguments, 1);
    // 反参bound函数
    var bound = function(){
        // 获取bound的入参并拼接 bind_params 
        var bound_params = Array.prototype.slice.call(arguments);
        var params = bind_params.concat(bound_params);
        // 使用new操作符时，此时bound内部的this已经指向了new操作符返回的实例
        if(this instanceof bound){
            // 将原函数的原型对象复制一份，指给bound的原型对象，但此时实例已经生成了，需要重新设置一遍原型对象，这样bound的实例就能调用原函数的原型对象的方法
            bound.prototype = Object.create(original_func.prototype);
            this.__proto__ = bound.prototype;

            // 以bound实例为this，传入拼接后的参数，执行原函数，并将原函数的返回结果保存在result变量
            var result = original_func.apply(this, params);
            // 判断原函数的返回结果类型
            // 当原函数返回Object/Function/Array/Date/RegExp/Error的实例时，将这个结果返回给new的instance变量
            var isObject = typeof result === 'object' && result !== null;
            var isFunction = typeof result === 'function';
            if(isObject || isFunction){
                return result;
            }
            // 类型不符合时直接返回bound的实例
            return this;
        }
        // 未使用new操作符时
        else{
            // 利用apply方法修改this指向，传入拼接后的参数，执行原函数并返回执行结果。
            return original_func.apply(thisArg, params);
        }
    };
    Object.defineProperties(bound, {
        'length': {
            value: original_func.length,
        },
        'name': {
            value: 'bound ' + original_func.name,
        }
    });
    return bound;
}
```

测试：

``` js
console.log(typeof Function.prototype.myBind()); // function
console.log(Function.prototype.myBind().name); // "bound "
console.log(Function.prototype.myBind.length); // 1
console.log(Function.prototype.myBind().length); // 0
var obj = {
    name: 'Jiuto'
}
function original(a,b,c){
    console.log(a)
    console.log(b)
    console.log(c)
    console.log(this)
    this.a=a
    return 'some'
}
original.prototype.getA=function(){
    return this.a
}

var bound = original.myBind(obj,1,2);
var boundResult = bound(3); // 执行 original 输出 1 2 3 { name: 'Jiuto' }
console.log(boundResult); // some

console.log(original.name); // original
console.log(bound.name); // 'bound original'

console.log(original.myBind.length); // 1 
console.log(original.myBind().length); // 3 返回original函数的形参个数

var newBoundResult = new bound(2); // 执行 original 输出 1 2 2 originnal的实例
console.log(newBoundResult) // originnal的实例
console.log(Object.prototype.toString.call(newBoundResult)) // [object Object]
console.log(newBoundResult.getA()) // 1 

var another_bound = original.myBind()
another_bound(1,2,3) // 执行 original 输出 1 2 3 Window

var null_bound = original.myBind(null)
null_bound(1,2,3) // 执行 original 输出 1 2 3 Window

var undefined_bound = original.myBind(undefined)
undefined_bound(1,2,3) // 执行 original 输出 1 2 3 Window
```

### 参考

[面试官问：能否模拟实现JS的bind方法](https://juejin.cn/post/6844903718089916429)
