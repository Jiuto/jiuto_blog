# 搭建一个由 karma + mocha + chai + Istanbul 组成的基础测试工具

## 目的
搭建一个由 karma + mocha + chai + Istanbul + es6 + webpack 组成的基础测试工具

---

## 工具的简单介绍
### 测试框架
#### Mocha
> mocha是JavaScript的一种单元测试框架，既可以在浏览器环境下运行，也可以在Node.js环境下运行。
> 使用mocha，我们就只需要专注于编写单元测试本身，然后，让mocha去自动运行所有的测试，并给出测试结果。
> mocha的特点主要有：
>
>   1. 既可以测试简单的JavaScript函数，又可以测试异步代码，因为异步是JavaScript的特性之一；

>   1. 可以自动运行所有测试，也可以只运行特定的测试；

>   1. 可以支持before、after、beforeEach和afterEach来编写初始化代码。


[测试框架Mocah实例教程]()
[廖雪峰js教程](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/00147203593334596b366f3fe0b409fbc30ad81a0a91c4a000)



---

#### Chai断言库
> chai 提供了三种断言风格来分别适用于 BDD 和 TDD。`expect/should` API 对应BDD风格，`Assert API` 对应TDD风格。

[Chai官网API Reference](https://www.chaijs.com/api/)
[Chai.js断言库API中文文档](https://www.jianshu.com/p/f200a75a15d2)


### 前端测试工具
#### Karma
> Karma是一个基于 Node.js 的 JavaScript 测试执行过程管理工具（Test Runner）。该工具可用于测试所有主流Web浏览器，也可集成到 CI（Continuous integration）工具，也可和其他代码编辑器一起使用。这个测试工具的一个强大特性就是，它可以监控(Watch)文件的变化，然后自行执行，通过`console.log`显示测试结果。

[Karma官网](https://karma-runner.github.io/2.0/intro/configuration.html)

---

#### Istanbul
> 测试的时候，我们常常关心，是否所有代码都测试到了。
> 这个指标就叫做"代码覆盖率"（code coverage）。它有四个测量维度。
> - 行覆盖率（line coverage）：是否每一行都执行了？
> - 函数覆盖率（function coverage）：是否每个函数都调用了？
> - 分支覆盖率（branch coverage）：是否每个if代码块都执行了？
> - 语句覆盖率（statement coverage）：是否每个语句都执行了？

[代码覆盖率工具 Istanbul 入门教程](http://www.ruanyifeng.com/blog/2015/06/istanbul.html)
## 实践
### 文件结构概览

karma_mocha-----项目文件夹

|

|---node_modules-----项目依赖

|

|---src

|------add.js-----待测文件

|

|---test

|------coverage-----自动生产的报告文件夹

|------mochaDemo

|---------add.spec.js-----测试用例文件

|------karma.conf.js-----karma配置文件

|

|---.babelrc-----babel配置文件

|---package.json-----npm配置文件

|---webpack.config.js-----webpack配置文件


---

### 初始化配置
#### karma配置
```javascript
const webpack = require('../webpack.config.js')
module.exports = function(config) {
    config.set({
      basePath: '',
      port:1010,
      // 自动启用Chrome浏览器执行代码 karma-chrome-launcher
      browsers: ['Chrome'],
      // 告诉karma用的测试框架（mocha）和断言库 (karma-chai)
      frameworks: ['mocha','chai'],
      // 测试报告的显示格式（命令行内的显示格式）  karma-mocha-reporter
      // 测试覆盖率报告  karma-coverage
      reporters: ['spec', 'coverage'],
      //colors 报表中是否有颜色区分
      colors:true,
      // 将功能代码和测试代码加载到karma
      files: [
        'mochaDemo/**/*.spec.js'
      ],
      //排除文件，可以是正则
      exclude:["karma.conf.js"],
      //对指定文件的预处理
      preprocessors: {
        'mochaDemo/add.spec.js': ['webpack']
      },
      // webpack
      webpack: webpack,
      // 测试时忽略打包信息
      webpackMiddleware: {
        noInfo: true
      },
      // 生成的覆盖率报告 配置项
      // coverageReporter: {
      //   type : 'html',
      //   dir : 'coverage/'
      // }
      coverageReporter: {
        dir: './coverage',
        reporters: [
          { type: 'lcov', subdir: '.' },
          { type: 'text-summary' } //在控制台输出摘要
        ]
      },
      // 检测文件变动 文件变动自动执行测试文件
      autoWatch: true,
      // 输出的日志级别
      // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
      logLevel: config.LOG_INFO,
      //是否依附浏览器运行
      singleRun:false,
      //并发数，同时支持多少个浏览器运行
      concurrency:Infinity
    });
  };
```
#### babel配置
```javascript
{
  "presets": [
    ["env", {
      "modules": false,
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
      }
    }],
    "stage-2"
  ],
  "plugins": ["transform-vue-jsx", "transform-runtime"],
  "env": {
    "test": {
      "presets": ["env", "stage-2"],
      "plugins": ["transform-vue-jsx", "istanbul"]  
    }
  }
}
```
#### webpack配置
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
```
#### package.json修改脚本
```javascript
"scripts": {
    "test": "cross-env BABEL_ENV=test karma start test/karma.conf.js"
  }
```
#### 安装依赖
```javascript
		"babel-core": "^6.26.3",
    "babel-loader": "^7.1.1",
    "babel-plugin-syntax-jsx": "^6.18.0",
    "babel-plugin-transform-runtime": "^6.23.0",
    "babel-plugin-transform-vue-jsx": "^3.7.0",
    "babel-preset-env": "^1.7.0",
    "babel-preset-stage-2": "^6.24.1",
    "chai": "^4.2.0",
    "cross-env": "^5.2.0",
    "karma": "^4.0.1",
    "karma-chai": "^0.1.0",
    "karma-chrome-launcher": "^2.2.0",
    "karma-coverage": "^1.1.2",
    "karma-mocha": "^1.3.0",
    "karma-spec-reporter": "0.0.32",
    "karma-webpack": "^2.0.2",
    "mocha": "^6.0.2",
    "webpack": "^3.6.0"
    "babel-plugin-istanbul": "^4.1.1"
```

---

### 功能测试demo

待测文件

```javascript
//add.js
function add(x, y) {
  return x + y
}

module.exports = add;
```

测试用例

```javascript
//add.spec.js
var add = require('../../src/add.js');
var expect = require('chai').expect;

describe('加法函数的测试', function() {
  it('1 加 1 等于 2', function() {
    expect(add(1, 1)).to.be.equal(2);
  });
});
```

---

### 接口测试demo
接口测试使用了chai的插件chai-http，详见[chai-http官网](https://www.chaijs.com/plugins/chai-http/)。
另外还有supertest等其他http测试工具。


karma.conf.js增加proxies配置项，用于代理跨域请求。
```javascript
module.exports = function(config) {
    config.set({
      ...
      //代理
      proxies: {
        '/': 'http://192.168.23.170:29548'
      }
    });
};
```

添加http请求测试
```
...
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
describe('接口测试', function() {
	...
  it('请求数据库列表接口成功', done => {
    chai
      .request("http://localhost:1010")	// 这个端口为karma.conf.js中配置的port端口
      .post('/djtest/projectConfig/listDataBase.do')
      .set('Content-Type', 'application/json')
      .send({
        'fprojectId': '',
        'fsort': '',
        'pagenum': 1,
        'pagesize': 10
      })
      .end((err, res) => {
        if (err) {
          done();
        }
        let data = JSON.parse(res.text);
        expect(data.success).to.be.true;
        done();
      });
  });
});
```

在终端执行`npm run test`

控制台可看到输出结果

<img :src="$withBase('/imgs/else/karma_mocha/console.png')" alt="控制台输出">

test目录下生成coverage文件夹，打开index.html

<img :src="$withBase('/imgs/else/karma_mocha/coverage.png')" alt="index.html">

---

### 在vue项目中的使用
[Vue Test Utils](https://vue-test-utils.vuejs.org/zh/) 是 Vue.js 官方的单元测试实用工具库。
安装依赖：
`npm install --save-dev @vue/test-utils`

```javascript
import ElementUI from "element-ui";
import vueComponent from "@/demo/vueComponent.vue"; // 待测vue组件
import { createLocalVue, mount } from "vue-test-utils"; // vue-test-utils提供的方法

const localVue = createLocalVue(); 
// 返回一个 Vue 的类供你添加组件、混入和安装插件而不会污染全局的 Vue 类

localVue.use(ElementUI); // 注册element ui
const wrapper = mount(dataBaseManagement, {
  localVue
}); // 创建一个包含被挂载和渲染的 Vue 组件的 Wrapper

// 开始编写测试用例
```

---


参考文章：

[前端测试的那些事](https://github.com/muwoo/blogs/issues/33#event-1789300650)
