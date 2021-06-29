(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{372:function(e,t,r){"use strict";r.r(t);var s=r(44),a=Object(s.a)({},(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[r("h2",{attrs:{id:"如何使用docker发布项目"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#如何使用docker发布项目"}},[e._v("#")]),e._v(" 如何使用docker发布项目")]),e._v(" "),r("blockquote",[r("p",[e._v("本文将从docker的简单介绍，以及如何在docker上运行一个前端项目，讲到我曾经接触过的如何利用docker实现前端的自动化部署。")]),e._v(" "),r("p",[e._v("我对docker的了解也不深，只是基于自己的一丁点经验做一个前端发布的流程整理，同时帮助其他小白同学入门，如有错误，欢迎指正。")])]),e._v(" "),r("h3",{attrs:{id:"什么是docker"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#什么是docker"}},[e._v("#")]),e._v(" 什么是docker")]),e._v(" "),r("blockquote",[r("p",[e._v("Docker 属于 Linux 容器的一种封装，提供简单易用的容器使用接口。")])]),e._v(" "),r("h4",{attrs:{id:"背景知识"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#背景知识"}},[e._v("#")]),e._v(" 背景知识")]),e._v(" "),r("p",[e._v("详细版传送门："),r("a",{attrs:{href:"http://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("Docker 入门教程-阮一峰"),r("OutboundLink")],1)]),e._v(" "),r("p",[e._v("简化版：")]),e._v(" "),r("p",[e._v("大家都是开发者，知道配置环境的麻烦和难处，操作系统的设置、各种库和组件的安装，以及各个版本之间的兼容问题。")]),e._v(" "),r("p",[e._v("虚拟机是一种解决方案，但存在资源占用多、冗余步骤多、启动慢等缺点。")]),e._v(" "),r("p",[e._v("于是发展出来另一种虚拟化技术：Linux容器（Linux Containers，LXC）。LXC不模拟完整的操作系统，而是对进程进行隔离。由于容器是进程级别的，相比虚拟机启动快、资源占用少、体积小。")]),e._v(" "),r("h4",{attrs:{id:"镜像和容器"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#镜像和容器"}},[e._v("#")]),e._v(" 镜像和容器")]),e._v(" "),r("p",[r("a",{attrs:{href:"https://www.docker.com/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Docker"),r("OutboundLink")],1),e._v(" 将应用程序与该程序的依赖，打包在一个文件里面，这个文件称为一个image镜像，运行镜像文件，会生成一个container容器实例。我们的程序，就在这个容器实例中运行。")]),e._v(" "),r("hr"),e._v(" "),r("h3",{attrs:{id:"docker的一些基础命令"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#docker的一些基础命令"}},[e._v("#")]),e._v(" docker的一些基础命令")]),e._v(" "),r("blockquote",[r("p",[e._v("docker的安装这里就不讲了，大家自己去网上搜。")])]),e._v(" "),r("p",[r("a",{attrs:{href:"https://hub.docker.com/",target:"_blank",rel:"noopener noreferrer"}},[e._v("docker hub"),r("OutboundLink")],1),e._v("是docker的镜像仓库，我们可以在docker hub上搜索我们想要的镜像，比如nginx：")]),e._v(" "),r("img",{attrs:{src:e.$withBase("/imgs/else/docker/dockerhub.png"),alt:"dockerhub"}}),e._v(" "),r("ul",[r("li",[r("p",[e._v("通过"),r("code",[e._v("docker pull nginx")]),e._v("命令，默认拉取最新版本的nginx镜像。在Tags列表中，我们也可以看到历史各个版本的镜像，通过"),r("code",[e._v(":")]),e._v("+"),r("code",[e._v("对应版本的tagName")]),e._v("获取指定版本的镜像。")])]),e._v(" "),r("li",[r("p",[r("code",[e._v("docker run")]),e._v("命令用于运行镜像，生成一个容器实例。")])]),e._v(" "),r("li",[r("p",[e._v("通过"),r("code",[e._v("docker ps -a")]),e._v("可以查看所有容器及其运行状态。")])]),e._v(" "),r("li",[r("p",[r("code",[e._v("docker start containName")]),e._v("运行容器。")])]),e._v(" "),r("li",[r("p",[r("code",[e._v("docker restart containName")]),e._v("重启容器。")])]),e._v(" "),r("li",[r("p",[r("code",[e._v("docker stop containName")]),e._v("停止运行容器。")])]),e._v(" "),r("li",[r("p",[r("code",[e._v("docker logs")]),e._v("查看容器输出日志。")])]),e._v(" "),r("li",[r("p",[r("code",[e._v("docker rm")]),e._v("删除指定容器。")])]),e._v(" "),r("li",[r("p",[r("code",[e._v("docker rmi")]),e._v("删除指定镜像。")])])]),e._v(" "),r("p",[r("a",{attrs:{href:"https://docs.docker.com/engine/reference/commandline/run/",target:"_blank",rel:"noopener noreferrer"}},[e._v("docker 命令列表"),r("OutboundLink")],1)]),e._v(" "),r("hr"),e._v(" "),r("h3",{attrs:{id:"什么是dockerfile"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#什么是dockerfile"}},[e._v("#")]),e._v(" 什么是Dockerfile")]),e._v(" "),r("blockquote",[r("p",[e._v("A "),r("code",[e._v("Dockerfile")]),e._v(" is a text document that contains all the commands a user could call on the command line to assemble an image.")])]),e._v(" "),r("p",[e._v("Dockerfile是一个文本文件，包含了配置一个image镜像所有可以调用的命令。")]),e._v(" "),r("p",[e._v("这话其实有点歧义，实际上，并不是说它真的包含每一个命令，而是说当我们想要生成一个image镜像时，Docker会根据该文件中指定的命令，来生成二进制的 image 文件。")]),e._v(" "),r("h4",{attrs:{id:"举一个栗子🌰"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#举一个栗子🌰"}},[e._v("#")]),e._v(" 举一个栗子🌰")]),e._v(" "),r("p",[r("strong",[e._v("场景")]),e._v("：在docker中运行mysql容器，希望免去初始化数据库的操作。")]),e._v(" "),r("p",[e._v("如果我们直接"),r("code",[e._v("docker pull mysql")]),e._v("，然后"),r("code",[e._v("docker run")]),e._v("，显然没有应用到我们的"),r("code",[e._v("init.sql")]),e._v("文件。")]),e._v(" "),r("p",[e._v("这个时候就可以写一个Dockerfile，来帮助我们构建一个想要的、直接完成初始化配置的镜像。")]),e._v(" "),r("p",[r("strong",[e._v("步骤")]),e._v("：夹带私货传送门："),r("a",{attrs:{href:"https://jiuto.github.io/jiuto_blog/guide/else/docker_initSql.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("通过Dockerfile在docker中初始化mysql表"),r("OutboundLink")],1)]),e._v(" "),r("ol",[r("li",[e._v("在当前docker命令行目录下，新建一个Dockerfile文件，代码如下：")])]),e._v(" "),r("div",{staticClass:"language-js extra-class"},[r("pre",{pre:!0,attrs:{class:"language-js"}},[r("code",[r("span",{pre:!0,attrs:{class:"token constant"}},[e._v("FROM")]),e._v(" mysql"),r("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),r("span",{pre:!0,attrs:{class:"token number"}},[e._v("5.7")]),e._v("\n"),r("span",{pre:!0,attrs:{class:"token constant"}},[e._v("WORKDIR")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token operator"}},[e._v("/")]),e._v("docker"),r("span",{pre:!0,attrs:{class:"token operator"}},[e._v("-")]),e._v("entrypoint"),r("span",{pre:!0,attrs:{class:"token operator"}},[e._v("-")]),e._v("initdb"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),e._v("d\n"),r("span",{pre:!0,attrs:{class:"token constant"}},[e._v("ENV")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token constant"}},[e._v("LANG")]),r("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),r("span",{pre:!0,attrs:{class:"token constant"}},[e._v("C")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),r("span",{pre:!0,attrs:{class:"token constant"}},[e._v("UTF")]),r("span",{pre:!0,attrs:{class:"token operator"}},[e._v("-")]),r("span",{pre:!0,attrs:{class:"token number"}},[e._v("8")]),e._v("\n"),r("span",{pre:!0,attrs:{class:"token constant"}},[e._v("ADD")]),e._v(" init"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),e._v("sql "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),e._v("\n")])])]),r("p",[e._v("​    其中，init.sql即mysql初始化需要执行的文件，需和Dockerfile文件在同一目录。")]),e._v(" "),r("p",[e._v("​\t这些命令是什么意思呢？大意就是基于mysql:5.7这个镜像，指定工作路径，设定环境变量，增加文件到指定目录。")]),e._v(" "),r("ol",{attrs:{start:"2"}},[r("li",[r("p",[e._v("在docker中通过"),r("code",[e._v("docker pull mysql:5.7")]),e._v("（以5.7版本为例）拉取mysql镜像，完成后通过"),r("code",[e._v("docker images")]),e._v("可查看image镜像列表。")])]),e._v(" "),r("li",[r("p",[e._v("在docker当前目录（Dockerfile所在目录）下执行"),r("code",[e._v("docker build -t mysql:5.7task .")]),e._v('构建tag名为"5.7task"的mysql镜像。')])]),e._v(" "),r("li",[r("p",[e._v("执行"),r("code",[e._v("docker run --name mysqltask -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.7task")])])])]),e._v(" "),r("p",[e._v('​    运行名为"mysqltask"的容器，--name指定容器名，-p容器内部端口映射主机端口，-e设置环境变量，-d后台运行容器。')]),e._v(" "),r("ol",{attrs:{start:"5"}},[r("li",[r("p",[e._v("...")]),e._v(" "),r("p",[e._v("后面的步骤就不说了，到这里我们已经知道Dockerfile是什么了。")])])]),e._v(" "),r("hr"),e._v(" "),r("h3",{attrs:{id:"如何用docker运行一个前端项目"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#如何用docker运行一个前端项目"}},[e._v("#")]),e._v(" 如何用docker运行一个前端项目")]),e._v(" "),r("p",[e._v("这个问题其实很简单，和docker没有太大关系，换一个nginx容器罢了。")]),e._v(" "),r("p",[e._v("将前端打包好的资源文件映射到容器的"),r("code",[e._v("/usr/share/nginx/html/")]),e._v("，再做好配置文件映射即可。")]),e._v(" "),r("p",[e._v("大家可以参考这篇文章，传送门："),r("a",{attrs:{href:"http://www.ruanyifeng.com/blog/2018/02/nginx-docker.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("Nginx 容器教程-阮一峰"),r("OutboundLink")],1)]),e._v(" "),r("hr"),e._v(" "),r("h3",{attrs:{id:"我曾使用过的自动化部署流程"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#我曾使用过的自动化部署流程"}},[e._v("#")]),e._v(" 我曾使用过的自动化部署流程")]),e._v(" "),r("p",[e._v("我曾参与过一个使用"),r("a",{attrs:{href:"https://coding.net/",target:"_blank",rel:"noopener noreferrer"}},[e._v("coding"),r("OutboundLink")],1),e._v("进行管理的项目，这边简单介绍一下这个项目是如何完成自动化部署的。")]),e._v(" "),r("h4",{attrs:{id:"简单讲讲用coding持续集成"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#简单讲讲用coding持续集成"}},[e._v("#")]),e._v(" 简单讲讲用coding持续集成")]),e._v(" "),r("p",[e._v("coding提供了很多构建计划的模版，可以直接使用，也可以自定义。")]),e._v(" "),r("img",{attrs:{src:e.$withBase("/imgs/else/docker/coding.png"),alt:"coding"}}),e._v(" "),r("p",[e._v("coding的持续集成帮我们做了哪些？")]),e._v(" "),r("p",[e._v("实际上，我们除了新增一个Dockerfile和构建节点，其余都由coding完成。")]),e._v(" "),r("img",{attrs:{src:e.$withBase("/imgs/else/docker/dockerfile.png"),alt:"dockerfile"}}),e._v(" "),r("p",[e._v("这个Dockerfile就不需要解释了，看一看构建的节点做了什么。")]),e._v(" "),r("img",{attrs:{src:e.$withBase("/imgs/else/docker/process1.png"),alt:"process1"}}),e._v(" "),r("img",{attrs:{src:e.$withBase("/imgs/else/docker/process2.png"),alt:"process2"}}),e._v(" "),r("h4",{attrs:{id:"在本地完成手动部署"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#在本地完成手动部署"}},[e._v("#")]),e._v(" 在本地完成手动部署？")]),e._v(" "),r("p",[r("a",{attrs:{href:"https://github.com/dc-ken-jiu/dc-deploy",target:"_blank",rel:"noopener noreferrer"}},[e._v("自动化部署工具(by Ken-ding)"),r("OutboundLink")],1)]),e._v(" "),r("p",[e._v("在已完成镜像的前提下，这个工具使得我们只要在本地运行"),r("code",[e._v("npm run deploy")]),e._v("即可完成更新部署。")]),e._v(" "),r("p",[r("strong",[e._v("步骤")]),e._v("：")]),e._v(" "),r("ol",[r("li",[r("p",[e._v("首先当然是安装工具依赖")])]),e._v(" "),r("li",[r("p",[e._v("在项目根目录创建一个"),r("code",[e._v("deploy.js")]),e._v("文件，传入配置")])])]),e._v(" "),r("img",{attrs:{src:e.$withBase("/imgs/else/docker/deploy.png"),alt:"deploy"}}),e._v(" "),r("ol",{attrs:{start:"3"}},[r("li",[r("p",[e._v("在"),r("code",[e._v("package.json")]),e._v("中配置deploy命令：")]),e._v(" "),r("div",{staticClass:"language-js extra-class"},[r("pre",{pre:!0,attrs:{class:"language-js"}},[r("code",[r("span",{pre:!0,attrs:{class:"token string"}},[e._v('"scripts"')]),r("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n    "),r("span",{pre:!0,attrs:{class:"token string"}},[e._v('"deploy"')]),r("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[e._v('"node deploy.js"')]),e._v("\n"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n")])])])])]),e._v(" "),r("p",[r("strong",[e._v("dc-deploy做了什么？")])]),e._v(" "),r("img",{attrs:{src:e.$withBase("/imgs/else/docker/deployfun.png"),alt:"deployfun"}}),e._v(" "),r("p",[e._v("根据传入的配置完成打包-压缩-连接服务器-删除远程文件-上次文件-解压文件-查找容器。前面就不看了，看一下查找容器这一步。")]),e._v(" "),r("img",{attrs:{src:e.$withBase("/imgs/else/docker/searchCon.png"),alt:"searchCon"}}),e._v(" "),r("p",[e._v("通过"),r("code",[e._v("docker ps")]),e._v("查找容器，-q只显示容器编号，-f根据条件过滤显示的内容。")]),e._v(" "),r("p",[e._v("找到容器执行"),r("code",[e._v("docker restart")]),e._v("，没找到"),r("code",[e._v("docker run --name ${containName} -d -p ${exportPort}:80 -v ${webDir}:/usr/share/nginx/html -v ${webRootDir}/conf/nginx.conf:/etc/nginx/nginx.conf -v ${webRootDir}/conf.d:/etc/nginx/conf.d -v ${webRootDir}/logs:/var/log/nginx nginx")]),e._v("创建新容器。")]),e._v(" "),r("hr"),e._v(" "),r("h3",{attrs:{id:"结束语"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#结束语"}},[e._v("#")]),e._v(" 结束语")]),e._v(" "),r("p",[e._v("这篇文章暂时就这样结束了，当然目的不是给大家介绍coding或是夹带私货，这些工具都不是重点，介绍他们的目的，只是为了让大家明白，用docker发布项目，本质上都是一样的：")]),e._v(" "),r("p",[e._v("不过是创建镜像并运行容器实例罢了。")])])}),[],!1,null,null,null);t.default=a.exports}}]);