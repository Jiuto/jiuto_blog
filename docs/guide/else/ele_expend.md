## 如何在element-ui中拓展一个新的组件

#### 一张图诠释

<img :src="$withBase('/imgs/ele_expend/ele_xmind.png')" alt="element-ui 创建组件的项目结构分析">

#### demo

1、在自己的仓库中 fork element-ui 项目，新建一个自己的分支

2、windows下需提前配置make命令所需环境

3、使用`make new componentTag componentName ` 生成新组件相关的所有文件

4、开发自己的组件（关于样式部分，element声明了一些基础变量，使用方便，很有参考意义）

<img :src="$withBase('/imgs/ele_expend/element1.png')" alt="效果一">

<img :src="$withBase('/imgs/ele_expend/element2.png')" alt="效果二">

[github地址，切换ele-expand分支](https://github.com/Jiuto/element.git)
