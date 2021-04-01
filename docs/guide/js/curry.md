## 柯里化

### 什么是柯里化

柯里化指这样的一种函数，它接受一个函数A为参数，返回一个新的函数，新函数能够接受函数A的剩余参数。

### 举例实现柯里化

``` js
var add = (a,b,c) => a+b+c
var _add = curry(add)
```

假设我们有一个函数curry，有一个函数add，通过curry返回新函数_add。

柯里化使得我们可以这样传参：

``` js
_add(1)(2)(3)
_add(1)(2,3)
_add(1,2)(3)
```

来实现一下这个curry函数：

``` js
function createCurry(fn) {
    var fn_len = fn.length; // 获取原函数参数个数
    var args = Array.prototype.slice.call(arguments, 1); // 已传入参数，通过闭包保存

    return function() {
        var _args = Array.prototype.slice.call(arguments);
        _args = args.concat(_args)

        // 参数个数不够则递归
        if (_args.length < fn_len) {
            return createCurry(fn, ..._args);
        }

        // 参数达标
        return fn(..._args);
    }
}
```

通过[Function.length](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/length)获取原函数的形参个数，
通过闭包保存剩余参数，返回一个新的函数，拼接闭包中的参数和新函数的参数，对比原函数的形参个数，参数不足递归继续生成另一个新函数来收集参数，参数达标则调用原函数并传入所有参数。

稍微优化一下可以这样写，增加了一个原函数无入参的判断：

``` js
function curry(fn) {
    if(fn.length<=1) return fn; // 原函数无入参，直接返回原函数
    var args = Array.prototype.slice.call(arguments, 1);
    return function() {
        var _args = args.concat(Array.prototype.slice.call(arguments));
        return _args.length < fn.length ? createCurry(fn, ..._args) : fn(..._args);
    }
}

var add = (a,b,c) => a+b+c
var _add = curry(add)
var result1 = _add(1)(2,3)
console.log(result1) // 6
var result2 = _add(2)(3)(4)
console.log(result2) // 9
```

### 应用场景

通过上面的例子我们已经能够简单的实现柯里化，但还是不知道为什么要这样做，为什么要把参数分开传递，来看一下下面两个应用场景。

#### 场景一：正则校验

当我们需要用正则来校验手机号时，可能会这样写：

``` js
function checkPhone(phone) {
    return /^1[34578]\d{9}$/.test(phone);
}
```

如果我们还需要一个邮箱验证，那就又要写一个函数

``` js
function checkEmail(email) {
    return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email);
}
```

如果还需要验证身份证、验证车牌号、验证...那就要写很多很多个这样的函数，而他们唯一的区别就是正则表达式的不同。

我们确实可以写一个这样的函数：

``` js
function checkFun(reg,val) {
    return reg.test(val)
}
checkFun(/^1[34578]\d{9}$/,'13111111111')
checkFun(/^1[34578]\d{9}$/,'13122221111')
checkFun(/^1[34578]\d{9}$/,'13133331111')
```

但是我们每验证一个新的手机号，就要传一次这样的正则。

如果我们使用柯里化的思想，就可以这样写：

``` js
function getCheckFun(reg) {
    return function(val){
        return reg.test(val)
    }
}

var phoneCheck = getCheckFun(/^1[34578]\d{9}$/);
console.log(phoneCheck('13111111111'))
console.log(phoneCheck('13122221111'))

var emailCheck = getCheckFun(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
emailCheck('aa@fe.123.cn')
emailCheck('bb@fe.123.cn')
```

#### 场景二：类型判断

``` js
var isType = type => target => `[object ${type}]` === Object.prototype.toString.call(target)
```

来理解一下这个isType函数，接受一个type入参，返回一个新函数，这个新函数接受一个target入参，返回类型判断结果。

使用起来式这样的：

``` js
var isArray = isType('Array');
var isObject = isType('Object');
var isString = isType('String');

console.log(isArray([])) // true
console.log(isArray(1)) // false
console.log(isObject({})) // true
console.log(isObject(2)) // false
console.log(isString('')) // true
console.log(isString(3)) // false
```
