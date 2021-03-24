## 水平居中、垂直居中

``` html
<div class="center_block parent">
    <div class="block">块级元素div</div>
</div>
<div class="center_inline parent">
    <span>行内元素span</span>
</div>
<div class="middle_block parent">
    <div class="block">块级元素div</div>
</div>
<div class="middle_inline parent">
    <span>行内元素span</span>
</div>
```

``` css
.parent {
    width: 500px;
    height: 100px;
    background-color: gray;
    border: 1px solid black;
    margin: 10px;
    padding: 20px;
    color: white;
}
.block {
    width: 200px;
    height: 30px;
    background-color: burlywood;
}
```

原始效果：

<img :src="$withBase('/imgs/css/center/before.png')" alt="原始效果">

居中效果：

<img :src="$withBase('/imgs/css/center/after.png')" alt="居中效果">

### 水平居中+行内元素

1. 方法一

``` css
.center_inline {
    text-align: center;
}
```

### 水平居中+块级元素

1. 方法一：margin

``` css
.center_block .block {
    margin: 0 auto;
}
```

2. 方法二：flex

``` css
.center_block {
    display: flex;
    justify-content: center;
}
```

3. 方法三：position + transform

``` css
.center_block {
    position: relative;
}
.center_block .block {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
}
```

4. 方法四：position + margin

``` css
.center_block {
    position: relative;
}
.center_block .block {
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
}
```

### 垂直居中+行内元素

1. 方法一：line-height

``` css
.middle_inline span {
    line-height: 100px;
}
```

2. 方法二：table-cell + vertical-align

``` css
/* 这种方案margin会失效 */
.middle_inline { 
    display: table-cell;
    vertical-align: middle;
}
```

``` css
/* 使用这种，但是宽度会撑满*/
.middle_inline { 
    display: table;
}
.middle_inline span {
    display: table-cell;
    vertical-align: middle;
}
```

<img :src="$withBase('/imgs/css/center/middle-inline.png')" alt="居中效果">

### 垂直居中+块级元素

1. 方法一：flex

``` css
.middle_block {
    display: flex;
    align-items: center;
}
```

2. 方法二：position + transform

``` css
.middle_block {
    position: relative;
}
.middle_block .block {
    position: absolute;
    top: 50%;
    transform: translate( 0, -50%);
}
```

3. 方法三：position + margin

``` css
.middle_block {
    position: relative;
}
.middle_block .block {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
}
```

4. 方法四：table-cell + vertical-align

``` css
/* 这种方案margin会失效 */
.middle_block {
    display: table-cell;
    vertical-align: middle;
}
```

``` css
/* 使用这种，但是高度会撑满*/
.middle_block { 
    display: table;
}
.middle_block .block {
    display: table-cell;
    vertical-align: middle;
}
```

<img :src="$withBase('/imgs/css/center/middle-block.png')" alt="居中效果">

5. 方法五：伪元素 + content

``` css
.middle_block::before {
    content: '';
    height: 100%;
    display: inline-block;
    vertical-align: middle;  
}
.middle_block .block {
    display: inline-block;
    vertical-align: middle;
}
```
