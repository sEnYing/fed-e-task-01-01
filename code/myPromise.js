const PENDING = 'pending' // 等待状态
const RESPONSE = 'response' //成功状态
const REJECTED = 'rejected' //失败状态

class myPromise {
  // Promise状态
  status = PENDING
  // 成功后的返回值
  value = undefined
  // 失败原因
  reason = undefined
  // 成功回调
  successCallBack = []
  // 失败回调
  failCallBack = []

  resolve = (value) => {
    //状态为等待状态，则继续执行变更状态为成功 - 所以失败成功状态不能相互切换
    if (this.status !== PENDING) return
    this.status = RESPONSE
    this.value = value
    while (this.successCallBack.length) this.successCallBack.shift()()
  }
  reject = (reason) => {
    //状态为等待状态，则继续执行变更状态为失败 - 所以失败成功状态不能相互切换
    if (this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    while (this.failCallBack.length) this.failCallBack.shift()()
  }
  then(successCallBack, failCallBack) {
    // 请求成功时
    successCallBack = successCallBack ? successCallBack : (value) => value
    failCallBack = failCallBack
      ? failCallBack
      : (reason) => {
          throw reason
        }
    let promsie2 = new MyPromise((resolve, reject) => {
      if (this.status === RESPONSE) {
        setTimeout(() => {
          try {
            let x = successCallBack(this.value)
            resolvePromise(promsie2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = failCallBack(this.reason)
            resolvePromise(promsie2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else {
        this.successCallBack.push(() => {
          setTimeout(() => {
            try {
              let x = successCallBack(this.value)
              resolvePromise(promsie2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        this.failCallBack.push(() => {
          setTimeout(() => {
            try {
              let x = failCallBack(this.reason)
              resolvePromise(promsie2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    })
    return promsie2
  }
  catch(failCallBack) {
    // 请求错误时
    return this.then(undefined, failCallBack)
  }
  finally(callback) {
    // 请求结束
    return this.then(
      (value) => {
        return MyPromise.resolve(callback()).then(() => value)
      },
      (reason) => {
        return MyPromise.resolve(callback()).then(() => {
          throw reason
        })
      },
    )
  }
}
function resolvePromise(promsie2, x, resolve, reject) {
  if (promsie2 === x) {
    return reject(new TypeError('TypeError：'))
  }
  if (x instanceof MyPromise) {
    // promise 对象
    // x.then(value => resolve(value), reason => reject(reason));
    x.then(resolve, reject)
  } else {
    // 普通值
    resolve(x)
  }
}
module.exports = myPromise
