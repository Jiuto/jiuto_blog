## 手写 apply 和 call

> 关于apply和call的实现可以看大佬的这篇文章[面试官问：能否模拟实现JS的call和apply方法](https://juejin.cn/post/6844903728147857415#heading-7)，
> 非常详细，本篇只是以自己的理解再写一遍，加强印象，做一个自己的总结。

### apply 和 call

[Function.prototype.apply()-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)

> apply() 方法调用一个具有给定this值的函数，以及以一个数组（或类数组对象）的形式提供的参数。
>
> func.apply(thisArg, [argsArray])
>
> thisArg
>
> 必选的。在 func 函数运行时使用的 this 值。请注意，this可能不是该方法看到的实际值：如果这个函数处于非严格模式下，则指定为 null 或 undefined 时会自动替换为指向全局对象，原始值会被包装。
>
> argsArray
>
> 可选的。一个数组或者类数组对象，其中的数组元素将作为单独的参数传给 func 函数。如果该参数的值为 null 或  undefined，则表示不需要传入任何参数。

---

[Function.prototype.call()-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)

> call() 方法使用一个指定的 this 值和单独给出的一个或多个参数来调用一个函数。
>
> function.call(thisArg, arg1, arg2, ...)
>
> thisArg
>
> 可选的。在 function 函数运行时使用的 this 值。请注意，this可能不是该方法看到的实际值：如果这个函数处于非严格模式下，则指定为 null 或 undefined 时会自动替换为指向全局对象，原始值会被包装。
>
> arg1, arg2, ...
>
> 指定的参数列表。

---

MDN上说apply的thisArg是必选的，call的thisArg是可选的，于是我在严格模式和非严格模式下跑了下面这个例子：

``` js
var name = "window"
var obj = {
    name: "Jiuto"
}
function sayName(a,b){
    console.log(this)
    console.log([a,b])
}
sayName.call()
sayName.apply()
sayName.call(obj,1,2)
sayName.call('this is call',1,2)
sayName.apply(obj,[1,2])
sayName.apply('this is apply',[1,2])
```

非严格模式下：

``` js
sayName.call() // Window [undefined, undefined]
sayName.apply() // Window [undefined, undefined]
sayName.call(obj,1,2) // {name: "Jiuto"} [1,2]
sayName.call('this is call',1,2) // String {"this is call"} [1,2]
sayName.apply(obj,[1,2]) // {name: "Jiuto"} [1,2]
sayName.apply('this is apply',[1,2]) // String {"this is apply"} [1,2]
```

严格模式下:

``` js
sayName.call() // undefined
sayName.apply() // undefined
sayName.call(obj,1,2) // {name: "Jiuto"} [1,2]
sayName.call('this is call',1,2) // "this is call" [1,2]
sayName.apply(obj,[1,2]) // {name: "Jiuto"} [1,2]
sayName.apply('this is apply',[1,2]) // "this is apply" [1,2]
```

---

> 该方法的语法和作用与 apply() 方法类似，只有一个区别，就是 call() 方法接受的是一个参数列表，而 apply() 方法接受的是一个包含多个参数的数组。

所以只要实现两个方法中的一个，就可以实现另一个。

---

看一下规范

[ECMAScript5.1中文版](http://yanhaijing.com/es5/#322)

> Function.prototype.apply (thisArg, argArray)
>
>  当以 thisArg 和 argArray 为参数在一个 func 对象上调用 apply 方法，采用如下步骤：
>
> 1. 如果 IsCallable(func) 是 false, 则抛出一个 TypeError 异常 .
> 2. 如果 argArray 是 null 或 undefined, 则
>  a. 返回提供 thisArg 作为 this 值并以空参数列表调用 func 的 [[Call]] 内部方法的结果。
> 3. 如果 Type(argArray) 不是 Object, 则抛出一个 TypeError 异常 .
> 4. 令 len 为以 "length" 作为参数调用 argArray 的 [[Get]] 内部方法的结果。
> 5. 令 n 为 ToUint32(len).
> 6. 令 argList 为一个空列表 .
> 7. 令 index 为 0.
> 8. 只要 index < n 就重复
>  a. 令 indexName 为 ToString(index).
>  b. 令 nextArg 为以 indexName 作为参数调用 argArray 的 [[Get]] 内部方法的结果。
>  c. 将 nextArg 作为最后一个元素插入到 argList 里。
>  d. 设定 index 为 index + 1.
> 9. 提供 thisArg 作为 this 值并以 argList 作为参数列表，调用 func 的 [[Call]] 内部方法，返回结果。
>
> apply 方法的 length 属性是 2。
>
> 在外面传入的 thisArg 值会修改并成为 this 值。thisArg 是 undefined 或 null 时它会被替换成全局对象，所有其他值会被应用 ToObject 并将结果作为 this 值，这是第三版引入的更改。

> Function.prototype.call (thisArg [ , arg1 [ , arg2, … ] ] )
>
>  当以 thisArg 和可选的 arg1, arg2 等等作为参数在一个 func 对象上调用 call 方法，采用如下步骤：
>
> 1. 如果 IsCallable(func) 是 false, 则抛出一个 TypeError 异常。
> 2. 令 argList 为一个空列表。
> 3. 如果调用这个方法的参数多余一个，则从 arg1 开始以从左到右的顺序将每个参数插入为 argList 的最后一个元素。
> 4. 提供 thisArg 作为 this 值并以 argList 作为参数列表，调用 func 的 [[Call]] 内部方法，返回结果。
>
> call 方法的 length 属性是 1。
>
> 在外面传入的 thisArg 值会修改并成为 this 值。thisArg 是 undefined 或 null 时它会被替换成全局对象，所有其他值会被应用 ToObject 并将结果作为 this 值，这是第三版引入的更改。

apply的4-8，call的2我们不实现。

---

实现思路：

我们选择先实现apply，再利用apply实现call。

给传入的thisArg增加调用函数方法func，执行该方法，执行完毕后删除。

另外需要注意，为了避免覆盖thisArg上可能存在的同名方法，可以对原同名方法做一个存储，删除func后恢复。

##### 注意

+ 在ES3、ES5（在局部作用域中）中 undefined 是能修改的：

> 所以判断一个变量a是不是undefined，更严谨的方案是 typeof a === 'undefined'或者a === void 0; 这里面用的是void，void的作用是计算表达式，始终返回undefined，也可以这样写void(0)。

### 实现

#### apply

``` js
function generateUUID(){
    var i, random;
    var uuid = '';
    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
            uuid += '-';
        }
        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
            .toString(16);
    }
    return uuid;
}
function getGlobalObject(){
    // console.log(this) // 非严格模式this指向Window，严格模式为undefined
    return this;
}
// 生成new Function的code
function generateFunctionCode(argsArrayLength){
    var code = 'return arguments[0][arguments[1]](';
    for(var i = 0; i < argsArrayLength; i++){
        if(i > 0){
            code += ',';
        }
        code += 'arguments[2][' + i + ']';
    }
    code += ')';
    // return arguments[0][arguments[1]](arg1, arg2, arg3...)
    return code;
}
Function.prototype.applyFn = function apply(thisArg, argsArray){
    // 1. 如果 IsCallable(func) 是 false, 则抛出一个 TypeError 异常 .
    // 判断调用apply的对象是不是函数
    if(typeof this !== 'function'){
        throw new TypeError(this + ' is not a function');
    }

    //  2. 如果 argArray 是 null 或 undefined, 则 返回提供 thisArg 作为 this 值并以空参数列表调用 func 的 [[Call]] 内部方法的结果。
    // argsArray为null或者undefined时，初始化argsArray为空数组
    if(typeof argsArray === 'undefined' || argsArray === null){
        argsArray = [];
    }
    
    // 3. 如果 Type(argArray) 不是 Object, 则抛出一个 TypeError 异常 .
    if(argsArray !== new Object(argsArray)){
        throw new TypeError('CreateListFromArrayLike called on non-object');
    }

    // 在外面传入的 thisArg 值会修改并成为 this 值。
    // thisArg 是 undefined 或 null 时它会被替换成全局对象。
    if(typeof thisArg === 'undefined' || thisArg === null){
        thisArg = getGlobalObject();
    }
    // 所有其他值会被应用 ToObject 并将结果作为 this 值。
    thisArg = new Object(thisArg);

    // 尽可能的唯一函数名
    var func = generateUUID();

    // 储存原同名方法
    var originalVal = thisArg[func];
    var hasOriginalVal = thisArg.hasOwnProperty(func);
    
    // 增加方法
    thisArg[func] = this;

    // 9. 提供 thisArg 作为 this 值并以 argList 作为参数列表，调用 func 的 [[Call]] 内部方法，返回结果。
    var code = generateFunctionCode(argsArray.length);
    var result = (new Function(code))(thisArg, func, argsArray);

    // 第九条的ES6版
    // var result = thisArg[func](...args);

    // 删除方法
    delete thisArg[func];

    // 恢复原方法
    if(hasOriginalVal){
        thisArg[func] = originalVal;
    }

    return result
};

```

#### call

``` js
Function.prototype.callFn = function call(thisArg){
    var argsArray = [];
    var len = arguments.length;
    for(var i = 0; i < len - 1; i++){
        // argsArray.push(arguments[i + 1]); // push方法内部也有一层循环，理论上不用push性能更好
        argsArray[i] = arguments[i + 1];
    }
    return this.applyFn(thisArg, argsArray);
}
```

#### 测试

``` js
var name = "window"
var obj = {
    name: "Jiuto"
}
function sayName(a,b){
    console.log(this)
    console.log([a,b])
}
sayName.callFn()
sayName.applyFn()
sayName.callFn(obj,1,2)
sayName.callFn('this is call',1,2)
sayName.applyFn(obj,[1,2])
sayName.applyFn('this is apply',[1,2])
```

非严格模式下：

``` js
sayName.callFn() // Window [undefined, undefined]
sayName.applyFn() // Window [undefined, undefined]
sayName.callFn(obj,1,2) // {name: "Jiuto", b2d272d0-0235-45c0-9994-abcd2ca7c2b0: ƒ} [1,2]
sayName.callFn('this is call',1,2) // String {"this is call", 184967ed-ac02-40f0-9671-9bd4fd45f1a4: ƒ} [1,2]
sayName.applyFn(obj,[1,2]) // {name: "Jiuto", c3954fbb-f0ad-459f-b0ae-5f2d64333ced: ƒ} [1,2]
sayName.applyFn('this is apply',[1,2]) // String {"this is apply", ecaa54b9-bcea-43ac-b148-f0425600d4db: ƒ} [1,2]
```

严格模式下:

``` js
sayName.callFn() // {406b9c82-9727-409b-bfc5-c2b062e17ce4: ƒ} [undefined, undefined]
sayName.applyFn() // {85d9975d-5096-46e8-bc67-6ebaf9aab914: ƒ} [undefined, undefined]
sayName.callFn(obj,1,2) // {name: "Jiuto", c571e336-1e52-4295-8667-aeaaaaf3b8fa: ƒ} [1,2]
sayName.callFn('this is call',1,2) // String {"this is call", e11114e6-102a-4627-ad03-86b215c44465: ƒ} [1,2]
sayName.applyFn(obj,[1,2]) // name: "Jiuto", 4a55ef4c-9c0e-4ea6-a4b2-9d19859aba23: ƒ} [1,2]
sayName.applyFn('this is apply',[1,2]) // String {"this is apply", 81313be6-5368-4696-830d-ad5df4f1b706: ƒ} [1,2]
```

验证成功。

唯一的问题是由于我们调用`(new Function(code))(thisArg, func, argsArray)`的时候，传入的`thisArg`是被我们加过料（增加了func）的对象，
所以在`sayName`中打印this会多一个func方法，也就是我们以uuid命名的方法。

我也试过将这个方法放在原型上，但同样的道理，虽然this打印出来时我们想要的结果，但是`this.__proto__`上会多出一个方法。

只要实现是通过更改`thisArg`就无法避免这个问题。

### 参考

[面试官问：能否模拟实现JS的call和apply方法](https://juejin.cn/post/6844903728147857415#heading-7)
