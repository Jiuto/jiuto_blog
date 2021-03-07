## 冒泡与捕获

### 事件流

#### 冒泡型事件

例：`div -> body -> html -> document`

IE5.5及以前版本，会跳过 html 直接 body -> document

IE9、Firefox、Safari、Chrome将事件一直冒泡到 window

不是所有事件都能冒泡如：blur、focus、load、unload

#### 捕获型事件

例：`document -> html -> body -> div`

IE9、Firefox、Safari、Chrome、Opera从 window 对象开始捕获

#### DOM事件流

包括三个阶段：事件捕获阶段、处于目标阶段、事件冒泡阶段，从document到document

IE9、Firefox、Safari、Chrome、Opera

### 事件处理程序

#### HTML事件处理程序：响应某个事件的函数就叫做事件处理程序

* 通过event变量可以直接访问事件对象

`<input type="button" value="click me" οnclick="alert(event.type)">`

输出'click'

* this指向事件的目标元素

`<input type="button" value="click me" οnclick="alert(this.value)">`

输出'click me'

* 动态创建的函数扩展作用域，可以访问 document 及元素本身成员和访问表单元素的入口

``` js
function(){
  with(document){
    with(this.form){
      with(this){
        //元素属性值
      }
    }
  }
}
```

``` html
<form method="post">
    <input type="text" name="username" value="">
    <input type="button" value="Echo Username" οnclick="alert(username.value)">
</form>
```

让事件处理程序无需引用表单元素就能访问其他表单字段

缺点：

1. 如果用户在解析函数之前就触发事件，会引发错误，所以用try-catch块封装事件处理程序

`<input type="button" value="click me" οnclick="try{showMessage();}catch(ex){}">`

2. 这样扩展事件处理程序的作用域链在不同浏览器中会导致不同的结果，不同js引擎遵循的标识符解析规则略有差异，很可能会在访问非限定对象成员时出错

3. html和js代码紧密耦合

#### dom0级事件处理程序

如 onlick，事件冒泡阶段被处理

``` js
ele.οnclick=function(){
	alert(this.id);
}
```

* 事件处理程序在其所属元素的作用域内运行，this引用当前元素ele

* 解绑时将其设为null，即`ele.onclik = null;`

* 没有兼容性问题

#### dom2级事件处理程序

`addEventListener(event,handle,boolean)`

`removeEventListener(event, handle, boolean)`

* IE9+、Firefox、Safari、Chrome、Opera支持

* boolean为true时捕获，为false时冒泡

* 可添加多个事件，按照添加顺序触发

* 解绑时参数和绑定时一样，用ele.removeEventListener(event, handle, boolean)

* 匿名函数无法移除

* 大多数情况下都是将事件添加到冒泡阶段方便兼容所有浏览器，最好只在需要事件到达目标之前截获它时才将事件处理程序添加到捕获阶段。

#### ie事件处理程序

`attachEvent('on'+event, handle)`

`detachEvent("onclick", function(){})`

* IE8及以前版本，只支持冒泡

* 事件处理程序在全局作用域内运行，this指向window

* 可添加多个事件

* 添加的事件以相反的顺序触发

* 如果handle是同一个方法，绑定几次执行几次

* 解绑时参数和绑定时一样,用ele.detachEvent("onclick", function(){ });

* 匿名函数无法移除

* IE、Opera

#### 跨浏览器的事件处理程序

``` js
var EventUtil={
  addHandler:function(element,type,handler){
    if(element.addEventListener){
      element.addEventListener(type,handler,false);
    }else if(element.attachEvent){
      element.attachEvent('on'+type,handler);
    }else{
      element['on'+type]=handler;
    }
  },
  removeHandler:function(element,type,handler){
    if(element.removeEventListener){
      element.removeEventListener(type,handler,false);
    }else(element.detachEvent){
      element.detachEvent('on'+type,handler);
    }else{
      element['on'+type]=null;
    }
  }
};
var btn=document.getElementById('myBtn');
var handler=function(){
  alert('clicked');
};
EventUtil.addHandler(btn,'click',handler);
EventUtil.removeHandler(btn,'click',handler);
```

### 事件对象

调用事件处理程序时，引擎会传入一个event对象到事件处理程序。这个对象包含事件的状态和信息，事件处理程序执行完event会被销毁。

#### DOM中的事件对象
 
* event对象的常用属性和方法

|属性|类型|读写|说明|
|--|--|--|--|
|cancelable|Boolean|只读|表明是否可以取消事件的默认行为|
|currentTarget|Element|只读|其事件处理程序当前正在处理事件的那个元素|
|eventPhase|Integer|只读|调用事件处理程序阶段：1表示捕获阶段，2表示“处于目标”，3表示冒泡阶段|
|target|Element|只读|事件的目标|
|type|String|只读|被触发的事件的类型|

* 事件处理程序内部，对象this始终等于currentTarget的值，而target只包含事件的实际目标。

* 如果事件处理程序存在于按钮的父节点document.body中，button是事件click的实际目标，由于button上没有事件处理器，click事件就冒泡到了document.body处理。

``` js
var btn=document.getElementById('myBtn');
var handler=function(event){
  switch(event.type){
    case "click":
      alert('clicked');
      break;
    case "mouseover":
      event.target.style.backgroundColor='red';
      break;
    case "mouseout":
      event.target.backgroundColor='';
      break;
  }
};
btn.οnclick=handler;
btn.οnmοuseοver=handler;
btn.οnmοuseοut=handler;
```

##### 阻止事件的默认行为

如果要阻止事件的默认行为（超链接打开页面、submit表单提交等），
对于添加DOM0级事件处理器时，可以在事件处理器中`return false`，
对于添加DOM0/2级事件处理器时还可以用`preventDefault()`方法，
只有在`cancelable===true`时才可以用`preventDefault()`方法取消默认事件。
 
``` js
var link=document.getElementById('myLink');
link.οnclick=function(event){
  event.preventDefault(); 
}
link.addEventListener("click", function(event){
    var event = event || window.event;
    ...
    event.preventDefault(); 
},false);
```

##### 阻止事件传播

使用`event.stopPropagation()`方法阻止事件传播，
无参数，可以同时取消冒泡和捕获，在捕获过程中使用后冒泡也不会发生。
 
直接添加到一个按钮的事件处理程序可以调用`stopPropagation()`，
从而避免触发注册在document.body上面的事件处理程序。

事件对象的eventPhase属性可以用来确认当前正位于事件流的哪个阶段。

``` js 
var btn=document.getElementById('myBtn');
btn.οnclick=function(event){
  alert('clicked');
  event.stopPropagation();
};
document.body.οnclick=function(event){
  alert("body clicked");
};

var btn=document.getElementById('myBtn');
btn.οnclick=function(event){
  alert(event.eventPhase);//2
};
document.body.addEventListener("click",function(event){
  alert(event.eventPhase);//1
},true);
document.body..οnclick=function(event){
  alert(event.eventPhase);//3
};
```

#### IE中的事件对象
 
* DOM0级添加事件处理器时，event作为window对象的属性。
用attachEvent()添加事件处理程序，有一个event对象作为参数被传入事件处理程序中，
也可以通过window.event访问事件对象。

如果是通过HTML特性指定的事件处理程序，还可以通过一个叫event的变量来访问事件对象
`<input type="button" value="click me" οnclick="alert(event.type)">`
 
* event对象的常用属性和方法

|属性|类型|读写|说明|
|--|--|--|--|
|cancelBubble|Boolean|读/写|默认false，设为true可以取消事件冒泡(作用同DOM中的stopPropagation())
|returnValue|Boolean|读/写|默认true，设为false可以取消事件默认行为(作用同DOM中的preventDefault())
|srcElement|Element|只读|事件的目标(同dom中target)
|type|String|只读|被触发事件的类型

* 因为事件处理程序的作用域是根据指定它的方式来确定的，所以不能认为this始终等于事件目标，最好使用event.srcElement
 
##### 阻止事件的默认行为

将returnValue设为false，阻止默认行为

``` js
var link=document.getElementById('myLink');
link.οnclick=function(){
  window.event.returnValue=false; 
}
link.attachEvent("onclick", function(e){
    var event = e || window.event;
    ...
    event.returnValue = false; 
},false);
```

##### 阻止事件传播

由于IE不支持捕获，所以只能阻止冒泡

``` js
var btn=document.getElementById('myBtn');
btn.οnclick=function(event){
  alert('clicked');
  window.event.cancelBubble = true;
};
document.body.οnclick=function(event){
  alert("body clicked");
};
```

#### 跨浏览器的事件对象

由于IE不支持事件捕获，因此这个方法在跨浏览器情况下也只能用来阻止事件冒泡

``` js
var EventUtil={
  addHandler:function(element,type,handler){
    if(element.addEventListener){
      element.addEventListener(type,handler,false);
    }else if(element.attachEvent){
      element.attachEvent('on'+type,handler);
    }else{
      element['on'+type]=handler;
    }
  },
 
  getEvent:function(event){
    return event?event:window.event;
  },
  getTarget:function(event){
    return event.target||event.srcElement;
  },
  preventDefault:function(event){
    if(event.preventDefault){
      event.preventDefault();
    }else{
      event.returnValue=false;
    }
  },
 
  removeHandler:function(element,type,handler){
    if(element.removeEventListener){
      element.removeEventListener(type,handler,false);
    }else(element.detachEvent){
      element.detachEvent('on'+type,handler);
    }else{
      element['on'+type]=null;
    }
  },
 
  stopPropagation:function(event){
    if(event.stopPropagation){
      event.stopPropagation();
    }else{
      event.cancelBubble=true;
    }
  }
 
};
 
var btn=document.getElementById('myBtn');
 
btn.οnclick=function(event){
  event=EventUtil.getEvent(event);  // 确保随时可以使用event对象；
  var target=EventUtil.getTarget(event);
  EventUtil.preventDefault(event);
}
 
var btn=document.getElementById('myBtn');
 
btn.οnclick=function(event){
  alert("clicked");
  event=EventUtil.getEvent(event);
  EventUtil.stopPropagation(event);
}
document.body.οnclick=function(event){
  alert("body clicked");
}
```

### 参考

《JavaScript高级程序设计》