---
title: "JavaScript复习-0"
tags: "JavaScript"
categories: "2021复习"
description: ""
createDate: "2021-05-07 14:34:34"
updateDate: "2024-04-03 20:30:44"
---


## JavaScript数据类型

原始Primitive类型：

`Number`、`String`、`Boolean`、`Undefined`、`Null`、`Symbol`、`Bigint`

引用类型

`Object`、`Array`、`Date`、`Function` 

## Symbol和Bigint

`Symbol`表示唯一、不可变的值。用于确保对象属性使用唯一标识符，不会发生属性名冲突的危险； `Symbol.for`返回一致的结果

`BigInt`是一种数字类型的数据，它可以表示任意精度格式的整数，使用`BigInt`可以安全地存储和操作大整数，即使这个数已经超出了 Number 能够表示的安全整数范围

常见 `Symbol` 
``` js
// Object.prototype.toString
Symbol.toStringTag

// 将对象转换为相应的原始值（隐式类型转换）
Symbol.toPrimitive

// 迭代器
Symbol.Iterator
```

## var vs let/const

- 作用域问题
- 重复声明/赋值问题
- 变量提升
- 暂时性死区

## 数据属性/访问器属性

对象的属性有两种类型，**数据属性**和**访问器属性**

- 创建对象时默认就存在的属性为数据属性
- 通过`Object.defineProperty`设置的属性描述符中含有`set/get`的属性为访问器属性

## 内部属性[[Class]]

[Object.prototype.toString传送门]()

~~所有对象(`typeof`返回为`object`)都包含有一个内部属性`[[Class]]`，该属性不能直接访问，
可使用`Object.prototype.toString`来查看~~

**ES6移除了这个属性**

``` js
Object.prototype.toString.call([])  
//"[object Array]"

Object.prototype.toString.call(() => {})
// "[object Function]"
```

## Object.prototype.toString

拿到变量准确的类型

``` js
Object.prototype.toString.call([])  
//"[object Array]"

Object.prototype.toString.call(() => {})
// "[object Function]"

/*
基本类型值string、number、boolean都可以打印这是因为JavaScript为基本类型值包装
了一个封装对象使它们变成了对象，而String()、Number()、Boolean()上有属性[[Class]]
*/
Object.prototype.toString.call(2)
// "[object Number]"

Object.prototype.toString.call("a")
// "[object String]"
```

可通过重写变量的toString方法修改输出

``` js
const a = {
    get [Symbol.toStringTag]() {
        return 'A';
    }
}

Object.prototype.toString.call("a")
// "[object A]"
```

## 上下文、作用域链、闭包

~~ (执行)上下文：变量或函数的上下文决定 了它们可以访问哪些数据，以及它们的行为。每个上下文都有一个关联的**变量对象(variable object)** ，存储这个上下文中定义的所有变量和函数。函数局部上下文中的叫做**活动对象(activity object)**(活动对象最初只有一个定义变量`arguments`，全局上下文中没有这个变量)。上下文会在其所有代码都执行完毕后被销毁（全局上下文会在应用程序退出前才会被销毁，比如关闭网页或退出浏览器）~~

[(执行)上下文](https://blog.mrrs.top/post/JavaScript%E5%A4%8D%E4%B9%A0-JavaScript%E7%9A%84%E6%89%A7%E8%A1%8C%E8%BF%87%E7%A8%8B)

作用域链：执行上下文的集合。上下文中的代码在执行时会创建**变量对象(VO)** 的一个**作用域链**，代码正在执行的上下文的变量对象始终位于作用域链的最前端。全局上下文的变量对象始终位于作用域链尾部

闭包（JS高程4）：指那些引用了另一个函数**作用域中**变量的**函数**。在一个函数内定义的函数会把其包含函数的活动(变量)对象添加到自己的作用域链中，外部函数的活动(变量)对象是内部函数作用域链上的第二个对象。闭包的本质是内部函数加长了其作用域链

闭包（[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)）：一个函数和对其周围状态（lexical environment，词法环境）的引用捆绑在一起（或者说函数被引用包围），这样的组合就是闭包（closure）

``` js
function createComparisonFunction(propertyName) {
    return function(object1, object2) {
        let value1 = object1[propertyName];
        let values = object2[propertyName];
        
        if (value1 < value2) {
            return -1;
        } else if (value1 > value2) {
            return 1;
        } else {
            return 0;
        }
    }
}

let compare = createComparisonFunction("name");
let result = compare({ name: "Nicholas" }, { name: ""Matt });
```

![closure](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/closure.png)

作用域和上下文的区别：

作用域是静态的，只要函数定义好了就一直存在并且不再发生变化。执行上下文是动态的，调用函数时创建，调用结束后会释放。上下文中包括了作用域

## this

![this](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/this.png)

- 先判断函数类型(箭头函数？bind生成？普通函数？)
- 普通函数判断调用方式(new？foo()？obj.foo()？)
- 不管 `bind` 几次，`fn`中的`this`始终由第一次`bind`决定
- 箭头函数中的`this`一旦被绑定就不会再改变

``` js
function fn() {
  console.log(this?.a);
}

let a = 12;

const obj = {
  a: 13,
  fn
};

const obj2 = {
  a: 14,
  fn: obj.fn,
  fn2() {
      fn();
  },
};

fn(); // undefined
obj.fn(); // 13
obj2.fn(); // 14
obj2.fn2(); // undefined
```

## ==时的类型转换

![==时的类型转换](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/%3D%3D%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2.png)

## 对象转原始类型

对象转原始类型会调用内置的[[ToPrimitive]]函数：

1. 如果存在`Symbol.toPrimitive()`方法，调用后返回
2. 调用`valueOf()`，如果转换为原始类型则返回（使用`obj.valueOf = xxx`来定义）
3. 调用`toString()`，如果转换为原始类型则返回
4. 如果都没有返回原始类型则报错

## 原型

每个构造函数都有(`prototype`)一个原型对象，原型有一个属性(`constructor`)指回构造函数，而实例有一个内部指针(`__proto__`)指向原型

如果原型是另一个类型的实例呢？那就意味着这个原型本身有一个内部指针指向另一个原型，相应地如果另一个原型也有一个指针指向另一个构造函数。这样就在原型和实例之间构造了一条原型链。

`__proto_`_指向**构造函数**的原型，存在于**对象**中，指向**原型**

`prototype`存在于**函数**中，指向**原型**

``` js
function User() {}

const tom = new User();

tom.__proto__ === User.prototype // true
User.prototype.constructor === User // true
```

![原型](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/prototype.png)

[new的原理及手动实现]()
[继承]()

## new

过程：

1. 在内存中创建一个新的空对象
2. 这个新对象内部的`__proto__`指针被赋值为构造函数的`prototype`值
3. 构造函数内部的`this`被赋值为这个新对象（即`this`指向新对象）
4. 执行构造函数内部的代码（给新对象添加属性）
5. 如果构造函数返回非空对象，则返回该对象；否则返回刚创建的新对象

``` js
function create() {
    let obj = new Object()
    let Con = [].shift.call(arguments)
    obj.__proto__ = Con.prototype
    let result = Con.apply(obj, arguments)
    return typeof result === 'object' ? result : obj
}
```