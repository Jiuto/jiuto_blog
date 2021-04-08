## 浏览器缓存

### 什么是浏览器缓存

> 浏览器缓存保存着用户通过 HTTP 获取的所有资源，再下一次请求时可以避免重复向服务器发出多余的请求。

浏览器缓存也就http缓存，分为强制缓存和协商缓存，两类缓存可同时存在，但强制缓存优先级更高。

为什么使用缓存：

1. 避免数据重复传递，节省宽带流量
2. 减少服务器的负担，提高网站性能
3. 加快网页加载速度

### 强制缓存

当本地缓存中有所请求的数据时，客户端直接从缓存中获取数据，当缓存中没有所请求的数据时，客户端从服务端获取新的数据，并更新缓存。

通过服务器响应header中的Expires和Cache-Control字段设置。

+ Exprires

Exprires的值为缓存到期时间，是一个绝对时间。

缺点：

服务端和客户端时间不一致，会导致缓存命中的误差，如果手动更改了客户端的本地时间，也可能导致错误判断缓存失效。

> Expires是HTTP1.0的产物，故现在大多数使用Cache-Control替代。

+ Cache-Control

Cache-Control通过max-age设置一个相对时间，如`Cache-Control:max-age=600`，单位是秒，表示600s后缓存过期。

其他属性：

1. no-cache：需要进行协商缓存，发送请求到服务器确认是否使用缓存。

2. no-store：禁止使用缓存，每一次都要重新请求数据。

3. public：默认设置，客户端和代理服务器都可以缓存。

4. private：不能被多用户共享，客户端可以缓存。

> 现在基本上都会同时设置 Expire 和 Cache-Control ，Cache-Control 的优先级别更高。

### 协商缓存（对比缓存）

客户端先从本地缓存中获取缓存数据的标识，然后向服务端发起请求验证缓存是否失效，未失效返回304并显示"Not Modified"，从缓存中获取数据，如果失效返回200和新数据，更新缓存。

+ Last-Modified、if-Modified-Since/if-Unmodified-Since

Last-Modified：

浏览器第一次请求资源的时候，服务器返回的header上会返回Last-Modified字段，表示资源最后修改的时间。

if-Modified-Since：

浏览器再次请求该资源时，请求的header会包含if-Modified-Since字段，表示缓存中获得的最后修改时间，也就是浏览器返回header的Last-Modified。

服务端接收到请求，将if-Modified-Since与资源的最后修改时间进行对比，如果一致返回304和"Not Modified"，浏览器从缓存中获取数据，如果不一致，返回200和新资源，浏览器更新缓存。

[if-Unmodified-Since](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/If-Unmodified-Since):

> HTTP协议中的 If-Unmodified-Since 消息头用于请求之中，使得当前请求成为条件式请求：
> 只有当资源在指定的时间之后没有进行过修改的情况下，服务器才会返回请求的资源，或是接受 POST 或其他 non-safe 方法的请求。
> 如果所请求的资源在指定的时间之后发生了修改，那么会返回 412 (Precondition Failed) 错误。

即，if-Modified-Since是资源修改才返回，if-Unmodified-Since是资源没修改才返回。

缺点：

1. 最小单位是秒，如果短时间内资源发生了改变，Last-Modified返回的时间并不精确。

2. 文件修改时间发生变化，但实际内容没有变化，无法检测到。

因此推出了Etag。

+ Etag、If-no-match

Etag 字段的值表示资源的唯一标识，一般是由文件内容 hash 生成的。

在浏览器第一次请求资源时，服务器会返回一个 Etag 标识。

再次请求该资源时，请求头中包含If-no-match字段表示上一次请求的Etag值，服务器比较后，如果一致，返回304，如果不一致，返回新资源并更新缓存。

> 实际应用中Etag生成算法会占用服务端的资源。
>
> Last-Modified 和 Etag 是可以同时设置的，服务器会优先校验 Etag，如果 Etag 相等就会继续比对 Last-Modified，最后才会决定是否返回 304。

### 不同刷新请求的执行过程

浏览器中输入URL确认跳转，发现缓存有该资源，直接从缓存获取。

F5刷新，`强制缓存 || 协商缓存 ? 使用缓存 : 返回最新的资源`。

Ctrl+F5强制刷新，浏览器删除缓存中的资源，向服务器重新请求。

### 参考

[关于浏览器缓存你知道多少](https://mp.weixin.qq.com/s/Wvc0lkLpgyEW_u7bbMdvpQ)

[HTTP----HTTP缓存机制](https://juejin.cn/post/6844903517702848526)
