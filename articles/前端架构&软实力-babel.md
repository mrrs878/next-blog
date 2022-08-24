---
title: "前端架构&软实力-babel"
tags: "babel 访问者模式 有限状态机"
categories: "前端架构&软实力"
description: ""
createDate: "2022-08-22 20:11:45"
updateDate: "2022-08-24 20:33:45"
---

探究 Babel 内部的一些实现机制

## tokenizer/parse-有限状态机

// TODO

## traverse-访问者模式

Visitor（访问者模式）属于行为型模式

意图：**表示一个作用于某对象结构中的各元素的操作。它使你可以在不改变各元素的类的前提下定义作用于这些元素的新操作。**

访问者，顾名思义，就是对象访问的一种设计模式，我们可以在不改变要访问对象的前提下，对访问对象的操作做拓展：**它将对象的操作权移交给了 Visitor。**

Babel 在 traverse 阶段用到了访问者模式，该阶段 Babel 的主要工作包括：

1. 对 ast 进行深度优先遍历

2. 对节点进行添加、更新和移除等操作

```ts
interface Phone {
  accept(visitor: Visitor): PhoneInfo;
}

interface PhoneInfo {
  os: string;
  chip: string;
  GPUType?: string;
  port?: string;
  screen?: string;
}

interface Visitor {
  visit(phone: Mate40): PhoneInfo;
  visit(phone: IPhone13): PhoneInfo;
}

class Mate40 implements Phone {
  accept(visitor: Visitor): PhoneInfo {
    return visitor.visit(this);
  }
}

class IPhone13 implements Phone {
  accept(visitor: Visitor): PhoneInfo {
    return visitor.visit(this);
  }
}

class PhoneVisitor implements Visitor {
  visit(phone: Mate40): PhoneInfo;
  visit(phone: IPhone13): PhoneInfo;
  visit(phone: unknown): PhoneInfo {
    if (phone instanceof Mate40) {
      return {
        os: 'HarmonyOS',
        chip: 'Kirin 9000',
        GPUType: 'Mali-G78',
        port: 'type-c',
      };
    }
    if (phone instanceof IPhone13) {
      return {
        os: 'ios',
        chip: 'A15仿生芯片',
        screen: '电容屏',
      };
    }
    throw new Error('不识别的phone');
  }
}

const mate40 = new Mate40();
const visitor = new PhoneVisitor();
console.log(mate40.accept(visitor));

export {};
```

## 参考

[由 Babel 理解前端编译原理](https://www.codetd.com/article/13756799)
