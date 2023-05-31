## 面试准备2023

### 知识点

#### 基础

* ES6特性：

    let/const、Promise、Module、Class、箭头函数、函数参数默认值、字符串模板`${data}`、结构赋值{name} = data;与[a, b] = [1, 2];、延展操作符...、 对象属性简写var obj = { name, age, city }、Array.prototype.includes()返回布尔值、指数运算符**、async/await、Object.values()返回属性值数组、Object.entries()返回对象可枚举属性的键值对数组、 函数参数列表结尾允许逗号、Object.getOwnPropertyDescriptors()、Promise.finally()、Array.prototype.flat()和Array.prototype.flatMap()、BigInt、可选链操作符（Optional Chaining）obj?.first?.second、空位合并操作符（a ?? b 同 a !== undefined && a !== null ? a : b）、Promise.any()

* 居中方案、圣杯、双飞翼：

    水平居中，行内：text-align: center

    水平居中，块级：margin: 0 auto、弹性布局 justify-content: center、绝对定位 left: 50% + transform: translate(-50%, 0)、绝对定位 left: 0 + right: 0 + margin: 0 auto

    垂直居中，行内：line-height: 100px、table-cell + vertical-align（margin失效与宽度撑满两种）

    垂直居中，块级：弹性布局 align-items: center、绝对定位 top: 50% + transform: translate( 0, -50%)、绝对定位 top: 0 + bottom: 0 + margin: auto 0、table-cell + vertical-align（margin失效与高度撑满两种）、伪元素 ：

    ``` css
        .middle_block::before {
            content: '';
            height: 100%;
            display: inline-block;
            vertical-align: middle;  
        }
        .middle_block .block {
            display: inline-block;
            vertical-align: middle;
        }
    ```

    左列定宽，右列自适应：float + margin-left、float + overflow (触发BFC)、calc、display: table-cell、绝对定位、flex、grid；

    一列不定宽，一列自适应：float + overflow (触发BFC)、flex、grid；

    圣杯布局-两侧定宽，中间自适应：

    ``` html
        <div class="parent">
            <div class="center">中间自适应</div>
            <div class="left">左列定宽</div>
            <div class="right">右列定宽</div>
        </div>
    ```

    ``` css
        .center {
            width: 100%;
            height: 100%;
            float: left;
        }
        .left, .right {
            width: 200px;
            height: 100%;
            float: left;
        }
        .left {
            margin-left: -100%;
            position: relative;
            left: -200px;
        }
        .right {
            margin-left: -200px;
            position: relative;
            left: 200px;
        }
        .parent {
            padding: 0 200px;
        }
    ```

    双飞翼布局，类似圣杯，增加了一个内容区：

    ``` html
        <div class="parent">
            <div class="center">
                <div class="center_inbox">中间自适应</div>
            </div>
            <div class="left">左列定宽</div>
            <div class="right">右列定宽</div>
        </div>
    ```

    ``` css
        .center {
            width: 100%;
            height: 100%;
            background-color: gold;
            float: left;
        }
        .left, .right {
            width: 200px;
            height: 100%;
            background-color: teal;
            float: left;
        }
        .left {
            margin-left: -100%;
        }
        .right {
            margin-left: -200px;
        }
        .center_inbox {
            margin: 0 200px;
        }
    ```

* flex：

    设为 Flex 布局以后，子元素的float、clear和vertical-align属性将失效。

    容器属性：
    1. flex-direction 定义主轴：row、row-reverse、column、column-reverse；
    2. flex-wrap 换行：nowrap、wrap、wrap-reverse；
    3. justify-content 主轴上的排列方式：flex-start、flex-end、center、space-around、space-between；
    4. align-items 交叉轴上的对齐方式：stretch（元素/容器拉伸）、flex-start、flex-end、center、baseline；
    5. align-content 交叉轴上的整组的排列方式：stretch、flex-start、flex-end、center、space-between、space-around；
    6. flex-flow flex-direction和flex-wrap的简写：row nowrap；

    元素属性：
    1. order 排序，数字越小越靠前；
    2. flex-grow 放大比例，默认为0，有剩余也不放大；
    3. flex-shrink 缩小比例，默认为1，如果空间不足，该项目将缩小；
    4. flex-basis 分配多余空间之前，元素占据的主轴空间，默认auto，即元素原本大小；
    5. align-self 单个元素对齐方式：auto、flex-start、flex-end、center、baseline、stretch；
    6. flex 是flex-grow、flex-shrink、flex-basis的简写，默认值为0 1 auto；

    flex: initial === flex: 0 1 auto

    flex: auto === flex: 1 1 auto

    flex: none === flex: 0 0 auto

    flex: 1 === flex: 1 1 0

* BFC 块格式化上下文：

    创建方式：根元素`<html>`、浮动元素、绝对定位元素(absolute/fixed)、overflow(auto/hidden/scroll)、弹性元素、网格元素、行内块元素(inline-block)、display: flow-root(创建一个行为类似于根元素的元素)、表格相关、contain、多列容器。

    作用：阻止元素被浮动元素覆盖、可以包含浮动元素、阻止相邻元素的margin合并。

* const、let与var的区别：

    不存在变量提升、暂时性死区（typeof命令不再安全，可能会报ReferenceError）、不允许重复声明、不会绑定全局对象

* 防抖、节流：

    防抖：事件触发后经过规定时间再执行，规定时间内，多次触发，每次触发导致重新计时；

    ``` js
    function debounce(fn, delay) {
        let timer = null;
        return function (...args) {
            let context = this;
            if(timer) clearTimeout(timer);
            timer = setTimeout(function() {
                fn.apply(context, args);
            }, delay);
        }
    }
    ```

    节流：规定时间内，只执行一次，多次触发不生效，只有规定时间过去执行完毕，才开始下一轮计时；

    ``` js
    function throttle(fn, delay) {
        let flag = true;
        return function (...args) {
            let context = this;
            if (!flag) return;
            flag = false;
            setTimeout(() => {
                fn.apply(context, args);
                flag = true;
            }, delay);
        }
    }
    ```

* 原型及原型链：

    每一个函数都有一个prototype（原型）属性，这个属性是一个指针，指向一个对象，即原型对象。
    所有原型对象都会自动获得一个constructor（构造函数）属性，这个属性是一个指向prototype属性所在函数的指针。

    原型链就是一个原型对象等于另一个类型的实例，层层嵌套。

    ``` js
        Person.prototype.constructor // Person
        p1.constructor // Person

        p1.__proto__ // Person.prototype
        Object.getPrototypeOf(p1) // Person.prototype
        Person.prototype.isPrototypeOf(p1) // true

        Person.__proto__ // Function.prototype
        Object.__proto__ // Function.prototype
        Person.prototype.__proto__ // Object.prototype

        Function.__proto__ // Function.prototype
        typeof Function.prototype // function 唯一，其他原型对象的类型都是对象
        Function.prototype.__proto__ // Object.prototype
        Object.prototype.__proto__ // null 到顶
    ```

* 继承：

    继承的本质是重写原型对象。

    经典继承在子类构造函数内部调用超类构造函数，使用apply()、call()。父类引用类型会在子类创建副本，但方法无法继承。

    伪经典继承将父类实例作为原型对象，使用原型链实现对原型方法的继承，仍在构造函数内调用父类实现对属性的继承。需要两次调用父类构造函数。

    *原型继承，Object.create()。引用类型公用。

    *寄生式继承，将对象赋值给空函数的原型。函数无法复用。

    寄生组合式继承，解决两次调用问题：

    ``` js 
        function inheritPrototype(SubType,SuperType){
            var prototype=Object(SuperType.prototype); // 创建超类原型副本
            prototype.constructor=SubType; // 修正构造函数指向子类
            SubType.prototype=prototype; // 代替了前面的第一次调用SuperType()
        }

        function SuperType(name){
            this.name=name;
            this.colors=['red','blue','green'];
        }
        SuperType.prototype.sayName=function(){
            console.log(this.name);
        }

        function SubType(name,age){
            SuperType.call(this,name); // 继承属性, 二次调用SuperType()
            this.age=age;
        }
        inheritPrototype(SubType,SuperType);
        SubType.prototype.sayAge=function(){
            console.log(this.age);
        }
    ```

    空函数实现：

    ``` js
        var inherit = (function () {
            var F = function () {} // 闭包保留空函数
            return function (C, P) {
                F.prototype = P.prototype;
                C.prototype = new F();
                C.prototype.constructor = C;
            }
        }())
        inherit(Child, Parent)
    ```

    ES6实现：

    ``` js
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
    ```

* 数组降维、去重、排序（从大到小）：

    ``` js
    Array.from(new Set(arr.flat())).sort((a,b)=>a-b).reverse()

    let map = new Map()
    Array.prototype.concat.apply([], arr).filter((item) => !map.has(item) && map.set(item, true)).sort((a,b)=>a-b).reverse()
    ```

* $.ajax、axios、XHR、fetch区别：

    $.ajax 和 axios 是对 XMLHttpRequest 的封装， fetch 是底层API，可以代替XHR。

    $.ajax 是 jQuery 封装的方法；
    axios 是一个基于 Promise 的HTTP库，可以用在浏览器和 node.js 中；
    fetch 只对网络请求报错，对400、500不会 reject，需要封装处理，默认不带cookie，不支持abort，不支持超时控制，无法原生检测请求进度；

* rem、em、%、vh、vw、vm：

    rem：参考根元素font-size；
    em：参考父元素font-size；
    %：参考父元素百分比；
    vh：参考视口高度均分100份；
    vw：参考视口宽度均分100份；
    vm：参考视口宽高中较小值来均分100份

* git add/commit/push 前后的回滚和提交记录变化：

    修改commit：`git commit --amend`

    add前，撤销上一次对文件的操作：`git checkout -- <file>`

    add后commit前：`git reset HEAD <file>`

    commit后push前：`git reset --soft HEAD^`（HEAD^表示上一个版本，同HEAD~1；--soft不删除工作空间改动代码 ，撤销commit不撤销add；--hard删除工作空间改动代码，撤销commit且撤销add；）

    push后：

    `git reset --hard 版本号`(回退到目标记录) ， `git push origin master --force`

    `git revert -n 版本号`(生成新的记录，-n表示--no-commit，如果不带这个参数会自动提交一条commit) ， `git push`

* 类型判断，数组为例：

    ``` js
        typeof null // 'object'
        [].constructor // ƒ Array() { [native code] }
        [] instanceof Array // true 原理是通过原型链查找，只能判断对象类型
        Array.prototype.isPrototypeOf([]) // true
        Object.prototype.toString.call([]).slice(8,-1) // 'Array' 可判断所有基本类型，包括null和undefined
        Array.isArray([]) // true
    ```

* new操作符做了什么：

    1. 创建了一个新的Object的实例；
    2. 实例的__proto__指向构造函数的原型对象；
    3. 实例方法中的this指向实例本身；
    4. 当构造函数return 一个Object/Function/Array/Date/RegExp/Error的实例时，new操作符得到的就是return的结果；

* 实现 Promise.all、Promise.race：

    ``` js
    function myPromiseAll(arr) {
        let len = arr.length

        if(len === 0) return Promise.resolve(arr)

        return new Promise((res, rej) => {
            let count = 0
            let result = []

            for(let i = 0; i < len; i++) {
                arr[i].then(resolve => {
                    result[i] = resolve
                    count++
                    if(count === len) res(result)
                }).catch(e => {
                    rej(e)
                })
            }
        })
    }

    function myPromiseRace(arr) {
        return new Promise((res, rej) => {
            let len = arr.length
            for(let i = 0; i < len; i++) {
                arr[i].then(resolve => {
                     res(resolve)
                }).catch(e => {
                    rej(e)
                })
            }
        })
    }
    ```

* for of、for in、Object.keys：

    for in 以任意顺序迭代一个对象除Symbol以外的可枚举属性，可以遍历对象，拿到属性名，可以遍历数组，拿到下标；

    for of 遍历可迭代对象（包括 Array，Map，Set，String，TypedArray，arguments 对象等等），不能遍历对象，能遍历数组，拿到值；

    Object.keys 返回一个由一个给定对象的自身可枚举属性组成的数组，返回属性名的数组；

* Set/WeakSet/Map/WeakMap的区别：

    Set：任意值，add、delete、has、clear、keys、values、entries；

    WeakSet：任意对象，弱引用，add、delete、has；

    Map：任意键值对，set、get、delete、has、clear、keys、values、entries、forEach；

    WeakMap：属性名必须是对象，弱引用，set、get、delete、has；

* 跨域：

    同源：协议、主机、端口相同，不考虑IP；
    允许跨域加载资源的标签：`<img>、<link>、<script>、<audio>、<video>`；
    请求发出去了，但是响应被浏览器拦截；
    解决方式：CORS跨域资源共享、JSONP、Nginx 反向代理；

    1、CORS

    简单请求/非简单请求，根据是否满足条件：请求方法属于以下三种：GET、POST、HEAD，请求头 Accept、Accept-Language、Content-Language、Content-Type的取值范围属于以下三种，application/x-www-form-urlencoded、multipart/form-data、text/plain。

    简单请求：请求头当中添加Origin，响应头中添加Access-Control-Allow-Origin。

    非简单请求：会增加一次预检OPTIONS请求，判断是否允许跨域；

    2、JSONP，利用`<script>`标签来请求资源，兼容性好，但是仅支持GET方法，不安全，可能会遭受XSS攻击。

    3、Nginx 反向代理，利用同源策略对服务器没有限制

* async/await：

    async 返回一个 Promise，await 后面一般跟一个 Promise，如果跟原始值，会处理成立即 resolve 的 Promise。
    async 函数返回的 Promise 对象，必须等到内部所有的 await 命令的 Promise 对象执行完，才会发生状态改变。

    async 函数内部 return 返回的值，会成为 then 方法回调函数的参数。

    await 的 Promise 出现 reject 状态，会阻塞后面的代码，可以用 try/catch 包裹 await。

* ES6 Moudle：

    export命令：可以输出变量、函数、类（class）；输出的变量可用as关键字重命名；输出是引用；可以出现在模块顶层的任何位置；export default 为模块指定默认输出，仅有一个；

    import命令：接受一对大括号，里面指定导入的变量名；导入的变量可用as关键字重命名；输入的变量都是只读的，但可以改写对象的属性；会提升到整个模块的头部；不能使用表达式和变量等只有在运行时才能得到结果的语法结构；会执行所加载的模块；重复导入不会执行多次；import * 模块整体加载；

    与 CommonJS 模块的差异：

    1. CommonJS 使用require和module.exports，ES6 使用import和export。
    2. CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
    3. CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
    4. CommonJS 的require()命令不能加载 ES6 模块，会报错，只能使用import()这个方法加载。 ES6 模块的import命令可以加载 CommonJS 模块，但是只能整体加载，不能只加载单一的输出项。
    5. CommonJs 是单个值导出，ES6 Module可以导出多个。
    6. CommonJs 是动态语法可以写在判断里，ES6 Module 静态语法只能写在顶层。

* this：

    函数的直接调用者、new、触发事件的对象；

* cdn：

    内容分发网络，依靠部署在各地的边缘服务器，通过中心平台的负载均衡、内容分发、调度等功能模块，使用户就近获取所需内容，降低网络拥塞，提高用户访问响应速度和命中率。

* h5新增特性：

    语义化标签，header、footer、nav、article、section、aside，有利于阅读和维护、有利于SEO搜索引擎识别页面结构、有利于无障碍设备解析；
    表单功能增强，input标签多种类型，如：number 类型，可以设置 min 和 max 属性，password 类型，可以设置 minLength 和 maxLength；
    form表单增强，如：通用属性 placeholder、autofocus；
    视频/音频-video/audio，媒体标签内部可通过 source 标签来进行多种类型的兼容；
    画布 Canvas；
    拖放；
    LocalStorage 和 SessionStorage;
    Web Worker;

* 缓存：

    cookie（document.cookie）：可设置失效时间，默认关闭浏览器失效；可存放4KB左右数据；会携带在HTTP头中；

    localStorage（使用同sessionStorage）：除非被手动清除，否则永久保存；可保存5MB数据；不参与通信，仅存于客户端；同源文档之间共享；

    sessionStorage（sessionStorage.setItem(name,value);、sessionStorage.getItem(name);、sessionStorage.removeItem(name);、 sessionStorage.valueOf();、sessionStorage.属性名、sessionStorage.clear()）：仅在当前会话有效；可保存5MB数据；不参与通信，仅存于客户端；同源文档，且同一个页面会话之间共享；

    浏览器缓存，分为强制缓存和协商缓存，强缓存优先级更高：

    强缓存，响应头的Expires（表示缓存到期时间，是绝对时间）和Cache-Control（通过max-age设置相对时间，单位秒；no-cache：需要进行协商缓存，发送请求到服务器确认是否使用缓存；no-store：禁止缓存，每次都要请求；public：默认设置，客户端和代理服务器都可以缓存；private：不能被多用户共享，客户端可以缓存）。

    协商缓存，从本地缓存获取缓存数据标识，向服务端验证是否失效，未失效返回304"Not Modified"，如果失效返回200和新数据，更新缓存。响应头Last-Modified+请求头if-Modified-Since/if-Unmodified-Since，响应头Etag+请求头If-no-match。

    Ctrl+F5强制刷新，浏览器会删除缓存。

* 箭头函数与普通函数的差异：

    1. 不会创建this，只会从自己的作用域链的上一层继承 this；
    2. 不可以使用 arguments 对象，该对象在函数体内不存在，可以用...args；
    3. 不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数；
    4. 不可以使用 new 命令，因为没有自己的 this，没有 prototype，而 new 命令在执行时需要将构造函数的 prototype 赋值给新的对象的__proto__；

* 闭包和作用域链：

    指有权访问另一个函数作用域中的变量的函数，所有的JavaScript函数都是闭包。

    作用域是在函数定义时决定的，而不是函数调用时决定的。每一段JavaScript代码（全局代码或函数）都有一个与之关联的作用域链。 这个作用域链是一个对象列表或者链表，定义了这段代码“作用域中”的变量。当JavaScript需要查找变量的x的值的时候，它会从作用域链中的第一个对象开始查找， 如果这个对象没有名为x的属性，就会继续查找链上下一个对象，最后到全局作用域，如果全都没有找到就会抛出一个引用错误（ReferenceError）异常。

* 浏览器渲染过程（从url到展示）：

    1. 网络进程查找缓存，没有缓存要先进行DNS解析。如果是HTTPS，要建立TLS连接。通过IP地址建立TCP连接，构建请求行、请求头等信息，添加cookie，发起请求。
    2. 响应为301或302时，从响应头的Location读取重定向的地址，重新发起请求。响应为200，根据Content-Type判断返回类型，HTML格式为text/html。
    3. 准备渲染进程，Chrome 默认为每个页面分配一个渲染进程，但如果从一个页面打开了另一个新页面，而新页面和当前页面属于同一站点（根域名和协议相同）的话，会复用父页面的渲染进程。
    4. 浏览器进程发出“提交请求”消息给渲染进程，渲染进程接收后和网络进程建立传输数据的“管道”，等响应体数据传输完成后，渲染进程返回“确认提交”的消息给浏览器进程，浏览器进程收到后更新浏览器界面状态，包括了安全状态、地址栏的 URL、前进后退的历史状态。
    5. 构建DOM树，从响应体读取HTML原始字节，并指定编码(如UTF-8)转换成字符串， 再将字符串转换成Token，由Token生成节点对象，最后构建DOM树。
    6. 构建CSSOM树，确定下每一个节点的样式。
    7. 构建渲染树，遍历DOM树中的所有可见节点，并把这些节点添加到渲染树，不可见的节点会被忽略掉，如head标签下面的全部内容、样式属性包含dispaly:none的元素等。
    8. 构建分层树，渲染引擎为特定的节点生成专用的图层，并生成一棵对应的图层树。
    9. 把每一个图层的绘制拆分成很多小的绘制指令，并按照顺序组成一个待绘制列表，提交到合成线程。
    10. 合成线程会将图层划分为图块，按照视口附近的图块来优先生成位图。
    11. 合成线程发送绘制图块的命令DrawQuad给浏览器进程，浏览器进程里面有一个叫viz的组件，将内容绘制到内存中，最后显示在屏幕上。

* 回流（重排）、重绘：

    会导致回流的操作：
    首次渲染、浏览器窗口大小改变、元素尺寸或位置改变（边距、填充、边框、宽度和高度）、元素内容变化（文字数量或图片大小等等）、元素字体大小变化、添加或者删除可见的DOM元素、计算 offsetWidth 和 offsetHeight 属性、设置/查询某些属性、调用某些方法：
    + width、height、margin、padding、border
    + display、position、overflow
    + clientWidth、clientHeight、clientTop、clientLeft
    + offsetWidth、offsetHeight、offsetTop、offsetLeft
    + scrollWidth、scrollHeight、scrollTop、scrollLeft
    + scrollIntoView()、scrollIntoViewIfNeeded()
    + getComputedStyle()
    + getBoundingClientRect()
    + scrollTo()

    重绘省去了布局和分层阶段，所以执行效率会比重排操作要高一些。会导致重绘的属性和方法：
    + color、text-decoration、visibility
    + background、background-image、background-position、background-repeat、background-size
    + outline、outline-color、outline-style、outline-radius、outline-width
    + border-style、box-shadow

* CSS GPU 加速：

    浏览器在处理这几个的 css 的时候，会使用 gpu 渲染：transform、opacity、filter、will-change。触发 gpu 渲染会新建一个图层，把该元素样式的计算交给 gpu。gpu 硬件加速能减轻 cpu 压力，使得渲染更流畅，但是也会增加内存的占用，建议只在必要的时候用。

* HTTP：

    HTTP0.9：纯文本格式，只允许用“GET”，没有请求头和请求体，返回内容是以 ASCII 字符流传输，响应后立即关闭连接。

    HTTP1.0：增加了 HEAD、POST 等新方法，增加了响应状态码，引入了协议版本号概念，引入了 HTTP Header 的概念，支持多种类型的文件下载。

    HTTP1.1：正式标准。基于TCP/IP的可靠传输，无状态，不保留通信过程的上下文信息，增加了 PUT、DELETE 等新的方法，增加了缓存管理和控制，允许持久连接，允许响应数据分块（chunked），利于传输大文件，强制要求 Host 头，客户端 Cookie 机制和安全机制。

    缺点：队头阻塞（将同一页面的资源分散到不同域名下，提升连接上限（同域名限制6个））、头部过大、明文传输不安全、不支持服务器推送消息。

    HTTP2：二进制传输，减少传输数据量；Header压缩，"HPACK"算法，在客户端和服务器两端建立"字典"，用索引号表示重复的字符串，采用哈夫曼编码来压缩整数和字符串；多路复用，同域名同一个TCP连接，定义了“流”（Stream）的概念，它是二进制帧的双向传输序列，同一个消息往返的帧会分配一个唯一的流 ID；支持服务器推送，如：提前把可能会用到的JS、CSS文件发给客户端；安全性提高，“事实上”要求加密通信，基于 TLS。

    缺点：TCP 以及 TCP+TLS 建立连接的延时、TCP 丢包重传机制导致队头阻塞。

    HTTP3：QUIC协议，基于 UDP 实现了可靠传输，基本数据传输单位是包和帧，“QPACK”头部压缩算法，没有指定端口号，需要先用HTTP2连接，服务器返回指定端口号。

    HTTPS：HTTP+TLS/SSL，对称加密（数据加密）、非对称加密（身份认证和密钥协商）、散列函数（验证信息完整性），标准端口443；

    + HTTP与HTTPS的区别：
    + HTTPS比HTTP更加安全，对搜索引擎更友好，利于SEO，谷歌、百度优先索引HTTPS网页;
    + HTTPS需要用到SSL证书，而HTTP不用;
    + HTTPS标准端口443，HTTP标准端口80;
    + HTTPS基于传输层，HTTP基于应用层;
    + HTTPS在浏览器显示绿色安全锁，HTTP没有显示;
    + HTTPS普遍认为性能消耗要大于HTTP，因为与纯文本通信相比，加密通信会消耗更多的CPU及内存资源;

    请求头起始行：GET /home HTTP/1.1 方法 + 路径 + http版本
    
    响应头起始行：HTTP/1.1 200 OK http版本 + 状态码 + 原因

    状态码：101 同意升级WebSocket、206 断点续传，body只是原数据的一部分、301 永久重定向、302 临时重定向、304 协商缓存Not Modified、403 无权限、404 Not Found 资源未找到、416 Range请求范围不合法、503 服务器暂时错误稍后重试。

    CSP内容安全策略：添加 Content-Security-Policy HTTP头部到一个页面，并配置相应的值，以控制用户代理（浏览器等）可以为该页面获取哪些资源。

* 事件模型：

    DOM事件流三个阶段：事件捕获阶段、处于目标阶段、事件冒泡阶段。

    dom0级事件处理程序，on+事件，如onclick；dom2级事件处理程序，addEventListener/removeEventListener；ie事件处理程序，attachEvent/detachEvent。

    dom中的事件对象，事件对象的属性：cancelable是否可取消默认行为、currentTarget正在处理事件的那个元素、target事件目标、type事件类型、eventPhase处理阶段1捕获2目标3冒泡。阻止默认行为，dom0级return false，dom0/2级preventDefault()。阻止传播，event.stopPropagation()。

    ie中的事件对象，事件对象的属性：cancelBubble设为true可以取消冒泡、returnValue设为false可以取消默认行为、srcElement事件目标、type事件类型。

* 事件循环：

    宏任务 MacroTask ：Script、setTimeout、setImmediate、setInterval、I/O、UI rendering

    微任务 MicroTask ：Promise、MutationObserver、process.nextTick、Object.observe

* preload/prefetch、defer/async：

    `<link rel="preload" href="./app.js" as="script">`preload提高优先级，优先加载本页资源；
    
    `<link rel="prefetch" href="./vendor-async.js">`prefetch降低优先级，提前加载可能用到的资源；

    `<script src="index.js"></script>`没有 defer 或 async，读到就加载，加载完成就执行；

    `<script defer src="index.js"></script>`defer 属性表示延迟执行，设置了defer的js加载不会阻塞dom构建，即js加载时HTML并未停止解析，这两个过程是并行的，都完成后才会执行；

    `<script async src="index.js"></script>`async 属性表示异步执行，与 defer 的区别在于，如果已经加载好，就会开始执行；

    在加载多个JS脚本的时候，async是无顺序的加载，而defer是有顺序的加载。

* dns预解析：

    通过域名访问站点要做DNS解析，按照浏览器缓存、系统缓存、路由器缓存、ISP(运营商)DNS缓存、根域名服务器、顶级域名服务器、主域名服务器的顺序，逐步读取缓存，直到拿到IP地址。
    DNS Prefetch 是一种 DNS 预解析技术，浏览器会在加载网页时对网页中的域名进行解析并缓存，当用户单击连接时就无需再进行DNS的解析。
    Chromium使用超链接的href属性来查找要预解析的主机名。解析过程与用户浏览网页并行。 为了确保安全性，在HTTPS页面中不会自动解析。

    手动解析：
    ``` html
    <link rel="dns-prefetch" href="http://www.spreadfirefox.com/">

    <meta http-equiv="x-dns-prefetch-control" content="on">
    ```
    禁用隐式dns预解析：
    ``` html
    <meta http-equiv="x-dns-prefetch-control" content="off">
    ```

* 实现深度优先遍历/广度优先遍历（递归和非递归版）：

    ``` js
        var tree = {
            name: '中国',
            children: [
                {
                    name: '北京',
                    children: [
                        {
                            name: '西城区',
                            children: [
                                {
                                    name: '月坛街道',
                                }
                            ]
                        },
                        {
                            name: '海淀区',
                        },
                        {
                            name: '昌平区',
                        },
                    ],
                },
                {
                    name: '浙江省',
                    children: [
                        {
                            name: '杭州市',
                            children: [
                                {
                                    name: '西湖区',
                                }
                            ]
                        },
                        {
                            name: '嘉兴市',
                        },
                        {
                            name: '绍兴市',
                        },
                        {
                            name: '宁波市',
                        },
                    ],
                },
            ],
        }

        // 递归算法
        function dfs(tree){
            console.log(tree.name)
            let children = tree.children
            if(children) {
                for(let i = 0; i < children.length; i++){
                    dfs(tree.children[i])
                }   
            }
        }

        // 深度优先遍历
        function dfs(tree, name){
            let stack = []
            stack.push(tree)
            while(stack.length != 0) {
                let item = stack.pop()
                console.log(item.name)
                let children = item.children
                if(children) {
                    for(let i = children.length - 1; i >= 0; i--){
                        stack.push(children[i])
                    }
                }
            }
        }

        // 广度优先遍历
        function bfs(tree){
            let queue = []
            queue.push(tree)
            while(queue.length != 0) {
                let item = queue.shift()
                console.log(item.name)
                let children = item.children
                if(children){
                    for(let i = 0; i < children.length; i++){
                        queue.push(children[i])
                    }
                }
            }
        }
    ```

* 冒泡、选择、插入、快排：

    ``` js
        // 冒泡排序 O(n²) 稳定
        // 两两比较，大的往后换，一趟完成最后一个最大
        function babelSort(arr) {
            let len = arr.length
            for(let i = len; i > 1; i--) {
                for(let j = 0; j < i-1; j++) {
                    if(arr[j] > arr[j+1]) {
                        [arr[j], arr[j+1]] = [arr[j+1], arr[j]]
                        console.log(arr)
                    }
                }
            }
        }

        // 选择排序 O(n²) 不稳定
        // 从头开始，将第一个元素和其他元素作比较，碰到更小的就交换，一趟完成第一个最小
        function selectSort(arr) {
            let len = arr.length
            for(let i = 0; i < len-1; i++) {
                for(let j = i+1; j < len; j++) {
                    if(arr[i] > arr[j]) {
                        [arr[i], arr[j]] = [arr[j], arr[i]]
                        console.log(arr)
                    }
                }
            }
        }

        // 插入排序 O(n²) 稳定
        // 默认首个为已排序，从第二个开始，往前比较，遇到更大的交换位置，遇到更小的停止（因为前面已排序不必再比），换下个数
        function insertSort(arr) {
            let len = arr.length
            for(let i = 1; i < len; i++) {
                for(let j = i; j > 0; j--) {
                    if(arr[j-1] > arr[j]) {
                        [arr[j-1], arr[j]] = [arr[j], arr[j-1]]
                        console.log(arr)
                    } else {
                        break
                    }
                }
            }
        }

        // 快速排序 O(nlogn) 不稳定
        // 以第一个数为基准，比它大放右边，比它小放左边，递归
        function quickSort(arr) {
            if (arr.length<=1) return arr
            let left = [], right = [], base = arr.shift()
            for(let i = 0; i < arr.length; i++){
                arr[i] < base ? left.push(arr[i]) : right.push(arr[i])
            }
            console.log(base)
            return quickSort(left).concat(base, quickSort(right))
        }
    ```

* 柯里化：

    柯里化指这样的一种函数，它接受一个函数A为参数，返回一个新的函数，新函数能够接受函数A的剩余参数。

    ``` js
        function curry(fn) {
            if(fn.length<=1) return fn; // 原函数无入参，直接返回原函数
            var args1 = Array.prototype.slice.call(arguments, 1);
            return function(...args) {
                var args2 = args1.concat(args);
                return args2.length < fn.length ? curry(fn, ...args2) : fn(...args2);
            }
        }
        var add = (a,b,c) => a+b+c
        var _add = curry(add)
        console.log(_add(1)(2,3)) // 6
        console.log(_add(2)(3)(4)) // 9
    ```

* 实现一个深拷贝，考虑对象相互引用以及Symbol：

    ``` js
        function deepCopy(target, cache = new Set()) {
            if (typeof target !== 'object' || cache.has(target)) {
                return target
            }
            if (Array.isArray(target)) {
                target.map(t => {
                    cache.add(t)
                    return t
                })
            } else {
                return [...Object.keys(target), ...Object.getOwnPropertySymbols(target)].reduce((res, key) => {
                    cache.add(target[key])
                    res[key] = deepCopy(target[key], cache)
                    return res
                }, target.constructor !== Object ? Object.create(target.constructor.prototype) : {})
            }
        }
    ```

* node的应用常见、优缺点：

    Node.js是一个基于V8引擎的服务端JavaScript运行环境。单进程、单线程；事件驱动；非阻塞I/O(遇到I/O创建线程执行)。

    优点：高并发、适合I/O密集型应用。

    缺点：只支持单核CPU，不能充分利用CPU、可靠性低，（由于单进程、单线程）一旦代码某个环节崩溃，整个系统都崩溃（解决方案：1.Nnigx反向代理，负载均衡，开多个进程，绑定多个端口；2.开多个进程监听同一个端口，使用cluster模块）、 开源组件库质量参差不齐，更新快，向下不兼容、Debug不方便，错误没有stack trace。

    应用场景：RESTful API、统一Web应用的UI层、大量Ajax请求的应用。

* sass/less：

    CSS 预处理器，less（变量、混合、嵌套、运算、函数、导入），sass（变量、嵌套、混合）

* 安全问题：

    XSS 跨站脚本攻击，往Web页面里插入恶意可执行网页脚本代码。
    分类：反射型XSS（通过URL传递参数功能）、存储型 XSS（恶意脚本存储在目标服务器上）、DOM 型 XSS（不可信的用户输入）、基于字符集的 XSS（meta 没有指定 charset）、未经验证的跳转 XSS。
    不从URL读取数据直接渲染、对涉及渲染的内容做转义、尽量不使用可执行字符串的方法、尽量使用 .innerText、.textContent、.setAttribute() 等、指定`<meta charset="utf-8">`、对待跳转的 URL 参数做白名单或者某种规则过滤。

    CSRF 跨站请求伪造，诱导点击，冒用身份。
    为每个POST请求增加验证码；为每个用户生成一个唯一的token，用户在提交请求时携带；利用 Samesite Cookie属性。

    点击劫持，指在一个Web页面中隐藏了一个透明的iframe，用外层假页面诱导用户点击。
    X-FRAME-OPTIONS头部字段。

* 设计模式：

    观察者模式，观察者只要订阅了被观察者的事件，那么当被观察者的状态改变时，被观察者会主动去通知观察者，而无需关心观察者得到事件后要去做什么，实际程序中可能是执行订阅者的回调函数。

    代理模式，为对象提供一种代理以控制对这个对象的访问。

    单例模式，调用一个类，任何时候返回的都是同一个实例。

    工厂模式，工厂模式创建对象时不确定具体用哪个创建对象的类，而是定义一个用于创建对象的接口，通过接口决定如何实例化。

    装饰者模式，在不改变对象自身的基础上，在程序运行期间给对象动态的添加属性或方法。

* js基本规范：

    尽量用let和const代替var、用字符串模板而不是 + 来拼接字符串、函数参数优先用...args，而不是arguments、函数参数默认赋值opts = {}，而不是在内部赋值、一个模块只 import 一次、用a || b取代三元表达式、语义化命名，驼峰；

* 浏览器的popstate什么情况下会触发：

    history.pushState()、history.replaceState()不会触发popstate事件，popstate事件只会在浏览器某些行为下触发，比如点击后退、前进，调用history.back()、history.forward()、history.go()

* css样式隔离的几种方案及其优缺点：

    1. BEM，模块名 + 元素名 + 修饰器名的命名方法论，.block__element--modifier，如.dropdown-menu__item--active。优点：可读性好；缺点：命名太长，依赖人为约定容易出错；
    2. CSS modules，在构建步骤中对CSS类名和选择器限定作用域，依赖webpack css-loader，为每个局部样式名编译为哈希字符串，全局样式可以使用:global。优点：学习成本低，避免人工约束；缺点：没有变量，hash导致debug不方便；
    3. CSS in JS，一种设计模式，它的核心思想是把CSS直接写到各自组件中，有很多库，通过唯一CSS选择器或者行内样式解决。优点：没有无用的CSS样式堆积问题；缺点：学习成本高，可读性差，由于动态生成css，造成运行时消耗；
    4. CSS 预处理器，利用嵌套。优点：可读性好；缺点：依赖人为约定容易出错，需要编译；
    5. Shadow DOM，优点：浏览器原生支持；缺点：浏览器兼容问题，只对一定范围内的dom结构起作用；
    6. vue scoped，优点：简单；缺点：只适用于vue；

* 前端优化：

    1. 减少回流、重绘（css：使用 transform 替代 top；使用 visibility 替换 display: none；避免使用 table 布局；避免设置节点层级过多的样式，CSS 选择符从右往左匹配查找；js：避免频繁操作样式和DOM；避免频繁读取会引发回流/重绘的属性；）

    2. 首屏加载优化：webpack 分离打包（optimization.splitChunks）、mini-xss-extract-plugin（提取CSS到单独的文件, 并使用optimize-css-assets-webpack-plugin来压缩CSS文件）、uglifyjs-webpack-plugin、懒加载（import()）、缓存、图片压缩、雪碧图、cdn、gizp、link标签的preload（提高优先级，优先加载本页资源）/prefetch（降低优先级，提前加载可能用到的资源）

    3. 其他性能优化：js压缩（terser-webpack-plugin）、css压缩（css-minimizer-webpack-plugin）、删除无用css（purgecss-webpack-plugin）、图片压缩（image-webpack-loader）

#### webpack

* 提高构建速度：

    resolve 配置（alias配置别名简化模块引用、extensions配置解析文件格式、modules配置解析模块时应该搜索的目录）、externals配置从输出的 bundle 中排除依赖、module.rules配置include和exclude，指定 loader 的作用目录或者需要排除的目录、module.noParse配置不需要解析依赖的第三方大型类库、IgnorePlugin防止在 import 或 require 调用时，生成正则表达式匹配的模块、多进程配置、babel-loader 开启缓存，其他loader可以用cache-loader、cache 缓存生成的 webpack 模块和 chunk。

* 基础配置：

    mode、devtool、entry、output、resolve(alias、extensions)、module.rules(babel-loader、style-loader、css-loader、less-loader、sass-loader、url-loader)、plugins(html-webpack-plugin、mini-css-extract-plugin)

* 构建流程：

    1. 从配置文件和Shell语句中读取与合并参数，根据参数初始化compiler对象，加载插件

    2. 执行compiler对象的run方法开始执行编译，每一次新的编译都会实例化一个compilation对象，记录本次编译的基本信息，进入make hook（生成modules）

    3. 通过compilation.addEntry，找到配置中的entry找出所有的入口文件，从入口文件出发，递归找出依赖的依赖

    4. 通过loader将依赖转换成标准的js，通过Parser.parse再转换成AST，解析成AST最大作用就是收集模块依赖关系，webpack会遍历AST对象将依赖记录在module.dependencies，最后遍历module.dependencies解析依赖生成module，make阶段结束，得到项目所依赖的所有modules

    5. 执行compilation.seal方法生成chunks，把entry中对应的每个module都生成一个新的chunk，遍历module.dependencies，将其依赖的模块也加入到上一步生成的chunk中，若某个module是动态引入的，为其创建一个新的chunk，接着遍历依赖

    6. 遍历chunk，生成源码，调用emitAsset将其存在compilation.assets（最终的文件列表），compilation.seal结束，compilation结束

    7. 进入emit hook，这是修改最终文件的最后一个机会

    8. 遍历 compilation.assets 生成所有文件，然后触发钩子done，结束构建流程。

    简单地说：

    1. 读取与合并配置参数，加载 Plugin，实例化 Compiler

    2. 从 Entry 出发，用 Loader 翻译每个Module，递归地进行编译处理并得到依赖关系

    3. 将编译后的 Module 组合成 Chunk，将 Chunk 转换成文件，输出到文件系统中

* babel原理：

    1. 解析，从代码=>AST语法树，分为词法分析（代码字符串=>tokens）、语法分析阶段（tokens=>AST）。
    2. 转换，遍历AST，对节点进行增删改。
    3. 生成，AST=>代码字符串。

    Babel 的预设（preset）可以被看作是一组 Babel 插件和/或 options 配置的可共享模块。

* tree-shaking原理：

    Tree-shaking 的本质是消除无用的js代码。Tree-shaking原理依赖于ES6的模块特性。ES6模块依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析，这就是tree-shaking的基础。所谓静态分析就是不执行代码，从字面量上对代码进行分析，ES6之前的模块化，比如我们可以动态require一个模块，只有执行后才知道引用的什么模块，这个就不能通过静态分析去做优化。

* 热更新原理：

    1. 使用express启动本地服务，将websocket客户端代码塞进打包结果，用websocket连接浏览器；
    2. 监听源文件的变化，触发重新编译，生成新的hash值（用于下一次打包结果命名）、json文件、js文件，通过websocket发送最新hash给浏览器；
    3. 客户端对比，走缓存或发起ajax请求json文件，通过JSONP方式请求js文件（JSONP获取的代码可以直接执行，以进行热更新）；

#### 框架

* vue和react不同：

    + 监听数据变化的实现原理不同：Vue 通过 getter/setter 以及一些函数的劫持，能精确知道数据变化，不需要特别的优化就能达到很好的性能。React 默认是通过比较引用的方式进行的。

    + 数据流：Vue 组件与DOM之间可以通过 v-model 双向绑定。 react 组件=>Dom单向数据流，使用onChange/setState()。

    + 组件通信：Vue props/event，provide/inject跨越层级。React props传递数据和回调，context跨越层级。

    + 渲染方式不同：React是在组件中通过原生JS实现模板中的常见语法，比如插值，条件，循环等。Vue是在template模板中，通过指令比如v-if、v-for来实现。

* vue和react设计思想：

    vue的整体思想仍然是拥抱经典的html(结构)+css(表现)+js(行为)的形式，vue鼓励开发者使用template模板，并提供指令供开发者使用(v-if、v-show、v-for等等)，因此在开发vue应用的时候会有一种在写经典web应用（结构、表现、行为分离）的感觉。对组件数据做到了更细致的监听，精准实现组件级别的更新。

    react整体上是函数式的思想，组件使用jsx语法，all in js，将html与css全都融入javaScript，jsx语法相对来说更加灵活。 当组件调用setState或props变化的时候，组件内部render会重新渲染。

* vuex和redux区别：

    从使用上来说：
    Vuex 中 mutaion 是改变 state 的唯一途径，可以使用 commit-mutations 和 dispatch-actions 提交更新，actions 支持异步；通过 mapState 辅助函数将 state 作为计算属性访问， 或者直接通过 this.$store.state 来读取数据。
    Redux 中用 Reducer（纯函数，根据 action 和旧 state 计算出新的 state） 实现替换 state，dispatch(action) => reducer(state, action)。

    从实现原理上来说，最大的区别是两点：
    Redux 使用的是不可变数据，而Vuex的数据是可变的。Redux每次都是用新的state替换旧的state，而Vuex是直接修改。Redux 在检测数据变化的时候，是通过 diff 的方式比较差异的，而Vuex其实和Vue的原理一样，是通过 getter/setter。

* MVVM：

    View 层，视图层，用户界面，由 HTML 和 CSS 来构建。

    Model 层，指数据模型，泛指后端进行的各种业务逻辑处理和数据操控，主要围绕数据库系统展开。

    ViewModel 层，由前端开发人员组织生成和维护的视图数据层。
    前端对从后端获取的 Model 数据进行转换处理，做二次封装，以生成符合 View 层使用预期的视图数据模型。
    需要注意的是 ViewModel 所封装出来的数据模型包括视图的状态和行为两部分，而 Model 层的数据模型是只包含状态的，比如页面的这一块展示什么，那一块展示什么这些都属于视图状态（展示），而页面加载进来时发生什么，点击这一块发生什么，这一块滚动时发生什么这些都属于视图行为（交互），视图状态和行为都封装在了 ViewModel 里。这样的封装使得 ViewModel 可以完整地去描述 View 层。
    由于实现了双向绑定，ViewModel 的内容会实时展现在 View 层，前端不必操纵 DOM 去更新视图，MVVM 框架已经把最脏最累的一块做好了，开发者只需处理和维护 ViewModel，更新数据视图就会自动得到相应更新，真正实现数据驱动开发。
    View 层展现的不是 Model 层的数据，而是 ViewModel 的数据，由 ViewModel 负责与 Model 层交互，这就完全解耦了 View 层和 Model 层，这个解耦是至关重要的，它是前后端分离方案实施的重要一环。

##### Vue

* 响应式原理：

    data对象，有一个__ob__属性，对应一个Observer实例，Observer实例会重写data上的每一个属性，并通过闭包保存每个属性各自的dep数组， 而每一个dep数组，收集了这个属性的所有Watcher观察者实例，而每一个观察者实例各自有一个deps依赖集，反向收集闭包的dep。

* 为什么vue3响应式用proxy代替Object.defineProperty：

    Object.defineProperty 无法监控数组下标的变化，导致通过数组下标添加元素，不能实时响应；只能劫持对象的属性，需要遍历每个属性，如果嵌套，需要深度遍历。
    Proxy 可以劫持整个对象，并返回一个新的对象；不仅可以代理对象，还可以代理数组；可以代理动态增加的属性。

* 响应后如何更新页面：

    渲染Watcher执行`update->run->get`，调用了`vm._update->vm.__patch__->patch`。
    节点相同判断通过sameVnode方法。

    patch：
    + 新节点不存在，则销毁旧节点，结束patch；
    + 旧节点不存在，则创建新节点；
    + 旧节点存在且新旧相同，进行patchVnode；
    + 旧节点存在且新旧不同，创建新节点；

    patchVnode：
    + 新节点有文本节点，且与旧文本节点不同，则替换文本；
    + 新节点不存在文本节点：
    + 都有子节点且子节点不同，进行updateChildren；
    + 仅新节点有子节点，增加节点；
    + 仅旧节点有子节点，删除节点；
    + 均无子节点，清空文本；

    updateChildren：
    + 首首、尾尾、首尾、尾首比较；
    + 上述四种不匹配，则查找相同key，没找到则新增节点；
    + 找到相同key但节点不同，则新增节点；
    + 找到相同key但节点相同，则移动；
    + 直到新节点列表或旧节点列表有一个遍历完，对多余的旧节点进行删除，新节点进行增加；

* 生命周期：

    beforeCreate => created 这个阶段进行数据观测，created可以拿到$data

    beforeMount => mounted 这个阶段从 `{{message}} => 真实内容`，添加$el

    beforeUpdate => updated

    beforeUnmount => unmounted

    activated => deactivated

* 父子组件生命周期执行顺序：

    加载渲染：父beforeCreate -> 父created -> 父beforeMount -> 子beforeCreate -> 子created -> 子beforeMount -> 子mounted -> 父mounted

    更新：父beforeUpdate -> 子beforeUpdate -> 子updated -> 父updated

    销毁：父beforeDestroy -> 子beforeDestroy -> 子destroyed -> 父destroyed

* computed 和 watch 的区别：

    需要经过计算获取值，可以使用computed，需要在值发生变化的时候执行回调则用watch。计算属性的结果会被缓存，除非依赖的响应式 property 变化才会重新计算。

    computed本质是在vue实例上定义一个计算属性同名属性，我们设置的computed的方法是这个属性的get方法，而watch设置的方法是watcher实例的callback回调。

* v-if/v-show区别：

    v-if 会重新渲染和销毁，v-show 只是样式层面的隐藏。从开闭的频率和初始化两方面考虑该采用哪个。

* vue-router有哪些钩子：

    全局守卫（beforeEach、beforeResolve、afterEach）、路由独享的守卫（beforeEnter）、组件内的守卫（beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave）

* vuex 原理：

    通过applyMixin方法，在vue的beforeCreate生命周期混入一个vuexInit方法，通过该方法初始化或从父组件拿$store，保证全局共用一个store。 Vuex内部新建一个Vue实例vm，通过vm响应式地注册state，并将状态管理的getters注册到vm的computed上。

* vue computed 原理：

    假设有一个vue实例vm，vm.data上有一个A属性，vm.computed上有一个A'计算属性，值为function(){return this.A}。

    + 那么A在initData方法中会生产一个观察者实例watcher a，A'在initComputed方法中会生产一个观察者实例watcher a'。

    + 第一次调用vm.computed.A'时：触发A'的get，由于a'.dirty默认为true，调用a'.evaluate=>a'.get(在这里将Dep.target设为a')=>调用a'.getter，即function(){return this.A}，触发了A.get。

    在A.get中，由于Dep.target指向a'，调用了A的闭包中的dep的depend方法，dep.depent调用了Dep.target也就是a'的addDep，a'.addDep又触发了dep.addSub， 总的来说，这一步完成了双方的观察者和依赖的收集。

    A.get执行完，回到a'.get，将Dep.target设为null，回到a'.evaluate，将a'.dirty设为false。

    + 第二次调用vm.computed.A'时，由于a'.dirty为false，直接返回缓存的a'.value。

    + 当A被更改时，触发A的set，调用dep.notify，会调用a'.update，在update中a'.dirty将重置为true，下一次获取A'时就会重新调用a'.evaluate了。

* vue3 diff：

    + 首首查找相同的节点，遇到不同停止
    + 尾尾查找相同的节点，遇到不同停止
    + 如果新节点遍历完，删除多余旧节点
    + 如果旧节点遍历完，新增多余新节点
    + 构建可复用节点的最长递增子序列
    + 遍历新节点，没有可复用旧节点则新增，否则判断是否在最长递增子序列中，在则跳过， 不在则移动

##### React

* setState:

    1、由 React 控制的事件处理程序，以及生命周期函数调用 setState 不会同步更新 state。

    2、React 控制之外的事件中调用 setState 是同步更新的。比如原生 js 绑定的事件，setTimeout/setInterval 等。

* hooks：

    无状态组件没有state和逻辑难以复用问题

    ``` js
        const useFetchApi = <T, K>(
            fetch: (param?: T) => Promise<K>,
            { reqData, resData }: IOption<T, K>,
        ): {
            data: K
            loading: boolean
            run: (param: T) => void
        } => {
            const [data, setData] = useState<K>(resData)
            const [loading, setLoading] = useState<boolean>(false)
            const [params, setParams] = useState<T>(reqData)

            useEffect(() => {
                const func = async () => {
                    setLoading(true)
                    const res = await fetch(params)
                    setLoading(false)
                    setData(res)
                }
                func()
            }, [fetch, params])

            const run = (newParams: T) => {
                setParams({ ...newParams })
            }

            return {
                data,
                loading,
                run,
            }
        }
    ```

* 生命周期：

    挂载：constructor（初始化state或为事件处理函数绑定实例，不能使用setState） => getDerivedStateFromProps（可以比较新的props和旧的state来加一些限制条件，防止无用的state更新，静态函数，不能使用this） => render（不能使用setState） => componentDidMount（发送网络请求、启用事件监听方法等）

    更新：getDerivedStateFromProps => shouldComponentUpdate（返回布尔值，控制组件是否进行更新，不能使用setState） => render => getSnapshotBeforeUpdate（真正挂载前调用，返回值会传给componentDidUpdate） => componentDidUpdate（首次渲染不执行）

    卸载：componentWillUnmount

* 父子组件生命周期执行顺序：

    加载渲染：父constructor -> 父getDerivedStateFromProps -> 父render -> 子constructor -> 子getDerivedStateFromProps -> 子render -> 子componentDidMount -> 父componentDidMount

    更新：父getDerivedStateFromProps -> 父shouldComponentUpdate -> 父render -> 子getDerivedStateFromProps -> 子shouldComponentUpdate -> 子render -> 子getSnapshotBeforeUpdate -> 父getSnapshotBeforeUpdate -> 子componentDidUpdate -> 父componentDidUpdate

* fiber：

    fiber是协程，使得 React 渲染的过程可以被中断，可以将控制权交回浏览器，让位给高优先级的任务，浏览器空闲后再恢复渲染。

    三层含义：
    1. 作为架构来说，在旧的架构中，Reconciler（协调器）采用递归的方式执行，无法中断，节点数据保存在递归的调用栈中，被称为 Stack Reconciler；在新的架构中，Reconciler（协调器）是基于fiber实现的，节点数据保存在fiber中，所以被称为 fiber Reconciler。
    2. 作为静态数据结构来说，每个fiber对应一个组件，保存了这个组件的类型对应的dom节点信息，这个时候，fiber节点就是我们所说的虚拟DOM。
    3. 作为动态工作单元来说，fiber节点保存了该节点需要更新的状态，以及需要执行的副作用。

    React 目前的做法是使用链表, 每个 VirtualDOM 节点内部现在使用 Fiber 表示。因为使用了链表结构，即使处理流程被中断了，我们随时可以从上次未处理完的Fiber继续遍历下去。

    每次渲染有两个阶段：Reconciliation(协调阶段) 和 Commit(提交阶段)。

    协调阶段: 可以认为是 Diff 阶段, 这个阶段可以被中断, 这个阶段会找出所有节点变更，例如节点新增、删除、属性变更等等, 这些变更 React 称之为'副作用(Effect)'。以下生命周期钩子会在协调阶段被调用：constructor、componentWillMount 废弃、componentWillReceiveProps 废弃、static getDerivedStateFromProps、shouldComponentUpdate、componentWillUpdate 废弃、render。

    提交阶段: 将上一个阶段计算出来的需要处理的副作用(Effects)一次性执行了。这个阶段必须同步执行，不能被打断. 这些生命周期钩子在提交阶段被执行:getSnapshotBeforeUpdate() 严格来说，这个是在进入 commit 阶段前调用、componentDidMount、componentDidUpdate、componentWillUnmount。

    在协调阶段如果时间片用完，React就会选择让出控制权。因此 React 协调阶段的生命周期钩子可能会被调用多次。所以建议协调阶段的生命周期钩子不要包含副作用，React 就废弃了这部分可能包含副作用的生命周期。

    React 在 Reconciliation（diff） 过程中会构建一颗新的树(官方称为workInProgress tree，WIP树)，可以认为是一颗表示当前工作进度的树。还有一颗表示已渲染界面的旧树，React就是一边和旧树比对，一边构建WIP树的。

    WIP 树类似一个缓冲机制，在Reconciliation 完毕后一次性提交给浏览器进行渲染。它可以减少内存分配和垃圾回收，WIP 的节点不完全是新的，比如某颗子树不需要变动，React会克隆复用旧树中的子树。还有另外一个重要的场景就是异常的处理，比如当一个节点抛出异常，仍然可以继续沿用旧树的节点，避免整棵树挂掉。

    好处：
    + 快速响应用户操作和输入，提升用户交互体验
    + 让动画更加流畅，通过调度，可以让应用保持高帧率
    + 利用好I/O 操作空闲期或者CPU空闲期，进行一些预渲染。 比如离屏(offscreen)不可见的内容，优先级最低，可以让 React 等到CPU空闲时才去渲染这部分内容。
    + 用Suspense 降低加载状态(load state)的优先级，减少闪屏。 比如数据很快返回时，可以不必显示加载状态，而是直接显示出来，避免闪屏；如果超时没有返回才显式加载状态。

* redux工作流程：

    View 发起 dispatch Action，store 调用 Reducer 收到旧 state 和 Action，返回新的 state，View 更新。

* react 18 有哪些更新：

    多个setState批量更新只渲染一次、用flushSync退出批量更新（flushSync内部仍为批量更新）、去掉了对IE浏览器的支持、空组件支持返回undefined、useId API。

* react 设计思想：

    组件化、数据驱动视图、虚拟DOM

* 为什么没有使用react，也要在顶部import React from "react"：

    只要使用了jsx，就需要引用react，因为jsx本质就是React.createElement的语法糖。jsx需要经过编译。

* 为什么React自定义组件首字母要大写：

    jsx通过babel转义时，调用了React.createElement函数，它接收三个参数，分别是type元素类型，props元素属性，children子元素。如果组件首字母为小写，会被当成字符串作为type传递，在创建虚拟DOM的时候，就会把它当成一个html标签，而html没有这个标签，就会报错。组件首字母为大写，它会当成一个变量进行传递，React知道它是个自定义组件就不会报错。

* React组件为什么不能返回多个元素：

    React组件最后会编译为render函数，函数的返回值只能是一个。

* React中元素和组件的区别：

    react组件有类组件、函数组件；react元素是通过jsx创建的，`const element = <div className="element">我是元素</div>`

* React中数据流通：

    props、回调、子组件向父组件的事件冒泡、ref、Context、Redux

* React事件机制：

    合成事件：React基于浏览器的事件机制实现了一套自身的事件机制，在底层磨平不同浏览器的差异，实现了对所有事件的中心化管控，引入事件池。虽然合成事件不是原生DOM事件，但它包含了原生DOM事件的引用，可以通过e.nativeEvent访问。React所有的事件绑定在container上(react17以后)，而不是绑定在DOM元素上（作用：减少内存开销，所有的事件处理都在container上，其他节点没有绑定事件）。React自身实现了一套冒泡机制，不能通过return false阻止冒泡。

    ``` js
    // React事件到原生事件的映射
    {
        onBlur: ['blur'],
        onClick: ['click'],
        onClickCapture: ['click'],
        onChange: ['blur', 'change', 'click', 'focus', 'input', 'keydown', 'keyup', 'selectionchange'],
        onMouseEnter: ['mouseout', 'mouseover'],
        onMouseLeave: ['mouseout', 'mouseover'],
    }
    ```

    React怎么阻止事件冒泡：阻止合成事件的冒泡用e.stopPropagation()；阻止合成事件和最外层document事件冒泡，使用e.nativeEvent.stopImmediatePropogation()。

* useEffect 和 useLayoutEffect：

    useEffect 是下一个宏任务，渲染完成后，执行一些副作用操作。useLayoutEffect 在当前宏任务中执行，会阻塞渲染，可以解决一些页面闪烁问题。

* React 性能优化：

    React.memo、避免使用匿名函数，使用useCallback、懒加载（React.lazy 和 React.Suspense）、useMemo、遍历展示视图时使用key。

* redux、react-redux、@reduxjs/toolkit：

    Redux 和 React 之间没有关系，Redux 支持 React、Angular、Ember、jQuery 甚至纯 JavaScript。

    react-redux 是一个 react 插件库，从 redux 封装而来，提供`<Provider store={store}>`、`connect(mapStateToprops,mapDispatchToProps)(OurComponent)`、mapStateToprops、mapDispatchToProps，不需要在每一个组件中引入store，并手动监听store变化。

    @reduxjs/toolkit 是对 Redux 的二次封装，使得创建store、更新store等更简单。