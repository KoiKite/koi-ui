<template>
  <div ref="refChart" style="width: 100%; height: 350px" v-loading="dataLoading"></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { nextTick, ref, shallowRef, onMounted, onUnmounted } from "vue";

// 用于监听容器尺寸的ResizeObserver
const resizeObserver = ref<ResizeObserver | null>(null);
// 图表初始化状态
const dataLoading = ref(false);

/** 安全初始化图表 */
const safeInitChart = (retry = 0, maxRetries = 6) => {
  dataLoading.value = true;

  if (retry > maxRetries) {
    console.error("图表初始化失败：重试次数超限");
    return;
  }

  if (!refChart.value) {
    console.warn("图表容器未找到，延迟初始化");
    setTimeout(() => safeInitChart(retry + 1), 100);
    return;
  }

  // 检查容器尺寸是否有效
  const { clientWidth, clientHeight } = refChart.value;
  if (clientWidth <= 0 || clientHeight <= 0) {
    console.warn("图表容器尺寸无效，延迟初始化", { width: clientWidth, height: clientHeight });
    setTimeout(() => safeInitChart(retry + 1), 50);
    return;
  }

  // 如果已有图表实例，先销毁
  if (chartInstance.value) {
    chartInstance.value.dispose();
    chartInstance.value = null;
  }

  // 初始化图表
  chartInstance.value = echarts.init(refChart.value);
  initChartOptions();

  // 设置ResizeObserver监听容器变化
  resizeObserver.value = new ResizeObserver(() => {
    if (chartInstance.value) {
      chartInstance.value.resize();
    }
  });

  resizeObserver.value.observe(refChart.value);

  // 图表自适应
  chartAdapter();
  window.addEventListener("resize", chartAdapter);
  // 获取接口数据
  handleData();
  handleTooltipTimer();
};

const refChart = ref();
const chartInstance = shallowRef();
// 接口数据
const dataApi = ref<any>([]);

// tooltip定时器
const tooltipTimer = ref();

onMounted(() => {
  // 延迟初始化以确保容器尺寸已计算
  nextTick(() => {
    safeInitChart();
    // tooltip刷新定时器
    handleTooltipTimer();
  });
});

onUnmounted(() => {
  // 清除局部刷新定时器
  clearInterval(tooltipTimer.value as any);
  tooltipTimer.value = null;

  window.removeEventListener("resize", chartAdapter);

  // 销毁ResizeObserver
  if (resizeObserver.value && refChart.value) {
    resizeObserver.value.unobserve(refChart.value);
    resizeObserver.value.disconnect();
  }

  // 销毁Echarts图表
  if (chartInstance.value) {
    chartInstance.value.dispose();
    chartInstance.value = null;
  }
});

/** 初始化加载图表 */
const initChartOptions = () => {
  if (!chartInstance.value) return;

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
    handleTooltipTimer();
  });
};

/** 获取接口数据 */
const handleData = () => {
  // API请求
  // try {
  //   const res: any = await listData();
  //   dataApi.value = res.data;
  //   dataLoading.value = false;
  //   updateChart();
  // } catch (error){
  //   console.log('接口请求失败', error);
  // }
  setTimeout(() => {
    dataApi.value = [
      { value: 5, name: "AABB故障" },
      { value: 6, name: "CCDD故障" },
      { value: 7, name: "TTZZ故障" },
      { value: 8, name: "GGHH故障" },
      { value: 9, name: "YYXX故障" }
    ];
    updateChart();
    dataLoading.value = false;
  }, 1000);
};

/** 修改图表数据 */
const updateChart = () => {
  if (!chartInstance.value) return;

  // 处理图表需要的数据
  const dataOption = {
    series: [
      {
        data: dataApi.value
      }
    ]
  };
  // 图表数据变化配置
  chartInstance.value?.setOption(dataOption);
};

/** 图表自适应 */
const chartAdapter = () => {
  if (!refChart.value || !chartInstance.value) return;

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
const handleTooltipTimer = () => {
  // 清除旧定时器
  if (tooltipTimer.value) {
    clearInterval(tooltipTimer.value);
    tooltipTimer.value = null;
  }

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
    if (index > dataApi.value.length) {
      index = 0;
    }
  }, 2000);
};
</script>

<style scoped></style>
