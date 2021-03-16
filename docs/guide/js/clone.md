## 浅拷贝和深拷贝

### 浅拷贝

> 创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。
>
> 如果属性是基本类型，拷贝的就是基本类型的值，如果属性是引用类型，拷贝的就是内存地址，所以如果其中一个对象改变了这个地址，就会影响到另一个对象。

方法：

`Object.assign()`、展开语法`{...obj}`

> Object.assign()函数会触发setters，而展开语法不会。

`Array.prototype.slice()`、`Array.prototype.concat()`

### 深拷贝

> 深拷贝会拷贝所有的属性，并拷贝属性指向的动态分配的内存。
>
> 当对象和它所引用的对象一起拷贝时即发生深拷贝。
>
> 深拷贝相比于浅拷贝速度较慢并且花销较大。拷贝前后两个对象互不影响。

方法：

`JSON.parse(JSON.stringify(object))`

> 这个方法能正确处理的对象只有 Number, String, Boolean, Array这类扁平对象，即那些能够被json直接表示的数据结构。

缺点：

会忽略undefined、symbol、函数

<img :src="$withBase('/imgs/js/clone/problem1.png')" alt="会忽略undefined、symbol、函数">

循环引用对象报错

<img :src="$withBase('/imgs/js/clone/problem2.png')" alt="循环引用对象报错">

不能正确处理new Date()

<img :src="$withBase('/imgs/js/clone/problem3.png')" alt="不能正确处理new Date()">

不能处理正则

<img :src="$withBase('/imgs/js/clone/problem4.png')" alt="不能处理正则">

### 实现

#### 前置知识

1. 查看对象属性是否可枚举，可使用 `Object.getOwnPropertyDescriptor` 或者 `Object.propertyIsEnumerable`

> [Object.prototype.propertyIsEnumerable()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/propertyIsEnumerable)
>
> `propertyIsEnumerable()`方法返回一个布尔值，表示指定的属性是否可枚举。
>
> 此方法可以确定对象中指定的属性是否可以被 for...in 循环枚举，但是通过原型链继承的属性除外。如果对象没有指定的属性，则此方法返回 false。

2. 判断参数是否为undefined或者null可直接通过`arg == null`判断，因为`undefined == null`为true

3. Object.defineProperty()

> [Object.defineProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
>
> Object.defineProperty(obj, prop, descriptor) 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。
>
> descriptor：要定义或修改的属性描述符

``` js
var obj = {};
Object.defineProperty(obj, "key", {
  enumerable: false, //为true该属性的描述符才能够被改变，同时该属性也能从对应的对象上被删除。默认为false。
  configurable: false, //为true属性才会出现在对象的枚举属性中即被for...in 或 Object.keys 方法枚举到。默认为false。
  writable: false, //为true时，属性的值value才能被赋值运算符改变。默认为false。
  value: "static", //该属性对应的值。可以是任何有效的JavaScript值（数值，对象，函数等）。默认为undefined。
  // get、set
});
```

4. in操作符会检查属性是否在对象及其 [[Prototype]] 原型链中

5. hasOwnProperty() 只会检查属性是否在对象中，不会检查 [[Prototype]] 原型链

> 通过`Object.create(null)`创建的对象没法直接使用hasOwnProperty，可通过`Object.prototype.hasOwnProperty.call()`

6. `typeof null`结果为'object'

<img :src="$withBase('/imgs/js/clone/typeof.png')" alt="typeof">

实现一个判断对象或数组的方法

``` js
function isObject(obj) {
    return typeof obj === 'object' && obj != null;
}
```

7. [WeakMap-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)

8. [Object.getOwnPropertySymbols()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols)方法返回一个给定对象自身的所有 Symbol 属性的数组

9. [Reflect.ownKeys()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/ownKeys)

> 静态方法 Reflect.ownKeys() 返回一个由目标对象自身的属性键组成的数组。
>
> 它的返回值等同于Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target))。

#### step1 实现一个浅拷贝

``` js
function cloneShallow(source) {
    var target = {};
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
    return target;
}
```
##### 测试

<img :src="$withBase('/imgs/js/clone/test1.png')" alt="浅拷贝">

<img :src="$withBase('/imgs/js/clone/test2.png')" alt="浅拷贝">

#### step2 实现一个深拷贝：在浅拷贝基础上增加对象和数组的判断

``` js
function isObject(obj) {
    return typeof obj === 'object' && obj != null;
}
function cloneDeep(source) {

    if (!isObject(source)) return source;

    var target = Array.isArray(source) ? [...source] : {...source};
    for(var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (isObject(source[key])) {
                target[key] = cloneDeep(source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }
    return target;
}
```
##### 测试

<img :src="$withBase('/imgs/js/clone/test3.png')" alt="深拷贝">

<img :src="$withBase('/imgs/js/clone/test4.png')" alt="深拷贝">

#### step3 解决循环引用问题

解决方案：存储所有的引用对象，再次遇到时直接取出

使用WeakMap解决循环引用：

``` js
function cloneDeep(source, hash = new WeakMap()) {

    if (!isObject(source)) return source;

    if (hash.has(source)) return hash.get(source);

    var target = Array.isArray(source) ? [...source] : {...source};
    hash.set(source, target);
    for(var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (isObject(source[key])) {
                target[key] = cloneDeep(source[key], hash);
            } else {
                target[key] = source[key];
            }
        }
    }
    return target;
}
```

##### 测试

<img :src="$withBase('/imgs/js/clone/test5.png')" alt="深拷贝-循环引用-WeakMap">

使用数组解决循环引用：

``` js
function cloneDeep(source, list = []) {

    if (!isObject(source)) return source;

    var target = Array.isArray(source) ? [...source] : {...source};

    var data = find(list, source);
    if (data) return data.target;
    list.push({
        source: source,
        target: target
    });

    for(var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (isObject(source[key])) {
                target[key] = cloneDeep(source[key], list);
            } else {
                target[key] = source[key];
            }
        }
    }
    return target;
}
function find(list, source) {
    for(var i = 0; i < list.length; i++) {
        if (list[i].source === source) {
            return list[i];
        }
    }
    return null;
}
```

##### 测试

<img :src="$withBase('/imgs/js/clone/test6.png')" alt="深拷贝-数组">

非ES6情况下需要手动检测Symbol类型：

``` js
function cloneDeep(source, list = []) {

    if (!isObject(source)) return source;

    var target = Array.isArray(source) ? [...source] : {...source};

    var data = find(list, source);
    if (data) return data.target;
    list.push({
        source: source,
        target: target
    });

    let symKeys = Object.getOwnPropertySymbols(source);
    if (symKeys.length) { 
        symKeys.forEach(symKey => {
            if (isObject(source[symKey])) {
                target[symKey] = cloneDeep(source[symKey], list); 
            } else {
                target[symKey] = source[symKey];
            }    
        });
    }

    for(var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (isObject(source[key])) {
                target[key] = cloneDeep(source[key], list);
            } else {
                target[key] = source[key];
            }
        }
    }
    return target;
}
```

或

``` js
function cloneDeep(source, list = []) {

    if (!isObject(source)) return source;

    var target = Array.isArray(source) ? [...source] : {...source};

    var data = find(list, source);
    if (data) return data.target;
    list.push({
        source: source,
        target: target
    });

    Reflect.ownKeys(source).forEach(key => {
        if (isObject(source[key])) {
            target[key] = cloneDeep(source[key], hash); 
        } else {
            target[key] = source[key];
        }  
  	});

    return target;
}
```

#### step4 处理Date和RegExp

``` js
function getType(obj){
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}
function handleRegExp(source){
    var pattern = source.valueOf();
    var flags = '';
    flags += pattern.global ? 'g' : '';
    flags += pattern.ignoreCase ? 'i' : '';
    flags += pattern.multiline ? 'm' : '';
    return new RegExp(pattern.source, flags);
}
function handleDate(source){
    return new Date(source.valueOf());
}
function cloneDeep(source, hash = new WeakMap()) {

    let type = getType(source);
    if(type==='regexp'){
        return handleRegExp(source);
    }else if(type==='date'){
        return handleDate(source);
    }else if(type!=='array'&&type!=='object'){
        return source;
    }

    if (hash.has(source)) return hash.get(source);

    var target = Array.isArray(source) ? [...source] : {...source};
    hash.set(source, target);
    for(var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            let property_type = getType(source[key]);
            if(property_type==='regexp'){
                target[key] = handleRegExp(source[key]);
            }else if(property_type==='date'){
                target[key] = handleDate(source[key]);
            }else if(property_type!=='array'&&property_type!=='object'){
                target[key] = source[key];
            }else{
                target[key] = cloneDeep(source[key], hash);
            }
        }
    }
    return target;
}
```

##### 测试

<img :src="$withBase('/imgs/js/clone/test7.png')" alt="深拷贝-Date和RegExp">

#### step5 破解递归爆栈

``` js
function cloneLoop(source) {

    let type = getType(source);
    if(type==='regexp'){
        return handleRegExp(source);
    }else if(type==='date'){
        return handleDate(source);
    }else if(type!=='array'&&type!=='object'){
        return source;
    }

    var root = {},
        loopList = [
        {
            parent: root,
            key: undefined,
            data: source,
        }
    ];

    while(loopList.length) {
        let node = loopList.pop();
        let parent = node.parent;
        let key = node.key;
        let data = node.data;

        let res = parent;
        if (typeof key !== 'undefined') {
            res = parent[key] = Array.isArray(data) ? [...data] : {...data};
        }

        for(var k in data) {
            if (Object.prototype.hasOwnProperty.call(data, k)) {
                let property_type = getType(data[k]);
                if(property_type==='regexp'){
                    res[k] = handleRegExp(data[k]);
                }else if(property_type==='date'){
                    res[k] = handleDate(data[k]);
                }else if(property_type!=='array'&&property_type!=='object'){
                    res[k] = data[k];
                }else{
                    loopList.push({
                        parent: res,
                        key: k,
                        data: data[k],
                    });
                }
            }
        }
    }

    return root;
}
```

##### 测试

<img :src="$withBase('/imgs/js/clone/test8.png')" alt="破解递归爆栈">

### 参考

[【进阶4-1期】详细解析赋值、浅拷贝和深拷贝的区别](https://github.com/yygmind/blog/issues/25)

[【进阶4-2期】Object.assign 原理及其实现](https://github.com/yygmind/blog/issues/26)

[【进阶4-3期】面试题之如何实现一个深拷贝](https://github.com/yygmind/blog/issues/29)

[深入剖析 JavaScript 的深复制](https://jerryzou.com/posts/dive-into-deep-clone-in-javascript/)