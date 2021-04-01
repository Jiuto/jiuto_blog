## grid 网格布局

### 基本概念

采用栅格布局`display:grid 或 inline-grid`的元素称为容器，其直接子元素称为项目。

<img :src="$withBase('/imgs/css/grid/base.png')" alt="基本概念">

> 设为网格布局以后，容器子元素（项目）的float、display: inline-block、display: table-cell、vertical-align和column-*等设置都将失效。

### 容器属性

#### grid-template-columns grid-template-rows

grid-template-columns 定义列宽， grid-template-rows 定义行高。

1. px

``` html
<div class="parent">
    <div class="child" style="background-color: #b574c3;">child1</div>
    <div class="child" style="background-color: #8b76c1;">child2</div>
    <div class="child" style="background-color: #5171c4;">child3</div>
    <div class="child" style="background-color: #51cd8f;">child4</div>
    <div class="child" style="background-color: #9fd364;">child5</div>
    <div class="child" style="background-color: #d8ac4e;">child6</div>
    <div class="child" style="background-color: #d93a52;">child7</div>
</div>
```

``` css
.parent {
    display: grid;
    grid-template-columns: 100px 200px 300px;
    grid-template-rows: 100px 200px 200px;
}
.child {
    margin: 5px;
    padding: 5px;
    color: white;
}
```

<img :src="$withBase('/imgs/css/grid/test1.png')" alt="test">

2. 百分比

``` css
.parent {
    width: 600px;
    height: 600px;
    display: grid;
    grid-template-columns: 33% 33% 33%;
    grid-template-rows: 33% 33% 33%;
}
```

<img :src="$withBase('/imgs/css/grid/test2.png')" alt="test">

也可以和px混用。

3. repeat()函数

第一个参数表示重复次数，可以是数字，也可以是`auto-fill`表示自动填充，直到容器放不下会自动换行。

第二个参数表示重复的内容，可以是一个值，也可以是罗列宽度的模式，宽度之间用空格分隔。

``` css
.parent {
    width: 600px;
    height: 600px;
    display: grid;
    grid-template-columns: repeat(3,33%);
    grid-template-rows: repeat(2,100px 200px);
}
```

<img :src="$withBase('/imgs/css/grid/test3.png')" alt="test">

``` css
.parent {
    width: 600px;
    height: 600px;
    display: grid;
    grid-template-columns: repeat(auto-fill,100px);
}
```

<img :src="$withBase('/imgs/css/grid/test4.png')" alt="test">

4. fr 关键字

fr(fraction，“片段”)，用于表示倍数关系。

可与px、百分比混用。

``` css
.parent {
    width: 600px;
    height: 600px;
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: repeat(auto-fill, 100px);
}
```

<img :src="$withBase('/imgs/css/grid/test5.png')" alt="test">

5. minmax()函数

表示长度范围，第一个参数是最小值，第二个参数是最大值，容器宽度不够则超出容器。

``` css
.parent {
    width: 600px;
    height: 600px;
    display: grid;
    grid-template-columns: 100px 100px minmax(100px, 300px);
    grid-template-rows: repeat(auto-fill, 100px);
}
```

6. auto

浏览器自己决定宽度，一般为最大宽度，除非项目设置的min-width大于最大宽度。

``` css
.parent {
    width: 600px;
    height: 600px;
    display: grid;
    grid-template-columns: 100px 100px auto;
    grid-template-rows: repeat(auto-fill, 100px);
}
```

7. 为网格线取名

为网格线取名，用[]包裹，可取多个名字，用空格分隔。

``` css
.parent {
    width: 600px;
    height: 600px;
    display: grid;
    grid-template-columns: [c1 line-one] 100px [c2] 100px [c3] auto [c4];
    grid-template-rows: [r1] 100px [r2] 100px [r3] auto [r4];
}
```

#### grid-row-gap grid-column-gap grid-gap

grid-row-gap 定义行间距， grid-column-gap 定义列间距， grid-gap 行列间距简写。

可直接写成 row-gap column-gap gap;

``` css
.parent {
    grid-row-gap: 20px;
    grid-column-gap: 10px;
    /* gap: 20px 10px; */
}
```

<img :src="$withBase('/imgs/css/grid/test6.png')" alt="test">

#### grid-template-areas

grid-template-areas 定义区域(area)，一个区域由单个或多个单元格组成。

``` css
.parent {
    grid-template-areas: 'a a b'
                         'c . d'
                         'e . f';
}
```

`.`表示不需要使用该区域。

> 区域的命名会影响到网格线。每个区域的起始网格线，会自动命名为区域名-start，终止网格线自动命名为区域名-end。

#### grid-auto-flow

grid-auto-flow 定义排列顺序，有四种取值：

##### row 默认

先行后列

``` css
.parent {
    width: 360px;
    height: 360px;
    display: grid;
    grid-template-columns: repeat(3,120px);
    grid-template-rows: repeat(3,120px);
    grid-auto-flow: row;
}
```

<img :src="$withBase('/imgs/css/grid/test7.png')" alt="test">

##### column

先列后行

``` css
.parent {
    grid-auto-flow: column;
}
```

<img :src="$withBase('/imgs/css/grid/test8.png')" alt="test">

##### row dense

先行后列，紧密排列

先看一个例子，第一二项占两列。

``` css
.parent {
    width: 360px;
    height: 480px;
    display: grid;
    grid-template-columns: repeat(3,120px);
    grid-template-rows: repeat(4,120px);
    grid-auto-flow: row;
}
.child1, .child2 {
    /* 在这几个例子中，给第一、二个项目加上下面的样式，表示起始网格线位置，是这两个元素占两列。
    这两个样式将在项目属性中介绍。 */
    grid-column-start: 1; 
    grid-column-end: 3;
}
```

<img :src="$withBase('/imgs/css/grid/test9.png')" alt="test">

设置`grid-auto-flow: row dense;`会提升后面的项目填补空缺。

<img :src="$withBase('/imgs/css/grid/test10.png')" alt="test">

##### column dense

先列后行，紧密排列

``` css
.parent {
    grid-auto-flow: column dense;
}
```

<img :src="$withBase('/imgs/css/grid/test11.png')" alt="test">

#### justify-items align-items place-items

justify-items 定义单元格内容的水平位置，align-items 定义单元格内容的垂直位置，place-items是简写，简写的第二个值未设置默认与第一个值相同。

有四种取值：start | end | center | stretch(拉伸)

``` css
.parent {
    justify-items: start;
    align-items: end;
}
```

<img :src="$withBase('/imgs/css/grid/test12.png')" alt="test">

``` css
.parent {
    place-items: center stretch;
}
```

<img :src="$withBase('/imgs/css/grid/test13.png')" alt="test">

#### justify-content align-content place-content

justify-content 顶个整个内容区域在容器里面的水平位置，align-content 定义整个内容区域的垂直位置，place-content是简写，简写的第二个值未设置默认与第一个值相同。

有六种取值：start | end | center | stretch | space-around | space-between | space-evenly

这里重点介绍后三种。

space-around：每个项目两侧的间隔相等。所以项目之间的间隔比项目与容器边框的间隔大一倍。

space-between：项目与项目的间隔相等，项目与容器边框之间没有间隔。

space-evenly：项目与项目的间隔相等，项目与容器边框之间也是同样长度的间隔

``` css
.parent {
    width: 600px;
    height: 600px;
    display: grid;
    grid-template-columns: repeat(3,120px);
    grid-template-rows: repeat(3,120px);
    justify-content: space-around;
    align-content: space-between;
}
```

<img :src="$withBase('/imgs/css/grid/test14.png')" alt="test">

``` css
.parent {
    place-content: space-evenly;
}
```

<img :src="$withBase('/imgs/css/grid/test15.png')" alt="test">

#### grid-auto-columns grid-auto-rows

当项目指定位置在网格外，浏览器自动根据单元格内容大小生成多余网格，而这两个属性就是用于设置多余网格宽高。

``` css
.parent {
    width: 240px;
    height: 240px;
    display: grid;
    grid-template-columns: repeat(2,120px);
    grid-template-rows: repeat(2,120px);
    grid-auto-rows: 50px;
    grid-auto-columns: 80px;
}
```

<img :src="$withBase('/imgs/css/grid/test16.png')" alt="test">

#### grid-template grid

> grid-template属性是grid-template-columns、grid-template-rows和grid-template-areas这三个属性的合并简写形式。
>
> grid属性是grid-template-rows、grid-template-columns、grid-template-areas、 grid-auto-rows、grid-auto-columns、grid-auto-flow这六个属性的合并简写形式。

### 项目属性

#### grid-column-start grid-column-end grid-row-start grid-row-end grid-column grid-row 

grid-column-start grid-column-end grid-row-start grid-row-end 这四个属性用于指定项目位置。

grid-column 是 grid-column-start grid-column-end 的简写，grid-row 是 grid-row-start grid-row-end 的简写，用`/`分隔值。

1. 数字表示网格线起始位置

``` css
.parent {
    width: 360px;
    height: 360px;
    display: grid;
    grid-template-columns: repeat(3,120px);
    grid-template-rows: repeat(4,120px);
}
.child1 { 
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 2;
    grid-row-end:4;
}
```

<img :src="$withBase('/imgs/css/grid/test17.png')" alt="test">

2. 网格线名代表的起始位置

``` css
.parent {
    display: grid;
    grid-template-columns: [r1] 120px [r2] 120px [r3] 120px [r4];
    grid-template-rows: repeat(3,120px);
}
.child1 { 
    grid-column-start: r1;
    grid-column-end: r3;
}
```

<img :src="$withBase('/imgs/css/grid/test18.png')" alt="test">

3. span 关键字表示跨越

``` css
.child1 {
    grid-column-start: span 2; 
    grid-row-start: span 2;
}
```

效果等同于

``` css
.child1 {
    grid-column-end: span 2;
    grid-row-end: span 2;
}
```

<img :src="$withBase('/imgs/css/grid/test19.png')" alt="test">

4. 简写

``` css
.child1 {
    grid-column: 1 / span 2;
    grid-row: 1 / 3;
}
```

效果等同于3

#### grid-area

grid-area 指定项目放置区域。同时也是 `<row-start> / <column-start> / <row-end> / <column-end>` 的简写。

``` css
.parent {
    grid-template-areas: 'a a b'
                         'c d d'
                         'e . .';
}
.child1 { 
    grid-area: e;
}
```

<img :src="$withBase('/imgs/css/grid/test20.png')" alt="test">

``` css
.child1 { 
    grid-area: 2 / 1 / 4 / 3;
}
```

<img :src="$withBase('/imgs/css/grid/test17.png')" alt="test">

#### justify-self align-self place-self

justify-self 定义单元格内容的水平位置，align-self 定义单元格内容的垂直位置，place-self 是简写，简写的第二个值未设置默认与第一个值相同。

有四种取值：start | end | center | stretch(拉伸)

``` css
.child1 { 
    justify-self: start;
    align-self: end;
}
```

<img :src="$withBase('/imgs/css/grid/test21.png')" alt="test">

``` css
.child1 { 
    place-self: center stretch;
}
```

<img :src="$withBase('/imgs/css/grid/test22.png')" alt="test">

### 浏览器兼容性

<img :src="$withBase('/imgs/css/grid/compatibility.png')" alt="浏览器兼容性">

### 参考

[CSS Grid 网格布局教程](http://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html)
