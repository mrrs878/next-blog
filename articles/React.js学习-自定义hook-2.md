---
title: "React.js学习-自定义hook-2"
tags: "React.js学习 hook"
categories: "React.js"
description: ""
createDate: "2020-10-19 15:11:13"
updateDate: "2020-10-20 03:22:35"
---


# DOM 副作用修改 / 监听

## 修改页面 title

在组件里调用`useDocumentTitle`即可设置页面标题，且切换页面时，页面标题重置为默认标题 “React.js学习”

```js
const useDocumentTitle = (newTitle: string) => {
	useEffect(() => {
  	document.title = title
    return () => {
    	document.title = "React.js学习"
    }
  }, [newTitle])
}
```

## 监听页面大小发生改变（网络状况发生改变），重新渲染界面

```js
function getSize() {
  const { innerWidth, innerHeight, outerHeight, outerWidth } = window
  return {
    innerWidth,
    innerHeight,
    outerHeight,
    outerWidth
  };
}

function useWindowSizeChange() {
  const [windowSize, setWindowSize] = useState(getSize());

  const onWindowSizeChange = useCallback(() => {
    setWindowSize(getSize());
  }, [])

  useEffect(() => {
    window.addEventListener('resize', onWindowSizeChange);
    return () => {
      window.removeEventListener('resize', onWindowSizeChange);
    }
  }, [onWindowSizeChange])

  return windowSize;
}

function getInternetState() {
  const { onLine } = navigator
  return onLine ? 'online' : 'offline'
}

function useInternetStateChange() {
  const [internetState, setInternetState] = useState(getInternetState())

  const onInternetStateChange = useCallback(() => {
    setInternetState(getInternetState())
  }, [])

  useEffect(() => {
    window.addEventListener("online", onInternetStateChange)
    window.addEventListener("offline", onInternetStateChange)
    return () => {
      window.removeEventListener("online", onInternetStateChange)
      window.removeEventListener("offline", onInternetStateChange)
    }
  }, [onInternetStateChange])

  return internetState
}
```