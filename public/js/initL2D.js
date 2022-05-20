/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-05-20 11:33:36
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-05-20 15:32:47
 */

setTimeout(() => {
  window.L2Dwidget?.init({
    model: {
      scale: 0.2,
      jsonPath: 'https://unpkg.com/live2d-widget-model-hijiki@1.0.5/assets/hijiki.model.json',
    },
    display: {
      position: 'right',
      width: 150,
      height: 300,
      hOffset: 0,
      vOffset: -10,
    },
    mobile: {
      show: false,
    },
    react: {
      opacityDefault: 0.8,
      opacityOnHover: 0.2,
    },
  });
}, 1000);
