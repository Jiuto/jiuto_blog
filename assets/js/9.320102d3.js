(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{367:function(e,c,r){"use strict";r.r(c);var o=r(42),a=Object(o.a)({},(function(){var e=this,c=e.$createElement,r=e._self._c||c;return r("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[r("h2",{attrs:{id:"在docker中通过verdaccio搭建一个私有npm库"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#在docker中通过verdaccio搭建一个私有npm库"}},[e._v("#")]),e._v(" 在docker中通过Verdaccio搭建一个私有npm库")]),e._v(" "),r("h3",{attrs:{id:"拉取镜像"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#拉取镜像"}},[e._v("#")]),e._v(" 拉取镜像")]),e._v(" "),r("ol",[r("li",[e._v("执行"),r("code",[e._v("docker pull verdaccio/verdaccio")]),e._v("命令，在docker中拉取最新的Verdaccio镜像")])]),e._v(" "),r("h3",{attrs:{id:"获取配置文件"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#获取配置文件"}},[e._v("#")]),e._v(" 获取配置文件")]),e._v(" "),r("ol",{attrs:{start:"2"}},[r("li",[r("p",[e._v("执行"),r("code",[e._v("mkdir -p ~/docker/demo")]),e._v("命令，在根目录下创建docker文件夹，demo子文件夹用于拉取"),r("a",{attrs:{href:"https://github.com/verdaccio/verdaccio",target:"_blank",rel:"noopener noreferrer"}},[e._v("verdaccio项目"),r("OutboundLink")],1)])]),e._v(" "),r("li",[r("p",[e._v("执行"),r("code",[e._v("cd ~/docker/demo")]),e._v("命令进入demo件夹，\n执行"),r("code",[e._v("git clone https://github.com/verdaccio/verdaccio")]),e._v("命令，拉取verdaccio项目")])]),e._v(" "),r("li",[r("p",[e._v("执行"),r("code",[e._v("cd verdaccio")]),e._v("命令进入项目文件夹，\n执行"),r("code",[e._v("git checkout -b 5.x origin/5.x")]),e._v('命令，切换到"5.x"这个分支')])]),e._v(" "),r("li",[r("p",[e._v("执行"),r("code",[e._v("cd docker-examples")]),e._v("命令进入docker-examples文件夹，\n执行"),r("code",[e._v("mv docker-local-storage-volume ~/docker/verdaccio")]),e._v("将docker-local-storage-volume下的配置文件移动到docker下新建的verdaccio文件夹")])]),e._v(" "),r("li",[r("p",[e._v("执行"),r("code",[e._v("chown -R 10001:65533 ~/docker/verdaccio")]),e._v("设置文件权限，docker环境下verdaccio容器中用户不是当前系统用户")])])]),e._v(" "),r("h3",{attrs:{id:"启动镜像"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#启动镜像"}},[e._v("#")]),e._v(" 启动镜像")]),e._v(" "),r("ol",{attrs:{start:"7"}},[r("li",[e._v("执行"),r("code",[e._v("docker run --name verdaccio -itd -v ~/docker/verdaccio/conf:/verdaccio/conf -v ~/docker/verdaccio/storage:/verdaccio/storage -p 4873:4873 verdaccio/verdaccio")]),e._v("命令启动镜像，\n此时通过"),r("code",[e._v("docker ps -a")]),e._v("可以看到容器已经启动，访问4873端口可以看到仓库已经好了（我自己的dockerIP是http://192.168.99.100:4873/下文以此为例）")])]),e._v(" "),r("img",{attrs:{src:e.$withBase("/imgs/docker_verdaccio/docker.png"),alt:"docker"}}),e._v(" "),r("img",{attrs:{src:e.$withBase("/imgs/docker_verdaccio/verdaccio.png"),alt:"verdaccio"}}),e._v(" "),r("h3",{attrs:{id:"发布包"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#发布包"}},[e._v("#")]),e._v(" 发布包")]),e._v(" "),r("ol",{attrs:{start:"8"}},[r("li",[r("p",[e._v("有nrm的可以通过"),r("code",[e._v("nrm add 仓库命 仓库地址")]),e._v("增加一个源，如"),r("code",[e._v("nrm add verdaccio http://192.168.99.100:4873/")]),e._v("，\n没有的"),r("code",[e._v("npm set registry http://192.168.99.100:4873/")]),e._v("，就是每次切换都要输url太麻烦")])]),e._v(" "),r("li",[r("p",[e._v("执行"),r("code",[e._v("npm adduser")]),e._v("，按提示输入用户名、密码、邮箱增加用户，也可以自己去配置文件"),r("code",[e._v("docker\\verdaccio\\conf\\htpasswd")]),e._v("下手动加")])]),e._v(" "),r("li",[r("p",[e._v("执行"),r("code",[e._v("npm login")]),e._v("登录")])]),e._v(" "),r("li",[r("p",[e._v("在要发布的包目录下执行"),r("code",[e._v("npm publish")])])]),e._v(" "),r("li",[r("p",[e._v("撤销包可用"),r("code",[e._v("npm unpublish 包名 --force")])])])]),e._v(" "),r("img",{attrs:{src:e.$withBase("/imgs/docker_verdaccio/npm.png"),alt:"已发布的包"}}),e._v(" "),r("h4",{attrs:{id:"报错"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#报错"}},[e._v("#")]),e._v(" 报错")]),e._v(" "),r("ol",{attrs:{start:"13"}},[r("li",[e._v("如果有"),r("code",[e._v("docker verdaccio one of the uplinks is down, refuse to publish")]),e._v("报错，\n则需要修改配置文件"),r("code",[e._v("docker\\verdaccio\\conf\\config.yaml")]),e._v("，在文件后面加上")])]),e._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[e._v("## Special packages publish configurations\npublish:\n## This will allow the publisher to publish packages even if any uplink is down.\n  allow_offline: true\n")])])]),r("img",{attrs:{src:e.$withBase("/imgs/docker_verdaccio/config.png"),alt:"config"}})])}),[],!1,null,null,null);c.default=a.exports}}]);