## 手写webpack plugin 和 loader

> 本文将简单写一个具有删除console语句功能的webpack的plugin和loader，示例代码参见[delConsolePlugin](https://github.com/Jiuto/delConsolePlugin.git)、[delConsoleLoader](https://github.com/Jiuto/delConsoleLoader.git)

---

### 写一个loader

``` js
var loaderUtils = require('loader-utils');

module.exports = function(source) {
    var options = loaderUtils.getOptions(this) || {};
    // 删除console语句
    if(options.deleteConsole) {
        source = source.replace(/console\.(log|dir|info)\(.*?\);?/g, '');
    }
    return source;
};
```

loader直接导出一个方法，入参source为需要loader处理的代码，loader-utils用于获取调用loader时传入的配置对象，根据配置做完相应处理后返回处理后的source。

### 写一个pulgin

``` js
class DelConsole {
    constructor(options) {
        this.deleteConsole = options.deleteConsole;
    }
    apply(compiler) {
        let that = this;
        compiler.hooks.emit.tap('DelConsole',compilation=>{
            // 探索每个块（构建后的输出）
            compilation.chunks.forEach(function(chunk) {
              // 探索块生成的每个资源文件名
              chunk.files.forEach(function(filename) {
                var source = compilation.assets[filename].source();
                // 删除console语句
                if(that.deleteConsole){
                    source = source.replace(/console\.(log|dir|info)\(.*?\);?/g, '');
                }
                // 返回
                compilation.assets[filename]={
                    source() {
                        return source;
                    },
                    size() {
                        return source.length;
                    }
                }
              });
            });
        });
    }
}
module.exports = DelConsole;
```

plugin稍微比loader复杂一点点，每个plugin都是一个类，constructor接收plugin实例化的配置对象。

webpack会调用每个plugin的apply方法，并传入[compiler](https://github.com/webpack/docs/wiki/plugins)。

compiler暴露了和webpack相关的生命周期hooks，我们希望在生成的资源输出之前做处理，需要调用compiler.hooks.emit.tap(pluginName,compilation=>{})。

> emit(c: Compilation) async
>
> The Compiler begins with emitting the generated assets. Here plugins have the last chance to add assets to the c.assets array.

通过compilation，我们则可以拿到模块和依赖。

> The Compilation instance extends from the compiler. ie. compiler.compilation It is the literal compilation of all the objects in the require graph. This object has access to all the modules and their dependencies (most of which are circular references). In the compilation phase, modules are loaded, sealed, optimized, chunked, hashed and restored, etc. This would be the main lifecycle of any operations of the compilation.

### 测试使用

目录结构

<img :src="$withBase('/imgs/plugin_loader/file.png')" alt="目录结构">

测试代码

``` js
var a = 1;
// 这是一句打印
console.log('12313')
/**
 * 这是一段注释
 */
var b = 2;
b = a;
```

plugin的使用

``` js
const DelConsole = require("../index");
module.exports = {
    mode: 'development',
    entry: './index.js',
    output: {
        filename: './bundle.js'
    },
    plugins: [
        new DelConsole({deleteConsole:true})
    ]
};
```

loader的使用

``` js
const path = require("path");
module.exports = {
    mode: 'development',
    entry: './index.js',
    output: {
        filename: './bundle.js'
    },
    module:{
        rules:[{
            test:/\.js$/,
            use:[{
                    loader:path.resolve(__dirname,'../index.js'),
                    options:{
                    deleteConsole:true
                    }
            }]
        }]
    }
};
```

使用plugin或loader前

<img :src="$withBase('/imgs/plugin_loader/before.png')" alt="使用前">

使用plugin或loader后

<img :src="$withBase('/imgs/plugin_loader/after.png')" alt="使用后">