---
title: "React.js复习-diff"
tags: "React.js"
categories: "2024复习"
description: ""
createDate: "2024-03-21 14:08:32"
updateDate: "2024-03-24 20:40:43"
---

## Diff

### 什么 diff

简单来讲就是在 `re-render` 时，以上一次的 `fiber` 树作为基础，以这次的 vdom 作为目标，生成一个新的 `fiber` 树，在此过程中尽量复用旧的节点。分别发生在 `reconcile` 阶段中的 `beginWork` 和 `completeWork` 中，在 `beginWork` 阶段，React 会遍历新的 vdom，并尝试复用旧的 `fiber` 节点。在 `completeWork` 阶段，React 会根据新的 vdom 和旧的 `fiber` 节点的比较结果，生成新的 fiber 树

第一次渲染时不需要 diff，直接由 vdom 生成 `fiber` 。再次渲染的时候，会产生新的 vdom，这时候就需要运用 diff 算法。

传统的 diff 算法，对于树的处理，时间复杂度在 O(n^3)，这对于前端框架来说太慢了，开销过于高昂，因此为降低时间复杂度，React 的 diff 算法会预设三个限制

1. 只进行同层比较

2. 节点 `type` 不同时，直接删除节点（及其子孙节点）

3. 根据 `key` 来复用节点

## 为什么要有 diff

为什么要做 diff 呢？直接使用新的 vdom 替换不可以吗？ 🤔

可以是可以，但无法实现一些功能，比如保持输入框的聚焦状态，丝滑的动画等等，而且频繁创建 dom 节点对浏览器也是不小的负担。

诶，那我们就不能自己来决定哪些 dom 更新吗？这样性能不更高效吗？

可以滴，对于复杂页面，程序员表示这 diff 谁爱做谁做，更新一个节点掉一根头发 👨‍🦲

**SSR 并没有 diff**

### 性能

1. 合并大量 dom 操作并进行统一处理，减少重绘重排次数

2. 复用 dom 节点，减少创建/删除 dom 节点次数，而非全量重渲

### 状态

1. 保持某些特殊的状态

2. 实现更细滑的动画

## 如何实现 diff

**以下过程发生在 render 阶段**

核心--**复用**

总结：同层比较，使用 `key` 和 `type` 决定节点的更新类型（新增、删除、移动）。由于是单链表对比，无法使用双指针优化，需要经过两次遍历对比出结果：

1. 第一轮对比`key`，直至遇到 `key` 不一致的节点

2. 第二轮，将剩下的 `fiber` 节点存入 `map` 中，继续遍历剩下的新的 `element` ，从 map 中查找是否能复用

### 节点移动逻辑

新增/删除逻辑较为简单，这里着重研究一下节点**移动**逻辑

以 👇 的数据为例

```html
<!-- before -->
<ul>
  <li id="A" key="A"></li>
  <li id="B" key="B"></li>
  <li id="C" key="C"></li>
  <li id="D" key="D"></li>
  <li id="E" key="E"></li>
</ul>
<!-- after -->
<ul>
  <li id="A" key="A"></li>
  <li id="C" key="C"></li>
  <li id="B" key="B1"></li>
  <li id="D" key="D"></li>
  <li id="E1" key="E1"></li>
</ul>
```

其中，删除了 `li#B` 和 `li#E` ，新增了 `li#B1` 和 `li#E1` ，将 `li#C` 向前移动

第一轮遍历，到达 `li#C` 时即停止，将 `li#B` 至 `li#E` 存至 `existingChildren` 中，以 `key` 或 `index` 作为键，更新 `lastPlacedIndex` 为 0, 开启第二轮遍历。

发现 `li#C` 可以复用，将其从 `existingChildren` 中删除，并更新 `lastPlacedIndex` 为 2 （在 `existingChildren` 中的位置）；继续遍历

发现 `li#B` 为新增

发现 `li#D` 可复用，并且 `li#D` 的 `index` 小于 `lastPlacedIndex` ， `li#D` 不用移动，同时更新 `existingChildren` 为 3

发现 `li#E` 为新增

遍历结束，标记 `existingChildren` 中其余节点为删除

## 关联

[双指针]()
[深度优先遍历]()
