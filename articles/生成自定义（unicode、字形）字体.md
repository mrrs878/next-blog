---
title: "生成自定义（unicode、字形）字体"
tags: "反爬虫 字体 安全"
categories: "反爬虫"
description: ""
createDate: "2022-01-08 09:38:17"
updateDate: "2022-01-08 18:05:37"
---


原理(流程)：基于[opentype.js](https://opentype.js.org/)从源字体中提取出特定的字符，按照一定的规则对字符的字形做出变换，输出一套新的字体

变换规则：根据`strength`和`distance`调整`glyph.path.command`的坐标点

基于[opentype.js](https://opentype.js.org)

``` js
import opentype from 'opentype.js'; 
import { clone } from 'ramda'
import fs from "fs";
import { Chance } from "chance";

const snapX = 0;
const snapY = 0;
const snapDistance = 2;

// 随机数生成器
const chance = new Chance();

// 调整path点
function snap(v, distance, strength) {
    return (v * (1.0 - strength)) + (strength * Math.round(v / distance) * distance);
}

// 对每个字符的字形做调整
function doSnap(sourcePath, options) {
    const { snapStrength, snapDistance, snapPathCmdCnt } = options;
    const path = clone(sourcePath);
    if (!path?.commands) return path;

    const cursorLeft = chance.integer({ min: 0, max: path.commands.length - snapPathCmdCnt });
    const cursorRight = chance.integer({ min: cursorLeft, max: cursorLeft + snapPathCmdCnt });

    for (let i = cursorLeft; i < cursorRight; i += 1) {
        const cmd = path?.commands?.[i];
        if (cmd.type !== 'Z') {
            cmd.x = snap(cmd.x + snapX, snapDistance, snapStrength) - snapX;
            cmd.y = snap(cmd.y + snapY, snapDistance, snapStrength) - snapY;
        }
        if (cmd.type === 'Q' || cmd.type === 'C') {
            cmd.x1 = snap(cmd.x1 + snapX, snapDistance, snapStrength) - snapX;
            cmd.y1 = snap(cmd.y1 + snapY, snapDistance, snapStrength) - snapY;
        }
        if (cmd.type === 'C') {
            cmd.x2 = snap(cmd.x2 + snapX, snapDistance, snapStrength) - snapX;
            cmd.y2 = snap(cmd.y2 + snapY, snapDistance, snapStrength) - snapY;
        }
    }

    return path;
}

/**
 * @description: TTF变码，基于一种字体，生成另一种新字体
 * @param {string} sourceFontPath 源字体
 * @param {string} words 要转换的字
 * @param {string|Array<string>} newFontPath 转换后的字体
 * @param {SnapConfiguration} snapConfig 字形变化配置
 * @return {object} 转换规则(映射表)
 */
function generateFont(sourceFontPath, words, newFontPath, snapConfig) {
    // 保存字符和unicode的映射关系
    const result = {};
    const sourceFont = opentype.loadSync(sourceFontPath);

    const notdefGlyph = new opentype.Glyph({
        name: '.notdef',
        advanceWidth: sourceFont.getAdvanceWidth('.'),
        path: new opentype.Path(),
    });

    const snapStrength = chance.integer({ min: 1, max: 10 });

    // 生成新的字形
    // sourceFont.stringToGlyphs(words) 提取出要转换的字符的字形
    const subGlyphs = sourceFont.stringToGlyphs(words).map((glyph, index) => {
        const word = words[index];
        // 针对反爬虫需求，每个字符需要生成新的unicode
        const unicode = chance.integer({ min: 255, max: 65536 });
        const { consistent, isSnap, snapPathCmdCnt } = snapConfig;
        let path = glyph.path;
        
        if (isSnap) {
            // 每个字符共用一套字形变换配置or相互独立
            const snapConfiguration = consistent
                ?   {   
                        snapDistance,
                        snapStrength,
                        snapPathCmdCnt,
                    }
                :   { 
                        snapPathCmdCnt,
                        snapDistance,
                        snapStrength: chance.integer({ min: 1, max: 10 }),
                    }
            path = doSnap(glyph.path, snapConfiguration);
        }
        
        // 保存映射关系
        result[word] = `&#x${Number(unicode).toString(16)};`;

        return new opentype.Glyph({
            index: index + 1,
            unicode,
            name: word,
            path,
            advanceWidth: glyph.advanceWidth,
        });
    });

    const { unitsPerEm, ascender, descender } = sourceFont;

    // 生成新的字体文件
    const res = new opentype.Font({
        familyName: 'yqn-font',
        styleName: 'Medium',
        unitsPerEm,
        ascender,
        descender,
        glyphs: [notdefGlyph, ...subGlyphs],
    });

    // 可能需要保存多份字体文件（不同格式，做浏览器兼容）
    const outputPath = [newFontPath].flat();
    outputPath?.map((path) => {
        res.download(path);
    });

    return result;
}

// 输出映射关系到单独的文件中
function saveRule(rule) {
    fs.writeFileSync('rule.json', JSON.stringify(rule, null, 4));
}

export { generateFont, saveRule };
```