## ES6 Module

### 概述

> 历史上，JavaScript 一直没有模块（module）体系，无法将一个大程序拆分成互相依赖的小文件，再用简单的方法拼装起来。
> 在 ES6 之前，社区制定了一些模块加载方案，最主要的有 CommonJS 和 AMD 两种。前者用于服务器，后者用于浏览器。
> ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。

> ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。

#### CommonJS

> CommonJS 的一个模块，就是一个脚本文件。require命令第一次加载该脚本，就会执行整个脚本，然后在内存生成一个对象。

``` js
// CommonJS模块
let { stat, exists, readfile } = require('fs');

// 等同于
let _fs = require('fs');
let stat = _fs.stat;
let exists = _fs.exists;
let readfile = _fs.readfile;
```

> 上面代码的实质是整体加载fs模块（即加载fs的所有方法），生成一个对象（_fs），然后再从这个对象上面读取 3 个方法。
> 这种加载称为“运行时加载”，因为只有运行时才能得到这个对象，导致完全没办法在编译时做“静态优化”。

#### ES6

``` js
// ES6模块
import { stat, exists, readFile } from 'fs';
```

> 上面代码的实质是从fs模块加载 3 个方法，其他方法不加载。
> 这种加载称为“编译时加载”或者静态加载，即 ES6 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高。
> 当然，这也导致了没法引用 ES6 模块本身，因为它不是对象。

### export命令

1. export命令可以输出变量、函数、类（class）

``` js
export var firstName = 'Michael';
export var lastName = 'Jackson';
export var year = 1958;
// 等价于
var firstName = 'Michael';
var lastName = 'Jackson';
var year = 1958;
export { firstName, lastName, year };

// 输出函数
export function multiply(x, y) {
  return x * y;
};
```

2. 输出的变量可用as关键字重命名

``` js
// 重命名
function v1() { ... }
function v2() { ... }

export {
  v1 as streamV1,
  v2 as streamV2,
  v2 as streamLatestVersion
};
```

3. export语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。
CommonJS 模块输出的是值的缓存，不存在动态更新。

4. export命令可以出现在模块顶层的任何位置，但不能处于块级作用域内。
这是因为处于条件代码块之中，就没法做静态优化了，违背了 ES6 模块的设计初衷。

### import命令

1. import命令接受一对大括号，里面指定要从其他模块导入的变量名。大括号里面的变量名，必须与被导入模块（profile.js）对外接口的名称相同。

``` js
import { firstName, lastName, year, obj } from './profile.js';
```

2. 导入的变量可用as关键字重命名

``` js
import { lastName as surname } from './profile.js';
```

3. import命令输入的变量都是只读的，但可以改写对象的属性

``` js
import { firstName, lastName, year, obj } from './profile.js';

year = 0; // Syntax Error : 'year' is read-only;

obj.name = "Jiuto";
```

4. import命令具有提升效果，会提升到整个模块的头部，首先执行

5. 由于import是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构

``` js
// 报错
import { 'f' + 'oo' } from 'my_module';

// 报错
let module = 'my_module';
import { foo } from module;

// 报错
if (x === 1) {
  import { foo } from 'module1';
} else {
  import { foo } from 'module2';
}
```

6. import语句会执行所加载的模块

``` js
// 仅仅执行lodash模块，但是不输入任何值
import 'lodash';
```

7. 如果多次重复执行同一句import语句，那么只会执行一次，而不会执行多次

``` js
// 仅执行一次
import 'lodash';
import 'lodash'; 
```

### 模块整体加载 *

``` js
// 导出
export function area(radius) {
  return Math.PI * radius * radius;
}

export function circumference(radius) {
  return 2 * Math.PI * radius;
}

// 导入
import * as circle from './circle';

console.log('圆面积：' + circle.area(4));
console.log('圆周长：' + circle.circumference(14));

// 模块整体加载所在的那个对象，是可以静态分析的，所以不允许运行时改变
circle.foo = 'hello'; // 不允许
circle.area = function () {}; // 不允许
```

### export default命令

1. export default 为模块指定默认输出

``` js
export default function () {
  console.log('foo');
}
```

2. import命令可以为该匿名函数指定任意名字

``` js
export default function () {
  console.log('foo');
}

import customName from './export-default';
```

3. 一个模块只能有一个默认输出，因此export default命令只能使用一次

4. 本质上，export default就是输出一个叫做default的变量或方法

``` js
function add(x, y) {
  return x * y;
}
export {add as default};
// 等同于
export default add;

import { default as foo } from 'modules';
// 等同于
import foo from 'modules';

export default function (obj) {}
export function each(obj, iterator, context) {}
export { each as forEach };

import _, { each, forEach } from 'lodash';
```

### ES6 模块与 CommonJS 模块的差异

1. CommonJS 模块使用require()和module.exports，ES6 模块使用import和export。

2. CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。

``` js
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};
```

``` js
// main.js
var mod = require('./lib');

console.log(mod.counter);  // 3
mod.incCounter();
console.log(mod.counter); // 3
```
> lib.js模块加载以后，它的内部变化就影响不到输出的mod.counter了。
> 这是因为mod.counter是一个原始类型的值，会被缓存。
> 除非写成一个函数，才能得到内部变动后的值。

``` js
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  get counter() {
    return counter
  },
  incCounter: incCounter,
};
```

> ES6 模块的运行机制与 CommonJS 不一样。
> JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用。
> 等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。

> 因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。

``` js
// m1.js
export var foo = 'bar';
setTimeout(() => foo = 'baz', 500);

// m2.js
import {foo} from './m1.js';
console.log(foo); // bar
setTimeout(() => console.log(foo), 500); // baz
```

3. CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

> CommonJS 加载的是一个对象（即module.exports属性），该对象只有在脚本运行完才会生成。

4. CommonJS 模块的require()是同步加载模块，ES6 模块的import命令是异步加载，有一个独立的模块依赖的解析阶段。

5. CommonJS 的require()命令不能加载 ES6 模块，会报错，只能使用import()这个方法加载。
ES6 模块的import命令可以加载 CommonJS 模块，但是只能整体加载，不能只加载单一的输出项。

6. CommonJs 是单个值导出，ES6 Module可以导出多个。(common.js 和 es6 中模块引入的区别？- 霍小叶)

7. CommonJs 是动态语法可以写在判断里，ES6 Module 静态语法只能写在顶层。(common.js 和 es6 中模块引入的区别？- 霍小叶)

8. CommonJs 的 this 是当前模块，ES6 Module的 this 是 undefined。(common.js 和 es6 中模块引入的区别？- 霍小叶)

### 参考

[ECMAScript 6入门](https://es6.ruanyifeng.com/#docs/module)