<template>
  <div ref="refChart" class="w-full h-350px" v-loading="dataLoading"></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { randomInt } from "@/utils/random.ts";
import { nextTick, ref, shallowRef, onMounted, onUnmounted, watch } from "vue";
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
            chartAdapter();
          }
        }, 150);
      });
    },
    { deep: true }
  );
};

// 用于监听容器尺寸的ResizeObserver
const resizeObserver = ref<ResizeObserver | null>(null);
// 图表初始化状态
const dataLoading = ref(false);

/** 安全初始化图表 */
const safeInitChart = () => {
  dataLoading.value = true;
  if (!refChart.value) {
    console.warn("图表容器未找到，延迟初始化");
    setTimeout(safeInitChart, 50);
    return;
  }

  // 检查容器尺寸是否有效
  const { clientWidth, clientHeight } = refChart.value;
  if (clientWidth <= 0 || clientHeight <= 0) {
    console.warn("图表容器尺寸无效，延迟初始化", { width: clientWidth, height: clientHeight });
    setTimeout(safeInitChart, 50);
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
  updateChart();
  // 设置ResizeObserver监听容器变化
  resizeObserver.value = new ResizeObserver(() => {
    if (chartInstance.value) {
      chartInstance.value.resize();
    }
  });

  resizeObserver.value.observe(refChart.value);

  setTimeout(() => {
    dataLoading.value = false;
  }, 1000);
};

const refChart = ref();
const chartInstance = shallowRef();
const xChartData = ref();
const yChartData = ref();
// 局部刷新定时器
const koiTimer = ref();

onMounted(() => {
  // 延迟初始化以确保容器尺寸已计算
  setTimeout(() => {
    safeInitChart();
    // 图表自适应
    chartAdapter();
    window.addEventListener("resize", chartAdapter);
    handleChartResize(chartInstance);
    // 局部刷新定时器
    getDataTimer();
  }, 100);

  // 获取接口数据
  getData();
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

  const initOption = {
    // title: {
    //   text: "🐻‍❄️近10日订单量",
    //   top: "0%",
    //   textStyle: {
    //     color: "#077EF8"
    //   }
    // },
    grid: {
      top: "12%",
      left: "6%",
      bottom: "6%",
      right: "0"
    },
    tooltip: {
      show: true
    },
    legend: {
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
            return value + " V";
          }
        },
        label: {
          color: "#8BADDA", // 设置顶部数字颜色
          show: true, // 开启数字显示
          position: "top" // 在上方显示数字
        }
      },
      {
        name: "折线订单量",
        type: "line",
        tooltip: {
          valueFormatter: function (value: any) {
            return value + " V";
          }
        },
        // 圆滑连接
        smooth: true,
        itemStyle: {
          color: "#6AC8FF" // 线颜色
        }
      }
    ]
  };
  // 图表初始化配置
  chartInstance.value?.setOption(initOption);
};

/** 获取接口数据 */
const getData = () => {
  // 先进行置空
  xChartData.value = [];
  yChartData.value = [];
  let num1 = randomInt(100, 200);
  let num2 = randomInt(200, 500);
  let num3 = randomInt(200, 500);
  let num4 = randomInt(500, 700);
  let num5 = randomInt(500, 700);
  let num6 = randomInt(700, 800);
  let num7 = randomInt(800, 900);
  let num8 = randomInt(900, 1000);
  xChartData.value = ["20240903", "20240904", "20240905", "20240906", "20240907", "20240908", "20240909", "20240910"];
  yChartData.value.push(num1, num2, num3, num4, num5, num6, num7, num8);
  // 模拟API请求
  // try {
  //   const res: any = await listData();
  //   dataApi.value = res.data;
  //   updateChart();
  // } catch (error){
  //   console.log('接口请求失败', error);
  // }
  // 获取服务器的数据, 对xChartData进行赋值之后, 调用updateChart方法更新图表
  updateChart();
};

/** 修改图表数据 */
const updateChart = () => {
  const colorArr = [
    ["#3A29D8", "#B5A7FF"],
    ["#0A84FF", "#6AC8FF"],
    ["#8BADDA", "#D0DAE5"],
    ["#FF4439", "#FFA826"]
  ];
  // 处理图表需要的数据
  const dataOption = {
    xAxis: {
      // x轴刻度文字
      data: xChartData.value
    },
    series: [
      {
        // y轴柱形耗电量数据
        data: yChartData.value,
        itemStyle: {
          //颜色样式部分
          label: {
            show: true, // 开启数字显示
            position: "top", // 在上方显示数字
            textStyle: {
              // 数值样式
              color: "#077EF8" // 字体颜色
              // fontSize: 10, // 字体大小
            }
          },
          //   柱状图颜色渐变
          color: (arg: any) => {
            let targetColorArr = null;
            if (arg.value > 700) {
              targetColorArr = colorArr[0];
            } else if (arg.value > 500) {
              targetColorArr = colorArr[1];
            } else if (arg.value > 200) {
              targetColorArr = colorArr[2];
            } else {
              targetColorArr = colorArr[3];
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
  const titleFontSize = ref(Math.round(refChart.value?.offsetWidth / 50));
  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize.value
      }
    },
    // 圆点分类标题
    legend: {
      textStyle: {
        fontSize: titleFontSize.value * 0.8
      }
    },
    xAxis: {
      //  改变x轴字体颜色和大小
      axisLabel: {
        fontSize: Math.round(titleFontSize.value * 0.8)
      }
    },
    yAxis: {
      //  改变y轴字体颜色和大小
      axisLabel: {
        fontSize: Math.round(titleFontSize.value * 0.8)
      }
    },
    series: [
      // 双柱的话复制粘贴一份即可
      {
        // 圆柱的宽度
        barWidth: Math.round(titleFontSize.value * 1.8),
        itemStyle: {
          //颜色样式部分
          label: {
            textStyle: {
              fontSize: Math.round(titleFontSize.value * 0.8) //字体大小
            }
          }
        }
      }
    ]
  };
  // 图表自适应变化配置
  chartInstance.value?.setOption(adapterOption);
  // 手动的调用图表对象的resize 才能产生效果
  chartInstance.value?.resize();
};

/** 定时器 */
const getDataTimer = () => {
  koiTimer.value = setInterval(() => {
    // 执行刷新数据的方法
    getData();
  }, 3000);
};
</script>

<style scoped></style>
