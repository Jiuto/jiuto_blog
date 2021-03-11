## BFC 块格式化上下文

### 概念

> 块格式化上下文（Block Formatting Context，BFC） 是Web页面的可视CSS渲染的一部分，是块盒子的布局过程发生的区域，也是浮动元素与其他元素交互的区域。(MDN)

> 一个BFC的范围包含创建该上下文元素的所有子元素，但不包括创建了新BFC的子元素的内部元素。
> 这从另一方角度说明，一个元素不能同时存在于两个BFC中。
> 因为如果一个元素能够同时处于两个BFC中，那么就意味着这个元素能与两个BFC中的元素发生作用，就违反了BFC的隔离作用。(CSS中重要的BFC)

### 创建方式

下列方式会创建块格式化上下文：

1. 根元素( `<html>` )
2. 浮动元素( float: left/right )
3. 绝对定位元素( position: absolute/fixed )
4. overflow ( overflow: auto/hidden/scroll)
5. 弹性元素( 元素本身或父元素为 display: flex/inline-flex )
6. 网格元素( 元素本身或父元素为 display: grid/inline-grid )
7. 行内块元素( display: inline-block )
8. display: flow-root( 创建一个行为类似于根元素的元素 )
9. 表格相关( display: table-cell/table-caption/inline-table/table/table-row/table-row-group/table-header-group/table-footer-group )
10. contain: layout/content/paint( [contain](https://developer.mozilla.org/zh-CN/docs/Web/CSS/contain) )
11. 多列容器( column-count 或 column-width 不为 auto，column-span：all )

### 实例

1. 阻止元素被浮动元素覆盖

> 一个正常文档流的block元素可能被一个float元素覆盖，挤占正常文档流，因此可以设置一个元素的float、display、position值等方式触发BFC，以阻止被浮动盒子覆盖。

<img :src="$withBase('/imgs/css/bfc/bfc1.png')" alt="阻止元素被浮动元素覆盖">

[点击查看阻止元素被浮动元素覆盖实例](/html/bfc1.html)

2. 可以包含浮动元素

> 通过改变包含浮动子元素的父盒子的属性值，触发BFC，以此来包含子元素的浮动盒子。

<img :src="$withBase('/imgs/css/bfc/bfc2.png')" alt="可以包含浮动元素">

[点击查看可以包含浮动元素实例](/html/bfc2.html)

3. 阻止相邻元素的margin合并

> 属于同一个BFC的两个相邻块级子元素的上下margin会发生重叠。
> 所以当两个相邻块级子元素分属于不同的BFC时可以阻止margin重叠。
> 这里给任一个相邻块级盒子的外面包一个div，通过改变此div的属性使两个原盒子分属于两个不同的BFC，以此来阻止margin重叠。

<img :src="$withBase('/imgs/css/bfc/bfc3.png')" alt="阻止相邻元素的margin合并">

[点击查看阻止相邻元素的margin合并实例](/html/bfc3.html)

### 参考

[块格式化上下文](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)

[CSS中重要的BFC](https://segmentfault.com/a/1190000013023485)
