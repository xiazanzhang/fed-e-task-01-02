#  模块一：函数式编程与JS异步编程、手写Promise

> ##### 简答题：

1. 谈谈你是如何理解JS异步编程的，EventLoop、消息队列都是做什么的，什么是宏任务，什么是微任务？

- JS异步编程
  - JavaScript将任务的执行模式分为两种，一种是同步执行模式，另外一种是异步编程执行模式。
  - 众所周知，JavaScript的执行环境是单线程，即在同一时间只能做一件事情，我们把它称之为同步执行模式，这种模式的优点是直观简洁，代码会依次执行，安全，但遇到耗时任务时，则会出现程序假死的情况，很大程度降低了程序的执行效率。
  - 异步编程执行模式不会等待这个任务执行结束后才开始执行下一个任务，对于耗时操作开启过后会立即执行下一个任务，异步模式对于JavaScript非常重要，如果没有这种模式的话单线程的JavaScript语言就无法同时处理大量耗时任务，这种模式的优点是不占用主线程，提高了程序的执行效率，但不像同步执行模式的代码一样通俗易懂，执行顺序相对会比较跳跃。
  - 如何实现异步编程，可以通过回调函数的形式将所需要执行的函数放到任务队列中，不会占用主线程，此时的异步线程会单独的去执行异步任务，当执行完这个任务过后会将这个任务的回调放入到消息队列中，等主线程执行完毕后会依次执行消息队列当中的任务，异步编程实现的方案也在不断的发展，有以下几种方式，回调函数、事件监听、发布订阅模式、Promise、Generator、async/await等。
- EventLoop
  - 负责监听调用栈和消息队列，调用栈所有的任务都执行结束过后，事件循环会从消息队列当中取出第一个回调函数放入到调用栈中，整个运行机制被称为EventLoop。
- 消息队列
  - 负责存放待执行的任务，特点是先进先出，永不阻塞。
- 宏任务
  - 宿主环境提供的叫宏任务，setTimeout，setInterval，setImmediate，requestAnimationFrame等。
- 微任务
  - 由语言标准提供的叫微任务，process.nextTick，MutationObserver，Promise.then catch finally等。
- 宏任务和微任务之间的关系如下图所示
  - ![img](https://images.gitee.com/uploads/images/2020/0621/233633_21bc7573_7722044.png)	

> 代码题

1. 将下面异步代码使用Promise的方式改进

   ```javascript
   setTimeout(function () {
       var a = 'hello'
       setTimeout(function () {
           var b = 'lagou'
           setTimeout(() => {
               var c = 'I ♥ U'
               console.log(a + b + c)
           }, 10);
       }, 10);
   }, 10);
   ```

   答：

   ```javascript
   const fn = () => {
       return new Promise((resolve, reject) => {
           setTimeout(() => {
               return resolve(arguments)
           }, 10);
       })
   }
   
   fn().then(() => {
       return 'hello'
   }).then(value => {
       return value + 'lagou'
   }).then(value => {
       return value + 'I ♥ U'
   }).then(value => {
       console.log(value)
   })
   ```

   

2. 基于以下代码完成下面的四个练习

   ```javascript
   const cars = [
       { name: 'Ferrair FF', horsepower: 660, dollar_value: 700000, in_stock: true },
       { name: 'Spyker C12 Zagato', horsepower: 650, dollar_value: 648000, in_stock: false },
       { name: 'Jafuar XKR-S', horsepower: 550, dollar_value: 132000, in_stock: false },
       { name: 'Audi R8', horsepower: 525, dollar_value: 114200, in_stock: false },
       { name: 'Aston Martin One-77', horsepower: 750, dollar_value: 1850000, in_stock: true },
       { name: 'Pagani Huayra', horsepower: 700, dollar_value: 1300000, in_stock: false }
   ]
   ```

   

   练习1：使用函数组合fp.flowRight()重新实现下面这个函数

   ```javascript
   let isLastInStock = function (cars) {
       //获取最后一条数据
       let last_car = fp.last(cars)
       //获取最后一条数据的in_stock 属性值
       return fp.prop('in_stock', last_car)
   }
   ```

   答：

   ```javascript
   let isLastInStock = fp.flowRight(fp.prop('in_stock'),fp.last)
   console.log(isLastInStock(cars)) 
   ```

   

   练习2： 使用fp.flowRight()、fp.prop()和fp.first()获取第一个car的name

   ```javascript
    let isFirstInName=fp.flowRight(fp.prop('name'),fp.first)
    console.log(isFirstInName(cars))
   ```

   

   练习3：使用帮助函数_average重构averageDollarValue,使用函数组合的方式实现

   ```javascript
   let _average = function (xs) {
       return fp.reduce(fp.add, 0, xs) / xs.length
   }
   
   let averageDollarValue = function (cars) {
       let dollar_values = fp.map(function (car) {
           return car.dollar_value
       }, cars)
       return _average(dollar_values)
   }
   ```

   答：

   ```javascript
   let _average = function (xs) {
       return fp.reduce(fp.add, 0, xs) / xs.length
   }
   
   let averageDollarValue = fp.flowRight(_average, fp.map((car) => car.dollar_value))
   
   console.log(averageDollarValue(cars))
   ```

   

   练习4：使用flowRight写一个sanitizeNames()函数，返回一个下划线连接的小写字符串，把数组中的name转换为这种形式，例如：sanitizeNames(['Hello World']) => ['hello_world']

   ```javascript
   let _underscore = fp.replace(/\W+/g, '_')
   
   let sanitizeNames = fp.flowRight(_underscore, fp.toLower, fp.map(item => item))
   
   console.log(sanitizeNames(['Hello World']))
   ```

   

3. 基于下面提供的代码，完成后续的四个练习

   ```javascript
   class Container {
       static of(value) {
           return new Container(value)
       }
   
       constructor(value) {
           this._value = value
       }
   
       map(fn) {
           return Container.of(fn(this._value))
       }
   }
   
   class Maybe {
       static of(x) {
           return new Maybe(x)
       }
   
       isNothing() {
           return this._value === null || this._value === undefined
       }
   
       constructor(x) {
           this._value = x
       }
   
       map(fn) {
           return this.isNothing() ? this : Maybe.of(fn(this._value))
       }
   }
   
   module.exports = { Maybe, Container }
   ```

   

   练习1：使用fp.add(x,y)和fp.map(x,y)创建一个能让functor里的值增加的函数ex1

   ```javascript
   const fp = require('lodash/fp')
   const { Maybe, Container } = require('./03-support')
   
   let maybe = Maybe.of([5, 6, 11])
   let ex1 = () => {
       //你需要实现的函数
   }
   ```

   答：

   ```javascript
   let ex1 = num => maybe.map((fp.map(fp.add(num))))._value
   
   console.log(ex1(3)) //[8,9,14]
   ```

   

   练习2：实现一个函数ex2，能够使用fp.first获取列表的第一个元素

   ```javascript
   const fp = require('lodash/fp')
   const { Maybe, Container } = require('./03-support')
   
   let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
   
   let ex2 = () => {
       //你需要实现的函数
   }
   ```

   答：

   ```javascript
   let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
   
   let ex2 = () => xs.map((fp.first))._value
   
   console.log(ex2()) //do
   ```

   

   练习3：实现一个函数ex3，使用safeProp和fp.first找到user的名字的首字母

   ```javascript
   const fp = require('lodash/fp')
   const { Maybe, Container } = require('./03-support')
   
   let safeProp = fp.curry(function (x, o) {
       return Maybe.of(o[x])
   })
   
   let user = { id: 2, name: 'Albert' }
   
   let ex3 = () => {
       //你需要实现的函数
   }
   ```

   答：

   ```javascript
   let safeProp = fp.curry(function (x, o) {
       return Maybe.of(o[x])
   })
   
   let user = { id: 2, name: 'Albert' }
   
   let ex3 = (user) => safeProp('name', user).map(fp.first)._value
   
   console.log(ex3(user)) //A
   ```

   

   练习4：使用MayBe重写ex4，不要有if语句

   ```javascript
   let ex4 = function (n) {
       if (n) {
           return parseInt(n)
       }
   }、
   ```

   答：

   ```javascript
   let ex4 = n => Maybe.of(n).map(parseInt)._value
   
   console.log(ex4())  //undefined
   console.log(ex4(1)) //1
   ```

   

4. 手写实现MyPromise源码

   要求：尽可能还原Promise中的每一个API，并通过注释的方式描述思路和原理。

   ```javascript
   const PEDDING = 'pedding' //等待
   const FULFILLED = 'fulfilled' //成功
   const REJECTED = 'reject' //失败
   
   class MyPromise {
       /**
        * 通过构造函数来接收这个执行器
        * @param {*} executor 执行器
        */
       constructor(executor) {
           try {
               //这个执行器是立即执行的
               executor(this.resolve, this.reject)
           } catch (e) {
               this.reject(e)
           }
       }
   
       //记录Promise状态 默认：等待
       status = PEDDING
       //成功之后的值
       value = undefined
       //失败后的原因
       reason = undefined
       //成功回调
       successCallback = []
       //失败回调
       failCallback = []
   
       /**
        * 更改状态为成功,一旦状态确定将不可更改
        * 使用箭头函数定义是为了执行方法的时候让this指向MyPromise的实例对象
        * @param {*} value 成功后的值
        */
       resolve = value => {
           //如果状态不是等待，阻止程序向下执行
           if (this.status !== PEDDING) return
           //将状态更改为成功
           this.status = FULFILLED
           //保存成功之后的值
           this.value = value
           //判断成功回调是否存在，如果存在，调用存储的成功回调函数
           // this.successCallback && this.successCallback(this.value)
           // while (this.successCallback.length) this.successCallback.shift()(this.value)
           while (this.successCallback.length) this.successCallback.shift()()
       }
   
       /**
        * 更改状态为失败,一旦状态确定将不可更改
        * @param {*} reason 失败的原因
        */
       reject = reason => {
           //如果状态不是等待，阻止程序向下执行
           if (this.status !== PEDDING) return
           //将状态更改为失败
           this.status = REJECTED
           //保存失败后的原因
           this.reason = reason
           //判断失败回调是否存在，如果存在，调用存储的失败回调函数
           // this.failCallback && this.failCallback(this.reason)
           while (this.failCallback.length) this.failCallback.shift()()
       }
   
       /**
        * 判断状态，如果成功调用成功回调，如果失败调用失败回调
        * @param {*} successCallback 成功回调
        * @param {*} failCallback 失败回调
        */
       then(successCallback, failCallback) {
           //判断回调函数是否存在，如果存在就用这个回调函数，如果不存在就补充一个参数
           //实现调用then方法的时候，这个then方法不传递参数，这个then方法会依次调用，直到传递给有回调函数的then方法
           successCallback = successCallback ? successCallback : value => value
           failCallback = failCallback ? failCallback : reason => { throw reason }
   
           //实现链式调用,返回一个MyPromise对象
           let promose2 = new MyPromise((resolve, reject) => {
               // 同步执行，根据当前状态返回指定的回调函数
               if (this.status === FULFILLED) {
                   //将代码变成异步代码，同步代码执行完成之后才会执行，目的为了能够得到promose2对象
                   convert(() => resolvePromise(promose2, successCallback(this.value), resolve, reject), reject)
               } else if (this.status === REJECTED) {
                   convert(() => resolvePromise(promose2, failCallback(this.reason), resolve, reject), reject)
               } else {
                   //如果是等待状态（异步），将成功回调和失败回调存储起来
                   this.successCallback.push(() => convert(() => resolvePromise(promose2, successCallback(this.value), resolve, reject), reject))
                   this.failCallback.push(() => convert(() => resolvePromise(promose2, failCallback(this.reason), resolve, reject), reject))
               }
           })
   
           return promose2;
       }
   
       /**
        * 解决异步并发问题，允许异步代码调用的顺序得到异步代码执行的结果
        * @param {*} array 接收一个数组作为参数，这个数组当中的可以是任何值，包括普通值和promise对象，数组当中的顺序一定是执行结果的顺序
        */
       static all(array) {
           let result = []
   
           let index = 0
   
           return new MyPromise((resolve, reject) => {
               //添加执行结果数据到result
               const addData = (key, value) => {
                   result[key] = value
                   index++
                   //判断index的长度是否等于array的长度，因为for循环是一瞬间就执行完毕的，执行for循环的过程中存在异步操作，当长度一致时才去调用resolve方法
                   if (index === array.length) {
                       resolve(result)
                   }
               }
               for (let i = 0; i < array.length; i++) {
                   let current = array[i]
                   if (current instanceof MyPromise) {
                       //mypromise对象
                       //所有成功才返回成功，一次失败直接返回失败，这是all方法的一个特点
                       current.then(value => addData(i, value), reason => reject(reason))
                   } else {
                       //普通值
                       addData(i, array[i])
                   }
               }
           })
       }
   
       /**
        * 将传递的值转换成promise对象
        * @param {*} value 传递的值
        */
       static resolve(value) {
           if (value instanceof MyPromise) {
               return value
           } else {
               return new MyPromise(resolve => resolve(value))
           }
       }
   
       /**
        * 无论promise对象最终的状态是成功还是失败，该方法都会执行一次
        * 在finally后面可以链式调用得到这个方法的结果
        * @param {*} callback 回调函数
        */
       finally(callback) {
           return this.then(value => {
               return MyPromise.resolve(callback()).then(() => value)
           }, reason => {
               return MyPromise.resolve(callback()).then(() => { throw reason })
           })
       }
   
       /**
        * 用来处理当前这个promise对象最终的状态为失败的情况
        * @param {*} failCallback 失败的回调函数
        */
       catch(failCallback) {
           return this.then(undefined, failCallback)
       }
   }
   
   /**
    * 判断x的值是普通值还是promise对象
    * 如果是promise对象，查看promise对象返回的结果，再根据promise对象返回的结果 决定调用resolve还是reject
    * 如果是普通值，直接调用resolve
    * @param {*} promise 新的pormise对象
    * @param {*} x 当前操作的promise对象
    * @param {*} resolve 成功回调
    * @param {*} reject 失败回调
    */
   const resolvePromise = (promise, x, resolve, reject) => {
       //阻止promise对象循环调用
       if (promise === x) {
           return reject(new TypeError("Chaining cycle detected for promise #<Promise>"))
       }
       //判断X是否属于MyPromise对象
       if (x instanceof MyPromise) {
           // mypromise对象
           // x.then(value => { resolve(value) }, reason => { reject(reason) })
           x.then(resolve, reject)
       } else {
           //普通值
           resolve(x)
       }
   }
   
   /**
    * 将同步代码转换成异步代码
    * @param {*} resolve 需要转换的成功回调函数
    * @param {*} reject  需要转换的失败回调函数
    */
   const convert = (resolve, reject) => {
       setTimeout(() => {
           try {
               return resolve()
           } catch (e) {
               return reject(e)
           }
       }, 0);
   
   }
   
   module.exports = MyPromise
   ```

   ```javascript
   /**
    * 1：Promise就是一个类，在执行这个类的时候，需要传递一个执行器进去，执行器会立即执行
    * 2：Promise中有三种状态，分别为成功(fulfilled)、失败(rejected)、等待(pending)，一旦状态确定就不可更改
    *    pending->fulfilled||rejected
    * 3：resolve和reject函数是用来更改状态的
    *    resolve:fulfilled
    *    reject:rejected
    * 4：then方法内部做的事情就是判断状态，如果状态是成功就调用成功回调函数，如果状态是失败就调用失败回调函数，then方法是被定义在原形对象中的
    * 5：then成功回调有一个参数，表示成功之后的值，then失败回调有一个参数，表示失败后的原因
    * 6：同一个promise对象下面的then方法是可以被调用多次的
    * 7：then方法是可以被链式调用的，后面then方法的回调函数拿到值的是上一个then方法的回调函数的返回值  
    */
   
   const MyPromise = require('./05-mypromise')
   
   let promise = new MyPromise((resolve, reject) => {
       // setTimeout(() => {
       //     resolve('成功')
       // }, 1000);
       // throw new Error('executor error')
       // resolve("成功")
       reject('失败')
   })
   
   // 测试then多次调用的方式
   
   // promise.then(value => {
   //     console.log(value)
   // }, reason => {
   //     console.log(reason)
   // })
   
   // promise.then(value => {
   //     console.log(value)
   // }, reason => {
   //     console.log(reason)
   // })
   
   // promise.then(value => {
   //     console.log(value)
   // }, reason => {
   //     console.log(reason)
   // })
   
   // 测试链式调用方式 返回普通值
   // promise.then(value => {
   //     console.log(value)
   //     return 100
   // }).then(value => {
   //     console.log(value)
   // })
   
   // function other() {
   //     return new MyPromise((resolve, reject) => {
   //         resolve('other')
   //     })
   // }
   
   // 测试链式调用的方式 返回promise对象
   // promise.then(value => {
   //     console.log(value)
   //     return other()
   // }).then(value => {
   //     console.log(value)
   // })
   
   // 测试循环调用的情况，异常提醒
   // let p1 = promise.then(value => {
   //     console.log(value)
   //     return p1
   // })
   
   // p1.then(value => {
   //     console.log(value)
   // }, reason => {
   //     console.log(reason.message)
   // })
   
   // promise.then(value => {
   //     console.log(value)
   //     // throw new Error('then error')
   //     return 'aaa'
   // }, reason => {
   //     console.log(reason.message)
   //     return 100
   // }).then(value => {
   //     console.log(value)
   // })
   
   // 测试调用then方法的时候，这个then方法不传递参数，这个then方法会依次调用，直到传递给有回调函数的then方法
   // promise.then()
   //     .then()
   //     .then()
   //     .then(value => {
   //         console.log(value)
   //     }, reason => {
   //         console.log(reason)
   //     })
   
   // 测试all方法
   // const p1 = () => {
   //     return new MyPromise((resolve, reject) => {
   //         setTimeout(() => {
   //             resolve('p1')
   //         }, 2000);
   //     })
   // }
   
   // const p2 = () => {
   //     return new MyPromise((resolve, reject) => {
   //         resolve('p2')
   //     })
   // }
   
   // MyPromise.all(['a', 'b', p1(), p2(), 'c']).then(result => console.log(result))
   
   // 测试resolve方法
   // const p1 = () => {
   //     return new MyPromise((resolve, reject) => {
   //         resolve('hello')
   //     })
   // }
   
   // MyPromise.resolve(10).then(value => console.log(value))
   // MyPromise.resolve(p1()).then(value => console.log(value))
   
   // 测试finally方法
   // p2().finally(() => {
   //     console.log('finally')
   //     return p1()
   // }).then(value => {
   //     console.log(value)
   // }, reason => {
   //     console.log(reason)
   // })
   
   // 测试catch方法
   // promise.then(value => {
   //     console.log(value)
   // }).catch(e => {
   //     console.log(e)
   // })
   ```

   

