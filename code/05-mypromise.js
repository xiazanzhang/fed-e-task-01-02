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