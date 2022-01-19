---
title: "React.js学习-自定义hook-1"
tags: "React.js学习 hook"
categories: "React.js"
description: ""
createDate: "2020-09-03 09:23:54"
updateDate: "2020-10-20 16:48:58"
---


# 自定义hook的好处

可以把组件逻辑抽到**可复用**的方法里

# useRequest

```ts
function useRequest<P, T>(api: (params: P) => Promise<T>, params?: P, visiable = true)
  :[boolean, T|undefined, (params?: P) => void, () => void] {
  const [res, setRes] = useState<T>();
  const [loading, setLoading] = useState(() => false);
  const [newParams, setNewParams] = useState(() => params);
  const [autoFetch, setAutoFetch] = useState(() => visiable);

  const fetch = useCallback(async () => {
    if (!newParams && autoFetch === false) return;
    if (autoFetch) {
      const _params = (newParams || {}) as P;
      setLoading(true);
      const tmp = await api(_params);
      setRes(tmp);
      setLoading(false);
    }
  }, [api, autoFetch, newParams]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const doFetch = useCallback((rest = null) => {
    setNewParams(rest);
    setAutoFetch(true);
  }, []);

  return [loading, res, doFetch, fetch];
}
```

# useSlider

如果使用传统方式开发，UI界面与逻辑强耦合在一起，若要开发一个横向和一个竖向则代码过于冗余。于是可以使用自定义`hook-useSlider`将滑动逻辑复用

```js
// 传统方式开发
import React, { useRef, useEffect, useState } from "react"

const Slider = () => {
    const drag = useRef()
    const [percent, setPercent] = useState(0)

    useEffect(() => {
        drag.current.style.left = percent * 300 - 12 + 'px'
    }, [percent])

    function onMouseDown(e) {
        e.persist()
        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
    }
    function onMouseMove(e) {
        if (e.pageX < 0 || e.pageX > 300) return
        setPercent((e.pageX / 300))
        drag.current.style.left = e.pageX - 12 + 'px'
    }
    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
    }
    return (
        <div>
            <div>
                <button onClick={() => setPercent(0)}>0</button>
                <button onClick={() => setPercent(0.5)}>0.5</button>
                <button onClick={() => setPercent(1)}>1</button> 
            </div>
            <p>{ percent }</p>
            <div style={{ position: 'relative' }}>
                <div style={{ height: '15px', width: '300px', backgroundColor: '#ccc' }}></div>
                <div ref={drag} onMouseDown={ onMouseDown } style={{ width: '35px', height: '35px', borderRadius: '50%', position: 'absolute', backgroundColor: '#aaa', top: '-10px', left: 0 }}></div>
            </div>
        </div>
    )
}

export default Slider
```

```jsx
// 使用自定义hook开发

// slider2.0.js
import React, { useRef, useEffect, useState } from "react"

const useSlider = ({ dragWidth, slideWidth, direction ='horizontal' }) => {
    const drag = useRef()
    const [percent, setPercent] = useState(0)
    const [originPosition, setOriginPosition] = useState(() => ({ x: 0 ,y: 0 }))

    useEffect(() => {
        if (direction === 'horizontal') drag.current.style.left = percent * slideWidth - (dragWidth>>1) + 'px'
        else drag.current.style.top = percent * slideWidth - (dragWidth>>1) + 'px'
    }, [percent])

    useEffect(() => {
        const { left, top } = drag.current.getBoundingClientRect()
        setOriginPosition({ x: left, y: top })
        return onMouseUp
    }, [drag])
    
    function onMouseDown() {
        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
    }

    function onMouseMove(e) {
        if (direction === 'horizontal') {
            const pos = e.pageX - originPosition.x - (dragWidth>>1)
            if (pos < 0 || pos > slideWidth) return
            setPercent(pos / slideWidth)
            drag.current.style.left = pos - (dragWidth>>1) + 'px'
        } else {
            const pos = e.pageY - originPosition.y - (dragWidth>>1)
            if (pos < 0 || pos > slideWidth) return
            setPercent(pos / slideWidth)
            drag.current.style.top = pos - (dragWidth>>1) + 'px'
        }
    }
    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
    }

    return [
        drag,
        percent,
        onMouseDown,
        setPercent
    ]
}

const Slider = () => {
    const [ dragH, percentH, onDragMouseDownH, setPercentH ] = useSlider({ dragWidth: 35, slideWidth: 300 })
    const [ dragV, percentV, onDragMouseDownV, setPercentV ] = useSlider({ dragWidth: 35, slideWidth: 300, direction: 'vertical' })
    return (
        <>
        {/* 可以分别创建一个SliderV.js和SliderH.js */}
            <div style={{ marginLeft: '20px' }}>
                <p>横向</p>            
                <div>
                    <button onClick={() => setPercentH(0)}>0</button>
                    <button onClick={() => setPercentH(0.5)}>0.5</button>
                    <button onClick={() => setPercentH(1)}>1</button> 
                </div>
                <p>{ percentH }</p>
                <div style={{ position: 'relative' }}>
                    <div style={{ height: '15px', width: '300px', backgroundColor: '#ccc' }}></div>
                    <div style={{ width: `${percentH * 300}px`, height: '15px', position: 'absolute', top: '0', backgroundColor: '#f00' }}></div>
                    <div ref={dragH} onMouseDown={onDragMouseDownH} style={{ width: '35px', height: '35px', borderRadius: '50%', position: 'absolute', backgroundColor: '#aaa', left: 0, top: '-10px' }}></div>
                </div>
            </div>

            <div style={{ marginLeft: '20px' }}>
                <p>竖向</p>            
                <div>
                    <button onClick={() => setPercentV(0)}>0</button>
                    <button onClick={() => setPercentV(0.5)}>0.5</button>
                    <button onClick={() => setPercentV(1)}>1</button> 
                </div>
                <p>{ percentV }</p>
                <div style={{ position: 'relative' }}>
                    <div style={{ height: '300px', width: '15px', backgroundColor: '#ccc' }}></div>
                    <div style={{ height: `${percentV * 300}px`, width: '15px', position: 'absolute', left: '0', top: '0', backgroundColor: '#f00' }}></div>
                    <div ref={dragV} onMouseDown={onDragMouseDownV} style={{ width: '35px', height: '35px', borderRadius: '50%', position: 'absolute', backgroundColor: '#aaa', top: 0, left: '-10px' }}></div>
                </div>
            </div>
        </>
    )
}

export default Slider
```

# Ref: 

[React Hook 系列（二）：自定义hook的一些实践](https://juejin.im/post/6844904021984018439)
