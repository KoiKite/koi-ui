<template>
  <div>
    <template v-for="item in tagOptions">
      <el-tag
        v-if="value != null && value.toString() === item.dictValue.toString()"
        :disable-transitions="disableTransitions"
        :key="item.dictLabel"
        :type="item.dictTag"
        :index="item.dictLabel + item.dictValue.toString()"
        :effect="effect"
        :size="size"
        :round="round"
        :style="{
          'background': (item.dictClass || '').split(' ')[0],
          'border-color': (item.dictClass || '').split(' ')[1],
          'color': (item.dictClass || '').split(' ')[2]
        }"
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
.el-tag {
  padding: 0 10px;
}
</style>
