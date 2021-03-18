## 理解js原型、原型链和继承

### 原型

什么是原型对象？

+ 我们创建的每一个函数都有一个prototype（原型）属性，这个属性是一个指针，指向一个对象，即原型对象。

``` js
function Person(){}
Person.prototype.name="Jiuto";
Person.prototype.age=25;
Person.prototype.sayName=function(){
    console.log(this.name)
};
console.log(Person.prototype)
```

<img :src="$withBase('/imgs/js/proto/prototype.png')" alt="Person.prototype">

+ prototype就是通过调用构造函数而创建的那个对象实例的原型对象，这个实例内部含有的指向原型对象的指针叫`[[Prototype]]`。

+ 默认情况下，所有原型对象都会自动获得一个`constructor（构造函数）`属性，这个属性是一个指向prototype属性所在函数的指针。

``` js
console.log(Person.prototype.constructor) // Person
console.log(p1.constructor === Person) // true
```

+ 所有函数的默认原型都是Object的实例，因此默认原型都会包含一个内部指针，指向`Object.prototype`。
这也是所有自定义类型都会继承toString()、valueOf()等默认方法的根本原因。

``` js
console.log(typeof Person.prototype)
console.log(p1 instanceof Object)
console.log(p1.toString())
console.log(p1.valueOf())
```

<img :src="$withBase('/imgs/js/proto/Object.png')" alt="Object">

为什么要用原型对象？

> 使用原型对象的好处是可以让所有对象实例共享它所包含的属性和方法。 

``` js
var p1 = new Person();
var p2 = new Person();
console.log(p1.sayName === p2.sayName) // true
```

如何访问原型对象？

+ Firefox、Safari、Chrome在每个对象上都支持一个属性`__proto__`可以访问原型对象。ECMAScript 2015 将`__proto__`属性纳入了规范的一部分。

``` js
console.log(p1)
console.log(p1.__proto__ === Person.prototype) // true
```

<img :src="$withBase('/imgs/js/proto/p1.png')" alt="p1">

+ ES5 增加了一个方法`Object.getPrototypeOf()`，返回`[[Prototype]]`的值。

``` js
console.log(Object.getPrototypeOf(p1) === Person.prototype) // true
```

其他关于原型对象的方法：

+ instanceof操作符

``` js
console.log(p1 instanceof Person) // true
```

+ 可以通过`isPrototypeOf()`方法来确定对象之间是否存在原型关系。

``` js
console.log(Person.prototype.isPrototypeOf(p2)) // true
```

+ `hasOwnProperty()`方法可以检测一个属性是存在实例中还是原型中，只有存在实例中才返回true。

+ in操作符有两种使用方式：单独使用或在`for in`循环中使用。无论原型还是实例上存在的属性，in都会返回true，结合`hasOwnProperty()`可以判断对象属性是否在原型对象上。

``` js
p1.job = "engineer";
console.log(p1.hasOwnProperty("name")) // false
console.log("name" in p1) // true
console.log("name" in p1 && !p1.hasOwnProperty("name")) // true
console.log("job" in p1 && !p1.hasOwnProperty("job")) // false
```

### 原型链

> 简单回顾一下构造函数、原型和实例的关系：
>
> 每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，而实例都包含一个指向原型对象的内部指针。

``` js
console.log(Person.prototype.constructor === p2.constructor) // true
```

什么是原型链？

> 假如我们让原型对象等于另一个类型的实例，此时的原型对象将包含一个指向另一个原型的指针，相应地，另一个原型中也包含着一个指向另一个构造函数的指针。
> 假如另一个原型又是另一个类型的实例，那么上述关系依然成立，如此层层递进，就构成了实例与原型的链条。这就是所谓的原型链的基本概念。


+ 上面我们已经知道`p1.__proto__ === Person.prototype`，那么`Person.__proto__`什么？

`Person.__proto__`指向了Person的构造函数的原型，也就是`Function.prototype`

``` js
console.log(Person.__proto__ === Function.prototype) // true
```

+ `Person.prototype.__proto__`是什么？

`Person.prototype`是Person的原型对象，本质上就是一个对象，所以这个对象的`__proto__`指向了它的构造函数（也就是Object）的原型，也就是`Object.prototype`

``` js
console.log(Person.prototype.__proto__ === Object.prototype) // true
```

+ `Object.__proto__`是什么？

Object其实与Person没有什么不同，都是构造函数，所以Object的构造函数就是Function

``` js
console.log(Object.__proto__ === Function.prototype) // true
```

+ 一些特殊情况（记忆）

1. `Function.__ptoto__`是什么？

``` js
console.log(Function.__proto__ === Function.prototype) // true
```

2. `Function.prototype`是什么类型？

``` js
console.log(typeof Function.prototype) // function
```

> `Function.prototype`是唯一一个`typeof XXX.prototype`为`function`的prototype，其它的构造器的prototype都是一个对象。

3. 那么`Function.prototype.__proto__`是什么？

``` js
console.log(Function.prototype.__proto__ === Object.prototype) // true
```

4. `Object.prototype__proto__`是什么？

``` js
console.log(Object.prototype.__proto__) // null
```

这已经是原型链的顶端了，指向null

### 继承

> 实现继承的本质是重写原型对象，代之以一个新类型的实例。

``` js
function SuperType_1(){
	this.superproterty=true;
}
SuperType_1.prototype.getSuperValue=function(){
	return this.superproterty;
}

function SubType_1(){
	this.subproperty=false;
}
SubType_1.prototype=new SuperType_1(); // 重写原型对象，继承SuperType_1
SubType_1.prototype.getSubValue=function(){
	return this.subproperty;
}

var instance=new SubType_1();
console.log(instance.getSuperValue());//true
 
console.log(instance instanceof Object);//true
console.log(instance instanceof SuperType_1);//true
console.log(instance instanceof SubType_1);//true

console.log(Object.prototype.isPrototypeOf(instance));//true
console.log(SubType_1.prototype.isPrototypeOf(instance));//true
console.log(SuperType_1.prototype.isPrototypeOf(instance));//true
```

+ 借用构造函数/伪造对象/经典继承

在子类构造函数内部调用超类构造函数，使用apply()、call()。

即使超类中有引用类型的属性，也会在子类创建一个副本。

``` js
function SuperType_2(){
	this.colors=['red','blue','green'];
}
function SubType_2(){
	SuperType_2.call(this); // 继承了SuperType_2
}

var instance1=new SubType_2();
instance1.colors.push('black');
console.log(instance1.colors);//[ 'red', 'blue', 'green', 'black' ]

var instance2=new SubType_2();
console.log(instance2.colors);//[ 'red', 'blue', 'green' ]
 
console.log(instance1 instanceof Object);//true
console.log(instance1 instanceof SuperType_2);//false
console.log(instance1 instanceof SubType_2);//true
console.log(Object.prototype.isPrototypeOf(instance1));//true
console.log(SuperType_2.prototype.isPrototypeOf(instance1));//false
console.log(SubType_2.prototype.isPrototypeOf(instance1));//true
```

>  借用构造函数的问题：
>
> 方法都在构造函数中定义，因此函数复用就无从谈起了。
> 在超类型的原型中定义的方法，对于子类型而言也是不可见的。

+ 组合继承/伪经典继承

使用原型链实现对原型属性和方法的继承，通过构造函数实现对实例属性的继承。

``` js
function SuperType_3(name){
	this.name=name;
	this.colors=['red','blue','green'];
}
SuperType_3.prototype.sayName=function(){
	console.log(this.name);
};

function SubType_3(name,age){
	//继承属性
	SuperType_3.call(this,name); // 二次调用SuperType_3()
	this.age=age;
}
//继承方法
SubType_3.prototype=new SuperType_3(); // 一次调用SuperType_3()，导致SubType_3.prototype.constructor指向SuperType_3
SubType_3.prototype.constructor=SubType_3; // 修正原型对象的构造函数指向
SubType_3.prototype.sayAge=function(){
	console.log(this.age);
};
 
var instance3=new SubType_3('Nicholas',29);
instance3.colors.push('brown');
console.log(instance3.colors);//[ 'red', 'blue', 'green', 'brown' ]
instance3.sayAge();//29
instance3.sayName();//Nicholas
 
var instance4=new SubType_3('Greg',27);
console.log(instance4.colors);//[ 'red', 'blue', 'green' ]
instance4.sayName();//Greg
instance4.sayAge();//27
 
console.log(instance4 instanceof Object);//true
console.log(instance4 instanceof SuperType_3);//true
console.log(instance4 instanceof SubType_3);//true
console.log(Object.prototype.isPrototypeOf(instance4));//true
console.log(SubType_3.prototype.isPrototypeOf(instance4));//true
console.log(SuperType_3.prototype.isPrototypeOf(instance4));//true
```

缺点：两次调用SuperType_3()

+ 原型继承

ECMAScript5增加了Object.create()方法，接收两个参数(用于创建副本的基本对象，可选的为新对象定义额外属性的对象)。
支持的浏览器有IE 9+、Firefox 4+、Safari 5+、Opera 12+、Chrome。

``` js
var person={
	name:'Nicholas',
	friends:['a','b','c']
};
 
var aperson=Object.create(person);
aperson.name='Greg';
aperson.friends.push('d');
 
var anotherperson=Object.create(person,{name:{value:'ccc'}});
 
console.log(person.friends);//[ 'a', 'b', 'c', 'd' ]
console.log(anotherperson.name);//ccc
console.log(anotherperson.friends);//[ 'a', 'b', 'c', 'd' ]
```

> 在没有必要兴师动众地创建构造函数，而只想让一个对象与另一个对象保持类似的情况下，原型式继承是完全可以胜任的。
>
> 包含引用类型值的属性始终都会共享相应的值。

+ 寄生式继承

任何能够返回新对象的函数都适用。

``` js
function object(o){
	function F(){}
	F.prototype=o; // 原型指向o，所以对其原型的任何更改也会反映到o上
	return new F();
}
function createAnother(originaobj){
	var clone=object(originaobj);
	clone.sayHi=function(){
		console.log('hi');
	};
	return clone;
}

var person={
	name:'Nicholas',
	friends:['a','b','c']
};
var yetAnotherPerson=createAnother(person);
yetAnotherPerson.sayHi();//hi
```

> 在主要考虑对象而不是自定义类型和构造函数的情况下，寄生式继承也是一种有用的模式。

缺点：为对象添加函数会因为不能做到函数复用而降低效率

+ 寄生组合式继承

解决两次调用的问题。

引用类型最理想的继承范式。

``` js
function inheritPrototype(SubType,SuperType){
	var prototype=Object(SuperType.prototype); // 创建超类原型副本
	prototype.constructor=SubType;
	SubType.prototype=prototype; // 代替了前面的第一次调用SuperType()
}
function SuperType(name){
	this.name=name;
	this.colors=['red','blue','green'];
}
SuperType.prototype.sayName=function(){
	console.log(this.name);
};
function SubType(name,age){
	//继承属性
	SuperType.call(this,name); // 二次调用SuperType()
	this.age=age;
}
inheritPrototype(SubType,SuperType);
SubType.prototype.sayAge=function(){
	console.log(this.age);
}

var instance5=new SubType('Nicholas',29);
instance5.colors.push('brown');
console.log(instance5.colors);//[ 'red', 'blue', 'green', 'brown' ]
instance5.sayAge();//29
instance5.sayName();//Nicholas
 
var instance6=new SubType('Greg',27);
console.log(instance6.colors);//[ 'red', 'blue', 'green' ]
instance6.sayName();//Greg
instance6.sayAge();//27
 
console.log(instance6 instanceof Object);//true
console.log(instance6 instanceof SuperType);//true
console.log(instance6 instanceof SubType);//true
console.log(Object.prototype.isPrototypeOf(instance6));//true
console.log(SubType.prototype.isPrototypeOf(instance6));//true
console.log(SuperType.prototype.isPrototypeOf(instance6));//true
```

+ 用空函数或es6实现一个寄生组合式继承

``` js
//父构造函数
function Parent(name) {
	this.name = name || 'Adam';
}
//在原型上添加方法
Parent.prototype.say = function () {
	return this.name;
};
//子构造函数
function Child(name) {
	Parent.apply(this, arguments); // 继承属性
}

//函数代理 避免多次创建临时函数F
var inherit = (function () {
	var F = function () {};
	return function (C, P) {
		F.prototype = P.prototype;
		C.prototype = new F();
		C.uber = P.prototype;
		C.prototype.constructor = C;
	}
}());

inherit(Child, Parent);
var kid = new Child();
console.log(kid.constructor)
console.log(kid)

// es6写法
function inherit2(subType, superType) {
	subType.prototype = Object.create(superType.prototype, {
		constructor: {
			enumerable: false,
			configurable: true,
			writable: true,
			value: subType
		}
	})
	Object.setPrototypeOf(subType, superType)
}

inherit2(Child, Parent);
var c = new Child('aha');
console.log(c.say())
console.log(c)
```

<img :src="$withBase('/imgs/js/proto/inherit.png')" alt="inherit">

### 参考

《JavaScript高级程序设计》

[最详尽的 JS 原型与原型链终极详解，没有「可能是」](https://www.jianshu.com/p/dee9f8b14771)系列三篇

---

其他相关文章

[深入理解 JavaScript 原型](https://mp.weixin.qq.com/s/1UDILezroK5wrcK-Z5bHOg)

[Javascript面向对象编程 - 阮一峰](http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_inheritance.html)系列三篇
