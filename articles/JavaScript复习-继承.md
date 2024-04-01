---
title: "JavaScript复习-继承"
tags: "JavaScript"
categories: "2021复习"
description: ""
createDate: "2021-05-10 14:17:07"
updateDate: "2024-03-29 18:24:51"
---


使用继承的原因：**复用**

## 基于原型链

每个构造函数都有一个原型对象，原型对象有一个属性指回构造函数，而实例有一个内部指针指向原型。如果原型是另一个类型的实例呢？那就意味着这个原型本身有一个内部指针指向另一个原型，相应地另一个原型也可能是一个对象...这样就在实例和原型之间构造了一条原型链

``` js
function SuperType() {
    this.property = true;
}
SuperType.prototype.getSuperValue = function () {
    return this.property;
}

function SubType() {
    this.property = false;
}
SubType.prototype = new SuperType();
SubType.prototype.getSubValue = function () {
    return this.property;
}

const instance = new SubType();
console.log(instance.getSuperValue());
const instance2 = new SubType();
console.log(instance2.getSuperValue());
// false
// false
```

![基于原型链模式的继承](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/extends_prototype.png)

问题：

1. 原型中包含的引用值会在所有实例中共享
2. 子类在实例化时不能给父类的构造函数传参

## 盗用构造函数

在子类构造函数中调用父类的构造函数

问题：

只继承了父类的属性，没有继承父类的方法

``` js
function SuperType(name) {
    this.name = name;
}
SuperType.prototype.getSuperValue = function () {
    return this.property;
}

function SubType(name, age) {
    SuperType.call(this, name);
    this.age = age;
}

const instance = new SubType('tom', 21);
console.log(instance);
const instance2 = new SubType('jerry', 22);
console.log(instance2);
console.log(instance2.getSuperValue);
// SubType { name: 'tom', age: 21 }  
// SubType { name: 'jerry', age: 22 }
// undefined
```

## 组合继承

使用原型链继承方法，使用构造函数继承属性

``` js
function SuperType(name) {
    this.name = name;
}
SuperType.prototype.getSuperValue = function () {
    return this.name;
}

function SubType(name, age) {
    SuperType.call(this, name);
    this.age = age;
}
SubType.prototype = new SuperType();
SubType.prototype.getSubValue = function () {
    return this.age;
}

const instance = new SubType('tom', 21);
const instance2 = new SubType('jerry', 23);
console.log(instance);
console.log(instance.getSubValue());
console.log(instance.getSuperValue());
console.log(instance2.name);
// SuperType { name: 'tom', age: 21 }
// 21
// tom
// jerry
```

## 寄生组合式继承

组合式继承的缺点在于调用了两次父类的构造函数，造成了子类构造函数和实例上有一组相同的属性

![组合式继承的缺点](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/prorotype_constructor_inheritance.png)

寄生组合式继承通过盗用构造函数继承属性，使用混合式原型链继承方法

``` js
function inheritance(superType, subType) {
    const pro = Object.create(superType.prototype);
    pro.constructor = subType;
    subType.prototype = pro;
}
  
function SuperType(name, friends) {
    this.name = name;
    this.friends = friends;
}
SuperType.prototype.getSuperValue = function () {
    return this.name;
}

function SubType(name, age, friends, colors) {
    SuperType.call(this, name, friends);
    this.age = age;
    this.colors = colors;
}
inheritance(SuperType, SubType);
SubType.prototype.getSubValue = function () {
    return this.age;
}

const instance = new SubType('tom', 21, [], []);
instance.friends.push('jerry');
instance.colors.push('pink');
console.log(instance.getSuperValue());
console.log(instance.getSubValue());
console.log(instance.friends);
console.log(instance.colors);

const instance2 = new SubType('jerry', 21, [], []);
instance2.friends.push('tom');
instance2.colors.push('black');
console.log(instance2.friends);
console.log(instance2.colors);
// tom
// 21
// [ 'jerry' ]
// [ 'pink' ]
// [ 'tom' ]
// [ 'black' ]
```