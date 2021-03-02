## 常见布局

### 左列定宽，右列自适应

#### 效果

<img :src="$withBase('/imgs/css/layout/一列定宽.png')" alt="row">

#### 示例基础代码

``` html
<div class="content">
    <div class="left"></div>
    <div class="right"></div>
</div>
```

``` css
.content {
    height: 80px;
}
.left {
    width: 200px;
    height: 100%;
    background-color: teal;
}
.right {
    background-color: bisque;
    height: 100%;
}
```

#### 方式一 float+margin-left

``` css
.content1 .left {
    float: left;
}
.content1 .right {
    margin-left: 200px;
}
```

#### 方式二 right嵌套一个内容区

``` css
.content2 .left {
    float: left;
}
.content2 .right {
    float: right;
    width: 100%;
    margin-left: -200px;
}
.content2 .right .right_inbox {
    margin-left: 200px;
}
```

html right提前

``` html
<div class="content content2">
    <div class="right"></div>
    <div class="left"></div>
</div>
```

#### 方式三 float+overflow (触发BFC)

``` css
.content3 .left {
    float: left;
}
.content3 .right {
    overflow: auto;
}
```

#### 方式四 calc计算宽度

``` css
.content4 .left {
    float: left;
}
.content4 .right {
    float: left;
    width: calc(100% - 200px);
}
```

#### 方式五 表格单元格

```css
.content5 {
    display: table;
    width: 100%;
}
.content5 .left, .content5 .right {
    display: table-cell;
}
```

#### 方式六 绝对定位

``` css
.content6 {
    position: relative;
}
.content6 .left {
    position: absolute;
    top: 0;
    left: 0;
}
.content6 .right {
    position: absolute;
    top: 0;
    left: 200px;
    right: 0;
}
```

#### 方式七 flex布局

``` css
.content7 {
    display: flex;
}
.content7 .right {
    flex: 1;
}
```

#### 方式八 栅格布局

``` css
.content8 {
    display: grid;
    grid-template-columns: 200px 1fr;
}
```

### 一列不定宽，一列自适应

#### 效果

<img :src="$withBase('/imgs/css/layout/一列不定宽.png')" alt="row">

#### 示例基础代码

``` html
<div class="content">
    <div class="left"></div>
    <div class="right"></div>
</div>
```

``` css
.content {
    height: 80px;
}
.left {
    height: 100%;
    background-color: teal;
}
.right {
    background-color: bisque;
    height: 100%;
}
```

#### 方式一 float+overflow (触发BFC)

``` css
.left {
    float: left;
}
.right {
    overflow: auto;
}
```

#### 方式二 flex布局

``` css
.content {
    display: flex;
}
.content .right {
    flex: 1;
}
```

#### 方式三 栅格布局

``` css
.content {
    display: grid;
    grid-template-columns: auto 1fr;
}
```

### 圣杯布局-两侧定宽，中间自适应

#### 最终效果

<img :src="$withBase('/imgs/css/layout/圣杯.png')" alt="row">

#### 实现代码

html

``` html
<div class="box">
    <div class="header">圣杯布局</div>
    <div class="parent">
        <div class="center">中间自适应</div>
        <div class="left">左列定宽</div>
        <div class="right">右列定宽</div>
    </div>
    <div class="footer"></div>
</div>
```

1. 基础css

``` css
.box {
    width: 100%;
}
.header, .footer {
    height: 100px;
    background-color: grey;
}
.parent {
    height: 300px;
}
.center {
    width: 100%;
    height: 100%;
    background-color: gold;
    float: left;
}
.left, .right {
    width: 200px;
    height: 100%;
    background-color: teal;
    float: left;
}
```

此时效果

<img :src="$withBase('/imgs/css/layout/圣杯1.png')" alt="row">

2. 给left和right加上margin-left，使左右两列提上去

``` css
.left1 {
    margin-left: -100%;
}
.right1 {
    margin-left: -200px;
}
```

此时效果

<img :src="$withBase('/imgs/css/layout/圣杯2.png')" alt="row">

3. 此时中间内容是被遮挡的，给parent加上padding，空出位置给两边

``` css
.parent {
    padding: 0 200px;
}
```

此时效果

<img :src="$withBase('/imgs/css/layout/圣杯3.png')" alt="row">

4. 左右两列也被移到了中间，用定位将两边移开

``` css
.left {
    position: relative;
    left: -200px;
}
.right {
    position: relative;
    left: 200px;
}
```

此时效果

<img :src="$withBase('/imgs/css/layout/圣杯.png')" alt="row">

### 双飞翼布局

双飞翼布局实现效果和圣杯是一样的，只是实现方式略有不同，有点类似左列定宽右列自适应中的方式二，增加了一个内容区。

#### 实现代码

html

``` html
<div class="box">
    <div class="header">双飞翼布局</div>
    <div class="parent">
        <div class="center">
            <div class="center_inbox">中间自适应</div>
        </div>
        <div class="left2">左列定宽</div>
        <div class="right2">右列定宽</div>
    </div>
    <div class="footer"></div>
</div>
```

1. 基础css + 给left和right加上margin-left，使左右两列提上去

``` css
.box {
    width: 100%;
}
.header, .footer {
    height: 100px;
    background-color: grey;
}
.parent {
    height: 300px;
}
.center {
    width: 100%;
    height: 100%;
    background-color: gold;
    float: left;
}
.left, .right {
    width: 200px;
    height: 100%;
    background-color: teal;
    float: left;
}
.left {
    margin-left: -100%;
}
.right {
    margin-left: -200px;
}
```

2. 给内容区增加左右外边距 

``` css
.center_inbox {
    margin: 0 200px;
}
```

### 参考

[CSS 常见布局方式](https://juejin.cn/post/6844903491891118087#heading-23)

[干货!各种常见布局实现+知名网站实例分析](https://juejin.cn/post/6844903574929932301#heading-29)