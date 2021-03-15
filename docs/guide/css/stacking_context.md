## 层叠上下文、层叠层级、层叠顺序

### 层叠上下文 stacking context

> 我们假定用户正面向（浏览器）视窗或网页，而 HTML 元素沿着其相对于用户的一条虚构的 z 轴排开，
> 层叠上下文就是对这些 HTML 元素的一个三维构想。众 HTML 元素基于其元素属性按照优先级顺序占据这个空间。

#### 如何创建层叠上下文

> 1. 文档根元素（`<html>`）；
> 2. position 值为 absolute（绝对定位）或  relative（相对定位）且 z-index 值不为 auto 的元素；
> 3. position 值为 fixed（固定定位）或 sticky（粘滞定位）的元素（沾滞定位适配所有移动设备上的浏览器，但老的桌面浏览器不支持）；
> 4. flex (flexbox (en-US)) 容器的子元素，且 z-index 值不为 auto；
> 5. grid (grid) 容器的子元素，且 z-index 值不为 auto；
> 6. opacity 属性值小于 1 的元素（参见[the specification for opacity](http://www.w3.org/TR/css3-color/#transparency)）；
> 7. mix-blend-mode 属性值不为 normal 的元素；
> 8. 以下任意属性值不为 none 的元素：
>
> transform
>
> filter
>
> perspective
>
> clip-path
>
> mask/mask-image/mask-border
>
> 9. isolation 属性值为 isolate 的元素；
> 10. -webkit-overflow-scrolling 属性值为 touch 的元素；
> 11. will-change 值设定了任一属性而该属性在 non-initial 值时会创建层叠上下文的元素（[参考这篇文章](http://dev.opera.com/articles/css-will-change-property/)）；
> 12. contain 属性值为 layout、paint 或包含它们其中之一的合成值（比如 contain: strict、contain: content）的元素。

+ 满足以上任意一个条件的元素将形成一个层叠上下文，我们称这样的元素为层叠上下文元素，相交普通元素离屏幕观察者更近（存疑）。

##### 测试1

``` html
<div class="parent1" style="background-color: #009688;width: 300px;">
    parent1：
    <div class="child">
        child1
    </div>
</div>
<div class="parent2" style="background-color: #ffc107;width: 500px;text-align: right;">
    parent2：
    <div class="child">
        child2
    </div>
</div>
```

``` css
.parent1 {
    position: relative;
    top: 35px;
}
```

<img :src="$withBase('/imgs/css/stacking_context/test1.png')" alt="test1">

#### 特点

> + 层叠上下文可以包含在其他层叠上下文中，并且一起创建一个层叠上下文的层级。
> + 每个层叠上下文都完全独立于它的兄弟元素：当处理层叠时只考虑子元素。
> + 每个层叠上下文都是自包含的：当一个元素的内容发生层叠后，该元素将被作为整体在父级层叠上下文中按顺序进行层叠。

##### 测试2

将上面例子的css改成：

``` css
.parent1 {
    position: relative;
    z-index: 1;
    top: 5px;
}
.parent2 {
    position: relative;
    z-index: 10;
}
.parent1 .child {
    position: relative;
    z-index: 100;
}
.parent2 .child {
    position: relative;
    z-index: 10;
}
```

<img :src="$withBase('/imgs/css/stacking_context/test2.png')" alt="test2">

注：[z-index](https://developer.mozilla.org/zh-CN/docs/Web/CSS/z-index)只在 position 属性值不是 static 或为flex盒子的子元素时有效。

### 层叠层级 stacking level

层叠层级，也有翻译层叠水平、层叠等级，个人觉得[层叠上下文 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)中`”层级“`更贴近元素在层叠上下文中的`level`。

所有元素都有层叠层级，层叠层级描述了该元素在当前层叠上下文中在z轴上的顺序。

> 层叠水平的比较只有在当前层叠上下文元素中才有意义。

> 在同一个层叠上下文中，它描述定义的是该层叠上下文中的层叠上下文元素在Z轴上的上下顺序。
>
> 在其他普通元素中，它描述定义的是这些普通元素在Z轴上的上下顺序。

### 层叠顺序 stacking order

> 层叠顺序表示元素发生层叠时候有着特定的垂直显示顺序。上面的层叠上下文和层叠水平是概念，而这里的层叠顺序是规则。

<img :src="$withBase('/imgs/css/stacking_context/order.png')" alt="order">

+ 每一个层叠顺序规则适用于一个完整的层叠上下文元素。

+ 位于最低层级的border/background指的是层叠上下文元素的边框和背景色。 

+ 比较规则

1. 不同层叠上下文的元素，比较他们所在层叠上下文的层级，随所在层叠上下文整体进行排列。

2. 同一个层叠上下文中，按照层叠顺序，层叠层级越高的元素越z轴上面。

3. 当层叠层级和层叠顺序都相同，在DOM流中处于后面的元素会覆盖前面的元素。

+ 为什么定位元素会层叠在普通元素的上面

> 其根本原因就在于，元素一旦成为定位元素，其z-index就会自动生效，此时其z-index就是默认的auto，也就是0级别，根据上面的层叠顺序表，就会覆盖inline或block或float元素。
>
> 而不支持z-index的层叠上下文元素天然z-index:auto级别，也就意味着，层叠上下文元素和定位元素是一个层叠顺序的，于是当他们发生层叠的时候，在DOM流中处于后面的元素会覆盖前面的元素。

### 实例

1. 第一个实例

``` html
<div class="parent1">
    <div class="child1" style="background-color: #b574c3;">position: relative;z-index: 10;</div>
</div>
<div class="parent2">
    <div class="child2" style="background-color: #8b76c1;">position: relative;z-index: 1;</div>
</div>
```

``` css
.parent1, .parent2 {
    position: absolute;
    z-index: auto;
}
.child1 {
    width: 300px;
    height: 100px;
    position: relative;
    z-index: 10;
}
.child2 {
    width: 100px;
    height: 300px;
    position: relative ;
    z-index: 1;
}
```

<img :src="$withBase('/imgs/css/stacking_context/test3.png')" alt="test3">

父元素均为`position: absolute;z-index:auto;`，按”如何创建层叠上下文中的第二条“，不会创建层叠上下文。
两个parent均为普通元素，两个子元素均为层叠上下文元素，且都处在根层叠上下文中，z-index高的在前。

``` css
.parent1, .parent2 {
    position: absolute;
    z-index: 0;
}
```

<img :src="$withBase('/imgs/css/stacking_context/test4.png')" alt="test4">

仅将父元素的z-index改成0，层叠层级发生变化。
按”如何创建层叠上下文中的第二条“，会创建两个层叠上下文。
按照比较规则第三天”当层叠层级和层叠顺序都相同，在DOM流中处于后面的元素会覆盖前面的元素“，parent2在parent1前面。

2. 第二个实例

还记得测试1的代码吗？”相交普通元素离屏幕观察者更近（存疑）“。

我们将parent1的样式加上z-index:-1;

``` css
.parent1 {
    position: relative;
    z-index: -1;
    top: 35px;
}
```

<img :src="$withBase('/imgs/css/stacking_context/test5.png')" alt="test5">

这时发现parent1层叠层级低于parent2了，不是”层叠上下文元素，相交普通元素离屏幕观察者更近“吗？

从层叠顺序规则上我们可以看到，普通的block元素层叠顺序是高于z-index<0的，所以看到parent2在parent1上面。

3. 第三个实例

``` html
<div class="box">
    <div class="parent">
        background-color: #5171c4;z-index: 10;
        <div class="child">
            position: absolute;z-index: -1;
        </div>
    </div>
</div>
```

``` css
.box {
    display: flex;
}
.parent {
    width: 350px;
    height: 100px;
    background-color: #5171c4;
    z-index: 10;
}
.child {
    width: 100px;
    height: 300px;
    background-color: #51cd8f;
    position: absolute;
    z-index: -1;
}
```

<img :src="$withBase('/imgs/css/stacking_context/test6.png')" alt="test6">

box作为父元素为flex容器，按”如何创建层叠上下文中的第四条“，parent元素为层叠上下文。

但是从层叠顺序规则上我们可以看到，层叠上下文元素的border/background（边框和背景色）层叠顺序是低于z-index<0的，所以看到child在parent上面。

我们把flex去掉，通过opacity: 0.5;、transform: rotate(15deg);等方式将parent变为层叠上下文元素，根据层叠顺序同样会发现child始终在parent上面。

<img :src="$withBase('/imgs/css/stacking_context/test7.png')" alt="test7">

<img :src="$withBase('/imgs/css/stacking_context/test8.png')" alt="test8">

### 参考

[彻底搞懂CSS层叠上下文、层叠等级、层叠顺序、z-index](https://juejin.cn/post/6844903667175260174#heading-9)

[深入理解CSS中的层叠上下文和层叠顺序](https://www.zhangxinxu.com/wordpress/2016/01/understand-css-stacking-context-order-z-index/)

[层叠上下文 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)
