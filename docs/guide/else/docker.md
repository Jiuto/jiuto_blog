## 如何使用docker发布项目

> 本文将从docker的简单介绍，以及如何在docker上运行一个前端项目，讲到我曾经接触过的如何利用docker实现前端的自动化部署。
>
> 我对docker的了解也不深，只是基于自己的一丁点经验做一个前端发布的流程整理，同时帮助其他小白同学入门，如有错误，欢迎指正。

### 什么是docker

> Docker 属于 Linux 容器的一种封装，提供简单易用的容器使用接口。

#### 背景知识

详细版传送门：[Docker 入门教程-阮一峰](http://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html)

简化版：

大家都是开发者，知道配置环境的麻烦和难处，操作系统的设置、各种库和组件的安装，以及各个版本之间的兼容问题。

虚拟机是一种解决方案，但存在资源占用多、冗余步骤多、启动慢等缺点。

于是发展出来另一种虚拟化技术：Linux容器（Linux Containers，LXC）。LXC不模拟完整的操作系统，而是对进程进行隔离。由于容器是进程级别的，相比虚拟机启动快、资源占用少、体积小。

#### 镜像和容器

[Docker](https://www.docker.com/) 将应用程序与该程序的依赖，打包在一个文件里面，这个文件称为一个image镜像，运行镜像文件，会生成一个container容器实例。我们的程序，就在这个容器实例中运行。

---

### docker的一些基础命令

> docker的安装这里就不讲了，大家自己去网上搜。

[docker hub](https://hub.docker.com/)是docker的镜像仓库，我们可以在docker hub上搜索我们想要的镜像，比如nginx：

<img :src="$withBase('/imgs/else/docker/dockerhub.png')" alt="dockerhub">

+ 通过`docker pull nginx`命令，默认拉取最新版本的nginx镜像。在Tags列表中，我们也可以看到历史各个版本的镜像，通过`:`+`对应版本的tagName`获取指定版本的镜像。

+ `docker run`命令用于运行镜像，生成一个容器实例。
+ 通过`docker ps -a`可以查看所有容器及其运行状态。
+ `docker start containName`运行容器。
+ `docker restart containName`重启容器。
+ `docker stop containName`停止运行容器。
+ `docker logs`查看容器输出日志。
+ `docker rm`删除指定容器。
+ `docker rmi`删除指定镜像。

[docker 命令列表](https://docs.docker.com/engine/reference/commandline/run/)

---

### 什么是Dockerfile

> A `Dockerfile` is a text document that contains all the commands a user could call on the command line to assemble an image. 

Dockerfile是一个文本文件，包含了配置一个image镜像所有可以调用的命令。

这话其实有点歧义，实际上，并不是说它真的包含每一个命令，而是说当我们想要生成一个image镜像时，Docker会根据该文件中指定的命令，来生成二进制的 image 文件。

#### 举一个栗子🌰

**场景**：在docker中运行mysql容器，希望免去初始化数据库的操作。

如果我们直接`docker pull mysql`，然后`docker run`，显然没有应用到我们的`init.sql`文件。

这个时候就可以写一个Dockerfile，来帮助我们构建一个想要的、直接完成初始化配置的镜像。

**步骤**：夹带私货传送门：[通过Dockerfile在docker中初始化mysql表](https://jiuto.github.io/jiuto_blog/guide/else/docker_initSql.html)

1. 在当前docker命令行目录下，新建一个Dockerfile文件，代码如下：

``` js
FROM mysql:5.7
WORKDIR /docker-entrypoint-initdb.d
ENV LANG=C.UTF-8
ADD init.sql .
```

​    其中，init.sql即mysql初始化需要执行的文件，需和Dockerfile文件在同一目录。

​	这些命令是什么意思呢？大意就是基于mysql:5.7这个镜像，指定工作路径，设定环境变量，增加文件到指定目录。

2. 在docker中通过`docker pull mysql:5.7`（以5.7版本为例）拉取mysql镜像，完成后通过`docker images`可查看image镜像列表。

3. 在docker当前目录（Dockerfile所在目录）下执行`docker build -t mysql:5.7task .`构建tag名为"5.7task"的mysql镜像。

4. 执行`docker run --name mysqltask -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.7task`

​    运行名为"mysqltask"的容器，--name指定容器名，-p容器内部端口映射主机端口，-e设置环境变量，-d后台运行容器。

 5. ...

    后面的步骤就不说了，到这里我们已经知道Dockerfile是什么了。

---

### 如何用docker运行一个前端项目

这个问题其实很简单，和docker没有太大关系，换一个nginx容器罢了。

将前端打包好的资源文件映射到容器的`/usr/share/nginx/html/`，再做好配置文件映射即可。

大家可以参考这篇文章，传送门：[Nginx 容器教程-阮一峰](http://www.ruanyifeng.com/blog/2018/02/nginx-docker.html)

---

### 我曾使用过的自动化部署流程

我曾参与过一个使用[coding](https://coding.net/)进行管理的项目，这边简单介绍一下这个项目是如何完成自动化部署的。

#### 简单讲讲用coding持续集成

coding提供了很多构建计划的模版，可以直接使用，也可以自定义。

<img :src="$withBase('/imgs/else/docker/coding.png')" alt="coding">

coding的持续集成帮我们做了哪些？

实际上，我们除了新增一个Dockerfile和构建节点，其余都由coding完成。

<img :src="$withBase('/imgs/else/docker/dockerfile.png')" alt="dockerfile">

这个Dockerfile就不需要解释了，看一看构建的节点做了什么。

<img :src="$withBase('/imgs/else/docker/process1.png')" alt="process1">

<img :src="$withBase('/imgs/else/docker/process2.png')" alt="process2">

#### 在本地完成手动部署？

[自动化部署工具(by Ken-ding)](https://github.com/dc-ken-jiu/dc-deploy)

在已完成镜像的前提下，这个工具使得我们只要在本地运行`npm run deploy`即可完成更新部署。

**步骤**：

1. 首先当然是安装工具依赖

2. 在项目根目录创建一个`deploy.js`文件，传入配置

<img :src="$withBase('/imgs/else/docker/deploy.png')" alt="deploy">

3. 在`package.json`中配置deploy命令：

   ``` js
   "scripts": {
       "deploy": "node deploy.js"
   },
   ```

**dc-deploy做了什么？**

<img :src="$withBase('/imgs/else/docker/deployfun.png')" alt="deployfun">

根据传入的配置完成打包-压缩-连接服务器-删除远程文件-上次文件-解压文件-查找容器。前面就不看了，看一下查找容器这一步。

<img :src="$withBase('/imgs/else/docker/searchCon.png')" alt="searchCon">

通过`docker ps`查找容器，-q只显示容器编号，-f根据条件过滤显示的内容。

找到容器执行`docker restart`，没找到`docker run --name ${containName} -d -p ${exportPort}:80 -v ${webDir}:/usr/share/nginx/html -v ${webRootDir}/conf/nginx.conf:/etc/nginx/nginx.conf -v ${webRootDir}/conf.d:/etc/nginx/conf.d -v ${webRootDir}/logs:/var/log/nginx nginx`创建新容器。

---

### 结束语

这篇文章暂时就这样结束了，当然目的不是给大家介绍coding或是夹带私货，这些工具都不是重点，介绍他们的目的，只是为了让大家明白，用docker发布项目，本质上都是一样的：

不过是创建镜像并运行容器实例罢了。