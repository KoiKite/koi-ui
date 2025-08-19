<template>
  <div class="flex flex-col h-370px" v-loading="dataLoading">
    <div class="flex flex-justify-center">
      <el-segmented v-model="selectValue" :options="segmentedOptions" @change="handleData" />
    </div>
    <div ref="refChart" class="w-full h-full"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { nextTick, ref, shallowRef, onMounted, onUnmounted, watch } from "vue";
import { getCssVar } from "@/utils/index.ts";
import { storeToRefs } from "pinia";
import useGlobalStore from "@/stores/modules/global.ts";

const globalStore = useGlobalStore();
const { themeColor, isDark } = storeToRefs(globalStore);

watch([() => themeColor.value, () => isDark.value], () => {
  nextTick(() => {
    if (chartInstance.value) {
      initChartOptions();
    }
  });
});

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
  handleDataTimer();
};

const selectValue = ref("订单量");
const segmentedOptions = ["订单量", "销售量", "退款量"];
const refChart = ref();
const chartInstance = shallowRef();
const xChartData = ref();
const yChartData = ref();
// 局部刷新定时器
const koiTimer = ref();

onMounted(() => {
  // 延迟初始化以确保容器尺寸已计算
  nextTick(() => {
    safeInitChart();
  });
});

onUnmounted(() => {
  // 销毁Echarts图表
  chartInstance.value.dispose();
  chartInstance.value = null;
  // 清除局部刷新定时器
  clearInterval(koiTimer.value);
  koiTimer.value = null;
  // Echarts图表自适应销毁
  window.removeEventListener("resize", chartAdapter);
  // handleEventResize();
});

/** 初始化加载图表 */
const initChartOptions = () => {
  if (!chartInstance.value) return;

  const initOption = {
    grid: {
      top: "55",
      left: "30",
      bottom: "25",
      right: "0"
    },
    tooltip: {
      show: true
    },
    legend: {
      top: 0,
      right: "5%"
    },
    xAxis: [
      {
        type: "category",
        axisPointer: {
          type: "shadow"
        },
        // 改变x轴字体颜色和大小
        axisLabel: {
          interval: 0, // 显示所有标签
          rotate: "70" //旋转度数
        }
      }
    ],
    yAxis: [
      {
        type: "value",
        axisLine: {
          show: true
          // lineStyle: {
          //   color: '#666' // 可选：设置 Y 轴颜色
          // }
        },
        axisLabel: {
          show: true
          // color: '#666' // 可选：设置字体颜色
        },
        axisTick: {
          show: true
        },
        splitLine: {
          show: false // 去掉背景横刻度线
        }
      }
    ],
    series: [
      {
        name: "折线订单量",
        type: "line",
        tooltip: {
          valueFormatter: function (value: any) {
            return value + "笔";
          }
        },
        // 圆滑连接
        smooth: true,
        itemStyle: {
          color: getCssVar("--el-color-primary") // 线颜色
        },
        markPoint: {
          data: [
            { type: "max", name: "最大值" },
            { type: "min", name: "最小值" }
          ]
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              // 渐变颜色
              {
                offset: 0,
                color: getCssVar("--el-color-primary")
              },
              {
                offset: 1,
                color: getCssVar("--el-color-primary-light-7")
              }
            ],
            global: false
          }
        }
      }
    ]
  };
  // 图表初始化配置
  chartInstance.value?.setOption(initOption);
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
    if (selectValue.value == "订单量") {
      xChartData.value = [
        "20250901",
        "20250902",
        "20250903",
        "20250904",
        "20250905",
        "20250906",
        "20250907",
        "20250908",
        "20250909",
        "20250910",
        "20250911",
        "20250912",
        "20250913",
        "20250914",
        "20250915"
      ];
      yChartData.value = [72, 33, 66, 26, 77, 36, 59, 35, 62, 27, 55, 33, 69, 37, 52];
    }

    if (selectValue.value == "销售量") {
      xChartData.value = [
        "20250901",
        "20250902",
        "20250903",
        "20250904",
        "20250905",
        "20250906",
        "20250907",
        "20250908",
        "20250909",
        "20250910",
        "20250911",
        "20250912",
        "20250913",
        "20250914",
        "20250915"
      ];
      yChartData.value = [66, 52, 36, 55, 75, 48, 59, 73, 56, 66, 45, 62, 70, 63, 65];
    }

    if (selectValue.value === "退款量") {
      xChartData.value = [
        "20250901",
        "20250902",
        "20250903",
        "20250904",
        "20250905",
        "20250906",
        "20250907",
        "20250908",
        "20250909",
        "20250910",
        "20250911",
        "20250912",
        "20250913",
        "20250914",
        "20250915"
      ];
      yChartData.value = [70, 62, 56, 60, 72, 55, 61, 46, 58, 52, 60, 54, 52, 59, 57];
    }
    updateChart();
    dataLoading.value = false;
  }, 1000);
};

/** 修改图表数据 */
const updateChart = () => {
  if (!chartInstance.value) return;

  // 处理图表需要的数据
  const dataOption = {
    xAxis: {
      // x轴刻度文字
      data: xChartData.value
    },
    series: [
      {
        name: "交易笔数",
        type: "line",
        data: yChartData.value
      }
    ]
  };
  // 图表数据变化配置
  chartInstance.value?.setOption(dataOption);
};

/** 图表自适应 */
const chartAdapter = () => {
  if (!refChart.value || !chartInstance.value) return;

  const offsetSize = Math.max(9, Math.round(refChart.value?.offsetWidth / 136));
  const adapterOption = {
    // title: {
    //   textStyle: {
    //     fontSize: offsetSize
    //   }
    // },
    // 圆点分类标题
    legend: {
      textStyle: {
        fontSize: offsetSize || 14
      }
    },
    xAxis: {
      //  改变x轴字体颜色和大小
      axisLabel: {
        fontSize: offsetSize || 12
      }
    },
    yAxis: {
      //  改变y轴字体颜色和大小
      axisLabel: {
        fontSize: offsetSize || 12
      }
    },
    series: []
  };
  // 图表自适应变化配置
  chartInstance.value?.setOption(adapterOption);
  // 手动的调用图表对象的resize 才能产生效果
  chartInstance.value.resize();
};

/** 定时器 */
const handleDataTimer = () => {
  // koiTimer.value = setInterval(() => {
  //   // 执行刷新数据的方法
  //   handleData();
  // }, 3000);
};
</script>

<style lang="scss" scoped></style>
