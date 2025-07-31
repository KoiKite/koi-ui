import type { Directive, DirectiveBinding } from 'vue';

// 扩展 HTMLElement 类型
interface AdaptiveElement extends HTMLElement {
  _resizeListener?: () => void;
}

// 配置接口
interface AdaptiveOptions {
  height?: number; // 距离底部的距离，默认 80
}

const DEFAULT_HEIGHT = 80;

/**
 * 自适应高度指令
 * 用法：
 * <div v-adaptive></div>
 * <div v-adaptive="{ height: 60 }"></div>
 */
const vAdaptiveHeight: Directive<AdaptiveElement, AdaptiveOptions> = {
  mounted(el, binding: DirectiveBinding<AdaptiveOptions>) {
    // 获取配置
    const config = binding.value || {};
    const bottomHeight = typeof config.height === 'number' ? config.height : DEFAULT_HEIGHT;

    // 设置高度
    const updateHeight = () => {
      const rect = el.getBoundingClientRect();
      const top = rect.top; // 更准确
      const pageHeight = window.innerHeight;
      el.style.height = `${pageHeight - top - bottomHeight}px`;
      el.style.overflowY = 'auto';
    };

    // 防抖：避免频繁触发
    let resizeTimer: number;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        requestAnimationFrame(updateHeight);
      }, 100);
    };

    // 保存监听器，用于销毁
    el._resizeListener = onResize;

    // 初始设置
    updateHeight();

    // 监听 resize
    window.addEventListener('resize', onResize);
  },

  // 组件更新时重新计算[比如父组件 re-render]
  updated(el, binding: DirectiveBinding<AdaptiveOptions>) {
    const config = binding.value || {};
    const bottomHeight = typeof config.height === 'number' ? config.height : DEFAULT_HEIGHT;

    const rect = el.getBoundingClientRect();
    const top = rect.top;
    const pageHeight = window.innerHeight;
    el.style.height = `${pageHeight - top - bottomHeight}px`;
  },

  unmounted(el) {
    if (el._resizeListener) {
      window.removeEventListener('resize', el._resizeListener);
      delete el._resizeListener;
    }
  }
};

export default vAdaptiveHeight;
