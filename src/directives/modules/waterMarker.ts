/*
  需求：给整个页面添加背景水印。

  思路：
    1、使用 canvas 特性生成 base64 格式的图片文件，设置其字体大小，颜色等。
    2、将其设置为背景图片，从而实现页面或组件水印效果
  
  使用：设置水印文案，颜色，字体大小即可
  <!-- 全局水印 - 整个页面 -->
  <div v-waterMarker="{
    text: 'KOI-ADMIN', 
    font: '20px 宋体',
    textColor: 'rgba(100, 100, 100, 0.15)',
    isGlobal: true,
    zIndex: 9999
  }">
  <!-- 局部水印 - 仅应用于此div -->
  <div v-waterMarker="{
    text: '局部水印', 
    font: '16px Arial',
    textColor: 'rgba(200, 50, 50, 0.2)',
    isGlobal: false
  }">
*/

import type { Directive, DirectiveBinding } from "vue";

// 全局水印容器ID
const GLOBAL_WATERMARK_ID = "global-watermark-container";

// 默认水印配置
const defaultConfig = {
  text: "KOI-ADMIN",
  font: "20px 宋体",
  textColor: "rgba(180, 180, 180, 0.3)",
  zIndex: 9999,
  isGlobal: false // 默认局部水印
};

// 生成水印画布
const generateWatermarkCanvas = (
  str: string,
  font: string,
  textColor: string
): string => {
  const can: HTMLCanvasElement = document.createElement("canvas");
  can.width = 205;
  can.height = 140;
  can.style.display = "none";
  
  const cans = can.getContext("2d") as CanvasRenderingContext2D;
  cans.rotate((-20 * Math.PI) / 180);
  cans.font = font;
  cans.fillStyle = textColor;
  cans.textAlign = "left";
  cans.fillText(str, can.width / 10, can.height / 2);
  
  return can.toDataURL("image/png");
};

// 创建全局水印
const createGlobalWatermark = (config: any) => {
  // 移除旧水印
  const oldWatermark = document.getElementById(GLOBAL_WATERMARK_ID);
  if (oldWatermark) document.body.removeChild(oldWatermark);
  
  // 创建新水印容器
  const container = document.createElement("div");
  container.id = GLOBAL_WATERMARK_ID;
  
  // 设置全局水印样式
  Object.assign(container.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: config.zIndex,
    backgroundImage: `url(${generateWatermarkCanvas(
      config.text,
      config.font,
      config.textColor
    )})`,
    backgroundRepeat: "repeat",
    opacity: "1"
  });
  
  document.body.appendChild(container);
};

// 创建局部水印
const createLocalWatermark = (el: HTMLElement, config: any) => {
  // 清理旧水印样式
  el.style.backgroundImage = "";
  
  // 应用新水印
  el.style.backgroundImage = `url(${generateWatermarkCanvas(
    config.text,
    config.font,
    config.textColor
  )})`;
  el.style.backgroundRepeat = "repeat";
  el.style.zIndex = config.zIndex;
};

// 水印指令
const waterMarker: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const config = {
      ...defaultConfig,
      ...(binding.value || {})
    };
    
    if (config.isGlobal) {
      createGlobalWatermark(config);
    } else {
      createLocalWatermark(el, config);
    }
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    const config = {
      ...defaultConfig,
      ...(binding.value || {})
    };
    
    if (config.isGlobal) {
      createGlobalWatermark(config);
    } else {
      createLocalWatermark(el, config);
    }
  },
  unmounted(el: HTMLElement) {
    // 仅清理局部水印
    el.style.backgroundImage = "";
    el.style.backgroundRepeat = "";
    el.style.zIndex = "";
  }
};

export default waterMarker;
