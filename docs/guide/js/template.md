## 模板引擎原理

### 概念

> 什么是模板引擎，说的简单点，就是一个字符串中有几个变量待定，通过模板引擎函数把数据塞进去，例如：

``` js
var TemplateEngine = function(tpl, data) {
    // 模板引擎函数
}
var template = 'Hello, my name is <%name%>. I\\'m <%age%> years old.';
console.log(TemplateEngine(template, {
    name: "Jiuto",
    age: 25
}));
```

我们将会得到"Hello, my name is Jiuto. I'm 25 years old."

### 实现

#### 通过正则匹配模板中的变量

匹配变量`<%...%>`的格式，我们声明一个正则表达式`/<%([^%>]+)?%>/g`。
即，全局匹配以`<%`开头，`%>`结尾，`[^%>]+`为匹配非`%>`字符集一次或多次，`()?`为匹配子表达式零次或一次。

正则匹配，我们使用[RegExp.prototype.exec()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec)方法

``` js
var template = "Hello, my name is <%name%>. I\\'m <%age%> years old.";
var reg = /<%([^%>]+)?%>/g;
while(match = reg.exec(template)) {
    console.log(match);
}
```

<img :src="$withBase('/imgs/js/template/reg.png')" alt="通过正则匹配模板中的变量">

此时的模板引擎函数可以写成：

``` js
var TemplateEngine = function(tpl, data) {
    var reg = /<%([^%>]+)?%>/g, match;
    while(match = reg.exec(tpl)) {
        tpl = tpl.replace(match[0], data[match[1]])
    }
    return tpl;
}
```

#### 发现问题及解决

1. 当变量像下面这样需要取对象的属性时就取不到了

``` js
var tpl = "Hello, my name is <%name%>. I\\'m <%profile.age%> years old.";
var data = {
    name: "Jiuto",
    profile: { age: 25 }
}
TemplateEngine(tpl,data);
```

我们会得到："Hello, my name is Jiuto. I\'m undefined years old."

我们可以将模板改成这样："Hello, my name is <%this.name%>. I\\'m <%this.profile.age%> years old."

同时，希望模板引擎这样返回：`return "Hello, my name is " + this.name + ". I\\'m " + this.profile.age + " years old.";`

那么如何传参？

如何执行`this.profile.age`？

2. 当模板中含有可执行js语句（如if-else、for、switch-case、break等等）时

``` js
var template = 
'My skills:' + 
'<%for(var index in this.skills) {%>' + 
'<%this.skills[index]%>' +
'<%}%>';
```

这时候，我们可以通过解析模板，构造一个可执行函数来执行这些js语句，最后返回这个可执行函数的返回结果：

``` js
let fun = function() {
    let str = 'My skills:'
    for(let key in this.skills) {
        str += this.skills[key]
    }
    return str
}
return fun()
```

另外，我们可以通过数组来存储模板片段

``` js
let fun = function() {
    var r = [];
    r.push('My skills:'); 
    for(let key in this.skills) {
        r.push(this.skills[key]);
    }
    return r.join('');
}
return fun()
```

3. 如何识别js语句

使用正则表达式`/(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g`：
g表示全局匹配，第一个子表达式，以零个或一个空格开头，后面是if/for/else/switch/case/break/{/}中的某一个表达式，第二个子表达为非换行符`\n`的零个或多个字符构成的子表达式匹配零次或一次。

正则匹配使用[String.prototype.match()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/match)方法

``` js
var regExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g;
line.match(regExp)
```

4. 关于如何传参，如何执行`this.profile.age`的问题

利用Function构造函数来解决这个问题

``` js
let code = 'var r=[];' + 
'r.push("My skills:");' + 
'for(let key in this.skills) {' + 
'r.push(this.skills[key]);' + 
'}' + 
'return r.join("");'
let rtn = new Function(code).apply({
    skills: {
        skill1: 'js',
        skill2: 'html'
    }
});
console.log(rtn)
```

得到结果：My skills:jshtml

#### 最终实现

``` js
var TemplateEngine = function(html, options) {
    var reg = /<%([^%>]+)?%>/g, // 匹配模板语句
        regExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,  // 匹配js执行语句
        code = 'var r=[];\n', // 初始化执行函数的code
        cursor = 0, // 模板语句匹配的初始下标
        match; // 模板语句匹配结果

    // add 函数用于增加执行函数的内容code
    // js为true表示这是经过reg匹配到的模板语句，
    // 需要通过regExp进一步匹配是否为js执行语句，或是变量
    // add函数返回函数add所以可以一直调用
    var add = function(line, js) {
        js? (code += line.match(regExp) ? line + '\n' : 'r.push(' + line + ');\n') :
            (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
        return add;
    }
    // 循环匹配模板语句
    while(match = reg.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length; // 设置下个循环匹配的初始下标
    }
    // 增加剩余没有模板语句的内容
    add(html.substr(cursor, html.length - cursor));
    // 对执行函数中的数组添加拼接语句
    code += 'return r.join("");';
    // 传入options作为执行函数的this，调用执行函数并返回执行结果
    return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
}
```

##### 测试

<img :src="$withBase('/imgs/js/template/test.png')" alt="测试">

### 参考

[JavaScript template engine in just 20 lines](https://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line)

[JavaScript模板引擎原理，几行代码的事儿](https://www.cnblogs.com/hustskyking/p/principle-of-javascript-template.html)
