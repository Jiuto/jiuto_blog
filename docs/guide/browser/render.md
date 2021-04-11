## 浏览器渲染机制

### 浏览器进程

> + 浏览器进程：主要负责界面显示、用户交互、子进程管理，同时提供存储等功能。
> + 渲染进程：核心任务是将 HTML、CSS 和 JavaScript 转换为用户可以与之交互的网页，排版引擎 Blink 和 JavaScript 引擎 V8 都是运行在该进程中，默认情况下，Chrome 会为每个 Tab 标签创建一个渲染进程。出于安全考虑，渲染进程都是运行在沙箱模式下。
> + GPU 进程：其实，Chrome 刚开始发布的时候是没有 GPU 进程的。而 GPU 的使用初衷是为了实现 3D CSS 的效果，只是随后网页、Chrome 的 UI 界面都选择采用 GPU 来绘制，这使得 GPU 成为浏览器普遍的需求。最后，Chrome 在其多进程架构上也引入了 GPU 进程。
> + 网络进程：主要负责页面的网络资源加载，之前是作为一个模块运行在浏览器进程里面的，直至最近才独立出来，成为一个单独的进程。
> + 插件进程：主要是负责插件的运行，因插件易崩溃，所以需要通过插件进程来隔离，以保证插件进程崩溃不会对浏览器和页面造成影响。

这里的排版引擎就是我们通常说的渲染引擎，也有叫浏览器内核的。

常见浏览器内核：Trident => IE、Gecko => Firefox、Webkit => Safari/Chrome、Presto => Opera

### “在浏览器里，从输入 URL 到页面展示，这中间发生了什么？ ”

#### 1. 用户输入URL

浏览器判断输入内容是否为URL，如果不是URL，用浏览器默认的搜索引擎来合成新的带搜索关键字的URL，如果判断输入内容符合URL规则，则加上协议合成完整URL。

#### 2. URL请求

1. 浏览器进程通过进程间通信（IPC）把URL请求发送至网络进程，由网络进程发起真正的URL请求。

2. 网络进程查找本地缓存是否缓存了该资源，如果有缓存资源，那么直接返回资源给浏览器进程，如果没有缓存则进入网络请求流程。

3. 请求前第一步进行DNS解析，以获取请求域名的服务器IP地址。如果请求协议是HTTPS，需要建立TLS连接。

4. 利用IP地址和服务器建立TCP连接。

5. 构建请求行、请求头等信息，并把和该域名相关的Cookie等数据附加到请求头中，然后向服务器发送构建的请求信息。

6. 服务器接收到请求信息后，会根据请求信息生成响应数据（包括响应行、响应头和响应体等信息），并发给网络进程。

7. 网络进程接收到响应后，解析响应头的内容。

+ 如果返回的状态码是301或者302，从响应头的 Location 字段读取重定向的地址，发起新的 HTTP 或者 HTTPS 请求。

+ 如果响应行是200，根据Content-Type，判断服务器返回的响应体数据是什么类型，如果响应头中的Content-type字段的值是text/html，说明服务器返回的数据是HTML格式。

#### 3. 准备渲染进程

同一站点：根域名（例如，geekbang.org）和协议（例如，https:// 或者 http://）相同的页面。

Chrome 默认会为每个页面分配一个渲染进程，但是，如果从一个页面打开了另一个新页面，而新页面和当前页面属于同一站点的话，那么新页面会复用父页面的渲染进程。

#### 4. 提交文档（即响应体数据）

1. 浏览器进程发出“提交请求”消息给渲染进程，渲染进程接收到“提交文档”的消息后，和网络进程建立传输数据的“管道”。

2. 等文档数据传输完成之后，渲染进程会返回“确认提交”的消息给浏览器进程。

3. 浏览器进程在收到“确认提交”的消息后，会更新浏览器界面状态，包括了安全状态、地址栏的 URL、前进后退的历史状态，并更新Web页面。

#### 5. 渲染流程

1. 构建DOM树

浏览器从响应体读取HTML原始字节，并指定编码(如UTF-8)转换成字符串，
再将字符串转换成Token，Token会标识是“开始标签”、“结束标签”或“文本”等信息，如"StartTag:head"、"EndTag:title"、"sometext"，
然后由Token生成节点对象，最后构建DOM树。

> 事实上，构建DOM的过程中，不是等所有Token都转换完成后再去生成节点对象，而是一边生成Token一边消耗Token来生成节点对象。
> 换句话说，每个Token被生成后，会立刻消耗这个Token创建出节点对象。注意：带有结束标签标识的Token不会创建节点对象。

2. 构建CSSOM树

构建CSSOM的过程与构建DOM的过程相似。

CSS 样式来源主要有三种：

+ 通过 link 引用的外部 CSS 文件
+ `<style>`标记内的 CSS
+ 元素的 style 属性内嵌的 CSS

在这一过程中，浏览器会确定下每一个节点的样式到底是什么，并且这一过程其实是很消耗资源的。因为样式既可以自行设置给某个节点，也可以通过继承获得。
在这一过程中，浏览器得递归CSSOM树，确定具体的元素样式。

3. 构建渲染树（布局树）

遍历DOM树中的所有可见节点，并把这些节点添加到渲染树，不可见的节点会被忽略掉，如head标签下面的全部内容、样式属性包含dispaly:none的元素等。

计算渲染树节点的坐标位置。

4. 构建分层树

渲染引擎为特定的节点生成专用的图层，并生成一棵对应的图层树。

这涉及到层叠上下文，可以看看这篇文章：[层叠上下文、层叠层级、层叠顺序](https://jiuto.github.io/jiuto_blog/guide/css/stacking_context.html)。

5. 生产绘制列表

把每一个图层的绘制拆分成很多小的绘制指令，然后再把这些指令按照顺序组成一个待绘制列表。

绘制列表只是用来记录绘制顺序和绘制指令的列表，而实际上绘制操作是由渲染引擎中的合成线程来完成的。

所以这一步还要将绘制列表提交到合成线程。

6. 栅格化

> 合成线程会将图层划分为图块（tile），按照视口附近的图块来优先生成位图，实际生成位图的操作是由栅格化来执行的。
> 所谓栅格化，是指将图块转换为位图。而图块是栅格化执行的最小单位。
> 渲染进程维护了一个栅格化的线程池，所有的图块栅格化都是在线程池内执行的。
> 通常，栅格化过程都会使用 GPU 来加速生成，使用 GPU 生成位图的过程叫快速栅格化，或者 GPU 栅格化，生成的位图被保存在 GPU 内存中。

7. 合成

所有图块都被光栅化后，合成线程发送绘制图块的命令DrawQuad给浏览器进程。

8. 显示

浏览器进程里面有一个叫viz的组件，用来接收合成线程发过来的DrawQuad命令，然后根据DrawQuad命令，将其页面内容绘制到内存中，最后再将内存显示在屏幕上。

### 理解回流（重排）、重绘、合成

#### 回流（重排）

当渲染树中部分或全部元素的更改，能引起元素的几何位置属性，例如改变元素的宽度、高度等，浏览器会触发重新布局，这个过程称为回流或者重排。

会导致回流的操作：

+ 页面首次渲染
+ 浏览器窗口大小发生改变
+ 元素尺寸或位置发生改变（边距、填充、边框、宽度和高度）
+ 元素内容变化（文字数量或图片大小等等）
+ 元素字体大小变化
+ 添加或者删除可见的DOM元素
+ 计算 offsetWidth 和 offsetHeight 属性
+ 设置/查询某些属性、调用某些方法

常见的会导致回流的属性和方法：

+ width、height、margin、padding、border
+ display、position、overflow
+ clientWidth、clientHeight、clientTop、clientLeft
+ offsetWidth、offsetHeight、offsetTop、offsetLeft
+ scrollWidth、scrollHeight、scrollTop、scrollLeft
+ scrollIntoView()、scrollIntoViewIfNeeded()
+ getComputedStyle()
+ getBoundingClientRect()
+ scrollTo()

#### 重绘

当页面中元素样式的改变并不影响它在文档流中的位置时，例如修改了元素的背景颜色，由于没有引起几何位置的变换，所以不会重新执行布局，浏览器会将新样式赋予给元素并重新绘制它，这个过程称为重绘。

相较于重排操作，重绘省去了布局和分层阶段，所以执行效率会比重排操作要高一些。

常见的会导致重绘的属性和方法：

+ color、text-decoration、visibility
+ background、background-image、background-position、background-repeat、background-size
+ outline、outline-color、outline-style、outline-radius、outline-width
+ border-style、box-shadow

#### 合成

更改一个既不要布局也不要绘制的属性，例如使用CSS的transform来实现动画效果，渲染引擎将跳过布局和绘制，只执行后续的合成操作，我们把这个过程叫做合成。

#### 总结

回流必将引起重绘，重绘不一定会引起回流。

减少回流和重绘：

+ 使用 transform 替代 top
+ 使用 visibility 替换 display: none
+ 不要把节点的属性值放在一个循环里当成循环里的变量
``` js
for(let i = 0; i < 1000; i++) {
    console.log(document.querySelector('.test').style.offsetTop)// 获取 offsetTop 会导致回流
}
```
+ 尽量避免使用 table 布局

> 浏览器会维护一个队列，把所有引起回流和重绘的操作放入队列中，如果队列中的任务数量或者时间间隔达到一个阈值的，浏览器就会将队列清空，进行一次批处理，这样可以把多次回流和重绘变成一次。
>
> 当你访问以下属性或方法时，浏览器会立刻清空队列：
> + clientWidth、clientHeight、clientTop、clientLeft
> + offsetWidth、offsetHeight、offsetTop、offsetLeft
> + scrollWidth、scrollHeight、scrollTop、scrollLeft
> + width、height
> + getComputedStyle()
> + getBoundingClientRect()
> 因为队列中可能会有影响到这些属性或方法返回值的操作，即使你希望获取的信息与队列中操作引发的改变无关，浏览器也会强行清空队列，确保你拿到的值是最精确的。

### 其他

#### 渲染过程中遇到JS文件怎么处理

JavaScript的加载、解析与执行会阻塞DOM的构建，所以为了加快首屏渲染，建议将script标签放在body标签底部，或者，也可以给script标签添加`defer`或者`async`属性。

JS文件会导致CSSOM阻塞DOM的构建，因为JavaScript既可以更改DOM，也可以更改CSS，不完整的CSSOM是无法使用的，在执行js时，必须要拿到完整的CSSOM，这就导致了一个现象，如果浏览器尚未完成CSSOM的下载和构建，而我们却想在此时运行js脚本，那么浏览器必须优先完成CSSOM的下载和构建，然后再执行js脚本，最后再继续构建DOM。

关于`defer`和`async`：

+ `<script src="index.js"></script>`没有 defer 或 async，浏览器会立即加载并执行指定的脚本，也就是说不等待后续载入的文档元素，读到就加载并执行。
+ `<script async src="index.js"></script>`async 属性表示异步执行引入的 JavaScript，与 defer 的区别在于，如果已经加载好，就会开始执行。
+ `<script defer src="index.js"></script>`defer 属性表示延迟执行js，设置了defer的js加载不会阻塞dom构建，即js加载时HTML并未停止解析，这两个过程是并行的，都完成后才会执行由defer-script加载的脚本。
+ 在加载多个JS脚本的时候，async是无顺序的加载，而defer是有顺序的加载。

#### 为什么操作 DOM 慢

因为DOM属于渲染引擎，而JS在JS引擎中执行。通过JS操作DOM涉及到两个线程之间的通信，并且操作DOM可能还会带来重绘回流的情况。

#### 渲染页面时常见哪些不良现象

> 由于浏览器的渲染机制不同，在渲染页面时会出现两种常见的不良现象—-白屏问题和FOUS（无样式内容闪烁）。
>
> FOUC：由于浏览器渲染机制（比如firefox），在CSS加载之前，先呈现了HTML，就会导致展示出无样式内容，然后样式突然呈现的现象。
>
> 白屏：有些浏览器渲染机制（比如chrome）要先构建DOM树和CSSOM树，构建完成后再进行渲染，如果CSS部分放在HTML尾部，由于CSS未加载完成，浏览器迟迟未渲染，从而导致白屏；也可能是把js文件放在头部，脚本会阻塞后面内容的呈现，脚本会阻塞其后组件的下载，出现白屏问题。

### 参考

[浏览器工作原理与实践-极客时间](https://time.geekbang.org/column/intro/100033601)

[浏览器内核的解析和对比](https://www.cnblogs.com/fullhouse/archive/2011/12/19/2293455.html)

[深入浅出浏览器渲染原理](https://zhuanlan.zhihu.com/p/53913989)

[浏览器的回流与重绘 (Reflow & Repaint)](https://juejin.cn/post/6844903569087266823)
