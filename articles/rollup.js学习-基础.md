---
title: "rollup.js学习-基础"
tags: "打包 rollup.js"
categories: "rollup.js"
description: ""
createDate: "2020-12-11 03:43:07"
updateDate: "2020-12-11 11:02:22"
---


## WHAT

一款打包工具

## WHY

- 轻量，适合打包库

- 支持输出esm

## HOW

> 打包 typescript，单入口，多输出格式

###  安装

- `rollup`

- `rollup-plugin-typescript2`

- `@rollup/plugin-node-resolve`

- `@rollup/plugin-commonjs`

- `rollup-plugin-cleaner`

### 配置

``` js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import path from 'path';
import ts from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';

const extensions = ['.ts', '.tsx', '.js', '.jsx'];
const tsconfig = path.resolve(__dirname, 'tsconfig.json');

export default [
  {
    input: './src/index.ts',
    output: {
      dir: 'dist/esm',
      format: 'esm',
    },
    plugins: [
      cleaner({ targets: ['./dist/'] }),
      resolve({ extensions }),
      commonjs(),
      ts({ tsconfig }),
    ],
    external: ['react']
  },
  {
    input: './src/index.ts',
    output: {
      dir: 'dist/umd',
      format: 'umd',
      name: 'MJSLibrary',
      globals: {
        react: 'React'
      }
    },
    plugins: [
      resolve({ 
        extensions
      }),
      commonjs(),
      ts({ 
        tsconfigOverride: { compilerOptions: { declaration: false } }, 
        tsconfig
      }),
    ],
    external: ['react']
  }
]
```

### 打包

``` json
{
	"scripts": {
    	"build": "rollup -c"
    }
}
```