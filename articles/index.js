/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-01-19 11:55:19
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-01-19 14:18:19
 */

const http = require('https');
const fs = require('fs');
const Base64 = require('js-base64');

function formatContent(src) {
  const content = (Base64.decode(src.toString()).split('---')[2]);
  return content;
}

http.get('https://api.mrrs.top/blog/article/user/0', {
  headers: {
    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibXJyczg3OCIsInJvbGUiOjEsIl9pZCI6IjVmNzFiZDljNzA4MDI2MzcwODQ3MTVjZCIsImlhdCI6MTY0MjQ5NjI4NSwiZXhwIjoxNjQyNTgyNjg1fQ.yp4lol_Jcy08Qsw1K82qR__SeYbHLR94PmTAJvNtPOY'
  }
}, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const articles = (JSON.parse(data)?.data);
    articles?.map((item) => {
      http.get(
        `https://api.mrrs.top/blog/article/${item._id}`,
        {
          headers: {
            authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibXJyczg3OCIsInJvbGUiOjEsIl9pZCI6IjVmNzFiZDljNzA4MDI2MzcwODQ3MTVjZCIsImlhdCI6MTY0MjQ5NjI4NSwiZXhwIjoxNjQyNTgyNjg1fQ.yp4lol_Jcy08Qsw1K82qR__SeYbHLR94PmTAJvNtPOY'
          },
        },
        (res) => {
          let articleData = '';
          res.on('data', (chunk) => {
            articleData += chunk;
          })
          res.on('end', () => {
            const article = (JSON.parse(articleData)?.data);
            const content = formatContent(article.content);
            console.log('title', article.title);
            fs.writeFileSync(`./articles/${article.title.trim().replace(/\//g, '|')}.md`, 
`---
title: "${article.title.trim()}"
tags: "${article.tags.trimEnd()}"
categories: "${article.categories.trimEnd()}"
description: ""
createDate: "${article.createTime}"
updateDate: "${article.updateTime}"
---
${content}`);
          })
        }
      )
    })
  })
})