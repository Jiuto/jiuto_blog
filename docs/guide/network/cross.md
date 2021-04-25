## 跨域

### 什么是跨域

URI格式：

`scheme://`+`user:passwd@`+`host:port`+`path`+`?query`+`#fragment`

浏览器遵循同源策略：

scheme(协议)、host(主机)和port(端口)都相同则为同源。

非同源限制：

1. 不能读取和修改对方的 DOM
2. 不读访问对方的 Cookie、IndexDB 和 LocalStorage
3. 限制 XMLHttpRequest 请求

允许跨域加载资源的标签：

`<img>`、`<link>`、`<script>`、`<audio>`、`<video>`

+ 跨域仅仅是通过scheme(协议)、host(主机)和port(端口)来识别，不会根据域名对应的IP地址是否相同来判断。

+ 如果是协议和端口造成的跨域问题前端无法解决。

+ 跨域请求的响应一般会被浏览器所拦截。

> 通过表单的方式可以发起跨域请求，为什么 Ajax 就不会？因为归根结底，跨域是为了阻止用户读取到另一个域名下的内容，Ajax 可以获取响应，浏览器认为这不安全，所以拦截了响应。但是表单并不会获取新的内容，所以可以发起跨域请求。同时也说明了跨域并不能完全阻止CSRF，因为请求毕竟是发出去了。

### 如何解决跨域问题

CORS 和 Nginx 反向代理 是实际中常用的跨域解决方案，JSONP需要理解，其他的方法不做详细展开。

#### CORS

CORS是一个W3C标准,全称是"跨域资源共享"(Cross-origin resource sharing)。它需要浏览器和服务器共同支持，服务器需要添加`Access-Control-Allow-Origin`响应头，

兼容性：非IE和IE 10以上支持CORS，IE 8/9需要通过 XDomainRequest 来实现。

优点：支持所有类型的请求方法。

浏览器根据请求方法和请求头的特定字段，分为简单请求和非简单请求（复杂请求）。

满足以下条件的即简单请求，不满足则归为非简单请求：
1. 请求方法属于以下三种：GET、POST、HEAD
2. 请求头 Accept、Accept-Language、Content-Language、Content-Type的取值范围属于以下三种：`application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`

**简单请求**

浏览器自动在简单请求的请求头当中添加`Origin`字段表示请求来自哪个源，服务器在响应头中添加`Access-Control-Allow-Origin`字段，列出允许跨域请求的源，值为`*`表示允许所有源。
如果`Origin`不在`Access-Control-Allow-Origin`的范围中浏览器就会拦截响应。

以下字段用于设置如果会拦截的特定功能：

[Access-Control-Allow-Credentials](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials)

布尔值，设置该响应头表示是否可以将该响应的`cookies, authorization headers 或 TLS client certificates`暴露给页面，默认false。

对于跨域请求，如果需要拿到浏览器的Cookie，需要添加这个响应头并设为true, 并且在前端也需要设置withCredentials属性:

``` js
let xhr = new XMLHttpRequest();
xhr.withCredentials = true;
```

[ccess-Control-Expose-Headers](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Expose-Headers)

值以这样的格式设置`<header-name>, <header-name>, ...`，该响应头字段列出了哪些首部可以作为响应的一部分暴露给外部。

默认情况下，只有七种 simple response headers （简单响应首部）可以暴露给外部：

`Cache-Control`、`Content-Language`、`Content-Length`、`Content-Type`、`Expires`、`Last-Modified`、`Pragma`

如果想要让客户端可以访问到其他的首部信息，就可以将它们在 Access-Control-Expose-Headers 里面列出来。

**非简单请求**

1. 在正式通信之前，非简单请求会增加一次HTTP查询请求，称为预检请求。预检发起OPTIONS请求，通过该请求来知道服务端是否允许跨域请求。

2. 预检请求的请求头会带上`Origin`源地址，`Host`目标地址，`Access-Control-Request-Method`指出CORS请求将用到的HTTP方法，`Access-Control-Request-Headers`指定CORS请求将要加上的请求头。

3. 预检请求的响应头会带上`Access-Control-Allow-Origin`、`Access-Control-Allow-Methods`、`Access-Control-Allow-Credentials`、`Access-Control-Allow-Headers`、`Access-Control-Max-Age`（预检请求的有效期，期限内不再发起预检请求）。

4. 预检请求响应不满足条件，会触发XMLHttpRequest的onerror方法，真正的CORS请求就不会发起，如果满足条件，发起CORS请求，浏览器自动加上`Origin`字段，服务端响应头返回`Access-Control-Allow-Origin`。

#### JSONP

JSONP原理很简单，就是利用`<script>`标签来请求资源。

优点：兼容性好。

缺点：仅支持GET方法，不安全，可能会遭受XSS攻击。

JSONP和AJAX的区别：JSONP是非同源策略跨域请求，AJAX属于同源策略。

封装一个JSONP

``` js
var jsonp = ({ url, params, callbackName }) => {
    var generateURL = () => {
        let arrs = [];
        for(let key in params) {
            arrs.push(`${key}=${params[key]}`);
        }
        arrs.push(`callback=${callbackName}`); // 传给后端的参数名叫callback
        return `${url}?${arrs.join('&')}`;
    };
    return new Promise((resolve, reject) => {
        callbackName = callbackName || Math.random().toString().replace('.', ''); 
        // 创建 script 标签
        let _script = document.createElement('script');
        _script.src = generateURL();
        document.body.appendChild(_script);
        // 绑定回调到window对象上
        window[callbackName] = (data) => {
            resolve(data);
            // 清除 script 标签
            document.body.removeChild(_script);
        }
    });
}
```

使用

``` js
jsonp({
    url: 'http://localhost:3000',
    params: { say: 'hello' },
    callbackName: 'sayhi'
}).then(data => {
    console.log('hi,',data)
})
```

后端

``` js
let express = require('express')
let app = express()
app.get('/', function(req, res) {
  let { say, callback } = req.query
  console.log(say); // hello
  console.log(callback); // sayhi
  // 浏览器直接执行返回给script的字符串
  res.end(`${callback}('jiuto')`);
})
app.listen(3000)
```

#### Nginx 反向代理

反向代理利用同源策略对服务器没有限制，设置一个反向代理服务器，用于接收客户端的请求，将请求转发给其他的服务器，主要的场景是维持服务器集群的负载均衡。

优点：只需要修改nginx配置，支持所有浏览器，支持session，不需要修改代码，不会影响服务器性能。

``` js
server {
  listen  80;
  server_name  client.com;
  location /api {
    proxy_pass server.com;
  }
}
```

> Nginx 相当于起了一个跳板机，这个跳板机的域名也是client.com，让客户端首先访问 client.com/api，这当然没有跨域，
> 然后 Nginx 服务器作为反向代理，将请求转发给server.com，当响应返回时又将响应给到客户端，这就完成整个跨域请求的过程。

#### 其他方法

*可参考[前端常见跨域解决方案（全）](https://segmentfault.com/a/1190000011145364)、[九种跨域方式实现原理（完整版）](https://juejin.cn/post/6844903767226351623#heading-5)*

+ Node中间件代理(两次跨域)

+ postMessage

+ websocket

+ window.name + iframe

+ location.hash + iframe

+ document.domain + iframe

### 参考

[九种跨域方式实现原理（完整版）](https://juejin.cn/post/6844903767226351623#heading-5)

[014: 什么是跨域？浏览器如何拦截响应？如何解决？](https://juejin.cn/post/6844904100035821575#heading-67)
