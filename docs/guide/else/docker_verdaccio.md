## 在docker中通过Verdaccio搭建一个私有npm库


### 拉取镜像

1. 执行`docker pull verdaccio/verdaccio`命令，在docker中拉取最新的Verdaccio镜像

### 获取配置文件

2. 执行`mkdir -p ~/docker/demo`命令，在根目录下创建docker文件夹，demo子文件夹用于拉取[verdaccio项目](https://github.com/verdaccio/verdaccio)

3. 执行`cd ~/docker/demo`命令进入demo件夹，
执行`git clone https://github.com/verdaccio/verdaccio`命令，拉取verdaccio项目

4. 执行`cd verdaccio`命令进入项目文件夹，
执行`git checkout -b 5.x origin/5.x`命令，切换到"5.x"这个分支

5. 执行`cd docker-examples`命令进入docker-examples文件夹，
执行`mv docker-local-storage-volume ~/docker/verdaccio`将docker-local-storage-volume下的配置文件移动到docker下新建的verdaccio文件夹

6. 执行`chown -R 10001:65533 ~/docker/verdaccio`设置文件权限，docker环境下verdaccio容器中用户不是当前系统用户

### 启动镜像

7. 执行`docker run --name verdaccio -itd -v ~/docker/verdaccio/conf:/verdaccio/conf -v ~/docker/verdaccio/storage:/verdaccio/storage -p 4873:4873 verdaccio/verdaccio`命令启动镜像，
此时通过`docker ps -a`可以看到容器已经启动，访问4873端口可以看到仓库已经好了（我自己的dockerIP是http://192.168.99.100:4873/下文以此为例）

<img :src="$withBase('/imgs/docker_verdaccio/docker.png')" alt="docker">

<img :src="$withBase('/imgs/docker_verdaccio/verdaccio.png')" alt="verdaccio">

### 发布包

8. 有nrm的可以通过`nrm add 仓库命 仓库地址`增加一个源，如`nrm add verdaccio http://192.168.99.100:4873/`，
没有的`npm set registry http://192.168.99.100:4873/`，就是每次切换都要输url太麻烦

9. 执行`npm adduser`，按提示输入用户名、密码、邮箱增加用户，也可以自己去配置文件`docker\verdaccio\conf\htpasswd`下手动加

10. 执行`npm login`登录

11. 在要发布的包目录下执行`npm publish`

12. 撤销包可用`npm unpublish 包名 --force`

<img :src="$withBase('/imgs/docker_verdaccio/npm.png')" alt="已发布的包">

#### 报错

13. 如果有`docker verdaccio one of the uplinks is down, refuse to publish`报错，
则需要修改配置文件`docker\verdaccio\conf\config.yaml`，在文件后面加上

```
## Special packages publish configurations
publish:
## This will allow the publisher to publish packages even if any uplink is down.
  allow_offline: true
```
<img :src="$withBase('/imgs/docker_verdaccio/config.png')" alt="config">
