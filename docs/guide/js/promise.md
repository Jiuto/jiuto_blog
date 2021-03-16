## 手写一个Promise

### Promise 

#### 三种状态

一个Promise对象有三种状态：

pending（进行中）

fulfilled（已成功）

rejected（已失败）

状态只有两种转变可能，从pending到fulfilled，或者从pending到rejected。

#### 基本用法

``` js
var promise = new Promise((resolve,reject)=>{
    let flag = true;
    if (flag) {
        // return resolve('not promise') 在前面增加return，resolve后面的代码不再执行
        resolve('not promise') // resolve不会阻止后面的代码执行，then的执行属于微任务部分
        console.log('before not promise') // 所以'before not promise'先打印
    } else {
        let p = new Promise((resolve,reject)=>{
                    setTimeout(()=>{
                        resolve('test')
                    },3000)
                })
        resolve(p) // 三秒后输出'test'
        /** 
         * 当resolve方法传入一个新的Promise对象p，p的状态会传给原Promise对象promise：
         * 如果p的状态是pending，那么promise的回调函数就会等待p的状态改变；
         * 如果p的状态已经是resolved或者rejected，那么promise的回调函数将会立刻执行。
        */
    }
}).then(res=>{
    console.log(res)
}).then(res=>{
    /**
     * Promise.prototype.then
     * then方法的作用是为 Promise 实例添加状态改变时的回调函数
     * 第一个参数是resolved状态的回调函数，第二个参数是rejected状态的回调函数，均为可选
     * then方法返回的是一个新的Promise实例，因此可以采用链式写法
    */
}).catch(err=>{
    console.log(err)
    /**
     * Promise.prototype.catch()方法是.then(null, rejection)或.then(undefined, rejection)的别名，用于指定发生错误时的回调函数
    */
})
```

#### 其他方法 

(下方引用参见[ECMAScript 6 入门](https://es6.ruanyifeng.com/))

##### Promise.prototype.finally()

> finally方法不管promise最后的状态，在执行完then或catch指定的回调函数以后，都会执行finally方法指定的回调函数。
>
> finally方法的回调函数不接受任何参数，这意味着没有办法知道，前面的 Promise 状态到底是fulfilled还是rejected。
>
> 这表明，finally方法里面的操作，应该是与状态无关的，不依赖于 Promise 的执行结果。

##### Promise.all()

> 接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。
>
> Promise.all()方法接受一个数组作为参数，p1、p2、p3都是 Promise 实例，如果不是，就会先调用Promise.resolve方法，将参数转为 Promise 实例，再进一步处理。
>
> 另外，Promise.all()方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例。
>
> 只有p1、p2、p3的状态都变成fulfilled，p的状态才会变成fulfilled，只要p1、p2、p3之中有一个被rejected，p的状态就变成rejected。

##### Promise.race()

> 接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。
>
> Promise.race()方法的参数与Promise.all()方法一样，如果不是 Promise 实例，就会先调用Promise.resolve()方法，将参数转为 Promise 实例，再进一步处理。
>
> 只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给p的回调函数。

##### Promise.allSettled() ES2020

> 接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。
>
> 该方法返回的新的 Promise 实例，一旦结束，状态总是fulfilled，不会变成rejected。
>
> 状态变成fulfilled后，Promise 的监听函数接收到的参数是一个results数组，每个成员对应一个传入Promise.allSettled()的 Promise 实例。

##### Promise.any() ES2021

> 接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。
>
> 只要参数实例有一个变成fulfilled状态，包装实例就会变成fulfilled状态；如果所有参数实例都变成rejected状态，包装实例就会变成rejected状态。
>
> Promise.any()跟Promise.race()方法很像，只有一点不同，就是不会因为某个 Promise 变成rejected状态而结束。

##### Promise.resolve()

> 将现有对象转为 Promise 对象。
>
> （1）参数是一个 Promise 实例：如果参数是 Promise 实例，那么Promise.resolve将不做任何修改、原封不动地返回这个实例。
>
> （2）参数是一个thenable对象：Promise.resolve()方法会将这个对象转为 Promise 对象，然后就立即执行thenable对象的then()方法。
>
> （3）参数不是具有then()方法的对象，或根本就不是对象：Promise.resolve()方法返回一个新的 Promise 对象，其状态从一生成就是resolved，所以回调函数会立即执行，Promise.resolve()的入参会传给回调函数。
>
> （4）不带有任何参数：直接返回一个resolved状态的 Promise 对象。

##### Promise.reject()

> Promise.reject()方法也会返回一个新的 Promise 实例，该实例的状态为rejected

### 模拟实现

#### 基本功能实现

``` js
//定义三种状态
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
    constructor (handle) {
        this._status = PENDING;
        this._value = null; // fultilled状态的值，即调用resolve的入参
        this._error = null; // rejected状态的值，即调用reject的入参
        this.onFulfilledCallbacks = []; // fultilled状态回调函数栈
        this.onRejectedCallbacks = []; // rejected状态回调函数栈

        try {
            handle(this._resolve.bind(this), this._reject.bind(this)) 
        } catch (err) {
            this._reject(err)
        }
        
    }

    _resolve (value) {
        var self = this;

        //当resolve方法传入一个新的Promise对象，则等待其完成或失败
        if(value instanceof MyPromise) {
            return value.then(self._resolve.bind(self), self._reject.bind(self));
        }

        // 判断状态
        if (this._status !== PENDING) return

        // 放在setTimeout中执行，为了在new Promise时传入的同步任务在then方法注册回调后，调用前执行
        setTimeout(()=>{
            self._status = FULFILLED;
            self._value = value;
            self.onFulfilledCallbacks.forEach(cb => cb(self._value));
        },0);
    }

    _reject (error) { 
        var self = this;

        // 判断状态
        if (this._status !== PENDING) return

        // 放在setTimeout中执行，为了在new Promise时传入的同步任务在then方法注册回调后，调用前执行
        setTimeout(()=>{
            self._status = REJECTED;
            self._error = error;
            self.onRejectedCallbacks.forEach(cb => cb(self._error));
        },0);
    }

    then (onFulfilled, onRejected) {
        var self = this;
        let bridgePromise; // then返回的promise对象

        // 处理回调，使之必然为一个函数
        onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value;
        onRejected = typeof onRejected === "function" ? onRejected : error => { throw error };

        return bridgePromise = new MyPromise((resolve, reject) => {
            // 封装回调
            let getCallback = function(flag) {
                return function(val) {
                    try {
                        let res =  flag ? onFulfilled(val) : onRejected(val);
                        // 如果回调函数返回一个Promise对象，则等待其完成或失败
                        res instanceof MyPromise 
                            ? res.then(resolve, reject) 
                            : resolve(res)
                    } catch (err) {
                        reject(err)
                    }
                }
            }
            switch (self._status) {
                case PENDING:
                    self.onFulfilledCallbacks.push(getCallback(true))
                    self.onRejectedCallbacks.push(getCallback(false))
                    break
                case FULFILLED:
                    getCallback(true)(self._value)
                    break
                case REJECTED:
                    getCallback(false)(self._error)
                    break
                }
        })
    }

    catch (onRejected) {
      return this.then(null, onRejected)
    }
}
```

#### 基本功能测试

``` js
var promise = new MyPromise((resolve,reject)=>{
    var flag = 2;
    switch (flag) {
        case 1:
            resolve('not promise')
            console.log('before not promise')
            break
        case 2:
            let p = new MyPromise((resolve,reject)=>{
                        setTimeout(()=>{
                            resolve('test')
                        },3000)
                    })
            resolve(p)
            break
        case 3:
            reject("some error")
    }
}).then(res=>{
    console.log(res)
}).then(res=>{
    console.log(123)
    console.log(res)
}).catch(err=>{
    console.log(err)
})
```

flag = 1

<img :src="$withBase('/imgs/js/promise/test1.png')" alt="test1">

flag = 2

<img :src="$withBase('/imgs/js/promise/test2.png')" alt="test2">

flag = 3

<img :src="$withBase('/imgs/js/promise/test3.png')" alt="test3">

#### 其他方法实现

(下方实现来自[Promise实现原理](https://juejin.cn/post/6844903665686282253#heading-0))

``` js
class MyPromise {
    static resolve (value) {
        if (value instanceof MyPromise) return value;
        return new MyPromise((resolve, reject) => resolve(value));
    }

    static reject (value) {
         return new MyPromise((resolve, reject) => reject(value));
    }

    static all (list) {
        return new MyPromise((resolve, reject) => {
            let values = []
            let count = 0
            for (let [i, p] of list.entries()) {
                this.resolve(p).then(res => {
                    values[i] = res;
                    count++;
                    if (count === list.length) resolve(values);
                }, err => {
                    reject(err);
                })
            }
        })
    }

    static race (list) {
        return new MyPromise((resolve, reject) => {
            for (let p of list) {
                this.resolve(p).then(res => {
                    resolve(res);
                }, err => {
                    reject(err);
                })
            }
        })
    }

    finally (cb) {
        return this.then(
            value  => MyPromise.resolve(cb()).then(() => value),
            reason => MyPromise.resolve(cb()).then(() => { throw reason })
        );
    }
}
```

#### 其他方法测试

``` js
var p1 = new MyPromise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(1)
    },1000)
})

var p2 = new MyPromise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(2)
    },2000)
})

var p3 = new MyPromise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(3)
    },3000)
})

MyPromise.race([p1,p2,p3]).then(res=>{
    console.log(res)
})

MyPromise.all([p1,p2,p3]).then(res=>{
    console.log(res)
})

console.log(MyPromise.resolve('string').then(res=>{console.log(res)}))

console.log(MyPromise.reject('error'))

p3.finally(()=>{
    console.log('this is a fanally callback')
})
```

<img :src="$withBase('/imgs/js/promise/test4.png')" alt="test4">

### 参考

[Promise 对象 - 阮一峰](https://es6.ruanyifeng.com/#docs/promise)

[Promise实现原理](https://juejin.cn/post/6844903665686282253#heading-0)

[Promise (异步处理-实现)](https://blog.csdn.net/SeriousLose/article/details/113861602)
