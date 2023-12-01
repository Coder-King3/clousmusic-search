// ES6 ES2015
// https://promisesaplus.com/
const PromiseStatus = {
  pending: 'pending',
  fulfilled: 'fulfilled',
  rejected: 'rejected'
}

// 工具函数-校验是否是函数，是则执行
function checkExecute(fn, ...args) {
  if (typeof fn === 'function') return fn(...args)
}
// 工具函数-确认promise状态时try/catch处理异常
function execFnWithCatchError(execFn, value, resolve, reject) {
  try {
    const result = checkExecute(execFn, value)
    resolve(result)
  } catch (error) {
    reject(error)
  }
}

export default class CKPromise {
  constructor(executor) {
    // promise状态
    this.status = PromiseStatus.pending
    // promise成功的值
    this.value = undefined
    // promise失败的值
    this.reason = undefined
    // promise成功回调队列
    this.onFulfilledFns = []
    // promise失败回调队列
    this.onRejectedFns = []

    const resolve = (value) => {
      // 不是pending状态直接return
      if (this.status !== PromiseStatus.pending) return
      // 状态只能修改一次
      this.status = PromiseStatus.fulfilled
      // 存储成功的值
      this.value = value

      // 将回调添加到微任务队列异步执行
      queueMicrotask(() => {
        this.onFulfilledFns.forEach((fn) => fn())
      })
    }
    const reject = (reason) => {
      if (this.status !== PromiseStatus.pending) return
      this.status = PromiseStatus.rejected
      this.reason = reason

      queueMicrotask(() => {
        this.onRejectedFns.forEach((fn) => fn())
      })
    }

    // executor抛出错误直接reject()
    try {
      checkExecute(executor, resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      onFulfilled ??
      ((value) => {
        throw value
      })

    onRejected =
      onRejected ??
      ((err) => {
        throw err
      })

    return new CKPromise((resolve, reject) => {
      // 1.如果在调用then方法时, 状态已确定
      if (this.status === PromiseStatus.fulfilled)
        execFnWithCatchError(onFulfilled, this.value, resolve, reject)
      if (this.status === PromiseStatus.rejected)
        execFnWithCatchError(onRejected, this.reason, resolve, reject)

      // 2.状态未确定，将成功于失败的回调添加到回调队列中
      if (this.status === PromiseStatus.pending) {
        this.onFulfilledFns.push(() =>
          execFnWithCatchError(onFulfilled, this.value, resolve, reject)
        )

        this.onRejectedFns.push(() =>
          execFnWithCatchError(onRejected, this.reason, resolve, reject)
        )
      }
    })
  }

  catch(onRejected) {
    return this.then(undefined, onRejected)
  }

  finally(onFinally) {
    this.then(
      () => onFinally(),
      () => onFinally()
    )
  }

  static resolve(value) {
    return new CKPromise((resolve) => resolve(value))
  }

  static reject(reason) {
    return new CKPromise((_, reject) => reject(reason))
  }

  static all(promises) {
    // 问题关键: 什么时候要执行resolve, 什么时候要执行reject
    return new CKPromise((resolve, reject) => {
      const values = []
      promises.forEach((promise) => {
        promise.then(
          (res) => {
            values.push(res)
            if (values.length === promises.length) resolve(values)
          },
          (err) => {
            reject(err)
          }
        )
      })
    })
  }

  static allSettled(promises) {
    return new CKPromise((resolve) => {
      const results = []
      promises.forEach((promise) => {
        promise.then(
          (res) => {
            results.push({ status: PromiseStatus.fulfilled, value: res })
            if (results.length === promises.length) resolve(results)
          },
          (err) => {
            results.push({ status: PromiseStatus.rejected, value: err })
            if (results.length === promises.length) resolve(results)
          }
        )
      })
    })
  }

  static race(promises) {
    return new CKPromise((resolve, reject) => {
      promises.forEach((promise) => {
        promise.then(resolve, reject)
      })
    })
  }

  static any(promises) {
    // resolve必须等到有一个成功的结果
    // reject所有的都失败才执行reject
    const reasons = []
    return new CKPromise((resolve, reject) => {
      promises.forEach((promise) => {
        promise.then(resolve, (err) => {
          reasons.push(err)
          if (reasons.length === promises.length) reject(reasons)
        })
      })
    })
  }
}
