## 简单实现vue响应式原理

> 本篇只是简单的实现一个vue响应式demo，并未对源码做解读。

### 想要的效果

``` html
<div id="app">
    <input type="text" v-model="text"> {{text}}
</div>
```

``` js
var vm = new Vue({
    el: 'app',
    data: {
        text: 'hello world',
    }
});
```

<img :src="$withBase('/imgs/vue/responsive/demo.png')" alt="效果">

右侧的文本内容会随着输入框的内容及时改变。

### 实现思路

我们可以先通过这篇文章（[Javascript常用的设计模式详解](https://www.cnblogs.com/tugenhua0707/p/5198407.html#_labe8)）了解一下发布-订阅模式。

> 发布---订阅模式又叫观察者模式，它定义了对象间的一种一对多的关系，让多个观察者对象同时监听某一个主题对象，当一个对象发生改变时，所有依赖于它的对象都将得到通知。

我们将对 data 对象的每一个属性，都使用发布-订阅模式。

每个属性都将有一个 Dep 对象，Dep 对象上有一个 subs 数组，用于存储所有的观察者 Watcher。

每一个 Watcher 对象有一个 update 方法，用于更新视图。

我们将通过[Object.defineProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)方法，
重写getter和setter，来分变实现观察者的收集和发布功能。

### 实现

1. Vue构造函数

``` js
function Vue(option) {
    this.data = option.data;    // {text:"..."}

    // 遍历每一个属性，建立发布-订阅模式
    observe(this.data, this);    // {text:"..."},Vue实例

    // 遍历每一个dom节点，初始化每一个观察者
    var id = option.el;     // "app"
    var dom = nodeToFragment(document.getElementById(id), this);    // "#app",Vue实例

    // 编译完成后,dom返回到app
    document.getElementById(id).appendChild(dom)    // 更新dom节点
}
```

2. Dep构造函数

``` js
function Dep() {
    this.subs = []; // 用于存储每一个观察者
}

Dep.prototype = {
    // 添加观察者
    addSub: function (sub) {
        this.subs.push(sub);
    },
    // 发布，通知每一个观察者
    notify: function () {
        this.subs.forEach(function (sub) {
            sub.update();   // 即调用每个Watcher的update方法来达到更新视图的目的
        })
    }
}
```

3. observe方法

``` js
function observe(obj, vm) { // data对象 {text:"..."}, Vue实例
    // 遍历每一个属性，调用defineReactive方法
    Object.keys(obj).forEach(function (key) {
        defineReactive(vm, key, obj[key]);  // Vue实例,属性名 text, 属性值 "hello world"
    });
}
```

4. defineReactive方法

``` js
function defineReactive(obj, key, val) {    // Vue实例, 属性名 text, 属性值 "hello world"
    var dep = new Dep();// 一个属性对应的观察者数组，对应当前属性文档中所有需要响应的节点

    // 重写getter和setter
    Object.defineProperty(obj, key, {
        get: function () {
            // console.log(Dep.target) // Watcher
            if (Dep.target) dep.addSub(Dep.target); // Dep.target属性用于当实例化Watcher并初始化dom节点时，收集该观察者
            return val
        },
        set: function (newVal) {
            if (newVal === val) return
            val = newVal;
            // 属性值每次更新时发布通知
            dep.notify();
        }
    })
}
```

5. Watcher构造函数

``` js
function Watcher(vm, node, name) {  // Vue实例,文本节点,text
    Dep.target = this;  // Watcher
    this.name = name;   // 属性名
    this.node = node;   // 节点
    this.vm = vm;       // Vue实例
    this.update();      // 初始化文本节点的nodeValue
    Dep.target = null;  // 初始化之后销毁
}

Watcher.prototype = {
    // 更新当前节点视图
    update: function () {
        this.get();
        this.node.nodeValue = this.value;
    },
    // 获取vue实例data对象相应的属性值
    get: function () {
        this.value = this.vm[this.name]; // this.vm[this.name]会触发第四步定义的getter，当Dep.target存在时就会收集观察者
    }
}
```

6. nodeToFragment方法

[Document.createDocumentFragment()](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createDocumentFragment)

[Node.appendChild](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/appendChild)

``` js
function nodeToFragment(node, vm) { // vue实例绑定的dom节点 "#app", Vue实例
    var flag = document.createDocumentFragment(); // 创建一个新的空白的文档片段作为容器
    var child;

    while (child = node.firstChild) {   // while遍历每一个子节点
        complie(child, vm); // 编译子节点
        flag.appendChild(child);    // appendChild 从原父节点移除该子节点后再添加到容器下
    }

    return flag
}
```

7. complie方法

``` js
function complie(node, vm) {    // 节点, Vue实例
    // 节点类型为元素
    if (node.nodeType === 1) {
        var attr = node.attributes; // 获取元素节点所有属性
        for (var i = 0; i < attr.length; i++) {
            if (attr[i].nodeName === 'v-model') { // 匹配到'v-model'
                var name = attr[i].nodeValue;   // 获取'v-model'绑定的属性名text
                node.addEventListener('input', function (e) { // 绑定input事件
                    // 给相应的data属性赋值，进而触发该属性的setter，进行发布
                    vm[name] = e.target.value;
                })
                node.value = vm.data[name]; // 初始化元素节点 input 的值
                node.removeAttribute('v-model') // 移除input的v-model属性
            }
        }
        return
    }
    var reg = /\{\{(.*)\}\}/    // 定义正则，用于匹配 {{...}}
    // 节点类型为文本
    if (node.nodeType === 3) {
        var str = node.nodeValue.trim(); // 删除字符串的头尾空白符
        if (reg.test(str)) {
            var name = RegExp.$1;   // 属性名 text
            new Watcher(vm, node, name);    // 实例化观察者对象，传入（Vue实例, 文本节点, 属性名text）
        }
        return
    }
}
```

##### 注：

> 这个实现还是很粗糙的，有太多场景没有考虑，更完善的可以看看源码分析这篇[阅读源码vue响应式原理](https://jiuto.github.io/jiuto_blog/guide/vue/initData.html)。
