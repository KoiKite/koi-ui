<template>
  <div ref="refChart" class="w-full h-350px" v-loading="dataLoading"></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { randomInt } from "@/utils/random.ts";
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
  // 局部刷新定时器
  handleDataTimer();
};

const refChart = ref();
const chartInstance = shallowRef();
const xChartData = ref<any>([]);
const yChartData = ref<any>([]);
// 局部刷新定时器
const koiTimer = ref();

onMounted(() => {
  nextTick(() => {
    safeInitChart();
  });
});

onUnmounted(() => {
  // 清除局部刷新定时器
  clearInterval(koiTimer.value as any);
  koiTimer.value = null;

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
  if (!refChart.value || !chartInstance.value) return;
  const colorArr = [
    // ["#3A29D8", "#B5A7FF"],
    // ["#0A84FF", "#6AC8FF"],
    // ["#8BADDA", "#D0DAE5"],
    // ["#FF4439", "#FFA826"]
    [getCssVar("--el-color-primary"), getCssVar("--el-color-primary-light-5")]
  ];

  const initOption = {
    // title: {
    //   text: "🐻‍❄️近10日订单量",
    //   top: "0%",
    //   textStyle: {
    //     color: "#077EF8"
    //   }
    // },
    grid: {
      top: "20",
      left: "0",
      bottom: "0",
      right: "0"
    },
    tooltip: {
      show: true
    },
    legend: {
      show: false,
      data: ["柱形订单量", "折线订单量"],
      top: 0,
      right: "5%"
    },
    xAxis: [
      {
        type: "category",
        axisPointer: {
          type: "shadow"
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
        name: "柱形订单量",
        type: "bar",
        tooltip: {
          valueFormatter: function (value: any) {
            return value + " 单";
          }
        },
        label: {
          show: true, // 开启数字显示
          color: getCssVar("--el-color-primary"), // 设置顶部数字颜色
          position: "top" // 在上方显示数字
        },
        itemStyle: {
          // 这里设置柱形图圆角 [左上角，右上角，右下角，左下角]
          borderRadius: [4, 4, 0, 0],
          //   柱状图颜色渐变
          color: (arg: any) => {
            let targetColorArr = colorArr[0];
            // if (arg.value > 700) {
            //   targetColorArr = colorArr[0];
            // } else if (arg.value > 500) {
            //   targetColorArr = colorArr[1];
            // } else if (arg.value > 200) {
            //   targetColorArr = colorArr[2];
            // } else {
            //   targetColorArr = colorArr[3];
            // }
            if (arg.value) {
              targetColorArr = colorArr[0];
            }
            return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: targetColorArr[0]
              },
              {
                offset: 1,
                color: targetColorArr[1]
              }
            ]);
          }
        }
      },
      {
        name: "折线订单量",
        type: "line",
        tooltip: {
          valueFormatter: function (value: any) {
            return value + " 单";
          }
        },
        // 圆滑连接
        smooth: true,
        itemStyle: {
          color: getCssVar("--el-color-primary") // 线颜色
        }
      }
    ]
  };
  // 图表初始化配置
  chartInstance.value?.setOption(initOption);
};

/** 获取接口数据 */
const handleData = () => {
  setTimeout(() => {
    let num1 = randomInt(500, 800);
    let num2 = randomInt(500, 800);
    let num3 = randomInt(500, 800);
    let num4 = randomInt(500, 800);
    let num5 = randomInt(600, 900);
    let num6 = randomInt(600, 900);
    let num7 = randomInt(600, 900);
    let num8 = randomInt(600, 900);
    let num9 = randomInt(500, 1000);
    let num10 = randomInt(500, 1000);
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
      "20250910"
    ];
    yChartData.value = [num1, num2, num3, num4, num5, num6, num7, num8, num9, num10];
    updateChart();
    dataLoading.value = false;
  }, 1000);
};

/** 修改图表数据 */
const updateChart = () => {
  // 处理图表需要的数据
  const dataOption = {
    xAxis: {
      // x轴刻度文字
      data: xChartData.value
    },
    series: [
      {
        // y轴柱形耗电量数据
        data: yChartData.value
      },
      {
        // y轴折线耗电量数据
        data: yChartData.value
      }
    ]
  };
  // 图表数据变化配置
  chartInstance.value?.setOption(dataOption);
};

/** 图表自适应 */
const chartAdapter = () => {
  const offsetSize = ref(Math.round(refChart.value?.offsetWidth / 66));
  const adapterOption = {
    // title: {
    //   textStyle: {
    //     fontSize: offsetSize.value
    //   }
    // },
    // 圆点分类标题
    legend: {
      textStyle: {
        fontSize: offsetSize.value || 12
      }
    },
    xAxis: {
      //  改变x轴字体颜色和大小
      axisLabel: {
        fontSize: Math.round(offsetSize.value) || 12
      }
    },
    yAxis: {
      //  改变y轴字体颜色和大小
      axisLabel: {
        fontSize: Math.round(offsetSize.value) || 12
      }
    },
    series: [
      // 双柱的话复制粘贴一份即可
      {
        // 圆柱的宽度
        barWidth: Math.round(offsetSize.value * 2.6) || 30
      }
    ]
  };
  // 图表自适应变化配置
  chartInstance.value?.setOption(adapterOption);
  // 手动的调用图表对象的resize 才能产生效果
  chartInstance.value?.resize();
};

/** 定时器 */
const handleDataTimer = () => {
  koiTimer.value = setInterval(() => {
    // 执行刷新数据的方法
    handleData();
  }, 3000);
};
</script>

<style scoped></style>
