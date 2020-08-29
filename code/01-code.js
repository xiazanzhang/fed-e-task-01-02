/**
 * 将下面异步代码使用Promise的方式改进
 */

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