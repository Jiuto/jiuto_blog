## CSS3 动画

### transition

> 过渡可以为一个元素在不同状态之间切换的时候定义不同的过渡效果。
> 比如在不同的伪元素之间切换，像是 :hover，:active 或者通过 JavaScript 实现的状态变化。

transition 是 transition-property / transition-duration / transition-timing-function / transition-delay 的简写属性。

#### transition-property

`transition-property`规定设置过渡效果的 CSS 属性的名称。

有三种取值：

|值|说明|
|--|--|
|none|没有属性会获得过渡效果|
|all|所有属性都将获得过渡效果|
|property|定义应用过渡效果的 CSS 属性名称列表，列表以逗号分隔，例如`transition-property: width,height;`|

#### transition-duration

`transition-duration`规定完成过渡效果需要多少秒或毫秒。

#### transition-timing-function

`transition-timing-function`规定速度效果的速度曲线。

有六种取值：

|值|说明|
|--|--|
|linear|匀速（等于 cubic-bezier(0,0,1,1)）|
|ease|慢速开始，然后变快，然后慢速结束（cubic-bezier(0.25,0.1,0.25,1)）|
|ease-in|以慢速开始（等于 cubic-bezier(0.42,0,1,1)）|
|ease-out|以慢速结束（等于 cubic-bezier(0,0,0.58,1)）|
|ease-in-out|以慢速开始和结束（等于 cubic-bezier(0.42,0,0.58,1)）|
|cubic-bezier(n,n,n,n)|贝塞尔曲线，在 cubic-bezier 函数中定义自己的值，可能的值是 0 至 1 之间的数值|

#### transition-delay

`transition-delay`定义延迟开始过渡效果，同样以s或ms计时。

#### 浏览器支持

<img :src="$withBase('/imgs/css/css3/compatibility_1.png')" alt="浏览器兼容性">

#### demo

``` css
div {
    width: 100px;
    height: 100px;
    background-color: #51cd8f;
    transition: width 3s ease 0.5s;
    -moz-transition: width 3s ease 0.5s; /* Firefox 4 */
    -webkit-transition: width 3s ease 0.5s; /* Safari 和 Chrome */
    -o-transition: width 3s ease 0.5s; /* Opera */
}
div:hover {
    width: 300px;
}
```

<img :src="$withBase('/imgs/css/css3/transition.gif')" alt="transition">

div的width属性在默认状态和hover状态下切换均通过transition设置的效果过渡。

### transform

> transform 属性向元素应用 2D 或 3D 转换。该属性允许我们对元素进行旋转、缩放、移动或倾斜。

|值|说明|
|--|--|
|none|定义不进行转换|
|matrix(n,n,n,n,n,n)|定义 2D 转换，使用六个值的矩阵|
|matrix3d(n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n)|定义 3D 转换，使用 16 个值的 4x4 矩阵|
|translate(x,y)|定义 2D 转换|
|translate3d(x,y,z)|定义 3D 转换|
|translateX(x)|定义转换，只是用 X 轴的值|
|translateY(y)|定义转换，只是用 Y 轴的值|
|translateZ(z)|定义 3D 转换，只是用 Z 轴的值|
|scale(x,y)|定义 2D 缩放转换|
|scale3d(x,y,z)|定义 3D 缩放转换|
|scaleX(x)|通过设置 X 轴的值来定义缩放转换|
|scaleY(y)|通过设置 Y 轴的值来定义缩放转换|
|scaleZ(z)|通过设置 Z 轴的值来定义 3D 缩放转换|
|rotate(angle)|定义 2D 旋转，在参数中规定角度|
|rotate3d(x,y,z,angle)|定义 3D 旋转|
|rotateX(angle)|定义沿着 X 轴的 3D 旋转|
|rotateY(angle)|定义沿着 Y 轴的 3D 旋转|
|rotateZ(angle)|定义沿着 Z 轴的 3D 旋转|
|skew(x-angle,y-angle)|定义沿着 X 和 Y 轴的 2D 倾斜转换|
|skewX(angle)|定义沿着 X 轴的 2D 倾斜转换|
|skewY(angle)|定义沿着 Y 轴的 2D 倾斜转换|
|perspective(n)|为 3D 转换元素定义透视视图|

#### 浏览器支持

<img :src="$withBase('/imgs/css/css3/compatibility_2.png')" alt="浏览器兼容性">

#### demo

``` css
.child {
    transform: translate(50%, 50%);
}
```

<img :src="$withBase('/imgs/css/css3/transform1.png')" alt="translate(50%, 50%)">

``` css
.child {
    height: 100px;
    width: 100px;
    transform: scale(2, 2);
}
```

<img :src="$withBase('/imgs/css/css3/transform2.png')" alt="scale(2, 2)">

``` css
.child {
    transform: rotate(-90deg);
}
```

<img :src="$withBase('/imgs/css/css3/transform3.png')" alt="rotate(-90deg)">

### animation

animation 属性是一个简写属性，用于设置六个动画属性。

#### animation-name

`animation-name`规定需要绑定到选择器的 keyframe 名称。

通过`@keyframes`定义一个动作。

``` css
.parent {
    margin: 20px;
    position:relative;
    width: 100px;
    height: 100px;
    background-color: #5171c4;
    animation-name:mymove;
    animation-duration:5s;

    /* Safari and Chrome */
    -webkit-animation-name:mymove;
    -webkit-animation-duration:5s;
}
@keyframes mymove
{
    from {
        left:0px;
    }
    to {
        left:200px;
    }
}
@-webkit-keyframes mymove /* Safari and Chrome */
{
    from {
        left:0px;
    }
    to {
        left:200px;
    }
}
```

<img :src="$withBase('/imgs/css/css3/animation1.gif')" alt="animation">

#### animation-duration

`animation-duration`规定完成动画所花费的时间，以秒或毫秒计。

#### animation-timing-function

`animation-timing-function`规定动画的速度曲线。

有六种取值：

|值|说明|
|--|--|
|linear|匀速（等于 cubic-bezier(0,0,1,1)）|
|ease|慢速开始，然后变快，然后慢速结束（cubic-bezier(0.25,0.1,0.25,1)）|
|ease-in|以慢速开始（等于 cubic-bezier(0.42,0,1,1)）|
|ease-out|以慢速结束（等于 cubic-bezier(0,0,0.58,1)）|
|ease-in-out|以慢速开始和结束（等于 cubic-bezier(0.42,0,0.58,1)）|
|cubic-bezier(n,n,n,n)|贝塞尔曲线，在 cubic-bezier 函数中定义自己的值，可能的值是 0 至 1 之间的数值|

#### animation-delay

`animation-delay`规定在动画开始之前的延迟，同样以s或ms计时。

#### animation-iteration-count

`animation-iteration-count`规定动画应该播放的次数。

值为次数或`infinite`，后者表示无限循环。

#### animation-direction

`animation-direction`规定是否应该轮流反向播放动画。

有两种取值：

`normal`表示正常播放，`alternate`表示轮流反向播放。

``` css
.parent {
    animation-name:mymove;
    animation-duration:5s;
    animation-direction:alternate;
    animation-iteration-count:infinite;

    /* Safari and Chrome */
    -webkit-animation-name:mymove;
    -webkit-animation-duration:5s;
    -webkit-animation-direction:alternate;
    -webkit-animation-iteration-count:infinite;
}
```

<img :src="$withBase('/imgs/css/css3/animation2.gif')" alt="animation">

#### 浏览器支持

<img :src="$withBase('/imgs/css/css3/compatibility_3.png')" alt="浏览器兼容性">

#### demo

一个简单的气球弹跳动画

``` css
#balloon{
    animation: balloonMove 2.5s infinite;
}
@keyframes balloonMove {
    48% {
        animation-timing-function: cubic-bezier(0.655, 0.05, 0.755, 0.06);
        transform: translate(0, -24px);
    }
    90% {
        transform: translate(0, -7px);
    }
}
```

<img :src="$withBase('/imgs/css/css3/animation3.gif')" alt="animation">
