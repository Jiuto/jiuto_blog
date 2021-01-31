## 通过Dockerfile在docker中初始化mysql表

1. 在当前docker命令行目录下，新建一个Dockerfile文件，代码如下
    ```
    FROM mysql:5.7
    WORKDIR /docker-entrypoint-initdb.d
    ENV LANG=C.UTF-8
    ADD init.sql .
    ```
	其中，init.sql即mysql初始化需要执行的文件，需和Dockerfile文件在同一目录

2. 在docker中通过`docker pull mysql:5.7`（以5.7版本为例）拉取mysql镜像，完成后通过`docker images`可查看image镜像列表

	win10使用docker toolbox需要换源可参考 [Docker toolbox换源](https://www.cnblogs.com/cielosun/p/11113863.html)

3. 在docker当前目录（Dockerfile所在目录）下执行`docker build -t mysql:5.7task .`构建tag名为"5.7task"的mysql镜像

4. 执行`docker run --name mysqltask -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.7task`

    运行名为"mysqltask"的容器并初始化密码为123456，通过`docker ps -a`可以查看所有容器及其运行状态

5. 通过`docker start mysqltask`即可运行"mysqltask"

6. 此时数据库已初始化完毕，通过`docker exec -it mysqltask /bin/bash`进入容器内部，
使用`mysql -uroot -p123456`连接数据库即可进行验证初始化的内容，当然也可下个navicat连接docker映射的端口可视化操作
