---
title: "webpack复习-运行时"
tags: "webpack runtime"
categories: "2024复习"
description: ""
createDate: "2024-04-25 19:34:54"
updateDate: "2024-04-26 20:04:54"
---

研究一下 `webpack` 的 运行时

webpack 运行时指在浏览器或 Node.js 环境中执行打包后的代码时， webpack 提供的一些辅助函数和对象。这些对象和函数帮助代码在运行时正确地加载和执行模块、处理依赖关系等。主要包括一下函数和对象

- **webpack_require** 用来加载模块

- **webpack_modules** 用来存储各个模块的定义与实现

- **webpack_exports** 用来保存模块的导出对象

分别针对如下代码讨论 `ESM` 和 `CommonJS` 构建输出

```js
// foo.js
const foo = "foo";

function sayHi() {
  console.log("hi");
}

module.exports = {
  sayHi,
};

exports.foo = foo;

// index.js
const { foo, sayHi } = require("./foo.js");

console.log(foo);

sayHi();
```

## CommonJS

执行 `npx webpack` 后，构建产物如下

```js
(() => {
  var __webpack_modules__ = {
    "./foo.js": (module, exports) => {
      const foo = "foo";
      function sayHi() {
        console.log("hi");
      }
      module.exports = {
        foo,
        sayHi,
      };
      exports.foo = foo;
    },
  };
  var __webpack_module_cache__ = {};
  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = (__webpack_module_cache__[moduleId] = {
      exports: {},
    });
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
  }
  var __webpack_exports__ = {};
  (() => {
    const { foo, sayHi } = __webpack_require__(/*! ./foo.js */ "./foo.js");
    console.log(foo);
    sayHi();
  })();
})();
```

简单梳理一下

1. 初始化一个 `__webpack_modules__` 的对象，用于存放各个模块的定义和实现

2. 定义化一个 `__webpack_module_cache__` 对象，用于缓存加载过的模块

3. 定义一个 `__webpack_require__` 函数

4. 执行 `entry` 代码

其中核心是 `__webpack_require__` 函数，在执行 `__webpack_require__` 时，其内部会执行 `__webpack_modules__` 中的模块，在执行时，会将 `module` 和 `module.exports` 以及 `__webpack_require__` 作为参数传递给模块代码，这将作为代码中的 `module` 和 `exports` 以及 `require` 。这样，代码中便可正确使用这些对象

## ESM

ESM 和 CommonJS 的运行时核心流程一致， 但在一些实现上差异较大，同样是上面的代码，当构建为 `ESM` 格式时，产物如下

```js
(() => {
  "use strict";
  var __webpack_modules__ = {
    "./foo.js": (
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__
    ) => {
      __webpack_require__.r(__webpack_exports__);
      __webpack_require__.d(__webpack_exports__, {
        foo: () => foo,
        sayHi: () => sayHi,
      });

      let foo = "foo";

      function sayHi() {
        console.log("hi");
        foo += "hi";
      }
    },
  };
  var __webpack_module_cache__ = {};
  function __webpack_require__(moduleId) {
    //
  }
  (() => {
    __webpack_require__.d = (exports, definition) => {
      for (var key in definition) {
        if (
          __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key)
        ) {
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key],
          });
        }
      }
    };
  })();
  (() => {
    __webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
  })();
  (() => {
    __webpack_require__.r = (exports) => {
      if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
      }
      Object.defineProperty(exports, "__esModule", { value: true });
    };
  })();
  var __webpack_exports__ = {};
  (() => {
    __webpack_require__.r(__webpack_exports__);
    var _foo_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! ./foo.js */ "./foo.js"
    );
    console.log(_foo_js__WEBPACK_IMPORTED_MODULE_0__.foo);
    (0, _foo_js__WEBPACK_IMPORTED_MODULE_0__.sayHi)();
    console.log(_foo_js__WEBPACK_IMPORTED_MODULE_0__.foo);
  })();
})();
```

主要差异在于

0. 给 `__webpack_require__` 挂载了几个函数

  - __webpack_require__.d 

  - __webpack_require__.r

  - __webpack_require__.o

1. 模块导出

在 `ESM` 规范中，导出的数据是对值的引用，如下面代码所示

```js
let b = 1;
let obj = {
  b: 1,
};
function increaseB() {
  b += 1;
  obj.b += 1;
}
export { b, increaseB, obj };

console.log(b, obj); // 1 { b: 1 }
increaseB();
console.log(b, obj); // 2 { b: 2 }
```

因此，不能直接在 `export` 对象上直接添加属性， `webpack` 的做法是这样的

```js
// __webpack_require__.d
Object.defineProperty(exports, 'foo', {
  enumerable: true,
  get: () => foo,
});
```

这样，每次引用 `foo` 变量时，都能拿到最新的数据
