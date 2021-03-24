## let、const和块级作用域

### let

> ES6 新增了let命令，用来声明变量。
>
> 所声明的变量，只在let命令所在的代码块内有效。

#### 不存在变量提升

``` js
console.log(a) // undefined
var a = 1;
console.log(b) // Uncaught ReferenceError: b is not defined
let b = 2;
```

`var`命令会发生“变量提升”的现象，即在声明变量之前，这个变量可以使用但是值为`undefined`。

而`let`声明的变量，在声明语句之前使用就会报`ReferenceError`。

（但也并不是说这个变量就不存在，请看下一节暂时性死区。）

#### 暂时性死区

我们来看一个例子

``` js
var a = 1;
if(true){
    console.log(a) // Uncaught ReferenceError: Cannot access 'a' before initialization
    let a = 2;
}
```

如果没有let声明语句，打印结果自然是1，但是有了let声明语句，在let所在的代码块中且在let语句之前使用a，就会报`ReferenceError`。

> ES6 明确规定，如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。
>
> 这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ）。

由于暂时性死区的存在，导致`typeof`命令不再安全：

``` js
console.log(typeof a) // "undefined"
```

通常情况下，我们使用`typeof`命令去判断一个未定义的变量，得到的结果是`"undefined"`。

``` js
console.log(typeof a) // Uncaught ReferenceError: a is not defined
let a = 1;
```

由于暂时性死区的存在，会直接报错。

> 暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取。

> ES6 规定暂时性死区和let、const语句不出现变量提升，主要是为了减少运行时错误，防止在变量声明前就使用这个变量，从而导致意料之外的行为。
> 这样的错误在 ES5 是很常见的，现在有了这种规定，避免此类错误就很容易了。

#### 不允许重复声明

`let`命令不能重复声明已经声明过的变量，无论这个变量是不是用`let`声明的。

``` js
var a = 1;
var a = 2;
console.log(a) // "undefined"
let b = 1;
let b = 2; // Uncaught SyntaxError: Identifier 'b' has already been declared
var c = 1;
let c = 2; // Uncaught SyntaxError: Identifier 'c' has already been declared
```

#### 不会绑定全局对象

let 声明的变量不会绑定要全局对象上，即便他是在全局作用域中声明的。

``` js
var a = 1;
console.log(window.a) // 1
let b = 2;
console.log(window.b) // "undefined"
```

### const

> `const`声明一个只读的常量。一旦声明，常量的值就不能改变。
>
> 这意味着，`const`一旦声明变量，就必须立即初始化，不能留到以后赋值。

``` js
const a // Uncaught SyntaxError: Missing initializer in const declaration
```

类似于`let`，`const`只在声明所在的块级作用域内有效，不存在变量提升，存在暂时性死区，不可重复声明，不会绑定全局对象。

### 块级作用域

#### 为什么需要块级作用域？

ES5 只有全局作用域和函数作用域，没有块级作用域，这就导致会出现下面这样的问题：

+ 由于变量提升，函数作用域内部的变量覆盖全局作用域的变量

``` js
var a = 1;
function fun(){
   console.log(a) // "undefined"
    if(false){
        var a = 2;
    }
}
fun()
```

+ 循环计数作用的临时变量泄露到全局

``` js
var arr = [];
for(var i = 0; i < 5; i++){
    arr[i]=i;
}
console.log(i) // 5
```

#### ES6 块级作用域

回忆一下：`let`声明的变量，只在let命令所在的代码块内有效。

也就是说，`let`的出现：

> 实际上为 JavaScript 新增了块级作用域。

上面的例子用let改写：

``` js
var a = 1;
function fun(){
   console.log(a) // 1
    if(false){
        let a = 2;
    }
}
fun()
```

`if(false)`语句生成了一个新的块级作用域，即便条件为`false`不执行，外面的块级作用域可以跟她声明相同的变量：

``` js
let a = 1;
function fun(){
   console.log(a) // 1
    if(false){
        let a = 2;
    }
}
fun()
```

另一个例子可以通过let防止变量泄露：

``` js
var arr = [];
for(let i = 0; i < 5; i++){
    arr[i]=i;
}
console.log(i) // Uncaught ReferenceError: i is not defined
```

#### 块级作用域与函数声明

> ES5 规定，函数只能在顶层作用域和函数作用域之中声明，不能在块级作用域声明。
>
> 但是，浏览器没有遵守这个规定，为了兼容以前的旧代码，还是支持在块级作用域之中声明函数。

> ES6 引入了块级作用域，明确允许在块级作用域之中声明函数。
> ES6 规定，块级作用域之中，函数声明语句的行为类似于let，在块级作用域之外不可引用。

``` js
function f() { console.log('I am outside!'); }

(function () {
  if (false) {
    // 重复声明一次函数f
    function f() { console.log('I am inside!'); }
  }

  f();
}());
```

在ES5中，由于函数提升，上述例子会输出'I am inside!'。

而在ES6中，会报错:

> 如果改变了块级作用域内声明的函数的处理规则，显然会对老代码产生很大影响。
> 为了减轻因此产生的不兼容问题，ES6 在附录 B里面规定，浏览器的实现可以不遵守上面的规定，有自己的行为方式。
>
> + 允许在块级作用域内声明函数。
> + 函数声明类似于var，即会提升到全局作用域或函数作用域的头部。
> + 同时，函数声明还会提升到所在的块级作用域的头部。
>
> 考虑到环境导致的行为差异太大，应该避免在块级作用域内声明函数。如果确实需要，也应该写成函数表达式，而不是函数声明语句。

---

ES6 的块级作用域必须有大括号：

``` js
if (true) let x = 1; // Uncaught SyntaxError: Lexical declaration cannot appear in a single-statement context
```

没有大括号不存在块级作用域，而let只能出现在当前作用域的顶层，故报错。

函数声明相同：

``` js
if (true) function f() {}
```

非严格模式下不会报错，严格模式下报错：”Uncaught SyntaxError: In strict mode code, functions can only be declared at top level or inside a block.“

### 参考

[ECMAScript 6入门](https://es6.ruanyifeng.com/#docs/let)
