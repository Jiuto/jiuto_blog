## 手写 new 操作符

前置知识：原型、原型链（可参考[理解js原型、原型链和继承](https://jiuto.github.io/jiuto_blog/guide/js/proto.html)）

### new 操作符

``` js
function MyConstructor () {
    this.data = "some data";
}
MyConstructor.prototype.getData = function(){
    console.log(this)
    return this.data
}

var instance1 = new MyConstructor()
console.log(instance1)
console.log(Object.prototype.toString.call(instance1))
console.log(instance1.getData())
console.log(instance1.__proto__ === MyConstructor.prototype)

var instance2 = new MyConstructor()
instance1.data = "another data"
console.log(instance1)
console.log(instance2)
instance1.getData()
instance2.getData()
console.log(instance2.__proto__ === instance1.__proto__)
```

<img :src="$withBase('/imgs/js/new/new.png')" alt="new">

从上面这个例子我们可以发现，当构造函数没有return时，我们使用new操作符：

1. 得到一个新的Object的实例
2. 实例的方法this指向这个实例本身
3. 每个实例的__proto__指向构造函数的原型对象

当构造函数有return时，我们测试一下return 不同类型的值，得到的实例和类型会是怎样的：

``` js
function test1(){
    this.data = "some data";
    return null
}
var t1 = new test1()
console.log(t1)
console.log(Object.prototype.toString.call(t1))
console.log(typeof null)

function test2(){
    this.data = "some data";
    return undefined
}
var t2 = new test2()
console.log(t2)
console.log(Object.prototype.toString.call(t2))
console.log(typeof undefined)

function test3(){
    this.data = "some data";
    return 0
    // return 1
}
var t3 = new test3()
console.log(t3)
console.log(Object.prototype.toString.call(t3))
console.log(typeof 0)

function test4(){
    this.data = "some data";
    return ''
    // return '1'
}
var t4 = new test4()
console.log(t4)
console.log(Object.prototype.toString.call(t4))
console.log(typeof '')

function test5(){
    this.data = "some data";
    return false
    // return true
}
var t5 = new test5()
console.log(t5)
console.log(Object.prototype.toString.call(t5))
console.log(typeof false)

function test6(){
    this.data = "some data";
    return Symbol('s')
}
var t6 = new test6()
console.log(t6)
console.log(Object.prototype.toString.call(t6))
console.log(typeof Symbol('s'))

function test7(){
    this.data = "some data";
    return {}
}
var t7 = new test7()
console.log(t7)
console.log(Object.prototype.toString.call(t7))
console.log(typeof {})

function test8(){
    this.data = "some data";
    return function(){}
}
var t8 = new test8()
console.log(t8)
console.log(Object.prototype.toString.call(t8))
console.log(typeof function(){})

function test9(){
    this.data = "some data";
    return []
}
var t9 = new test9()
console.log(t9)
console.log(Object.prototype.toString.call(t9))
console.log(typeof [])

function test10(){
    this.data = "some data";
    return new Date()
}
var t10 = new test10()
console.log(t10)
console.log(Object.prototype.toString.call(t10))
var date = new Date()
console.log(typeof date)

function test11(){
    this.data = "some data";
    return /\s/
}
var t11 = new test11()
console.log(t11)
console.log(Object.prototype.toString.call(t11))
let reg =  /\s/
console.log(typeof reg)

function test12(){
    this.data = "some data";
    return new Error('error')
}
var t12 = new test12()
console.log(t12)
console.log(Object.prototype.toString.call(t12))
var err = new Error('error')
console.log(typeof err)
```

<img :src="$withBase('/imgs/js/new/test1.png')" alt="test1">

<br>

<img :src="$withBase('/imgs/js/new/test2.png')" alt="test2">

4. 当return 一个Object/Function/Array/Date/RegExp/Error的实例，new操作符得到的就是return的结果

### 实现

[new.target](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new.target)

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

<img :src="$withBase('/imgs/js/new/test.png')" alt="test">

### 参考

[面试官问：能否模拟实现JS的new操作符](https://juejin.cn/post/6844903704663949325)
