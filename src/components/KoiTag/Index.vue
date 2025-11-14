<template>
  <div>
    <template v-for="item in tagOptions">
      <!-- 当 dictClass 有值时，使用自定义按钮 -->
      <div
        v-if="value != null && value.toString() === item.dictValue.toString() && item.dictClass"
        :key="'custom-' + item.dictLabel + item.dictValue.toString()"
        :class="[
          'custom-tag',
          item.dictClass
        ]"
        :data-index="item.dictLabel + item.dictValue.toString()"
      >
        {{ item.dictLabel || 'ERROR' }}
      </div>
      
      <!-- 当 dictClass 没有值时，使用 el-tag -->
      <el-tag
        v-else-if="value != null && value.toString() === item.dictValue.toString()"
        :disable-transitions="disableTransitions"
        :key="'el-tag-' + item.dictLabel + item.dictValue.toString()"
        :type="item.dictTag"
        :index="item.dictLabel + item.dictValue.toString()"
        :effect="effect"
        :size="size"
        :round="round"
      >
        {{ item.dictLabel || 'ERROR' }}
      </el-tag>
    </template>
  </div>
</template>

<script setup lang="ts">
// 定义参数的类型
interface ITagProps {
  tagOptions?: any;
  value?: any;
  size?: any;
  effect?: any;
  round?: any;
  disableTransitions?: any;
}

// 子组件接收父组件的值
// withDefaults：设置默认值  defineProps：接收父组件的参数
withDefaults(defineProps<ITagProps>(), {
  tagOptions: () => [],
  value: "",
  size: "default",
  effect: "light",
  round: false,
  disableTransitions: true
});
</script>

<style lang="scss" scoped>
.custom-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  height: 24px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
  cursor: default;
  transition: all 0.3s;
  outline: none;
  
  &:focus {
    outline: none;
  }
}
</style>
