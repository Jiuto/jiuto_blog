## http、https

> 这是一篇各种摘录的笔记整理，有些内容来源较散未在内容部分特地列出，详见参考列表。

### http请求方法

+ GET 方法请求指定的资源，使用GET的请求应该只被用于获取数据

+ HEAD 方法请求一个与GET请求的响应相同的响应，但没有响应体

+ POST 方法用于将实体提交到指定的资源，通常导致在服务器上的状态变化或副作用

+ PUT 方法用请求有效载荷替换目标资源的所有当前表示

+ DELETE 方法删除指定的资源

+ CONNECT 方法建立一个到由目标资源标识的服务器的隧道

+ OPTIONS 方法用于描述目标资源的通信选项

+ TRACE 方法沿着到目标资源的路径执行一个消息环回测试

+ PATCH 方法用于对资源应用部分修改

### Keep-Alive 持久连接

HTTP协议为无连接的协议，非Keep-Alive模式下，每个请求/应答客户和服务器都要建一个连接，完成之后立即断开连接，持久连接需要开启Keep-Alive。

HTTP/1.0中默认是关闭的，需要在http头加入"Connection: Keep-Alive"才能启用Keep-Alive。HTTP/1.1中默认启用Keep-Alive，如果加入"Connection: close"才关闭。

何时关闭持久连接：

+ 请求静态资源时可以确定内容大小，客户端（服务器）可以通过`Conent-Length（表示实体内容长度）`来判断数据是否接收完成。

+ 请求动态资源时不确定内容大小，可以使用`Transfer-Encoding: chunk`模式来传输数据（优先级高于Conent-Length）。

数据分多个chunk块发出，由一个标明长度为0的chunk（称为footer）标示结束。每个chunk分为头部和正文两部分（用回车换行(CRLF)分隔），头部内容指定正文的字符总数（十六进制的数字 ）和数量单位（一般不写），正文部分为指定长度的实际内容，最后一个长度为0的chunk的内容是一些附加的Header信息（通常可忽略）。

### HTTP/1.1 

#### HTTP/1.1特点

1. 灵活可扩展

主要体现在两个方面，一个是语义上的自由，只规定了基本格式，比如空格分隔单词，换行分隔字段，其他的各个部分都没有严格的语法限制。
另一个是传输形式的多样性，不仅仅可以传输文本，还能传输图片、视频等任意数据，非常方便。


2. 可靠传输

基于TCP/IP，继承了 TCP 的可靠传输特性。


3. 请求-应答

一发一收、有来有回。

4. 无状态

这里的状态是指通信过程的上下文信息，每次请求都是独立、无关的，默认不需要保留状态信息。

#### HTTP/1.1缺陷

1. 网络延迟导致的页面加载速度降低

> 网络延迟问题主要由于队头阻塞(Head-Of-Line Blocking),导致带宽无法被充分利用。
>
> 队头阻塞是指当顺序发送的请求序列中的一个请求因为某种原因被阻塞时，在后面排队的所有请求也一并被阻塞，会导致客户端迟迟收不到数据。

相关解决办法：

+ 将同一页面的资源分散到不同域名下，提升连接上限。

Chrome对同一个域名，默认允许同时建立6个TCP持久连接（例如：同一域名下同时有10个请求，其中4个会等待），公用一个TCP管道，但实际上一个管道中同时只能处理一个请求。

+ Spriting，合并多张小图为一张大图，减轻服务器对图片的请求次数，用JavaScript或者CSS做到只展示想要的部分。

+ 内联(Inlining)，将图片的原始数据嵌入在CSS文件的url里，减少网络请求次数。

例如：`background: url(data:image/png;base64,<data>) no-repeat;`

+ 拼接(Concatenation)，将多个小体积的js文件用webpack等工具打包成一个大体积的js文件。

缺点：如果其中一个小体检js文件发生改动，会导致大量数据重新加载。

2. 无状态特性导致http头部过大

由于报文Header一般会携带"User Agent"、"Cookie"、"Accept"、"Server"等许多固定的字段，多达几百上千字节，但Body却经常只有几十字节（比如GET请求、
204/301/304响应），Header携带内容过大增加了传输的成本，且成千上万的请求响应报文里有很多字段值都是重复的。

3. 明文传输不安全

HTTP/1.1所有传输的内容都是明文，客户端和服务器端无法相互验证身份。

例如："免费WiFi陷阱"

4. 不支持服务器推送消息

### HTTP/2

2009年，谷歌公开了自行研发的SPDY协议，为了兼容性考虑，SPDY位于HTTP之下，TCP和SSL之上，将HTTP1.x的内容封装成一种新的frame格式，同时可以使用已有的SSL功能。

<img :src="$withBase('/imgs/network/http/SPDY.png')" alt="SPDY">

HTTP/2基于SPDY，专注于性能，最大的一个目标是在用户和网站间只用一个连接（connection）。

HTTP/2由两个规范（Specification）组成：
1. Hypertext Transfer Protocol version 2 - RFC7540
2. HPACK - Header Compression for HTTP/2 - RFC7541

#### HTTP/2特性

1. 二进制传输，减少传输数据量，解析更高效

HTTP/2把TCP协议的部分特性挪到了应用层，将请求和响应数据分割为更小的帧：

原来的"Header+Body"的消息 => "HEADERS"/"DATA"二进制"帧"(Frame)

2. Header压缩，减少传输数据量

HTTP/2使用专门开发的"HPACK"算法，在客户端和服务器两端建立"字典"，用索引号表示重复的字符串，还采用哈夫曼编码来压缩整数和字符串，达到50%~90%压缩率。

+ 在客户端和服务器端使用"首部表"来跟踪和存储之前发送的键-值对，对于相同的数据，不再通过每次请求和响应发送

+ 首部表在HTTP/2的连接存续期内始终存在，由客户端和服务器共同渐进地更新

+ 每个新的首部键-值对要么被追加到当前表的末尾，要么替换表中之前的值

3. 多路复用

+ HTTP/2中同域名下所有通信都在同一个TCP连接上完成，整个页面资源下载只需一次慢启动，避免多个TCP连接竞争带宽。

+ 一个连接可以承载任意数量的双向数据流，并行交错的发送与响应，相互之间不影响。

+ 每个数据流以消息的形式发送，消息由一个或多个帧组成。多个帧之间可以乱序发送，根据帧首部的流标识可以重新组装。

+ 在HTTP/2中，每个请求都可以带一个31bit的优先值（0为最高优先级），客户端和服务器在处理不同的流时采取不同的策略，以最优的方式发送流、消息和帧。

4. 支持服务器推送（Server Push，也叫 Cache push）

例如：在浏览器刚请求HTML的时候，服务器就提前把可能会用到的JS、CSS文件发给客户端，减少等待的延迟。

+ 客户端有权利选择是否接收：比如资源已经被缓存，浏览器可发送RST_STREAM帧来拒收。

+ 服务器推送遵守同源策略，服务器不能随便将第三方资源推送给客户端，必须经过双方确认。

5. 安全性提高

HTTP/2可以像HTTP/1.1一样使用明文传输数据，不强制使用加密通信，不过格式还是二进制，只是不需要解密。
但主流浏览器Chrome、Firefox等都公开宣布只支持加密的HTTP/2，所以"事实上"的HTTP/2是加密的。互联网常见的HTTP/2都是使用"https"协议名，跑在TLS上面。

HTTP/2协议定义了两个字符串标识符："h2"表示加密的HTTP/2，"h2c"表示明文的HTTP/2。

#### HTTP/2缺陷（主要来自TCP协议）

+ TCP 以及 TCP+TLS（使用https需要TLS，也需要一个三次握手）建立连接的延时

建立TCP连接需要三次握手来确认连接成功，也就是需要在消耗完1.5个RTT之后才能进行数据传输。
进行TLS连接，TLS有两个版本——TLS1.2和TLS1.3，每个版本建立连接所花的时间不同，大致需要1~2个RTT。

+ TCP的队头阻塞并没有彻底解决

TCP发生丢包重传时会阻塞，不如HTTP/1.1有多个TCP链接。

### HTTP/3

HTTP/3，一个基于UDP协议（"无连接"，不需要握手挥手，不提供可靠性传输）的QUIC协议，使HTTP跑在QUIC上而不是TCP上。它真正"完美"地解决了"队头阻塞"问题。

1. 实现了类似TCP的流量控制、传输可靠性的功能

QUIC在UDP的基础之上增加了一层来保证数据可靠性传输，提供了数据包重传、拥塞控制以及其他一些TCP中存在的特性。

2. 快速握手

基于UDP，QUIC可以实现使用0-RTT或者1-RTT来建立连接。

3. 集成了TLS加密功能

4. 多路复用，彻底解决TCP中队头阻塞的问题

和TCP不同，QUIC实现了在同一物理连接上可以有多个独立的逻辑数据流，实现了数据流的单独传输，解决了TCP中队头阻塞的问题。

<img :src="$withBase('/imgs/network/http/http.png')" alt="http">

### HTTPS

#### HTTP的问题

1. http明文传输导致数据可能被窃听

2. 客服端和服务端之间相互无法认证身份和权限（无法阻止海量请求下的 DoS 攻击(Denial of Service，拒绝服务攻击)）

3. 数据可能被篡改（可能遭遇中间人攻击(Man-in-the-Middle attack，MITM)）

#### 什么是HTTPS

> 超文本传输安全协议（英语：Hypertext Transfer Protocol Secure，缩写：HTTPS，常称为HTTP over TLS，HTTP over SSL或HTTP Secure）是一种通过计算机网络进行安全通信的传输协议。
> HTTPS经由HTTP进行通信，但利用SSL/TLS来加密数据包。HTTPS开发的主要目的，是提供对网站服务器的身份认证，保护交换数据的隐私与完整性。

HTTPS不是应用层的一种新协议，可以理解为HTTP+TLS/SSL，是将原来的HTTP直接和TCP通信，改成HTTP先和TLS/SSL连接，再由TLS/SSL与TCP通信。

SSL和TLS的关系：

> 传输层安全性协议（英语：Transport Layer Security，缩写作 TLS），及其前身安全套接层（Secure Sockets Layer，缩写作 SSL）是一种安全协议，目的是为互联网通信，提供安全及数据完整性保障。

TLS/SSL的功能：

依赖于三类基本算法：对称加密（数据加密）、非对称加密（身份认证和密钥协商）、散列函数（验证信息完整性）。

<img :src="$withBase('/imgs/network/http/TLS.png')" alt="TLS/SSL">

*相关文章推荐：[SSL/TLS协议运行机制的概述](https://ruanyifeng.com/blog/2014/02/ssl_tls.html)*

#### 用信鸽来解释 HTTPS

*来自[用信鸽来解释 HTTPS](https://mp.weixin.qq.com/s?__biz=MzI4Njc5NjM1NQ==&mid=2247485207&idx=1&sn=64827cd627ad08798d21076cef1b7cfa&chksm=ebd6383bdca1b12de54dc4e157543b2ff63fc8c876a73f830d3855760b90ae109b239ade633f&mpshare=1&scene=24&srcid=0416kj0u5u9OKS1MIT61ETQM#rd)*

1. 初级交流

如果爱丽丝想要给鲍勃发送一段信息，她会把信息绑在信鸽的腿上然后送往鲍勃那里。鲍勃收到了信息，并阅读了信息，非常完美。

但如果马洛里拦截了爱丽丝的鸽子并且篡改了信息呢？鲍勃就没有办法去知道爱丽丝发出的信息在传递过程中遭到了修改。

这就是 HTTP 如何运作的。看起来很可怕对吧？我是不会通过 HTTP 来发送我的银行资信证明的，并且你也不应如此。

2. 隐蔽的密码

那么如果爱丽丝和鲍勃都非常的机智。他们一致认同使用一种隐蔽的密码来书写他们的信息。他们会将信息中的每个字母按照字母表中的顺序前移三位。比如，D→A，E→B，F→C。如此一来，原文为 “secret message” 的信息就变成了 “pbzobq jbppxdb” 。

那现在如果马洛里再截获了信鸽，她既不能做出有意义的修改同时也不会知道信息的内容，因为她不知道隐蔽的密码到底是什么。然而鲍勃却可以很容易反转密码，依靠 A → D, B → E, C → F 之类的规则破译信息的内容。加密后的信息 “pbzobq jbppxdb” 会被破解还原为 “secret message” 。

搞定！

这就是对称密匙加密，因为如果你知道如何加密一段信息那么你同样可以解密这段信息。

上述的密码通常被称为凯撒码。在现实生活中，我们会使用更为奇特和复杂的密码，但原理相同。

3. 我们如何决定密匙？

如果除了发信者和收信者之外没有人知道使用的是什么密匙，对称密匙加密是非常安全的。在凯撒加密中，密匙就是每个字母变到加密字母需要移动多少位的偏移量。我之前的距离中，使用的偏移量是 3 ，但是也可以用 4 或者 12 。

问题是如果爱丽丝和鲍勃在开始用信鸽传信之前没有碰过头，他们没有一个安全的方式来确立密匙。如果他们自己来在信中传递密匙，马洛里就会截获信息并发现密匙。这就使得马洛里可以在爱丽丝和鲍勃开始加密他们的信息之前或之后，阅读到他们信息的内容并按照她的意愿来篡改信息。

这是一个中间人攻击的典型例子，避免这个问题的唯一方法就是收发信的两方一起修改他们的编码系统。

4. 通过信鸽传递盒子

所以爱丽丝和鲍勃就想出了一个更好的系统。当鲍勃想要给爱丽丝发送信息时，他会按照如下的步骤来进行：

+ 鲍勃向爱丽丝送一只没有携带任何信息的鸽子。
+ 爱丽丝给鲍勃送回鸽子，并且这只鸽子带有一个有开着的锁的盒子，爱丽丝保管着锁的钥匙。
+ 鲍勃把信放进盒子中，把锁锁上然后把盒子送给爱丽丝。
+ 爱丽丝收到盒子，用钥匙打开然后阅读信息。

这样马洛里就不能通过截获鸽子来篡改信息了，因为她没有打开盒子的钥匙。当爱丽丝要给鲍勃发送消息的时候同样按照上述的流程。

爱丽丝和鲍勃所使用的流程通常被称为非对称密钥加密。之所以称之为非对称，是因为即使是你把信息编码（锁上盒子）也不能破译信息（打开锁住的盒子）。

在术语中，盒子被称为公匙而用来打开盒子的钥匙被称为私匙。

5. 如何信任盒子

如果你稍加注意你就会发现还是存在问题。当鲍勃收到盒子时他如何能确定这个盒子来自爱丽丝而不是马洛里截获了鸽子然后换了一个她有钥匙能打开的盒子呢？

爱丽丝决定签名标记一下盒子，这样鲍勃收到盒子的时候就可以检查签名来确定是爱丽丝送出的盒子了。

那么你们之中的一些人可能就会想了，鲍勃如何打一开始就能识别出爱丽丝的签名呢？这是个好问题。爱丽丝和鲍勃也确实有这个问题，所以他们决定让泰德代替爱丽丝来标记这个盒子。

那么谁是泰德呢？泰德很有名的，是一个值得信任的家伙。他会给任何人签名并且所有人都信任他只会给合法的人签名标记盒子。

如果泰德可以确认索要签名的人是爱丽丝，他就会在爱丽丝的盒子上签名。因此马洛里就不可能搞到一个有着泰德代表爱丽丝签了名的盒子，因为鲍勃知道泰德只会给他确认过的人签名，从而识破马洛里的诡计。

泰德的角色在术语中被称为认证机构。而你阅读此文时所用的浏览器打包存有许多认证机构的签名。

所以当你首次接入一个网站的时候你可以信任来自这个站点的盒子因为你信任泰德而泰德会告诉你盒子是合法的。

6. 沉重的盒子

现在爱丽丝和鲍勃有了一个可靠的系统来进行交流，然他们也意识到让鸽子携带盒子比原本只携带信件要慢一些。

因此他们决定只有在选择用对称加密来给信息编码（还记得凯撒加密法吧？）的密匙时，使用传递盒子的方法（非对称加密）。

这样就可以二者的优点兼具了，非对称加密的可靠性和对称加密的高效性。

现实世界中我们不会用信鸽这样慢的送信手段，但用非对称加密来编码信息仍要慢于使用对称加密技术，所以我们只有在交换编码密匙的时候会使用非对称加密技术。

#### 对称加密、非对称加密、散列函数

+ 对称加密

加密和解密公用一个密钥。这种方式用来加密内容。

问题：密钥无法安全的转交。

+ 非对称加密

使用一对密钥，私钥一方私有，公钥任何人都可以拥有。这种方式用来加密对称加密的密钥。

缺陷：

1. 公钥是公开的，所以针对私钥加密的信息，黑客截获后可以使用公钥进行解密，获取其中的内容；

2. 公钥并不包含服务器的信息，使用非对称加密算法无法确保服务器身份的合法性，存在中间人攻击的风险，服务器发送给客户端的公钥可能在传送过程中被中间人截获并篡改；

3. 使用非对称加密在数据加密解密过程需要消耗一定时间，降低了数据传输效率；

+ 散列函数

对称加密和非对称加密的方式还不够安全，还需要通过数字签名，来确定消息确实是由发送方签名并发出来的，确定消息的完整性证明数据未被篡改。

数字签名生成，需要将一段文本先用Hash函数生成消息摘要，然后用发送者的私钥加密生成数字签名，与原文文一起传送给接收者。

校验数字签名，接收者只有用发送者的公钥才能解密被加密的摘要信息，然后用HASH函数对收到的原文产生一个摘要信息，与上一步得到的摘要信息对比。
如果相同，则说明收到的信息是完整的，在传输过程中没有被修改，否则说明信息被修改过，因此数字签名能够验证信息的完整性。

因此需要引入了证书颁发机构（Certificate Authority，简称CA），CA数量并不多，客户端内置了所有受信任CA的证书。CA对服务器的公钥（和其他信息）数字签名后生成证书。

---

#### 数字证书认证机构的业务流程：

1. 服务器的运营人员向第三方机构CA提交公钥、组织信息、个人信息(域名)等信息并申请认证;

2. CA通过线上、线下等多种手段验证申请者提供信息的真实性，如组织是否存在、企业是否合法，是否拥有域名的所有权等;

3. 如信息审核通过，CA会向申请者签发认证文件-证书。证书包含以下信息：申请者公钥、申请者的组织信息和个人信息、签发机构 CA的信息、有效时间、证书序列号等信息的明文，同时包含一个签名。 其中签名的产生算法：首先，使用散列函数计算公开的明文信息的信息摘要，然后，采用 CA的私钥对信息摘要进行加密，密文即签名;

4. 客户端 Client 向服务器 Server 发出请求时，Server 返回证书文件;

5. 客户端 Client 读取证书中的相关的明文信息，采用相同的散列函数计算得到信息摘要，然后，利用对应 CA的公钥解密签名数据，对比证书的信息摘要，如果一致，则可以确认证书的合法性，即服务器的公开密钥是值得信赖的。

6. 客户端还会验证证书相关的域名信息、有效时间等信息; 客户端会内置信任CA的证书信息(包含公钥)，如果CA不被信任，则找不到对应 CA的证书，证书也会被判定非法。

#### http与https的区别

+ HTTPS比HTTP更加安全，对搜索引擎更友好，利于SEO，谷歌、百度优先索引HTTPS网页;

+ HTTPS需要用到SSL证书，而HTTP不用;

+ HTTPS标准端口443，HTTP标准端口80;

+ HTTPS基于传输层，HTTP基于应用层;

+ HTTPS在浏览器显示绿色安全锁，HTTP没有显示;

+ HTTPS普遍认为性能消耗要大于HTTP，因为与纯文本通信相比，加密通信会消耗更多的CPU及内存资源;

### 相关问答

*问题出自[（建议精读）HTTP灵魂之问，巩固你的 HTTP 知识体系](https://juejin.cn/post/6844904100035821575#heading-23)，回答参考一些文章经过整改。*

1. HTTP 报文结构是怎样的？

> 起始行 + 头部 + 空行 + 实体

起始行请求和响应不同：

<img :src="$withBase('/imgs/network/http/request.png')" alt="请求头">

如：`GET /home HTTP/1.1` 方法 + 路径 + http版本

<img :src="$withBase('/imgs/network/http/response.png')" alt="响应头">

如：`HTTP/1.1 200 OK` http版本 + 状态码 + 原因

头部字段名Field Name：不区分大小写，不包含空格和"_"，紧跟":"

2. GET 和 POST 有什么区别？

1、GET 方法请求指定的资源，使用GET的请求应该只被用于获取数据。POST 方法用于将实体提交到指定的资源，通常导致在服务器上的状态变化或副作用。

2、从缓存的角度，GET 请求会被浏览器主动缓存下来，留下历史记录，而 POST 默认不会。

3、从编码的角度，GET 只能进行 URL 编码，只能接收 ASCII 字符，而 POST 没有限制。

4、从参数的角度，GET 一般放在 URL 中，因此不安全，POST 放在请求体中，更适合传输敏感信息。

5、从幂等性的角度，GET是幂等的，而POST不是。(幂等表示执行相同的操作，结果也是相同的)

6、从TCP的角度，GET 请求会把请求报文一次性发出去，而 POST 会分为两个 TCP 数据包，首先发 header 部分，如果服务器响应 100(continue)， 然后发 body 部分。(火狐浏览器除外，它的 POST 请求只发一个 TCP 包)

3. 如何理解 URI？

URI(Uniform Resource Identifier)，统一资源标识符，包含URN和URL两个部分。

URI只能使用ASCII，所有非ASCII码字符和界定符将转换为十六进制字节值并在前面加个%，如`空格 => %20`。

格式：`scheme://`+`user:passwd@`+`host:port`+`path`+`?query`+`#fragment`

|字段|含义|
|--|--|
|scheme|协议名，比如http, https, file，后面紧跟://|
|user:passwd@|登录主机时的用户信息，不过很不安全，不推荐使用，也不常用|
|host:port|主机名:端口|
|path|请求路径，标记资源所在位置|
|query|查询参数，`key=val`格式键值对，用"&"分隔|
|fragment|URI所定位的资源内的一个锚点，浏览器可以根据这个锚点跳转到对应的位置|

4. 如何理解 HTTP 状态码？

*相关文章推荐[HTTP 响应代码](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)、[你所知道的3xx状态码](https://jelly.jd.com/article/6006b1035b6c6a01506c8791)*

> 响应分为五类：信息响应(100–199)，成功响应(200–299)，重定向(300–399)，客户端错误(400–499)和服务器错误 (500–599)。

**1xx**

101 Switching Protocol

该代码是响应客户端的 Upgrade (en-US) 标头发送的，并且指示服务器也正在切换的协议。
在HTTP升级为WebSocket的时候，如果服务器同意变更，就会发送状态码 101。

**2xx**

**200 OK** 请求成功，成功的含义取决于HTTP方法。
GET：资源已被提取并在消息正文中传输。
HEAD：实体标头位于消息正文中。
POST：描述动作结果的资源在消息体中传输。
TRACE：消息正文包含服务器收到的请求消息。

**204 No Content** 含义与 200 相同，但响应头后没有 body 数据。

**206 Partial Content** 服务器已经成功处理了部分 GET 请求。类似于 FlashGet 或者迅雷这类的 HTTP 下载工具都是使用此类响应实现断点续传或者将一个大文档分解为多个下载段同时下载。该请求必须包含 Range 头信息来指示客户端希望得到的内容范围，并且可能包含 If-Range 来作为请求条件。

**3xx**

**301 Moved Permanently** 即永久重定向，对应着302 Found，即临时重定向。
比如你的网站从 HTTP 升级到了 HTTPS 了，以前的站点再也不用了，应当返回301，这个时候浏览器默认会做缓存优化，在第二次访问的时候自动访问重定向的那个地址。
而如果只是暂时不可用，那么直接返回302即可，和301不同的是，浏览器并不会做缓存优化。

**304 Not Modified** 当协商缓存命中时会返回这个状态码。*可以看看这篇[浏览器缓存](https://jiuto.github.io/jiuto_blog/guide/network/cache.html)*

**4xx**

**400 Bad Request** 1、语义有误，当前请求无法被服务器理解。除非进行修改，否则客户端不应该重复提交这个请求。2、请求参数有误。

**403 Forbidden** 服务器拒绝。原因有很多，比如法律禁止、信息敏感。

**404 Not Found** 资源未找到。

**405 Method Not Allowed** 请求行中指定的请求方法不能被用于请求相应的资源。该响应必须返回一个Allow 头信息用以表示出当前资源能够接受的请求方法的列表。 

**406 Not Acceptable** 请求的资源的内容特性无法满足请求头中的条件，因而无法生成响应实体。

**408 Request Timeout** 请求超时。

**409 Conflict** 多个请求发生了冲突。

**413 Request Entity Too Large** 请求体的数据过大。

**414 Request-URI Too Long** 请求行里的 URI 太长。

**416 Range Not Satisfiable** 如果请求中包含了 Range 请求头，并且 Range 中指定的任何数据范围都与当前资源的可用范围不重合，同时请求中又没有定义 If-Range 请求头，那么服务器就应当返回416状态码。

**429 Too Many Request** 用户在给定的时间内发送了太多请求（“限制请求速率”）。

**431 Request Header Fields Too Large** 请求头的字段太大（Request Header Fields Too Large）。

**5xx**

**500 Internal Server Error** 服务器遇到了不知道如何处理的情况。

**501 Not Implemented** 此请求方法不被服务器支持且无法被处理。只有GET和HEAD是要求服务器支持的，它们必定不会返回此错误代码。

**502 Bad Gateway** 此错误响应表明服务器作为网关需要得到一个处理这个请求的响应，服务器正常，但是得到一个错误的响应。

**503 Service Unavailable** 服务器没有准备好处理请求。常见原因是服务器因维护或重载而停机。 

5. 对 Accept 系列字段了解多少？

**数据格式**

response使用Content-Type返回内容的MIME类型，request使用Accept指定客户端能够接收的内容类型。

取值可以分为下面几类:

text: text/html, text/plain, text/css 等

image: image/gif, image/jpeg, image/png 等

audio/video: audio/mpeg, video/mp4 等

application: application/json, application/javascript, application/pdf, application/octet-stream 等

**压缩方式**

response使用Content-Encoding表示web服务器支持的返回内容压缩编码类型，request使用Accept-Encoding指定浏览器可以支持的web服务器返回内容压缩编码类型。

取值有：`gzip、deflate、br`

**支持语言**

response使用Content-Language表示响应体的语言，request使用Accept-Language指定浏览器可接受的语言。

如：`Content-Language: zh-CN, zh, en`、`Accept-Language: zh-CN, zh, en`

**代码字符集**

response没有对应的单独头部字段，而是直接放在了Content-Type中，以charset属性指定，request使用Accept-Charset指定浏览器可以接受的字符编码集。

如：`Content-Type: text/html; charset=utf-8`

6. 对于定长和不定长的数据，HTTP 是怎么传输的？

定长数据，发送端在传输的时候一般会带上 Content-Length，设置数值比实际数据短数据会被截断，比实际数据长，会失败。

不定长数据，设置`Transfer-Encoding:chunked`，表示分块传输数据，Content-Length 字段会被忽略，基于长连接持续推送动态内容，响应体最后有一个空行表示结束。

7. HTTP 如何处理大文件的传输？

使用`范围请求`，服务器要支持范围请求这个功能，必须加上`Accept-Ranges: bytes`响应头，`Accept-Ranges: none`表示不支持，等同于没设置此头部字段。

客户端通过`Accept-Ranges: bytes`请求头，指定要请求哪一部分数据，如：

+ 0-499表示从开始到第 499 个字节。
+ 500- 表示从第 500 字节到文件终点。
+ -100表示文件的最后100个字节。

服务器收到请求之后，先验证范围是否合法，如果越界返回416，否则读取相应片段并返回206。

同时服务器需要添加Content-Range字段，这个字段的格式根据请求头中Range字段的不同而有所差异，请求单段数据和请求多段数据不同。

单段请求如：`Range: bytes=0-9`

单段请求响应如：

``` js
HTTP/1.1 206 Partial Content
Content-Length: 10
Accept-Ranges: bytes
Content-Range: bytes 0-9/100

i am xxxxx
```

Content-Range字段，0-9表示请求的返回，100表示资源的总大小。

多段请求如：`Range: bytes=0-9, 30-39`

多段请求响应如：

``` js
HTTP/1.1 206 Partial Content
Content-Type: multipart/byteranges; boundary=00000010101
Content-Length: 189
Connection: keep-alive
Accept-Ranges: bytes


--00000010101
Content-Type: text/plain
Content-Range: bytes 0-9/96

i am xxxxx
--00000010101
Content-Type: text/plain
Content-Range: bytes 20-29/96

eex jspy e
--00000010101--
```

`Content-Type: multipart/byteranges;boundary=00000010101`表示，表示这是多段请求，响应体中的分隔符是`00000010101`，最后的分隔末尾添上--表示结束。

8. HTTP 中如何处理表单数据的提交？

`Content-Type: application/x-www-form-urlencoded`

数据会被编码成以&分隔的键值对，字符以URL编码方式编码。

`Content-Type: multipart/form-data`

请求头中的Content-Type字段会包含boundary（值由浏览器默认指定）。

数据会分为多个部分，每两个部分之间通过分隔符来分隔，每部分表述均有HTTP头部描述，最后的分隔符会加上--表示结束，如：

``` js
Content-Disposition: form-data;name="data1";
Content-Type: text/plain
data1
----WebkitFormBoundaryRRJKeWfHPGrS4LKe
Content-Disposition: form-data;name="data2";
Content-Type: text/plain
data2
----WebkitFormBoundaryRRJKeWfHPGrS4LKe--
```

对于图片等文件的上传，基本采用multipart/form-data，因为没有必要做URL编码。

9. 对 Cookie 了解多少？

*摘自[浏览器系列之 Cookie 和 SameSite 属性](https://github.com/mqyqingfeng/Blog/issues/157)*

> Cookie（复数形态Cookies），类型为「小型文本文件」，指某些网站为了辨别用户身份而储存在用户本地终端上的数据。

服务端可以通过`Set-Cookie`响应头设置。

一般不超过4KB，由一个名称（Name）、一个值（Value）和其它几个用于控制 Cookie 有效期、安全性、使用范围的可选属性组成。

**Name/Value** 用 JavaScript 操作 Cookie 的时候注意对 Value 进行编码处理。

**Expires** 用于设置 Cookie 的过期时间。比如：`Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT;`

> 当 Expires 属性缺省时，表示是会话性 Cookie，浏览器开发者工具中显示 Expires 的值为 Session，表示的就是会话性 Cookie。
>
> 当为会话性 Cookie 的时候，值保存在客户端内存中，并在用户关闭浏览器时失效。
> 需要注意的是，有些浏览器提供了会话恢复功能，这种情况下即使关闭了浏览器，会话期 Cookie 也会被保留下来，就好像浏览器从来没有关闭一样。
>
> 与会话性 Cookie 相对的是持久性 Cookie，持久性 Cookies 会保存在用户的硬盘中，直至过期或者清除 Cookie。
> 这里值得注意的是，设定的日期和时间只与客户端相关，而不是服务端。

**Max-Age** 用于设置在 Cookie 失效之前需要经过的秒数，优先级高于 Expires 。 Max-Age 可以为正数、负数、甚至是 0。

``` js
max-Age > 0
    ? 浏览器会将其持久化，即写到对应的 Cookie 文件中
    max-Age < 0
        ? 表示该 Cookie 只是一个会话性 Cookie
        : 立即删除这个 Cookie
```

**Domain** 指定了 Cookie 可以送达的主机名，默认为当前文档访问地址中的主机部分（但是不包含子域名），且不能跨域设置 Cookie。

例如：
1. 淘宝首页设置的 Domain 为 .taobao.com，这样无论是 a.taobao.com 还是 b.taobao.com 都可以使用 Cookie。
2. 阿里域名下的页面把 Domain 设置成百度是无效的。

**Path** 指定了一个 URL 路径，这个路径必须出现在要请求的资源的路径中才可以发送 Cookie 首部。

例如：设置 Path=/docs，/docs/Web/ 下的资源会带 Cookie 首部，/test 则不会携带 Cookie 首部。

> Domain 和 Path 标识共同定义了 Cookie 的作用域：即 Cookie 应该发送给哪些 URL。

**Secure** 标记为 Secure 的 Cookie 只应通过被HTTPS协议加密过的请求发送给服务端。

**HTTPOnly** 设置 HTTPOnly 属性可以防止客户端脚本通过 document.cookie 等方式访问 Cookie，有助于避免 XSS 攻击。

**SameSite** 这个属性可以让 Cookie 在**跨站**请求时不会被发送，从而可以阻止跨站请求伪造攻击（CSRF）。

> 跨站和跨域是不同的。
>
> Cookie中的「同站」判断：
> 只要两个 URL 的 eTLD+1 相同即可，不需要考虑协议和端口。
> 其中，eTLD 表示有效顶级域名，注册于 Mozilla 维护的公共后缀列表（Public Suffix List）中，例如，.com、.co.uk、.github.io 等。
> eTLD+1 则表示，有效顶级域名+二级域名，例如 taobao.com 等。

例如：
> www.taobao.com 和 www.baidu.com 是跨站，www.a.taobao.com 和 www.b.taobao.com 是同站，a.github.io 和 b.github.io 是跨站(注意是跨站)。

SameSite有三种取值：

`Strict` 仅允许一方请求携带 Cookie，即浏览器将只发送相同站点请求的 Cookie，即当前网页 URL 与请求目标 URL 完全一致。

`Lax` 允许部分第三方请求携带 Cookie

`None` 无论是否跨站都会发送 Cookie

之前默认是 None 的，Chrome80 后默认是 Lax。

10. 如何理解 HTTP 代理？

> 代理的服务器相当于一个中间人的角色，对于客户端而言，表现为服务器进行响应；而对于源服务器，表现为客户端发起请求，具有双重身份。

功能：

1. 负载均衡。客户端的请求只会先到达代理服务器，后面到底有多少源服务器，IP 都是多少，客户端是不知道的。
因此，这个代理服务器可以拿到这个请求之后，可以通过特定的算法（随机算法、轮询、一致性hash、LRU）分发给不同的源服务器，让各台源服务器的负载尽量平均。

2. 保障安全。利用心跳机制监控后台的服务器，一旦发现故障机就将其踢出集群。并且对于上下行的数据进行过滤，对非法 IP 限流。

3. 缓存代理。将内容缓存到代理服务器，使得客户端可以直接从代理服务器获得而不用到源服务器取数据。

相关头部字段：

+ Via

假设有两台代理服务器`客户端 -> 代理1 -> 代理2 -> 源服务器`，
在源服务器收到请求后，会在请求头拿到`Via: proxy_server1, proxy_server2`，源服务器响应时，最终在客户端会拿到`Via: proxy_server2, proxy_server1`。

+ X-Forwarded-For 记录的是请求方（包括代理）的IP地址

请求来自代理时，X-Forwarded-For记录的时代理的ip，这意味着代理必须解析HTTP请求头，然后修改，比直接转发数据性能下降。
而在 HTTPS 通信加密的过程中，原始报文是不允许修改的。

由此产生了代理协议，一般使用明文版本，只需要在 HTTP 请求行上面加上这样格式的文本即可:

``` js
// PROXY + TCP4/TCP6 + 请求方地址 + 接收方地址 + 请求端口 + 接收端口
PROXY TCP4 0.0.0.1 0.0.0.2 1111 2222
GET / HTTP/1.1
```

+ X-Real-IP 获取客户端IP的字段，X-Forwarded-Host 记录客户端域名，X-Forwarded-Proto记录客户端协议名，这几个记录的是客户端真实信息，不包括代理

11. 如何理解缓存代理？

[浏览器缓存](https://jiuto.github.io/jiuto_blog/guide/network/cache.html)是客户端的HTTP缓存，而代理服务器则负责服务端的HTTP缓存。
客户端缓存过期后就近到代理缓存中获取，代理缓存过期了才请求源服务器。

缓存代理的控制分为两部分，一部分是源服务器端的控制，一部分是客户端的控制。

+ 源服务器的缓存控制

**Cache-Control** 服务器响应头`Cache-Control`设为public表示允许代理服务器缓存，private不允许。

**proxy-revalidate** `must-revalidate`表示客户端缓存过期就去源服务器获取，而`proxy-revalidate`则表示代理服务器的缓存过期后到源服务器获取。

**s-maxage** s是share的意思，限定了缓存在代理服务器中可以存放多久。

+ 客户端的缓存控制

**max-stale 和 min-fresh** 客户端的请求头中这两个字段用来对代理服务器上的缓存进行宽容和限制操作。

比如：

`max-stale: 5`表示客户端到代理服务器上拿缓存的时候，只要过期时间在5秒之内，还是可以从代理中获取的，
`min-fresh: 5`表示代理缓存一定要在到期前 5 秒之前的时间拿，否则拿不到。

**only-if-cached** 表示客户端只会接受代理缓存，而不会接受源服务器的响应。如果代理缓存无效，则直接返回504（Gateway Timeout）。

### 头部字段

*来自[Header Field Definitions](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html)*

Requests部分

|Header|解释|示例|
|--|--|--|
|Accept|指定客户端能够接收的内容类型|Accept: text/plain, text/html|
|Accept-Charset|浏览器可以接受的字符编码集。|Accept-Charset: iso-8859-5|
|Accept-Encoding|指定浏览器可以支持的web服务器返回内容压缩编码类型。|Accept-Encoding: compress, gzip|
|Accept-Language|浏览器可接受的语言|Accept-Language: en,zh|
|Accept-Ranges|可以请求网页实体的一个或者多个子范围字段|Accept-Ranges: bytes|
|Authorization|HTTP授权的授权证书|Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==|
|Cache-Control|指定请求和响应遵循的缓存机制|Cache-Control: no-cache|
|Connection|表示是否需要持久连接。（HTTP 1.1默认进行持久连接）|Connection: close|
|Cookie|HTTP请求发送时，会把保存在该请求域名下的所有cookie值一起发送给web服务器。|Cookie: $Version=1; Skin=new;|
|Content-Length|请求的内容长度|Content-Length: 348|
|Content-Type|请求的与实体对应的MIME信息|Content-Type: application/x-www-form-urlencoded|
|Date|请求发送的日期和时间|Date: Tue, 15 Nov 2010 08:12:31 GMT|
|Expect|请求的特定的服务器行为|Expect: 100-continue|
|From|发出请求的用户的Email|From: user@email.com|
|Host|指定请求的服务器的域名和端口号|Host: www.zcmhi.com|
|If-Match|只有请求内容与实体相匹配才有效|If-Match: “737060cd8c284d8af7ad3082f209582d”|
|If-Modified-Since|如果请求的部分在指定时间之后被修改则请求成功，未被修改则返回304代码|If-Modified-Since: Sat, 29 Oct 2010 19:43:31 GMT|
|If-None-Match|如果内容未改变返回304代码，参数为服务器先前发送的Etag，与服务器回应的Etag比较判断是否改变|If-None-Match: “737060cd8c284d8af7ad3082f209582d”|
|If-Range|如果实体未改变，服务器发送客户端丢失的部分，否则发送整个实体。参数也为Etag|If-Range: “737060cd8c284d8af7ad3082f209582d”|
|If-Unmodified-Since|只在实体在指定时间之后未被修改才请求成功|If-Unmodified-Since: Sat, 29 Oct 2010 19:43:31 GMT|
|Max-Forwards|限制信息通过代理和网关传送的时间|Max-Forwards: 10|
|Pragma|用来包含实现特定的指令|Pragma: no-cache|
|Proxy-Authorization|连接到代理的授权证书|Proxy-Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==|
|Range|只请求实体的一部分，指定范围|Range: bytes=500-999|
|Referer|先前网页的地址，当前请求网页紧随其后,即来路|Referer: https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html|
|TE|客户端愿意接受的传输编码，并通知服务器接受接受尾加头信息|TE: trailers,deflate;q=0.5|
|Upgrade|向服务器指定某种传输协议以便服务器进行转换（如果支持）|Upgrade: HTTP/2.0, SHTTP/1.3, IRC/6.9, RTA/x11|
|User-Agent|User-Agent的内容包含发出请求的用户信息|User-Agent: Mozilla/5.0 (Linux; X11)|
|Via|通知中间网关或代理服务器地址，通信协议|Via: 1.0 fred, 1.1 nowhere.com (Apache/1.1)|
|Warning|关于消息实体的警告信息|Warn: 199 Miscellaneous warning|

Responses 部分 

|Header|解释|示例|
|--|--|--|
|Accept-Ranges|表明服务器是否支持指定范围请求及哪种类型的分段请求|Accept-Ranges: bytes|
|Age|从原始服务器到代理缓存形成的估算时间（以秒计，非负）|Age: 12|
|Allow|对某网络资源的有效的请求行为，不允许则返回405|Allow: GET, HEAD|
|Cache-Control|告诉所有的缓存机制是否可以缓存及哪种类型|Cache-Control: no-cache|
|Content-Encoding|web服务器支持的返回内容压缩编码类型。|Content-Encoding: gzip|
|Content-Language|响应体的语言|Content-Language: en,zh|
|Content-Length|响应体的长度|Content-Length: 348|
|Content-Location|请求资源可替代的备用的另一地址|Content-Location: /index.htm|
|Content-MD5|返回资源的MD5校验值|Content-MD5: Q2hlY2sgSW50ZWdyaXR5IQ==|
|Content-Range|在整个返回体中本部分的字节位置|Content-Range: bytes 21010-47021/47022|
|Content-Type|返回内容的MIME类型|Content-Type: text/html; charset=utf-8|
|Date|原始服务器消息发出的时间|Date: Tue, 15 Nov 2010 08:12:31 GMT|
|ETag|请求变量的实体标签的当前值|ETag: “737060cd8c284d8af7ad3082f209582d”|
|Expires|响应过期的日期和时间|Expires: Thu, 01 Dec 2010 16:00:00 GMT|
|Last-Modified|请求资源的最后修改时间|Last-Modified: Tue, 15 Nov 2010 12:45:26 GMT|
|Location|用来重定向接收方到非请求URL的位置来完成请求或标识新的资源|Location: https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html|
|Pragma|包括实现特定的指令，它可应用到响应链上的任何接收方|Pragma: no-cache|
|Proxy-Authenticate|它指出认证方案和可应用到代理的该URL上的参数|Proxy-Authenticate: Basic|
|refresh|应用于重定向或一个新的资源被创造，在5秒之后重定向（由网景提出，被大部分浏览器支持）|Refresh: 5; url=https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html|
|Retry-After|如果实体暂时不可取，通知客户端在指定时间之后再次尝试|Retry-After: 120|
|Server|web服务器软件名称|Server: Apache/1.3.27 (Unix) (Red-Hat/Linux)|
|Set-Cookie|设置Http Cookie|Set-Cookie: UserID=JohnDoe; Max-Age=3600; Version=1|
|Trailer|指出头域在分块传输编码的尾部存在|Trailer: Max-Forwards|
|Transfer-Encoding|文件传输编码|Transfer-Encoding:chunked|
|Vary|告诉下游代理是使用缓存响应还是从原始服务器请求|Vary: *|
|Via|告知代理客户端响应是通过哪里发送的|Via: 1.0 fred, 1.1 nowhere.com (Apache/1.1)|
|Warning|警告实体可能存在的问题|Warning: 199 Miscellaneous warning|
|WWW-Authenticate|表明客户端请求实体应该使用的授权方案|WWW-Authenticate: Basic|

### 参考

[HTTP请求方法](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods)

[HTTP协议头部与Keep-Alive模式详解](https://byvoid.com/zhs/blog/http-keep-alive-header/)

[解密HTTP/2与HTTP/3 的新特性](https://segmentfault.com/a/1190000020714686#articleHeader16)

[分分钟让你理解HTTPS](https://juejin.cn/post/6844903599303032845#heading-8)

[用信鸽来解释 HTTPS](https://mp.weixin.qq.com/s?__biz=MzI4Njc5NjM1NQ==&mid=2247485207&idx=1&sn=64827cd627ad08798d21076cef1b7cfa&chksm=ebd6383bdca1b12de54dc4e157543b2ff63fc8c876a73f830d3855760b90ae109b239ade633f&mpshare=1&scene=24&srcid=0416kj0u5u9OKS1MIT61ETQM#rd)

[深入理解HTTPS工作原理](https://juejin.cn/post/6844903830916694030#heading-3)

[（建议精读）HTTP灵魂之问，巩固你的 HTTP 知识体系](https://juejin.cn/post/6844904100035821575#heading-23)

[HTTP 响应代码](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)

[浏览器系列之 Cookie 和 SameSite 属性](https://github.com/mqyqingfeng/Blog/issues/157)

[HTTP响应头和请求头信息对照表](http://tools.jb51.net/table/http_header)
