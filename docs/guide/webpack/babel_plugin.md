## 写一个Babel插件

### 什么是Babel？

来看一下官方解释：

> Babel 是一个 JavaScript 编译器。
>
> Babel 是一个工具链，主要用于将采用 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法，
> 以便能够运行在当前和旧版本的浏览器或其他环境中。

> 作为一种语言，JavaScript 在不断发展，新的标准／提案和新的特性层出不穷。 在得到广泛普及之前，Babel 能够让你提前（甚至数年）使用它们。

### Babel的原理是什么？

一图胜千言

<img :src="$withBase('/imgs/webpack/babel_plugin/principle.jpg')" alt="babel原理">

可以看到Babel主要做了三件事：解析 parse 、转换 transform 、生成 generate 。

#### 1. 解析 parse

解析阶段的产物是 abstract syntax tree ，AST抽象语法树。

解析有词法分析和语法分析两个步骤。

1. 词法分析

> 词法分析（英语：lexical analysis）是计算机科学中将字符序列转换为标记（token）序列的过程。

语法分析阶段，把字符串形式的代码转换为tokens，可以理解为一组标记数组。

词法分析类似于我们的分词过程，“我 想吃 火锅”，名词、动词、名词。

比如`sum = 2 + 3`，标识符、操作符、数字、操作符、数字。

``` js
[
  { type: { ... }, value: "sum", start: 0, end: 2 },
  { type: { ... }, value: "=", start: 3, end: 4 },
  { type: { ... }, value: "2", start: 4, end: 5 },
  ...
]
```

[Lexical_analysis](https://en.wikipedia.org/wiki/Lexical_analysis)

[词法分析](https://zh.wikipedia.org/wiki/%E8%AF%8D%E6%B3%95%E5%88%86%E6%9E%90)

2. 语法分析

> 进行语法检查、并构建由输入的单词组成的数据结构

[语法分析](https://zh.wikipedia.org/wiki/%E8%AF%AD%E6%B3%95%E5%88%86%E6%9E%90)

简单点，说话的方式简单点，就是把 tokens 转换成 AST抽象语法树。

[AST抽象语法树](https://astexplorer.net/)

#### 2. 转换 transform

转换阶段接收一棵AST抽象语法树，对其进行遍历，做一些添加节点、删除节点、修改节点的操作，并输出转换后的AST抽象语法树。

#### 3. 生成 generate

这一阶段也很好理解，接收转换好的AST抽象语法树，生成字符串形式的代码，并创建源码映射。

[Introduction to JavaScript Source Maps](https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/)

[JavaScript Source Map 详解](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)

---

> Babel 实际上是一组模块的集合。

+ babylon 是 Babel 的解析器。

+ babel-traverse（遍历）模块维护了整棵树的状态，并且负责替换、移除和添加节点。

+ babel-generator 模块是 Babel 的代码生成器，它读取AST并将其转换为代码和源码映射（sourcemaps）。

+ babel-types 模块是一个用于 AST 节点的 Lodash 式工具库，它包含了构造、验证以及变换 AST 节点的方法。 

### Babel插件是做什么的？

> Babel's code transformations are enabled by applying plugins (or presets) to your configuration file.

[Babel插件](https://www.babeljs.cn/docs/plugins)

插件是干什么的呢？

直译一下，Babel的代码转换得益于在配置文件中设置的插件和预设的应用。

### Visitors（访问者）和 Paths（路径）

开始写plugin之前，我们还需要了解一下如何访问语法树的节点，节点与节点之间又是怎样关联的。

#### Visitors（访问者）

[访问者模式](https://www.jianshu.com/p/1f1049d0a0f4)是一种将数据操作和数据结构分离的设计模式。

简单的说，访问者就是一个对象，定义了用于在一个树状结构中获取具体节点的方法。

看一下官方例子：

``` js
const MyVisitor = {
  Identifier() {
    console.log("Called!");
  }
};
```

这是一个简单的访问者，把它用于遍历中时，每当在树中遇见一个 Identifier 的时候会调用 Identifier() 方法。

``` js
function square(n) {
  return n * n;
}
```

这段代码会触发几次"Called!"打印？

可以看一下这段代码解析出来的[AST抽象语法树](https://astexplorer.net/)。

有四个Identifier，所以触发四次。

实际上，`Identifier() { ... }` 是 `Identifier: { enter() { ... } }` 的简写形式，一个访问者有两次机会访问节点：进入节点，退出节点。

``` js
const MyVisitor = {
  "Identifier|FunctionDeclaration|BlockStatement|ReturnStatement|BinaryExpression": {
        enter(path) {
            console.log("Entered!",path.node.type,path.node.name || '');
        },
        exit(path) {
            console.log("Exited!",path.node.type,path.node.name || '');
        }
    }
};
```

<img :src="$withBase('/imgs/webpack/babel_plugin/visitor.png')" alt="visitor">

> 可以把方法名用"|"分割成"Idenfifier|MemberExpression"形式的字符串，把同一个函数应用到多种访问节点。

#### Paths（路径）

> Path 是表示两个节点之间连接的对象。

当我们通过Visitor来访问节点时，实际访问当不是节点，而是路径。

``` js
const MyVisitor = {
    "Identifier": {
        enter(path) {
            if(path.node.name === 'a') console.log(path);
        },
    }
}
```

用上面这个访问者访问`var a = 1`的AST抽象语法树，我们可以看到此时的path：

<img :src="$withBase('/imgs/webpack/babel_plugin/path.png')" alt="path">

路径对象还包含添加、更新、移动和删除节点有关的其他很多方法。

---

当然path中还有很多其他信息，有兴趣可以去了解一下

``` js
{
  "parent": {...},
  "node": {...},
  "hub": {...},
  "contexts": [],
  "data": {},
  "shouldSkip": false,
  "shouldStop": false,
  "removed": false,
  "state": null,
  "opts": null,
  "skipKeys": null,
  "parentPath": null,
  "context": null,
  "container": null,
  "listKey": null,
  "inList": false,
  "parentKey": null,
  "key": null,
  "scope": null,
  "type": null,
  "typeAnnotation": null
}
```

### 写一个Babel插件吧

来写一个删除`console.log(...)`的插件吧。

plugin 是一个接收了当前babel对象作为参数的 function，我们先把`babel.types`取出来，我们将用到它的一些验证节点类型的方法。

``` js
module.exports = function({ types: t }) {
    return {
        visitor: {
            // ...
        }
    }
}
```

来看看一条`console.log(...)`语句的[AST抽象语法树](https://astexplorer.net/)吧。

<img :src="$withBase('/imgs/webpack/babel_plugin/ast.png')" alt="ast">

然后就可以完成这个插件了！

``` js
CallExpression(path, state) {
    let node = path.node.callee
    if(t.isMemberExpression(node) 
        && t.isIdentifier(node.object) 
        && node.object.name === 'console' 
        && t.isIdentifier(node.property) 
        && node.property.name === 'log' ){
            path.parentPath.remove();
    }
},
```

<img :src="$withBase('/imgs/webpack/babel_plugin/result.png')" alt="result">

### 一个小知识

1. 插件的执行顺序是怎样的？

插件顺序从前往后排列。

2. 预设的执行顺序是怎样的？

Preset 顺序是颠倒的（从后往前）。

3. 插件和预设的执行顺序是怎样的？

插件在 Presets 前运行。

### 相关文档

[Babel插件手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md#toc-introduction)
