import { Directive, DirectiveBinding } from "vue";
import { ElMessage } from "element-plus";

interface HTMLElementWithCopyData extends HTMLElement {
  copyData: string | number;
  handleClickEl: EventListener;
}

/**
 * 使用传统方法复制文本（降级方案）
 */
const fallbackCopyText = (text: string): boolean => {
  try {
    // 创建临时 textarea 元素
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    document.body.appendChild(textarea);
    
    // 选中文本
    textarea.focus();
    textarea.select();
    
    // 执行复制
    const successful = document.execCommand('copy');
    
    // 清理
    document.body.removeChild(textarea);
    
    return successful;
  } catch (error) {
    console.error('降级复制方法失败:', error);
    return false;
  }
};

/**
 * 复制文本到剪贴板
 */
const copyToClipboard = async (text: string): Promise<boolean> => {
  // 检查数据是否有效
  if (!text && text !== '0') {
    console.warn('复制内容为空');
    return false;
  }

  const textToCopy = text.toString();

  // 优先使用现代 Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(textToCopy);
      return true;
    } catch (error) {
      console.warn('Clipboard API 失败，尝试降级方案:', error);
      // 如果 Clipboard API 失败，使用降级方案
      return fallbackCopyText(textToCopy);
    }
  } else {
    // 不支持 Clipboard API，使用降级方案
    return fallbackCopyText(textToCopy);
  }
};

const copy: Directive = {
  mounted(el: HTMLElementWithCopyData, binding: DirectiveBinding) {
    el.copyData = binding.value as string | number;
    el.handleClickEl = async function () {
      try {
        const text = el.copyData?.toString() || '';
        
        if (!text && text !== '0') {
          ElMessage.warning("复制内容为空");
          return;
        }

        const success = await copyToClipboard(text);
        
        if (success) {
          ElMessage.success("复制成功");
        } else {
          ElMessage.error("复制失败，请手动复制");
        }
      } catch (error) {
        console.error("复制操作失败: ", error);
        ElMessage.error("复制失败，请手动复制");
      }
    };
    el.addEventListener("click", el.handleClickEl);
  },
  updated(el: HTMLElementWithCopyData, binding: DirectiveBinding) {
    el.copyData = binding.value as string | number;
  },
  beforeUnmount(el: HTMLElementWithCopyData) {
    if (el.handleClickEl) {
      el.removeEventListener("click", el.handleClickEl);
    }
  }
};

export default copy;
