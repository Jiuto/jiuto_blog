## flex布局

### flex基本介绍

先贴一个简单的示例代码，后续讲解各属性时，均在此基础上更改。

``` html
<div class="flex-box">
    <div class="flex-item item1">1</div>
    <div class="flex-item item2">2</div>
    <div class="flex-item item3">3</div>
</div>
```

``` css
.flex-box {
    display: flex;
    width: 500px;
    background-color: honeydew;
}
.flex-item {
    box-sizing: border-box;
    height: 100px;
    width: 100px;
    background-color: gray;
    padding: 10px;
    margin: 10px;
    text-align: center;
}
```

> Flex 是 Flexible Box 的缩写，意为"弹性布局"。

设置元素`display: flex;`或`display: inline-flex;`（行内元素），即使用flex布局。
采用flex布局的元素称之为“flex容器”（flex container），容器的子元素称之为“flex元素”或“flex项目”（flex item）。

> 设为 Flex 布局以后，子元素的float、clear和vertical-align属性将失效。

#### 容器属性：flex-direction 主轴与交叉轴

flex容器的主轴（main axis）由flex-direction属性定义，有四个取值：

row（默认）

<img :src="$withBase('/imgs/css/flex/flex-direction_row.png')" alt="row">

row-reverse

<img :src="$withBase('/imgs/css/flex/flex-direction_row-reverse.png')" alt="row-reverse">

column

<img :src="$withBase('/imgs/css/flex/flex-direction_column.png')" alt="column">

column-reverse

<img :src="$withBase('/imgs/css/flex/flex-direction_column-reverse.png')" alt="column-reverse">

交叉轴（cross axis）与主轴垂直，flex元素默认沿主轴排列。

#### 容器属性：flex-wrap 换行

flex-wrap定义一行放不下时，元素的换行方式，有三种取值：

nowrap（默认），宽度不够时元素会被压缩变形

<img :src="$withBase('/imgs/css/flex/flex-wrap_nowrap.png')" alt="nowrap">

wrap

<img :src="$withBase('/imgs/css/flex/flex-wrap_wrap.png')" alt="wrap">

wrap-reverse

<img :src="$withBase('/imgs/css/flex/flex-wrap_wrap-reverse.png')" alt="wrap-reverse">

#### 容器属性：justify-content

justify-content定义元素在主轴上的对齐方式，有五种取值方式：

flex-start（默认）

<img :src="$withBase('/imgs/css/flex/flex-direction_row.png')" alt="flex-start">

flex-end

<img :src="$withBase('/imgs/css/flex/flex-direction_row-reverse.png')" alt="flex-end">

center

<img :src="$withBase('/imgs/css/flex/justify-content_center.png')" alt="center">

space-around

> 每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍

<img :src="$withBase('/imgs/css/flex/justify-content_space-around.png')" alt="space-around">

space-between

> 两端对齐，项目之间的间隔都相等

<img :src="$withBase('/imgs/css/flex/justify-content_space-between.png')" alt="space-between">

#### 容器属性：align-items

align-items定义元素在交叉轴上的对齐方式，有五种取值方式：

stretch（默认）

未定义元素高度，定义容器高度，元素会被拉伸满容器高度

<img :src="$withBase('/imgs/css/flex/align-items_stretch1.png')" alt="stretch">

未定义容器高度，定义元素高度，容器会被拉伸到最高元素的高度

<img :src="$withBase('/imgs/css/flex/align-items_stretch2.png')" alt="stretch">

flex-start

<img :src="$withBase('/imgs/css/flex/align-items_stretch2.png')" alt="flex-start">

flex-end

<img :src="$withBase('/imgs/css/flex/align-items_flex-end.png')" alt="flex-end">

center

<img :src="$withBase('/imgs/css/flex/align-items_center.png')" alt="center">

baseline

<img :src="$withBase('/imgs/css/flex/align-items_baseline.png')" alt="baseline">

#### 容器属性：align-content

align-content定义元素在交叉轴方向的对齐方式（即多行情况），有六种取值：

stretch（默认）

<img :src="$withBase('/imgs/css/flex/align-content_stretch.png')" alt="stretch">

flex-start

<img :src="$withBase('/imgs/css/flex/align-content_flex-start.png')" alt="flex-start">

flex-end

<img :src="$withBase('/imgs/css/flex/align-content_flex-end.png')" alt="flex-end">

center

<img :src="$withBase('/imgs/css/flex/align-content_center.png')" alt="center">

space-between

> 与交叉轴两端对齐，轴线之间的间隔平均分布

<img :src="$withBase('/imgs/css/flex/align-content_space-between.png')" alt="space-between">

space-around

> 每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍

<img :src="$withBase('/imgs/css/flex/align-content_space-around.png')" alt="space-around">

#### 容器属性：flex-flow 简写属性

> flex-flow属性是flex-direction属性和flex-wrap属性的简写形式，默认值为row nowrap。

#### 元素属性：order 排序

order定义元素排列顺序，数字越小越靠前，默认为0

<img :src="$withBase('/imgs/css/flex/flex-direction_row.png')" alt="order">

#### 元素属性：flex-grow 放大

> flex-grow属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。如果所有项目的flex-grow属性都为1，则它们将等分剩余空间。

<img :src="$withBase('/imgs/css/flex/flex-grow1.png')" alt="flex-grow">

<img :src="$withBase('/imgs/css/flex/flex-grow2.png')" alt="flex-grow">

#### 元素属性：flex-shrink 缩小

> flex-shrink属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。
> 如果所有项目的flex-shrink属性都为1，当空间不足时，都将等比例缩小。
> 如果一个项目的flex-shrink属性为0，其他项目都为1，则空间不足时，前者不缩小。
> 负值对该属性无效。

<img :src="$withBase('/imgs/css/flex/flex-shrink.png')" alt="flex-shrink">

#### 元素属性：flex-basis

flex-basis定义在分配多余空间之前，元素占据的主轴空间，默认auto，即元素原本大小。

<img :src="$withBase('/imgs/css/flex/flex-basis.png')" alt="flex-basis">

#### 元素属性：align-self 单个元素对齐方式

> align-self属性允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。
> 默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。

有六种取值: 

auto

flex-start

flex-end

center

baseline

stretch

#### 元素属性：flex 简写属性

> flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。

flex: initial === flex: 0 1 auto

flex: auto === flex: 1 1 auto

flex: none === flex: 0 0 auto

flex: 1 === flex: 1 1 0

### flex浏览器兼容性

<img :src="$withBase('/imgs/css/flex/兼容性.png')" alt="浏览器兼容性">

### flex布局demo

demo实现了内容充满一个屏的高度，首尾高度固定，内容自适应。
内容区分三部分，第三部分由内容撑开，一二部分平分剩余高度，第二部分超出设置滚动条。
第一部分又分上下两部分，上部分由内容撑开，下部分撑满剩余高度，超出则设置滚动条。

<img :src="$withBase('/imgs/css/flex/demo.png')" alt="demo">

``` html
<div id="app" class="flex">
    <div class="header">头部</div>
    <div class="part1 flex-full">
        <div class="part1-1">
            <p>包在part1-1内的若干个p</p>
            <p>包在part1-1内的若干个p</p>
            <p>包在part1-1内的若干个p</p>
        </div>
        <div class="part1-2 flex-full">
            <div>包在part1-2内的div</div>
            <div>包在part1-2内的div</div>
            <div>包在part1-2内的div</div>
            <div>包在part1-2内的div</div>
            <div>包在part1-2内的div</div>
            <div>包在part1-2内的div</div>
        </div>
    </div>
    <div class="part2">
        <p>包在part2内的若干个p，设置滚动</p>
        <p>包在part2内的若干个p，设置滚动</p>
        <p>包在part2内的若干个p，设置滚动</p>
        <p>包在part2内的若干个p，设置滚动</p>
        <p>包在part2内的若干个p，设置滚动</p>
        <p>包在part2内的若干个p，设置滚动</p>
        <p>包在part2内的若干个p，设置滚动</p>
        <p>包在part2内的若干个p，设置滚动</p>
        <p>包在part2内的若干个p，设置滚动</p>
        <p>包在part2内的若干个p，设置滚动</p>
        <p>包在part2内的若干个p，设置滚动</p>
        <p>包在part2内的若干个p，设置滚动</p>
        <p>包在part2内的若干个p，设置滚动</p>
        <p>包在part2内的若干个p，设置滚动</p>
        <p>包在part2内的若干个p，设置滚动</p>
        <p>包在part2内的若干个p，设置滚动</p>
        <p>包在part2内的若干个p，设置滚动</p>
        <p>包在part2内的若干个p，设置滚动</p>
        <p>包在part2内的若干个p，设置滚动</p>
        <p>包在part2内的若干个p，设置滚动</p>
        <p>包在part2内的若干个p，设置滚动</p>
    </div>
    <div class="part3">
        <p>包在part3内的若干个p</p>
        <p>包在part3内的若干个p</p>
        <p>包在part3内的若干个p</p>
    </div>
    <div class="footer">尾部</div>
</div>
```

``` css
p {
    margin: 0;
    padding: 0;
}
.header, .footer {
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-color: #333;
    color: #fff;
}
.flex {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    position: absolute;
}
.flex-full {
    display: flex;
    flex-direction: column;
    flex: 1;
}
.part1 {
    min-height: 300px;
}
.part1-2 {
    margin: 30px;
    padding: 30px;
    background: gainsboro;
    border: 1px solid;
    overflow: auto;
}
.part2 {
    min-height: 300px;
    background-color: #aaa;
    overflow: auto;
    flex: 1;
}
```

### 参考

[CSS弹性盒子布局-MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout)

[flex布局的基本概念-MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox)

[flex布局教程-阮一峰](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
