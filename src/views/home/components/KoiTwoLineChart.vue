<template>
  <div ref="refChart" style="width: 100%; height: 360px"></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { nextTick, shallowRef, ref, onMounted, onUnmounted, watch } from "vue";
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
    dataLoading.value = false
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

  getData();
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
});

/** 初始化加载图表 */ 
const initChartOptions = () => {
  if (!chartInstance.value) return;

  const initOption = {
    grid: {
      top: "20%",
      left: "0",
      bottom: "18%",
      right: "0"
    },
    tooltip: {
      show: true
    },
    legend: {
      right: "5%"
    },
    xAxis: [
      {
        type: "category",
        axisPointer: {
          type: "shadow"
        },
        //  改变x轴字体颜色和大小
        axisLabel: {
          interval: 0, // 显示所有标签
          rotate: "70" //旋转度数
        }
      }
    ],
    yAxis: [
      {
        type: "value",
        // 去掉背景横刻度线
        splitLine: { show: false }
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
          color: "#1CE0FE" // 线颜色
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
                color: "#1CE0FE"
              },
              {
                offset: 1,
                color: "#3DF8E5"
              }
            ],
            global: false
          }
        }
      },
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
          color: "#7E37F7" // 线颜色
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
                color: "#7E37F7"
              },
              {
                offset: 1,
                color: "#F1EBFB"
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
const getData = () => {
  // 先进行置空
  xChartData.value = [];
  yChartData.value = [];
  xChartData.value = [
    "20240901",
    "20240902",
    "20240903",
    "20240904",
    "20240905",
    "20240906",
    "20240907",
    "20240908",
    "20240909",
    "20240910",
    "20240911",
    "20240912",
    "20240913",
    "20240914",
    "20240915"
  ];
  // 模拟API请求
  // try {
  //   const res: any = await listData();
  //   dataApi.value = res.data;
  //   updateChart();
  // } catch (error){
  //   console.log('接口请求失败', error);
  // }
  updateChart();
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
        name: "上月同期交易笔数",
        type: "line",
        data: [
          320, 266, 245, 199, 278, 298, 312, 365, 378, 299, 287, 256, 276, 288, 281
        ]
      },
      {
        name: "昨日交易笔数",
        type: "line",
        data: [
          188, 166, 100, 234, 256, 278, 300, 166, 156, 246, 220, 188, 210, 234, 290 
        ]
      }
    ]
  };
  // 图表数据变化配置
  chartInstance.value?.setOption(dataOption);
};

/** 图表自适应 */
const chartAdapter = () => {
  const adapterOption = {
    title: {
      textStyle: {
        fontSize: 16
      }
    },
    // 圆点分类标题
    legend: {
      textStyle: {
        fontSize: 12
      }
    },
    xAxis: {
      //  改变x轴字体颜色和大小
      axisLabel: {
        fontSize: 12
      }
    },
    yAxis: {
      //  改变y轴字体颜色和大小
      axisLabel: {
        fontSize: 12
      }
    }
  };
  // 图表自适应变化配置
  chartInstance.value?.setOption(adapterOption);
  // 手动的调用图表对象的resize 才能产生效果
  chartInstance.value.resize();
};

/** 定时器 */
const getDataTimer = () => {
  // koiTimer.value = setInterval(() => {
  //   // 执行刷新数据的方法
  //   getData();
  // }, 3000);
};
</script>

<style scoped></style>
