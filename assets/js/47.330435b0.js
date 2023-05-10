(window.webpackJsonp=window.webpackJsonp||[]).push([[47],{318:function(t,e,a){"use strict";a.r(e);var s=a(13),v=Object(s.a)({},(function(){var t=this,e=t._self._c;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h2",{attrs:{id:"web-安全"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#web-安全"}},[t._v("#")]),t._v(" web 安全")]),t._v(" "),e("blockquote",[e("p",[t._v("笔记整理")])]),t._v(" "),e("h3",{attrs:{id:"xss"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#xss"}},[t._v("#")]),t._v(" XSS")]),t._v(" "),e("blockquote",[e("p",[t._v("XSS(Cross Site Script)，跨站脚本攻击，因为缩写和CSS(Cascading Style Sheets)重叠，所以只能叫XSS。")])]),t._v(" "),e("p",[t._v("XSS的原理是恶意攻击者往Web页面里插入恶意可执行网页脚本代码，浏览器无法分辨哪些是可信脚本，当用户浏览页面时恶意代码被执行，读取 cookie，session tokens，或者其它敏感的网站信息，从而可以达到攻击者盗取用户信息或其他侵犯用户安全隐私的目的。")]),t._v(" "),e("h4",{attrs:{id:"反射型xss-非持久型xss"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#反射型xss-非持久型xss"}},[t._v("#")]),t._v(" 反射型XSS（非持久型XSS）")]),t._v(" "),e("p",[t._v("通过URL传递参数功能，当用户打开带有恶意脚本代码参数的URL时，恶意代码参数被解析并执行。")]),t._v(" "),e("p",[t._v("特征：")]),t._v(" "),e("blockquote",[e("ul",[e("li",[t._v("即时性，不经过服务器存储，直接通过 HTTP 的 GET 和 POST 请求就能完成一次攻击，拿到用户隐私数据。")]),t._v(" "),e("li",[t._v("攻击者需要诱骗点击")]),t._v(" "),e("li",[t._v("反馈率低，所以较难发现和响应修复")]),t._v(" "),e("li",[t._v("盗取用户敏感保密信息")])])]),t._v(" "),e("p",[t._v("预防：")]),t._v(" "),e("blockquote",[e("ul",[e("li",[t._v("Web 页面渲染的所有内容或者渲染的数据都必须来自于服务端。")]),t._v(" "),e("li",[t._v("尽量不要从 URL，document.referrer，document.forms 等这种 DOM API 中获取数据直接渲染。")]),t._v(" "),e("li",[t._v("尽量不要使用 eval, new Function()，document.write()，document.writeln()，window.setInterval()，window.setTimeout()，innerHTML，document.creteElement() 等可执行字符串的方法。")]),t._v(" "),e("li",[t._v("如果做不到以上几点，也必须对涉及 DOM 渲染的方法传入的字符串参数做 escape 转义。")]),t._v(" "),e("li",[t._v("前端渲染的时候对任何的字段都需要做 escape 转义编码。（escape 转义的目的是将一些构成 HTML 标签的元素转义，比如 <，>，空格 等，转义成 <，>，  等显示转义字符。有很多开源的工具可以协助我们做 escape 转义。）")])])]),t._v(" "),e("h4",{attrs:{id:"存储型-xss-持久型xss"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#存储型-xss-持久型xss"}},[t._v("#")]),t._v(" 存储型 XSS（持久型XSS）")]),t._v(" "),e("p",[t._v("恶意脚本存储在目标服务器上，攻击者在表单提交时将恶意代码提交到数据库中，常见于带有用户保存数据的网站功能，如论坛发帖、商品评论、用户私信等。")]),t._v(" "),e("p",[t._v("特征：")]),t._v(" "),e("blockquote",[e("ul",[e("li",[t._v("持久性，存在数据库中")]),t._v(" "),e("li",[t._v("盗取用户敏感私密信息")])])]),t._v(" "),e("p",[t._v("预防：")]),t._v(" "),e("p",[t._v("前端传给服务器前，服务器存到数据库前，服务器传给前端前，前端接收到服务器返回做展示前，都要做好转义和过滤。")]),t._v(" "),e("h4",{attrs:{id:"dom-型-xss"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#dom-型-xss"}},[t._v("#")]),t._v(" DOM 型 XSS")]),t._v(" "),e("p",[t._v("一般由于前端js代码不够严谨，把不可信的用户输入插入到页面造成。")]),t._v(" "),e("p",[t._v("预防：")]),t._v(" "),e("blockquote",[e("p",[t._v("在使用 .innerHTML、.outerHTML、.appendChild、document.write()等API时要特别小心，不要把不可信的数据作为 HTML 插到页面上，尽量使用 .innerText、.textContent、.setAttribute() 等。")]),t._v(" "),e("p",[t._v("对输入内容进行转义(DOM 中的内联事件监听器和链接跳转都能把字符串作为代码运行，需要对其内容进行检查)。")])]),t._v(" "),e("h4",{attrs:{id:"基于字符集的-xss"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#基于字符集的-xss"}},[t._v("#")]),t._v(" 基于字符集的 XSS")]),t._v(" "),e("p",[t._v("由于浏览器在 meta 没有指定 charset 的时候有自动识别编码的机制，用户输入非期望字符集的字符绕过转义过滤规则。")]),t._v(" "),e("p",[t._v("预防：")]),t._v(" "),e("blockquote",[e("ul",[e("li",[t._v("记住指定 "),e("code",[t._v('<meta charset="utf-8">')])]),t._v(" "),e("li",[t._v("XML 中不仅要指定字符集为 utf-8，而且标签要闭合")])])]),t._v(" "),e("h4",{attrs:{id:"未经验证的跳转-xss"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#未经验证的跳转-xss"}},[t._v("#")]),t._v(" 未经验证的跳转 XSS")]),t._v(" "),e("p",[t._v("302状态码临时重定向跳转可能带有用户敏感信息，如果服务器端返回的跳转地址来自用户输入，攻击者可以输入一个恶意的跳转地址来执行脚本。")]),t._v(" "),e("p",[t._v("预防：")]),t._v(" "),e("blockquote",[e("ul",[e("li",[t._v("对待跳转的 URL 参数做白名单或者某种规则过滤")]),t._v(" "),e("li",[t._v("后端注意对敏感信息的保护, 比如 cookie 使用来源验证")])])]),t._v(" "),e("h3",{attrs:{id:"csrf"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#csrf"}},[t._v("#")]),t._v(" CSRF")]),t._v(" "),e("p",[t._v("CSRF（Cross-site request forgery）跨站请求伪造，攻击者诱导受害者进入第三方网站，冒用用户在cookie中保存的已登录的身份信息发送各种请求。")]),t._v(" "),e("p",[t._v("预防：")]),t._v(" "),e("ul",[e("li",[t._v("为每个POST请求增加验证码")]),t._v(" "),e("li",[t._v("为每个用户生成一个唯一的token，用户在提交请求时携带token（）")]),t._v(" "),e("li",[t._v("利用 Samesite Cookie属性")])]),t._v(" "),e("p",[t._v("服务器响应头的"),e("code",[t._v("Set-Cookie")]),t._v("字段，可以为cookie设置Samesite Cookie属性，Samesite Cookie属性可以让 Cookie 在"),e("strong",[t._v("跨站")]),t._v("请求时不会被发送。")]),t._v(" "),e("blockquote",[e("p",[t._v("跨站和跨域是不同的。")]),t._v(" "),e("p",[t._v("Cookie中的「同站」判断：\n只要两个 URL 的 eTLD+1 相同即可，不需要考虑协议和端口。\n其中，eTLD 表示有效顶级域名，注册于 Mozilla 维护的公共后缀列表（Public Suffix List）中，例如，.com、.co.uk、.github.io 等。\neTLD+1 则表示，有效顶级域名+二级域名，例如 taobao.com 等。")])]),t._v(" "),e("p",[t._v("例如：")]),t._v(" "),e("blockquote",[e("p",[t._v("www.taobao.com 和 www.baidu.com 是跨站，www.a.taobao.com 和 www.b.taobao.com 是同站，a.github.io 和 b.github.io 是跨站(注意是跨站)。")])]),t._v(" "),e("p",[t._v("SameSite有三种取值：")]),t._v(" "),e("p",[e("code",[t._v("Strict")]),t._v(" 仅允许一方请求携带 Cookie，即浏览器将只发送相同站点请求的 Cookie，即当前网页 URL 与请求目标 URL 完全一致。")]),t._v(" "),e("p",[e("code",[t._v("Lax")]),t._v(" 允许部分第三方请求携带 Cookie")]),t._v(" "),e("p",[e("code",[t._v("None")]),t._v(" 无论是否跨站都会发送 Cookie")]),t._v(" "),e("p",[t._v("之前默认是 None 的，Chrome80 后默认是 Lax。")]),t._v(" "),e("h3",{attrs:{id:"点击劫持"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#点击劫持"}},[t._v("#")]),t._v(" 点击劫持")]),t._v(" "),e("blockquote",[e("p",[t._v("点击劫持是指在一个Web页面中隐藏了一个透明的iframe，用外层假页面诱导用户点击。")])]),t._v(" "),e("p",[t._v("预防：")]),t._v(" "),e("blockquote",[e("ol",[e("li",[t._v("Frame busting")])]),t._v(" "),e("div",{staticClass:"language-js extra-class"},[e("pre",{pre:!0,attrs:{class:"language-js"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("top"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("location "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("!=")]),t._v(" window"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("location")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    top"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("location "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" window"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("location\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),e("p",[t._v("需要注意的是: HTML5中iframe的 sandbox 属性、IE中iframe的security 属性等，都可以限制iframe页面中的JavaScript脚本执行，从而可以使得 frame busting 失效。\n2. X-Frame-Options\nX-FRAME-OPTIONS是微软提出的一个http头，专门用来防御利用iframe嵌套的点击劫持攻击。并且在IE8、Firefox3.6、Chrome4以上的版本均能很好的支持。\n可以设置为以下值: deny: 拒绝任何域加载、sameorigin: 允许同源域下加载、allow-from: 可以定义允许frame加载的页面地址")])]),t._v(" "),e("h3",{attrs:{id:"sql-注入"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#sql-注入"}},[t._v("#")]),t._v(" SQL 注入")]),t._v(" "),e("blockquote",[e("p",[t._v("没有有效的转义过滤用户的输入，使攻击者成功的向服务器提交恶意的 SQL 查询代码。")])]),t._v(" "),e("p",[t._v("SQL 查询可以绕开访问控制，从而绕过身份验证和权限检查，甚至有可能通过 SQL 查询去运行主机系统级的命令。")]),t._v(" "),e("p",[t._v("预防：")]),t._v(" "),e("blockquote",[e("ul",[e("li",[t._v("严格限制Web应用的数据库的操作权限")]),t._v(" "),e("li",[t._v("后端代码检查输入的数据是否符合预期，严格限制变量的类型")]),t._v(" "),e("li",[t._v("对进入数据库的特殊字符（'，\"，\\，<，>，&，*，; 等）进行转义处理，或编码转换")]),t._v(" "),e("li",[t._v("所有的查询语句建议使用数据库提供的参数化查询接口")]),t._v(" "),e("li",[t._v("在应用发布之前建议使用专业的 SQL 注入检测工具进行检测")]),t._v(" "),e("li",[t._v("避免网站打印出 SQL 错误信息")]),t._v(" "),e("li",[t._v("不要过于细化返回的错误信息")])])]),t._v(" "),e("h3",{attrs:{id:"命令行注入"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#命令行注入"}},[t._v("#")]),t._v(" 命令行注入")]),t._v(" "),e("blockquote",[e("p",[t._v("通过 HTTP 请求直接侵入主机，执行攻击者预设的 shell 命令。")])]),t._v(" "),e("p",[t._v("预防：")]),t._v(" "),e("blockquote",[e("ul",[e("li",[t._v("后端对前端提交内容需要完全选择不相信，并且对其进行规则限制（比如正则表达式）")]),t._v(" "),e("li",[t._v("在调用系统命令前对所有传入参数进行命令行参数转义过滤")]),t._v(" "),e("li",[t._v("不要直接拼接命令语句，借助一些工具做拼接、转义预处理")])])]),t._v(" "),e("h3",{attrs:{id:"ddos-攻击"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#ddos-攻击"}},[t._v("#")]),t._v(" DDoS 攻击")]),t._v(" "),e("blockquote",[e("p",[t._v("DDoS 又叫分布式拒绝服务，全称 Distributed Denial of Service，其原理就是利用大量的请求造成资源过载，导致服务不可用。")])]),t._v(" "),e("p",[t._v("参见"),e("a",{attrs:{href:"https://zoumiaojiang.com/article/common-web-security/#xss",target:"_blank",rel:"noopener noreferrer"}},[t._v("常见 Web 安全攻防总结"),e("OutboundLink")],1)]),t._v(" "),e("h3",{attrs:{id:"流量劫持"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#流量劫持"}},[t._v("#")]),t._v(" 流量劫持")]),t._v(" "),e("h4",{attrs:{id:"dns-劫持-域名劫持"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#dns-劫持-域名劫持"}},[t._v("#")]),t._v(" DNS 劫持（域名劫持）")]),t._v(" "),e("p",[t._v("网络运营商与黑产勾结，或者是电脑中毒被恶意篡改了路由器的DNS配置。")]),t._v(" "),e("h4",{attrs:{id:"http-劫持"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#http-劫持"}},[t._v("#")]),t._v(" HTTP 劫持")]),t._v(" "),e("blockquote",[e("p",[t._v("不法运营商和黑产勾结能够截获HTTP请求返回内容，并且能够篡改内容，然后再返回给用户，从而实现劫持页面，轻则插入小广告，重则直接篡改成钓鱼网站页面骗用户隐私。")]),t._v(" "),e("p",[t._v("能够实施流量劫持的根本原因，是HTTP协议没有办法对通信对方的身份进行校验以及对数据完整性进行校验。")])]),t._v(" "),e("p",[t._v("预防：使用HTTPS")]),t._v(" "),e("h3",{attrs:{id:"服务器漏洞"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#服务器漏洞"}},[t._v("#")]),t._v(" 服务器漏洞")]),t._v(" "),e("p",[t._v("越权操作漏洞、目录遍历漏洞、物理路径泄漏、源码暴露漏洞")]),t._v(" "),e("p",[t._v("参见"),e("a",{attrs:{href:"https://zoumiaojiang.com/article/common-web-security/#xss",target:"_blank",rel:"noopener noreferrer"}},[t._v("常见 Web 安全攻防总结"),e("OutboundLink")],1)]),t._v(" "),e("h3",{attrs:{id:"参考"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#参考"}},[t._v("#")]),t._v(" 参考")]),t._v(" "),e("p",[e("a",{attrs:{href:"https://juejin.cn/post/6844903842635579405",target:"_blank",rel:"noopener noreferrer"}},[t._v("【面试篇】寒冬求职之你必须要懂的Web安全"),e("OutboundLink")],1)]),t._v(" "),e("p",[e("a",{attrs:{href:"https://zoumiaojiang.com/article/common-web-security/#xss",target:"_blank",rel:"noopener noreferrer"}},[t._v("常见 Web 安全攻防总结"),e("OutboundLink")],1)])])}),[],!1,null,null,null);e.default=v.exports}}]);