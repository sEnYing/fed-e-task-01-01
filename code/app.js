const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')

// 使用promise改进代码

setTimeout(function () {
  var a = 'hello'
  setTimeout(function () {
    var b = 'lagou'
    setTimeout(function () {
      var c = 'I LOVE U'
      console.log(a + b + c)
    }, 10)
  }, 10)
}, 10)

function fn1(a, b, c) {
  var p = new Promise(function (resovle, reject) {
    resovle(a + b + c)
  })
  return p
}
var a = 'hello'
var b = 'lagou'
var c = 'I LOVE U'
fn1(a, b, c).then(function (data) {
  console.log(data)
})

// 基于以下代码完成练习

const cars = [
  { name: 'Ferrari FF', horsepower: 660, dollar_value: 700000, in_stock: true },
  {
    name: 'Spyker C12 Zagato',
    horsepower: 650,
    dollar_value: 648000,
    in_stock: false,
  },
  {
    name: 'Jaguar XKR-S',
    horsepower: 550,
    dollar_value: 132000,
    in_stock: false,
  },
  { name: 'Audi R8', horsepower: 525, dollar_value: 114200, in_stock: false },
  {
    name: 'Aston Martin One-77',
    horsepower: 750,
    dollar_value: 1850000,
    in_stock: true,
  },
  {
    name: 'Pagani Huayra',
    horsepower: 700,
    dollar_value: 1300000,
    in_stock: false,
  },
]
// 1.使用fp.flowRight()重新实现
let isLastInStock = function (cars) {
  // 获取最后一条数据
  let last_car = fp.last(cars)
  // 获取最后一条的in_stock
  return fp.prop('in_stock', last_car)
}
isLastInStock()

const flowR = fp.flowRight(fp.prop('in_stock'), fp.last)
flowR()
// 2.获取第一个car的name
const flowF = fp.flowRight(fp.prop('name'), fp.first)
const FirstName = flowF(cars)
console.log(FirstName)

// 3.重构_average
let _average = function (xs) {
  return fp.reduce(fp.add, 0, xs) / xs.length
}
let averageDOllarValue = function (cars) {
  let dollar_values = fp.map(function (car) {
    return car.dollar_value
  }, cars)
  return dollar_values
}
const flowValue = fp.flowRight(_average, averageDOllarValue)
flowValue(cars)

// 4.
let _underscore = fp.replace(/\W+/g, '_')
const sanitizeNames = fp.flowRight(
  fp.map(fp.flowRight(_underscore, fp.toLower)),
)
sanitizeNames([
  'Hello World',
  'Hello World',
  'Hello World',
  'Hello World',
  'Hello World',
])
console.log(
  sanitizeNames([
    'Hello World',
    'Hello World',
    'Hello World',
    'Hello World',
    'Hello World',
  ]),
)

// 三、
// 1.
let maybe = Maybe.of([5, 6, 1])
let ex1 = () => {
  maybe.map((x) => {
    const fnp = fp.map(fp.add(1))
    fnp(x)
    console.log(fnp(x))
  })
}
ex1()
// 2.
let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
let ex2 = () => {
  xs.map((x) => {
    console.log(x)
    const fnp = fp.first
    fnp(x)
    console.log(fnp(x))
  })
}
ex2()
// 3.
let safeProp = fp.curry(function (x, o) {
  return Maybe.of(o[x])
})
let user = { id: 2, name: 'Albert' }
let ex3 = () => {
  const xs2 = safeProp('name', user)
  xs2.map((x) => {
    console.log(x)
    const fnp = fp.first
    fnp(x)
    console.log(fnp(x))
  })
}
ex3()
// 4
class ex4 {
  static of(value) {
    return new ex4(value)
  }
  constructor(value) {
    this._value = value
  }
  map() {
    return this.isNothing() ? ex4.of(null) : ex4.of(parseInt(this._value))
  }
  isNothing() {
    return this._value === null || this._value === undefined
  }
}
