- promise包含三种状态：Pending，Fulfilled，Rejected，执行结果只能有一种且不能修改
- promise即便没有写在异步函数内，后面then()方法的回调函数也会进入消息队列中排队
- 每个then都返回一个新的promise对象
- 链式写法，后一个then都是为上一个then方法返回的promise对象添加明确状态后的回调
- 前面then方法的回调函数的返回值会作为后面then方法回调函数的参数
- 如果前面then的回调返回的也是一个promise对象，后面then的回调会等待它结束
- promise并行执行，promise.all()里面的promise都成功了才成功，只要有一个失败就得到reject状态
- promise.race()只等待第一个结束的任务
- 在任务队列中promise是微任务，计时器是宏任务，微任务比宏任务优先执行

```javascript
const PENDING = 'pending' //等待
const FULFILLED = 'fulfilled'//成功
const REJECTED = 'rejected'//失败

class myPromise {
  constructor (executor) {
    try {
      executor(this.resolve,this.reject)
    } catch(e) {
      this.reject(e)
    }
  }
  //promise状态
  status = PENDING
  // 成功之后的值
  value = undefined
  // 失败之后的值
  reason = undefined
  //成功回调
  successCallBack = []
  //失败回调
  failCallBack = []
  
  resolve = value =>{
    //如果状态不是等待阻止程序继续向下执行
    if(this.status!==PENDING)return
    //将状态修改为成功
    this.status = FULFILLED
    //保存成功之后的值
    this.value = value
    //判断成功回调是否存在，存在就调用
    while(this.successCallBack.length)this.successCallBack.shift()()
  }
  reject = reason =>{
    //如果状态不是等待阻止程序继续向下执行
    if(this.status!==PENDING)return
    //将状态修改为失败
    this.status = REJECTED
    //保存失败原因
    this.reason = reason
    //判断失败回调是否存在，存在就调用
    while(this.failCallBack.length)this.failCallBack.shift()()
  }
  then(successCallBack,failCallBack) {
    //参数可选
    successCallBack = successCallBack?successCallBack:value =>value
    //参数可选
    failCallBack = failCallBack?failCallBack:reason =>{throw reason}
    let promise2 = new MyPromise({resolve,reject} =>{
      //判断状态
      if(this.status === FULFILLED){
        setTimeout(() =>{
          try {
            let x = successCallBack(this.value)
            //判断x的值是普通值还是promise对象
            //如果是普通值，直接调用resolve
            //如果是promise对象，查看promise对象返回的结果
            //再根据promise返回的结果决定调用resolve还是reject
            resolvePromise(promise2,x,resolve,reject)
          }catch(e) {
            reject(e)
          }
        },0)
      } else if (this.status === REJECTED) {
        setTimeout(() =>{
          try {
            let x = failCallBack(this.reason)
            //判断x的值是普通值还是promise对象
            //如果是普通值，直接调用resolve
            //如果是promise对象，查看promise对象返回的结果
            //再根据promise返回的结果决定调用resolve还是reject
          } catch(e) {
            reject(e)
          }
        }，0)
      } else {
        //等待
        //将成功回调和失败回调存储起来
        this.successCallBack.push(() =>{
          setTimeout(() =>{
            try {
            let x = successCallBack(this.value)
            //判断x的值是普通值还是promise对象
            //如果是普通值，直接调用resolve
            //如果是promise对象，查看promise对象返回的结果
            //再根据promise返回的结果决定调用resolve还是reject
            resolvePromise(promise2,x,resolve,reject)
          }catch(e) {
            reject(e)
          }
          },0)
        })
        this.failCallBack.push(() =>{
          setTimeout(() =>{
             try {
            let x = failCallBack(this.reason)
            //判断x的值是普通值还是promise对象
            //如果是普通值，直接调用resolve
            //如果是promise对象，查看promise对象返回的结果
            //再根据promise返回的结果决定调用resolve还是reject
          } catch(e) {
            reject(e)
          }
          },0)
        })
      }
    })
    return promise2
  }
finally (callback) {
  		return this.then(value =>{
    		return myPromise.resolve(callback()).then(() => value)
  		},reason =>{
      		return myPromise.resolve(callback()).then(() =>{throw reason})
  		})
	}
	catch (failCallBack) {
      return this.then(undefined,failCallBack)
	}
	static all (array) {
      let result = []
      let index = 0
      return new myPromise((resolve,reject) =>{
        function addData(key,value) {
          result[key] = value
          index ++
          if(index === array.length){
            resolve(result)
          }
        }
        for(let i = 0;i<array.length;i++) {
          let current = array[i]
          if(current instanceof myPromise) {
            // promise 对象
            current.then(value => addData(i,value),reason => reject(reason))
          } else {
            // 普通值
            addData(i,array[i])
          }
        }
      })
	}
	static resolve(value) {
      if(value instanceof myPromise) return value
      return new myPromise(resolve => resolve(value))
	} 
}

function resolvePromise (promsie2, x, resolve, reject) {
  if(promsie2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  if(x instanceof myPromise) {
    // promise 对象
    x.then(resolve,reject)
  } else {
    //普通值
    resolve(x)
  }
}

module.exports = myPromise
```

