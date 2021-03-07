## 防抖与节流

### 防抖

事件触发后经过规定时间再执行，规定时间内，多次触发，每次触发导致重新计时，以最后一次触发为准，规定时间内都没有再次触发就执行。

#### 实现

``` js
function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
        let context = this;
        if(timer) clearTimeout(timer);
        timer = setTimeout(function() {
            fn.apply(context, args);
        }, delay);
    }
}
```

### 节流

规定时间内，只执行一次，多次触发不生效，只有规定时间过去执行完毕，才开始下一轮计时。

#### 实现

``` js
function throttle(fn, delay) {
    let flag = true;
    return function (...args) {
        let context = this;
        if (!flag) return;
        flag = false;
        setTimeout(() => {
            fn.apply(context, args);
            flag = true;
        }, delay);
    }
}
```

或

``` js
function throttle(fn, delay) {
    let last = new Date().getTime();
    return function (...args) {
        let context = this;
        let now = new Date().getTime();
        if(now - last < delay) return;
        last = now;
        fn.apply(this, args)
    }
}
```

### 防抖+节流

#### 实现

``` js
function throttle(fn, delay) {
    let last = new Date().getTime(), timer = null;
    return function (...args) {
        let context = this;
        let now = new Date().getTime();
        if(now - last < delay){
            clearTimeout(timer);
            timer = setTimeout(function() {
                last = now;
                fn.apply(context, args);
            }, delay);
        } else {
            // 过了规定时间必然触发一次，防止由于总是防抖导致一直无法触发
            last = now;
            fn.apply(context, args);
        }
    }
}
```

### 测试

<img :src="$withBase('/imgs/js/debounce_throttle/test.png')" alt="test">

### 参考

[如何实现事件的防抖和节流？](http://47.98.159.95/my_blog/blogs/perform/003.html#%E8%8A%82%E6%B5%81)

[7分钟理解JS的节流、防抖及使用场景](https://juejin.cn/post/6844903669389885453#heading-4)
