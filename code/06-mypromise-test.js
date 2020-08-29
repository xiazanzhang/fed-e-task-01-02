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