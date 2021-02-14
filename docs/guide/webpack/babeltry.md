## 通过babel手撸超简化版webpack

> 本文讲述如何通过babel对文件及其依赖进行解析编译打包，示例代码参见[babeltry](https://github.com/Jiuto/babeltry)

---

### 目录结构

<img :src="$withBase('/imgs/babeltry/file.png')" alt="目录结构">

src：用于测试的打包项目

dist：用于存放打包生成的文件，test.html用于测试生成文件效果

babeltry.config.js：配置文件

index.js：打包工具入口

lib：打包工具的依赖方法

### 打包效果

源文件

`src/index.js`

``` js
import { greeting } from "./greeting.js";
document.write(greeting('world'));
```

`src/greeting.js`

``` js
import { str } from "./hello.js";
var greeting = function(name) {
    return str + ' ' + name;
}
export { greeting }
```

`src/hello.js`

``` js
var str = 'hello';
export { str }
```

打包文件

`dist/main.js`

``` js
            (function(modules){
                function require(filepath){
                    const fn = modules[filepath];
                    
                    const moudle = { exports: {} };

                    fn(require, moudle, moudle.exports);

                    return moudle.exports
                }
                require('E:\项目文件夹\项目资料\其他\babeltry\src\index.js')
            })({'E:\项目文件夹\项目资料\其他\babeltry\src\index.js': function (require, moudle, exports) {"use strict";

var _greeting = require("./greeting.js");

document.write((0, _greeting.greeting)('world'));},'./greeting.js': function (require, moudle, exports) {"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.greeting = undefined;

var _hello = require("./hello.js");

var greeting = function greeting(name) {
  return _hello.str + ' ' + name;
};
exports.greeting = greeting;},'./hello.js': function (require, moudle, exports) {"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var str = 'hello';
exports.str = str;},})
        
```

`dist/test.html`

``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="./main.js"></script>
</head>
<body>
</body>
</html>
```

<img :src="$withBase('/imgs/babeltry/result.png')" alt="test.html">

### 开始编写打包工具

#### package.json

所需依赖，依赖的具体作用我们会在解析器部分讲解

``` js
"devDependencies": {
    "babel-core": "^6.26.3",
    "babel-preset-env": "^1.7.0",
    "babel-traverse": "^6.26.0",
    "babylon": "^6.18.0"
}
```

#### babeltry.config.js

``` js
'use strict'
const path = require('path');
module.exports = {
    entry: path.join(__dirname, '/src/index.js'),
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'main.js'
    }
};
```

设置需要打包的项目入口和打包结果出口位置与文件名

#### index.js

``` js
const Compiler = require('./lib/compiler');
const config = require('./babeltry.config');
new Compiler(config).run();
```

index.js文件内容相当简单，就是加载配置和编译器，实例化一个编译器并执行run方法

#### parser.js 解析器

在编写编译器之前，我们先看一看解析器怎么实现

``` js
const fs = require('fs');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const core = require('babel-core');

module.exports = {
    getAST: (path) => {
        const file = fs.readFileSync(path, 'utf-8');
        return babylon.parse(file, {
            sourceType: 'module'
        })
    },
    getNode: (ast) => {
        const nodes = [];
        traverse(ast, {
            ImportDeclaration: ({ node }) => {
                nodes.push(node.source.value)
            }
        });
        return nodes
    },
    transform: (ast) => {
        const { code } = core.transformFromAst(ast, null, {
            presets: ["env"]
        });
        return code
    }
}
```

引入依赖：

babylon： 通过babylon的parse方法生成AST抽象语法树，关于抽象语法树这里就不展开讲解，网上有很多相关的文章资料可以查阅

babel-traverse：通过babel-traverse遍历AST，ImportDeclaration用于获取依赖节点

babel-core：通过babel-core的transformFromAst方法生成源码

解析器导出了三个方法：

getAST：接收一个文件路径作为入参，读取文件并解析出AST

getNode：接收AST作为入参，返回一个依赖文件路径的数组

transform：接收AST作为入参，返回源码

#### compiler.js 编译器

``` js
const fs = require('fs');
const path = require('path');
const { getAST, getNode, transform } = require('./parser');

module.exports = class Compiler {
    constructor(options) {
        const { entry, output } = options;
        this.entry = entry;
        this.output = output;
        this.modules = [];
    }

    run() { }

    buildMoudle() { }

    fillFile() { }
}
```

编译器类的构造函数接收一个配置项，声明三个变量，分变是入口、出口、以及表示依赖文件列表的数组。

编译器类有三个方法，run方法即编译器的主体方法，执行解析和编译，buildMoudle方法接收依赖路径，并生成一个代表依赖文件的对象，即modules数组存储的每一项，fillFile方法负责生成打包文件。

先看buildMoudle方法

``` js
buildMoudle(filepath, isEntry) {
    let ast;
    if (isEntry) {
        ast = getAST(filepath);
    } else {
        let absolutePath = path.join(process.cwd(), '/src', filepath);
        ast = getAST(absolutePath);
    }
    return {
        filepath,
        nodes: getNode(ast),
        code: transform(ast)
    }
}
```

buildMoudle接收两个参数，filepath为依赖文件路径，isEntry表示是否为入口文件。

主要做了三个动作，即调用解析器的三个方法，先通过getAST获取AST抽象语法树，再将AST作为入参，调用getNode和transform，分别获取当前解析文件的依赖文件路径数组和源码。

返回一个代表当前依赖文件的对象，filepath为依赖路径，nodes为当前解析文件的依赖文件路径数组，code为源码。

``` js
run() {
    const entryModule = this.buildMoudle(this.entry, true);
    this.modules.push(entryModule);
    // 深度遍历依赖
    for(let i = 0; i < this.modules.length;i++){
        let _moudle = this.modules[i];
        _moudle.nodes.map((node)=>{
            this.modules.push(this.buildMoudle(node));
        });
    }
    this.fillFile();
}
```

run方法从入口文件开始，遍历modules依赖数组，深度遍历所有依赖文件，构建所有依赖文件对象并存储在modules中，最后调用fillFile生成打包文件。

``` js
fillFile() {
    let moudles = '';
    this.modules.map((_moudle)=>{
        moudles += `'${_moudle.filepath}': function (require, moudle, exports) {${_moudle.code}},`
    })
    const bundle = `
        (function(modules){
            function require(filepath){
                const fn = modules[filepath];
                
                const moudle = { exports: {} };

                fn(require, moudle, moudle.exports);

                return moudle.exports
            }
            require('${this.entry}')
        })({${moudles}})
    `;

    const outpath = path.join(this.output.path, this.output.filename);
    fs.writeFileSync(outpath, bundle, 'utf-8');
}
```

fillFile生成打包文件，打包文件主体就是调用了一个匿名方法。

该匿名方法接收一个由我们的依赖文件列表生成的对象，对象的每一个属性都是依赖文件路径，值为一个方法(为方便记忆，我们称之为fn)，fn方法接收三个参数(require, moudle, exports)，方法内容即为依赖文件的源码。

该方法的主体声明了require方法，并以入口文件路径为入参调用了require，由此进入递归循环。

require方法接收一个路径作为入参，通过这个路径我们可以通过闭包拿到匿名方法入参对象中对应的fn方法，同时声明一个有exports属性的moudle对象，然后调用fn，返回moudle.exports。



说起来似乎有点绕，总的理解其实fn的内容，就是我们编译后的那些依赖文件比如greeting.js的内容，每当遇到一个require请求依赖文件，我们就执行这个依赖文件的内容，并返回导出结果。

通过示例的main.js的执行逻辑应该就能理解。
