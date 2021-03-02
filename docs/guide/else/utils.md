## 搭建一个方法库

> 本文讲述如何搭建一个自己的js常用方法库，并引入typescript，打包工具使用rollup。
> 示例代码详见[dc-utils](https://github.com/Jiuto/dc-utils)

---

### 开始搭建

#### package.json

1. 执行`npm init`生成package.json文件，并安装下列typescript和rollup相关依赖

``` js
"devDependencies": {
    "rollup": "^2.38.0",
    "rollup-plugin-commonjs": "^10.1.0",
    "rollup-plugin-node-resolve": "^5.2.0",
    "rollup-plugin-typescript": "^1.0.1",
    "tslib": "^2.1.0",
    "typescript": "^4.1.3"
}
```

在"scripts"中添加打包命令

``` js
"scripts": {
    "build": "rollup -c"
}
```

#### tsconfig.json

2. 执行`tsc --init`自动生产typescript配置文件，可根据自己的需要进行配置([参考](https://www.tslang.cn/docs/handbook/tsconfig-json.html))，本文示例未作更改

#### rollup.config.js

3. 在根目录创建一个rollup.config.js文件，配置如下，可根据自己的需要进行更改([文档](https://www.rollupjs.com/guide/big-list-of-options))

``` js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';

export default {
  input: 'src/index.ts', // 入口文件
  output: {
    name: 'dc-utils', // 生成包名称
    file: 'dist/index.js', // 打包出口
    format: 'umd', // umd是兼容amd/cjs/iife的通用打包格式，适合浏览器
  },
  plugins: [
    resolve(), // 查找和打包node_modules中的第三方模块
    commonjs(), // 将 CommonJS 转换成 ES2015 模块供 Rollup 处理
    typescript() // 解析TypeScript
  ]
};
```

#### src

4. 完成配置后即可编写自己的具体方法库内容，建立一个src文件件，建一个index.ts文件作为入口文件，建一个getDate.ts文件

getDate.ts

``` js
// 格式化日期：yyyy-MM-dd
function formatDate(date: Date): string {
    let year: number = date.getFullYear();
    let month: number = date.getMonth() + 1;
    let day: number = date.getDate();

    return year + "-" + month + "-" + day;
}
export { formatDate }
```

index.ts

``` js
import * as getDate from './getDate';
var utils = {
    ...getDate
}
export default utils;
```

#### 打包与测试

5. 执行`npm run build`命令，即可看到项目目录生成的dist打包文件

6. 将README.md和package.json复制到打包出来的文件夹下，进入该目录执行`npm login`和`npm publish`发布方法库。
此处我将示例的包命名为@dc/cli发布在私有库上，私有库的搭建可参考[在docker中通过Verdaccio搭建一个私有npm库](https://jiuto.github.io/jiuto_blog/guide/else/docker_verdaccio.html)

最终目录结构

<img :src="$withBase('/imgs/else/utils/file.png')" alt="目录结构">

npm私有库

<img :src="$withBase('/imgs/else/utils/npm.png')" alt="发布方法库">

7. 在项目中安装该方法库，引入依赖，即可正常使用

``` js
import utils from "@dc/utils";

console.log(utils.formatDate(new Date()))
```
