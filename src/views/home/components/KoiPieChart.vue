<template>
  <div ref="refChart" style="width: 100%; height: 350px"></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { nextTick, ref, onMounted, onUnmounted, watch } from "vue";
import { storeToRefs } from "pinia";
import useGlobalStore from "@/stores/modules/global.ts";

const globalStore = useGlobalStore();
const { isCollapse, themeColor, isDark } = storeToRefs(globalStore);

/** 菜单折叠图表自适应 */
const handleChartResize = (chartInstance: any) => {
  watch(
    [() => isCollapse.value, () => themeColor.value, () => isDark.value],
    () => {
      nextTick(() => {
        setTimeout(() => {
          if (chartInstance.value) {
            screenAdapter();
          }
        }, 150);
      });
    },
    { deep: true }
  );
};

const refChart = ref();
const chartInstance = ref();
// 接口数据
const allData = ref([
  { value: 5, name: "AABB故障" },
  { value: 6, name: "CCDD故障" },
  { value: 7, name: "TTZZ故障" },
  { value: 8, name: "GGHH故障" },
  { value: 9, name: "YYXX故障" }
]);

// tooltip定时器
const tooltipTimer = ref();

onMounted(() => {
  // 图表初始化
  initChart();
  // 获取接口数据
  getData();
  // 调用Echarts图表自适应方法
  screenAdapter();
  // Echarts图表自适应
  window.addEventListener("resize", screenAdapter);
  // tooltip刷新定时器
  getTootipTimer();
  handleChartResize(chartInstance);
});

onUnmounted(() => {
  // 销毁Echarts图表
  chartInstance.value.dispose();
  chartInstance.value = null;
  // 清除局部刷新定时器
  clearInterval(tooltipTimer.value);
  tooltipTimer.value = null;
  // Echarts图表自适应销毁
  window.removeEventListener("resize", screenAdapter);
});

/** 初始化加载图表 */ 
const initChart = () => {
  chartInstance.value = echarts?.init(refChart.value);
  const initOption = {
    tooltip: {
      confine: true,
      trigger: "item"
    },
    legend: {
      orient: "vertical",
      left: "left",
      extraCssText: "z-index: 999"
    },
    series: [
      {
        name: "模块故障",
        type: "pie",
        // 环形图大小
        radius: ["45%", "70%"],
        // 环形图位置
        center: ["60%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2
        },
        label: {
          show: false,
          position: "center",
          formatter: "{d}%" // 当前百分比
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "16",
            fontWeight: "bold"
          }
        },
        labelLine: {
          show: false
        }
      }
    ]
  };
  // 图表初始化配置
  chartInstance.value?.setOption(initOption);

  // 鼠标移入停止定时器
  chartInstance.value.on("mouseover", () => {
    clearInterval(tooltipTimer.value);
  });

  // 鼠标移入启动定时器
  chartInstance.value.on("mouseout", () => {
    getTootipTimer();
  });
};

/** 获取接口数据 */
const getData = () => {
  // 调用接口方法
  // getData().then(res => {
  //   xChartData.value = res.data;
  //   updateChart();
  //   // echarts查不到数据，将初始化echarts的方法全部放置到接口方法中即可。
  // })
  // 获取服务器的数据, 对xChartData进行赋值之后, 调用updateChart方法更新图表
  updateChart();
};

/** 修改图表数据 */
const updateChart = () => {
  // 处理图表需要的数据
  const dataOption = {
    series: [
      {
        data: allData.value
      }
    ]
  };
  // 图表数据变化配置
  chartInstance.value?.setOption(dataOption);
};

/** 图表自适应 */
const screenAdapter = () => {
  const adapterOption = {
    // 圆点分类标题
    legend: {
      textStyle: {
        fontSize: 12
      }
    }
  };
  // 图表自适应变化配置
  chartInstance.value?.setOption(adapterOption);
  // 手动的调用图表对象的resize 才能产生效果
  chartInstance.value?.resize();
};

/** 定时器 */ 
const getTootipTimer = () => {
  let index = 0; // 播放所在下标
  tooltipTimer.value = setInterval(() => {
    // echarts实现定时播放tooltip
    chartInstance.value.dispatchAction({
      type: "showTip",
      position: function (point: any) {
        return {
          left: point[0] + 10, // 水平方向偏移量
          top: point[1] - 10 // 垂直方向偏移量
        };
      },
      seriesIndex: 0,
      dataIndex: index
    });
    index++;
    if (index > allData.value.length) {
      index = 0;
    }
  }, 2000);
};
</script>

<style scoped></style>
