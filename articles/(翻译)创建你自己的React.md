---
title: "(翻译)创建你自己的React"
tags: "React.js"
categories: "React.js"
description: ""
createDate: "2020-11-02 14:25:18"
updateDate: "2020-11-11 15:00:53"
---


> 原文链接:https://pomb.us/build-your-own-react/

# Build your own React

我们将从头开始重写React。 一步步。 遵循真实的React代码中的架构，但没有所有的优化和非必要的功能。

如果您阅读过[我以前的任何“构建自己的React”文章](https://engineering.hexacta.com/didact-learning-how-react-works-by-building-it-from-scratch-51007984e5c5)，不同之处在于该文章基于React 16.8，因此我们现在可以使用`hook`并删除所有与`class`相关的代码。

您可以在旧博客文章中找到历史记录，并在[Didact仓库](https://github.com/pomber/didact)中找到代码。 还有一个演讲涉及相同的内容。

以下这些都是我们将一一添加到我们的React版本中的内容：

- 第一步: `createElement` 函数
- 第二步: `render` 函数
- 第三步: Concurrent Mode
- 第四步: Fibers
- 第五步: Render and Commit Phases
- 第六步: Reconciliation
- 第七步: 函数式组件
- 第八步: Hooks

##  第零步

如果您已经对React，JSX和DOM节点的工作方式有了很好的了解，则可以跳过此步骤。首先让我们回顾一些基本概念，我们将使用只有三行代码的React应用程序：第一个定义一个React节点，下一个从DOM获取一个节点，最后一个将React节点渲染到容器中。然后，我们会删除所有特定于React的代码将其替换为原始JavaScript。

``` js
const element = <h1 title="foo">Hello</h1>
const container = document.getElementById("root")
ReactDOM.render(element, container)
```

在第一行中，我们使用JSX定义了节点。 它不是有效的JavaScript，因此要用原生JS取代它。通过Babel等构建工具，JSX转换为JS。 转换通常很简单：使用对`createElement`的调用来替换标签内的代码，并将标签`type`、`props`、`children`作为参数传递。`React.createElement`根据其参数创建一个对象，除了一些验证之外，这就是全部。 因此，我们可以安全地将函数调用替换为其输出。

``` js
const element = <h1 title="foo">Hello</h1>

👇

const element = React.createElement(
  "h1",
  { title: "foo" },
  "Hello"
)
```

这就是一个节点，一个具有两个属性的对象：`type`和`props`（嗯，[它有更多的属性](https://github.com/facebook/react/blob/f4cc45ce962adc9f307690e1d5cfa28a288418eb/packages/react/src/ReactElement.js#L111)，但是我们只关心这两个属性）。`type`是一个字符串，用于指定我们要创建的DOM节点的类型，它是您要创建HTML节点时传递给`document.createElement`的`tagName`。 它也可以是一个函数，但我们将其留给步骤VII。`props`是另一个对象，它具有JSX属性中的所有键和值。 它还有一个特殊的属性：`children`。在这种情况下，`children`是字符串，但通常是包含更多节点的数组（这就是为什么节点也是树的原因）。

``` js
const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
}
```

我们需要替换的另一部分React代码是对`ReactDOM.render`的调用。`render`是React更新DOM的地方，现在用我们自己的代码进行操作。

首先，我们使用节点`type`（在本例中为`h1`）创建一个`node*`。然后，我们将所有节点属性分配给该节点。 这里只有一个`title`。*为避免混淆，我将使用`element`来指代React节点，并使用`node`来指代DOM节点。

然后，我们为`children`创建节点。 我们只有一个字符串作为`children`，因此我们创建了一个文本节点。使用`textNode`而不是设置`innerText`将允许我们以后以相同的方式对待所有节点。另请注意，我们像设置`h1`标题一样设置`nodeValue`，就像字符串中带有`props: {nodeValue: "hello"}`。最后，我们将`textNode`添加到`h1`并将`h1`添加到`container`。

```js
const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
}

const container = document.getElementById("root")

const node = document.createElement(element.type)
node["title"] = element.props.title

const text = document.createTextNode("")
text["nodeValue"] = element.props.children

node.appendChild(text)
container.appendChild(node)
```

## 第一步: createElement 函数

现在，让我们切换到另一个App：自己实现的简易React。

首先，从编写`createElement`开始，将JSX转换为JS。正如在上一步中看到的，`element`是具有类型和属性的对象。`createElement`唯一需要做的就是创建该对象。

因为`children`也可以包含原始数据类型，比如字符串或数字，所以对不是`object`的`child`创建特殊节点类型：`TEXT_ELEMENT`。这样做是因为可以简化代码。对于我们的库，我更喜欢简单而不是高性能代码。

```js
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => typeof child === "object"
        ? child
        : createTextElement(child)
      ),
    },
  }
}
```

目前Babel仍然使用`React.createElement`，为了替换它，让我们给自己的库起个名字。我们需要一个听起来像React的名字，但也暗示了它的教学目的，我们叫它`Didact`。

让我们使用`/** @jsx Didact.createElement */`来告诉Babel使用我们自己的`createElement`来转换jsx代码：

```js
/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
)
```

## 第二步：redner 函数

首先使用element的`type`创建DOM节点，然后将新element添加到`container`中。然后对每个`child`递归调用`render`：

```js
function render(element, container) {
  const dom = document.createElement(element.type);

  element.props.children.forEach((child) => render(child, dom))

  container.appendChild(dom);
}
```

其次，我们还需要处理文本节点，如果element类型为`TEXT_ELEMENT`，我们将创建文本节点而不是普通节点：

```js
function render(element, container) {
  // ...
  const dom = element.type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElmenet(element.type);
  //...
}
```

最后，将`props`分配给element：

```js
function render(element, container) {
  // ...
  const isProperty = key => key === "children";
  Reflect.ownkeys(element.props)
    .filter(isProperty)
    .forEach((name) => dom[name] = element.props[name]);
  // ...
}
```

这样的话，我们就有了一个可以将JSX呈现到DOM的库：

```js
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  };
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      )
    }
  };
}

function render(element, container) {
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  const isProperty = (key) => key !== "children";
  Reflect.ownKeys(element.props)
    .filter(isProperty)
    .forEach((name) => (dom[name] = element.props[name]));

  element.props.children.map((child) => render(child, dom));

  container.appendChild(dom);
}

const Didact = {
  createElement,
  render
};

/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <h1>Hello STEP1-STEP2</h1>
  </div>
);

const container = document.querySelector("#step1");

Didact.render(element, container);

```

## 第三步Concurrent Mode

在开始添加更多代码之前，我们需要重构。

上面的递归调用存在问题。开始渲染后，直到渲染完完整的element树，我们才会停止。 如果element树很大，则可能会阻塞主线程太长时间。 那么如果浏览器需要执行高优先级的操作（例如处理用户输入或保持动画流畅），则它必须等到渲染完成为止。因此，我们将工作分成几个小部分，在完成每个单元后，如果需要执行其他任何操作，我们将让浏览器中断渲染。

我们使用`requestIdleCallback`进行循环。 您可以将`requestIdleCallback`看作`setTimeout`，但是浏览器将在主线程空闲时运行回调，而不是告诉它何时运行。React不再使用`requestIdleCallback`，现在它使用scheduler package。 但是对于此用例，它在概念上是相同的。`requestIdleCallback`还为我们提供了`deadline`参数。 我们可以使用它来检查浏览器需要再次控制之前有多少时间。

要开始使用循环，我们需要设置第一个工作单元，然后编写一个`performUnitOfWork`函数，该函数不仅执行工作，还返回下一个工作单元。

## 第四步Fiber

要组织工作单元，我们需要一个数据结构--Fiber树。我们将为每个元素分配一根Fiber，并且每个Fiber将成为一个工作单元。

假如我们要渲染如下的element树，那么Fiber树就如下所示：

```js
Didact.render(
  <div>
    <h1>
      <p />
      <a />
    </h1>
    <h2 />
  </div>,
  container
)
```

![](https://pomb.us/static/a88a3ec01855349c14302f6da28e2b0c/ac667/fiber1.png)

在render函数中，我们将创建root Fiber并将其设置为`nextUnitOfWork`。 剩下的工作将在`performUnitOfWork`函数上进行，我们将为每个Fiber做三件事：

1. 将element添加到DOM
2. 为element的子代创建Filber
3. 选择下一个工作单元

该数据结构的目标之一是使查找下一个工作单元变得容易。 这就是为什么每个Fiber都链接到其第一个子节点、下一个兄弟节点和父节点。

- 当我们完成对当前Fiber的工作时，如果有child，那么该child对应的Fiber将是下一个工作单元。在我们的示例中，当我们完成div Fiber的工作时，下一个工作单元将是h1 Fiber。
- 如果当前Fiber没有child，我们将其sibling作为下一个工作单元。例如，p Fiber没有child，因此我们在完成当前之后下一个工作单元将是h1。
- 如果当前Fiber既没有child也没有sibling，那么我们去“uncle”：父母的兄弟节点。 就像示例中的a和h2 Fiber一样。
- 如果parent没有sibling，我们会不断检查parent，直到找到有sibling的parent，或者直到找到root。 如果到达root，则意味着我们已经完成了此渲染的所有工作。

现在，让我们开始写代码。

首先，更改`render`函数并创建`createDom`函数

```js
function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  }
}

function createDom(fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type)
  const isProperty = key => key !== "children"
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = fiber.props[name]
    })
  return dom
}
```

然后，当浏览器准备就绪时，它将调用我们的`workLoop`，我们将从`root`开始执行渲染。

```js
function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}
```

首先，我们创建一个新node并将其添加到DOM。我们在`fibre.dom`属性中跟踪DOM节点。

```js
function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
  }
  // TODO create new fibers
  // TODO return next unit of work
}
```

然后对每个`child`创建Fiber

```js
const elements = fiber.props.children
  let index = 0
  let prevSibling = null
  while (index < elements.length) {
    const element = elements[index]
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    }
  }
```

然后将其添加到Fiber树中，将其设置为`child`还是`sibing`，具体取决于它是否是第一个child。

```js
if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
}
prevSibling = newFiber
index++
```

最后，我们按照child ☞ sibling ☞ uncle来选择下一工作单元。

```js
if (fiber.child) {
  return fiber.child
}
let nextFiber = fiber
while (nextFiber) {
  if (nextFiber.sibling) {
    return nextFiber.sibling
  }
  nextFiber = nextFiber.parent
}
```

完整的代码如下所示：

```js
function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
  }

  const elements = fiber.props.children
  let index = 0
  let prevSibling = null

  while (index < elements.length) {
    const element = elements[index]

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    }

    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }

  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}
```

## 提交更改

我们还有一个问题。每次处理一个元素时，我们都会向DOM添加一个新节点。而且，请记住，浏览器可能会在我们完成整个树的渲染之前中断我们的工作。在这种情况下，用户将看到一个不完整的UI。我们不想这样。

因此，我们需要从`performUnitOfWork`里删除改变DOM的部分。相反，我们将跟踪Fiber tree。我们称它为`wipRoot`。一旦我们完成了所有的工作(我们知道它是因为没有下一个工作单元)，我们就将整个Fiber tree提交给DOM。我们在`commitRoot`函数中完成。在这里，我们递归地将所有节点追加到dom。

## Reconciliation

到目前为止，我们只向DOM添加了一些东西，那么更新或删除节点呢? 

这就是我们现在要做的，我们需要将`render`函数接收到的元素与提交给DOM的最后一个Fiber tree进行比较。因此，在完成`commit`之后，我们需要保存对**最后一个提交到DOM的Fiber tree**的引用。我们称之为`currentRoot`。我们还在每Fiber中加入了`alternate`, 此属性是到旧Fiber的链接，即我们在上一个提交阶段提交给DOM的Fiber。

现在让我们从创建新Fiber的`performUnitOfWork`函数中提取代码到`reconcileChildren` 。在这里，我们将`reconcile`旧的fibers和新元素。我们同时遍历旧Fiber tree(`wipFiber.alternate`)的子元素和我们想要reconciliation的元素数组。如果我们忽略同时遍历数组和链表所需的所有样板文件，那么我们只剩下while中最重要的部分:oldFiber和element。元素是我们想要渲染到DOM的东西，而oldFiber是我们上次渲染的东西。我们需要比较它们，看看是否需要对DOM进行更改。

为了比较它们，我们使用类型:

- 如果旧的Fiber和新元素具有相同的类型，我们可以保留DOM节点，并使用新的道具更新它
- 如果类型不同，并且有一个新元素，这意味着我们需要创建一个新的DOM节点
- 如果类型不同，并且有一个旧的光纤，我们需要删除旧的节点

这里React也使用key，这样可以更好的`reconcile`。例如，它检测子元素在元素数组中的位置发生了变化。

当旧Fiber和元素具有相同的类型时，我们创建一个新Fiber，使DOM节点与旧Fiber保持一致，使props与element保持一致。我们还向Fiber 添加了一个新属性:`effectTag`。我们将在稍后的`commit`阶段使用此属性。

```js
const sameType =
      oldFiber &&
      element &&
      element.type == oldFiber.type
if (sameType) {
  newFiber = {
    type: oldFiber.type,
    props: element.props,
    dom: oldFiber.dom,
    parent: wipFiber,
    alternate: oldFiber,
    effectTag: "UPDATE",
  }
}
```

对于element需要一个新DOM节点的情况，我们用`PLACEMENT`标记标记新Fiber。

```js
if (element && !sameType) {
  newFiber = {
    type: element.type,
    props: element.props,
    dom: null,
    parent: wipFiber,
    alternate: null,
    effectTag: "PLACEMENT",
  }
}
```

对于需要删除节点的情况，我们没有新的Fiber，所以我们在旧Fiber上添加effect标签。但是当我们将Fiber树提交到DOM时，我们从正在进行的根目录执行，它没有旧的Fiber 。所以我们需要一个数组来跟踪要删除的节点。然后，当我们将更改提交到DOM时，我们还使用了来自该数组的Fiber。

```js
if (oldFiber && !sameType) {
  oldFiber.effectTag = "DELETION"
  deletions.push(oldFiber)
}
```

现在，让我们修改`commitWork`函数来处理新的`effectTags`。

```js
function commitWork(fiber) {
  if (!fiber) {
    return
  }
  if (
    fiber.effectTag === "PLACEMENT" &&
    fiber.dom != null
  ) {
    domParent.appendChild(fiber.dom)
  } else if (
      fiber.effectTag === "UPDATE" &&
      fiber.dom != null
    ) {
      updateDom(
        fiber.dom,
        fiber.alternate.props,
        fiber.props
      )
    } else if (fiber.effectTag === "DELETION") {
      domParent.removeChild(fiber.dom)
  }
  const domParent = fiber.parent.dom
  domParent.appendChild(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
```

- 如果Fiber有一个`PLACEMENT`标签，从父Fiber将DOM节点附加到节点。

- 如果是`DELETION`，则做相反的操作，删除子元素。

- 如果是`UPDATE`，则需要使用更改后的props更新现有DOM节点。我们将在这个`updateDom`函数中完成这些操作。将旧Fiber中的props与新Fiber中的props进行比较，去掉不存在的prop，设置新的或更换的prop。需要注意的是，如果prop以`on`前缀开头，我们将以不同的方式处理它：如果event handler发生了更改，我们将其从节点中删除，然后再添加新的handler。

```js
const isEvent = key => key.startsWith("on")
const isProperty = key =>
  	key !== "children" && !isEvent(key)
const isNew = (prev, next) => key =>
    prev[key] !== next[key]
const isGone = (prev, next) => key => !(key in next)
  
function updateDom(dom, prevProps, nextProps) {
  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = ""
  })

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name]
  })
  
  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.addEventListener(
        eventType,
        nextProps[name]
      )
  })
}
```