/*
  需求：防止按钮在短时间内被多次点击，使用节流函数限制规定时间内只能点击一次。
  节流就是N秒内只执行一次，不管在N秒内重复调用了多少次，也只执行一次。
  思路：
    1、第一次点击，立即调用方法并禁用按钮，等延迟结束再次激活按钮
    2、将需要触发的方法绑定在指令上
  
  使用：给 Dom 加上 v-throttle 及回调函数即可
  <el-button type="danger" icon="refresh" plain @click="resetSearch()">重置</el-button>
*/
// @ts-nocheck
import type { Directive, DirectiveBinding } from "vue";

interface ElType extends HTMLElement {
  handleClick: () => any;
  disabled: boolean;
};

const throttle: Directive = {
  mounted(el: ElType, binding: DirectiveBinding) {
    let timer = null;
    const delay = parseInt(binding.arg) || 500;
    const handler = binding.value;
    let lastExecTime = 0;

    el.addEventListener(
      "click",
      () => {
        const now = Date.now();
        if (now - lastExecTime > delay) {
          handler();
          lastExecTime = now;
        }
      },
      { passive: false }
    );
  }
};

export default throttle;
