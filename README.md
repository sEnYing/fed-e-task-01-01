<!--
 * @Descripttion:
 * @Author: SongEnYing
 * @Date: 2020-06-22 09:56:54
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-06-22 09:58:09
-->

一、如何理解 js 异步的 EventLoop、消息队列，什么是宏任务、什么是微任务
-js 是一门单线程语言，同时只能执行一个任务，代码执行是同步阻塞的。浏览器可以多线程执行异步操作
js 执行遇到异步操作放到消息队列中，消息队列中的回调等待执行
js 会维护一个 callstack，同步代码一次加入执行，结束退出栈。如果栈为空了，事件触发线程会从消息队列取出一个任务到 callstack 中执行。当 callstack 再次为空的时候，继续之前操作

callstack 中执行的为宏任务，当执行过程中遇到 Promise 等微任务时会创建微任务，当宏任务执行完毕后会对微任务队列进行执行重新渲染。微任务全部执行完毕后，会从消息队列中取出下一个任务执行继续之前操作
同步操作(宏任务)=>(微任务)=>消息队列获取下一任务(宏任务)=>(微任务)
