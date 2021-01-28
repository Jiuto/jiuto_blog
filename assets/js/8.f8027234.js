(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{366:function(e,t,o){"use strict";o.r(t);var s=o(42),l=Object(s.a)({},(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[o("h2",{attrs:{id:"通过dockerfile在docker中初始化mysql表"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#通过dockerfile在docker中初始化mysql表"}},[e._v("#")]),e._v(" 通过Dockerfile在docker中初始化mysql表")]),e._v(" "),o("ol",[o("li",[o("p",[e._v("在当前docker命令行目录下，新建一个Dockerfile文件，代码如下")]),e._v(" "),o("div",{staticClass:"language- extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v("FROM mysql:5.7\nWORKDIR /docker-entrypoint-initdb.d\nENV LANG=C.UTF-8\nADD init.sql .\n")])])]),o("p",[e._v("其中，init.sql即mysql初始化需要执行的文件，需和Dockerfile文件在同一目录")])]),e._v(" "),o("li",[o("p",[e._v("在docker中通过"),o("code",[e._v("docker pull mysql:5.7")]),e._v("（以5.7版本为例）拉取mysql镜像，完成后通过"),o("code",[e._v("docker images")]),e._v("可查看image镜像列表\nwin10使用docker toolbox需要换源可参考 "),o("a",{attrs:{href:"https://www.cnblogs.com/cielosun/p/11113863.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("Docker toolbox换源"),o("OutboundLink")],1)])]),e._v(" "),o("li",[o("p",[e._v("在docker当前目录（Dockerfile所在目录）下执行"),o("code",[e._v("docker build -t mysql:5.7task .")]),e._v('构建tag名为"5.7task"的mysql镜像')])]),e._v(" "),o("li",[o("p",[e._v("执行"),o("code",[e._v("docker run --name mysqltask -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.7task")]),e._v('运行名为"mysqltask"的容器并初始化密码为123456，通过'),o("code",[e._v("docker ps -a")]),e._v("可以查看所有容器及其运行状态")])]),e._v(" "),o("li",[o("p",[e._v("通过"),o("code",[e._v("docker start mysqltask")]),e._v('即可运行"mysqltask"')])]),e._v(" "),o("li",[o("p",[e._v("此时数据库已初始化完毕，通过"),o("code",[e._v("docker exec -it mysqltask /bin/bash")]),e._v("进入容器内部，使用"),o("code",[e._v("mysql -uroot -p123456")]),e._v("连接数据库即可进行验证初始化的内容，当然也可下个navicat连接docker映射的端口可视化操作")])])])])}),[],!1,null,null,null);t.default=l.exports}}]);