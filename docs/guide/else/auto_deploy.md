## 搭建一个自动化部署服务

> 本文讲述如何搭建一个前端自动化部署服务，示例项目代码参考[auto_deploy](https://github.com/Jiuto/auto_deploy.git)

> 部署服务前端只有一个简单的html，后端使用 koa，通过 pm2 启动。
> 服务功能实现通过 child_process 执行命令，使用 taskkill 杀死进程，部署的目标项目使用 http-server 启动。

> 需要提前在安装全局 pm2 和 http-server

---

### 编写部署服务

1. 部署服务项目的目录结构

<img :src="$withBase('/imgs/else/auto_deploy/file.png')" alt="目录结构">

static：用于存放目标项目打包后的文件

statichtml：用于存放部署服务的前端界面

app.js：部署服务的后端

2. 部署服务的依赖

``` js
"devDependencies": {
    "koa": "^2.13.0",
    "koa-mount": "^4.0.0",
    "taskkill": "^3.1.0"
}
```

3. 部署服务的后端

app.js

``` js
const fs = require('fs');
const koa = require('koa');
const mount = require('koa-mount');

const app = new koa();
const reloadKoa = new koa();

app.use(
    mount('/favivon.ico', function(ctx){
        ctx.status = 200;
    })
)

app.use(
    mount('/reload', reloadKoa)
)

reloadKoa.use(
    async function(ctx, next){
        // 部署功能
    }
)

app.use( 
    mount('/', function(ctx) {
        ctx.body = fs.readFileSync(__dirname + '/statichtml/index.html', 'utf-8');
    })
)

app.listen(8003);

```

监听8003端口，访问'/'根目录时，返回`/statichtml/index.html`页面。

4. 部署服务的前端

`/statichtml/index.html`

``` html
<div class="form">
    <label class="label">分支名：</label>
    <input id="input" class="input"type="text" value="master" />
    <br/>
    <label class="label">连接环境：</label>
    <select id="select" class="select">
        <option value ="http://127.0.0.1:3001/">开发环境</option>
    </select>
    <br/>
    <button class="btn" id="btn" onclick="handleClick()">部署</button>
</div>
<div id="output"></div>
```

``` js
function handleClick(){
    var $btn = document.getElementById("btn");
    var $output = document.getElementById("output");

    var $input = document.getElementById("input");
    var $select = document.getElementById("select");
    var branch = encodeURI($input.value);
    var proxy = encodeURI($select.value);
    
    $btn.disabled = true;
    $btn.classList.add("disabled");
    $output.innerText = "正在部署，请耐心等待";

    fetch(`http://${location.host}/reload?branch=` + branch + `&proxy=` + proxy)
    .then((res)=>{
        return res.text()
    }).then((text)=>{
        $output.innerText = text;
        $btn.disabled = false;
        $btn.classList.remove("disabled");
    })
}
```

前端页面最简易的情况只需要一个部署按钮，用于发起部署请求。

可增加一些表单交互，用于拓展部署服务功能，例如分支选择，目标项目连接的后端ip等等。

点击部署按钮，请求当前服务端口的'/reload'接口，带上分支和代理ip两个参数，对接口返回的text进行展示，并取消按钮禁用。

5. 在编写部署功能功能前，先声明一些常量、变量和方法

``` js
// 这些参数均可从前端配置
const protocol = "https"; // git clone 命令的协议
const projectUrl = "github.com/Jiuto/ding_yapi.git"; // git clone 命令的项目地址
const projectDir = __dirname + '/ding_yapi'; // 目标项目名
const staticDir = __dirname + '/static/dist'; // 存放打包文件的路径
const buildStaticDir = __dirname + '/ding_yapi/client/dist'; // 目标项目打包后的文件路径

const git_username='username'; // git 用户名
const git_password='password'; // git 密码

// 目标项目启动的进程
var subprocess = null;

// 删除文件
function deleteFolder(path) {
    var files = [];
    if (fs.existsSync(path)) { // 目录存在
        if (fs.statSync(path).isDirectory()) { // 文件夹
            files = fs.readdirSync(path); // 返回所有文件名数组
            files.forEach(function (file, index) {
                var curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) { // 文件夹
                    deleteFolder(curPath);
                } else { // 文件
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        } else { // 文件
            fs.unlinkSync(path); // 删除文件
        }
    }
}

// 拷贝文件
function copyFolder(from, to) {
    var files = [];
    if (fs.existsSync(to)) { // 目录存在
        files = fs.readdirSync(from);
        files.forEach(function (file, index) {
            var targetPath = from + "/" + file;
            var toPath = to + '/' + file;
            if (fs.statSync(targetPath).isDirectory()) { // 文件夹
                copyFolder(targetPath, toPath);
            } else { // 文件
                fs.copyFileSync(targetPath, toPath); // 拷贝文件
            }
        });
    } else { // 目录不存在
        fs.mkdirSync(to); // 创建文件
        copyFolder(from, to);
    }
}
```

6. 部署功能

``` js
reloadKoa.use(
    async function(ctx, next){
        // 解析入参
        const query = ctx.query;
        const branch = decodeURI(query.branch);
        const proxy = decodeURI(query.proxy);

        // 声明两个变量用于存放拉取代码和更新环境两个功能的执行结果
        var rtn1 = {},
            rtn2 = {};

        // 是否重新克隆项目
        if(branch){
            // 删除上一次拉取的项目
            deleteFolder(projectDir);
            // 构建克隆命令
            let cmdStr = `git clone -b ` + branch + ` ` + protocol + `://` + git_username + `:` + git_password + `@` + projectUrl;
            // 调用执行克隆命令的方法
            rtn1 = await reloadCode(cmdStr);  
        }

        // 是否切换代理
        if(proxy){
            // 构建启动项目命令，将目标项目部署在8002端口
            let cmdStr = `http-server .\\static\\dist -p 8002 --proxy ` + proxy;
            // 调用执行启动项目命令的方法
            rtn2 = await changeProxy(cmdStr);
        }

        // 整合返回结果
        var rtn = {
            code: rtn1.code === 200 || rtn2.code === 200 ? 200 : 500,
            msg: rtn1.msg 
                        ? rtn2.msg
                            ? rtn1.msg + ' and ' + rtn2.msg
                            : rtn1.msg
                        : rtn2.msg
                            ? rtn2.msg
                            : 'parameter can nott be empty'
        }

        // 响应
        ctx.status = rtn.code;
        ctx.body = rtn.msg;
    }
)
```

执行克隆命令的方法

``` js
function reloadCode(cmdStr){
    return new Promise(function(resolve, reject) {
        try {
            child_process.execSync(cmdStr); // 克隆项目
            process.chdir(projectDir) // 进入子目录
            child_process.execSync(`npm install`); // 安装依赖
            child_process.execSync(`npm run build`); // 打包项目
            process.chdir(__dirname) // 返回根目录
            deleteFolder(staticDir) // 删除原静态文件
            copyFolder(buildStaticDir, staticDir) // 拷贝文件
            resolve({
                code: 200,
                msg: 'load code successful'
            })
        } catch (e) {
            reject({
                code: 500,
                msg: 'load failed, error message:\n' + e
            })
        }
    })
}
```

执行启动项目命令的方法

``` js
function changeProxy(cmdStr){
    var result2 = {
        code: 200,
        msg: ''
    };
    return new Promise(function(resolve, reject) {
        // 项目已启动，则杀死进程
        if(subprocess) {
            (async () => {
                await taskkill(subprocess.pid);
            })();
        }
        subprocess = child_process.exec(cmdStr); // 启动 http-server
        subprocess.on('error', (err) => {
            result2.code = 500;
            result2.msg += 'http-server failed, error message:\n' + err;
            reject(result2)
        });
        result2.code = 200;
        result2.msg += 'set proxy successful';
        resolve(result2)
    })
}
```

### 启动部署服务

7. 进入auto_deploy目录，执行`pm2 start app.js`启动部署服务

<img :src="$withBase('/imgs/else/auto_deploy/pm2.png')" alt="pm2">

随后，在本地8003端口即可看到部署服务的前端页面

<img :src="$withBase('/imgs/else/auto_deploy/html.png')" alt="部署服务前端页面">

### 自动化部署

正在部署

<img :src="$withBase('/imgs/else/auto_deploy/deploy.png')" alt="正在部署">

dist

<img :src="$withBase('/imgs/else/auto_deploy/dist.png')" alt="dist">

httpserver

<img :src="$withBase('/imgs/else/auto_deploy/httpserver.png')" alt="httpserver">
