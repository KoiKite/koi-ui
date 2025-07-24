<template>
  <div class="flex flex-col h-370px w-full">
    <div class="flex flex-justify-center">
      <el-segmented v-model="selectValue" :options="segmentedOptions" @change="getData" />
    </div>
    <div ref="refChart" class="w-full h-full"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { nextTick, ref, onMounted, onUnmounted } from "vue";
import { getCssVar } from "@/utils/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";

const globalStore = useGlobalStore();

/** 菜单折叠图表自适应 */
const handleChartResize = (chartInstance: any) => {
  globalStore.$subscribe((mutation) => {
    const events = Array.isArray(mutation.events) ? mutation.events : [mutation.events || mutation]; // 兼容不同结构

    // 检查目标事件
    const hasLayoutChange = events.some(event => ["layout"].includes(event?.key));

    // 检查目标事件
    const hasOtherChange = events.some(event => ["isCollapse", "themeColor", "isDark"].includes(event?.key));

    if (hasLayoutChange) {
      // console.log("检测到布局/主题变更", events);
      nextTick(() => {
        const event = new Event("resize");
        window.dispatchEvent(event);
      });
    }

    if (hasOtherChange) {
      nextTick(() => {
        setTimeout(() => {
          if (chartInstance.value) {
            screenAdapter();
          }
        }, 150);
      });
    }
  });
};

const selectValue = ref("订单量");
const segmentedOptions = ["订单量", "销售量", "退款量"];
const refChart = ref();
const chartInstance = ref();
const xChartData = ref();
const yChartData = ref();
// 局部刷新定时器
const koiTimer = ref();

onMounted(() => {
  // 图表初始化
  initChart();
  // 获取接口数据
  getData();
  // 调用Echarts图表自适应方法
  screenAdapter();
  // Echarts图表自适应
  window.addEventListener("resize", screenAdapter);
  // 局部刷新定时器
  getDataTimer();
  handleChartResize(chartInstance);
});

onUnmounted(() => {
  // 销毁Echarts图表
  chartInstance.value.dispose();
  chartInstance.value = null;
  // 清除局部刷新定时器
  clearInterval(koiTimer.value);
  koiTimer.value = null;
  // Echarts图表自适应销毁
  window.removeEventListener("resize", screenAdapter);
});

/** 初始化加载图表 */
const initChart = () => {
  chartInstance.value = echarts.init(refChart.value);
  const initOption = {
    grid: {
      top: "20%",
      left: "30px",
      bottom: "25%",
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
  // 调用接口方法
  // listTenDayData().then(res => {
  //       xChartData.value = res.data;
  //       updateChart();
  //       // console.log("xChartData->"+JSON.stringify(xChartData.value));
  //       // echarts查不到数据，将初始化echarts的方法全部放置到接口方法中即可。
  // })
  // 获取服务器的数据, 对xChartData进行赋值之后, 调用updateChart方法更新图表
  //console.log("xChartData->",JSON.stringify(res.data))
  //console.log("xChartData->",JSON.stringify(xChartData.value ))
  updateChart();
};

/** 修改图表数据 */
const updateChart = () => {
  yChartData.value = [];
  if (selectValue.value == "订单量") {
    yChartData.value = [72, 33, 66, 26, 77, 36, 59, 35, 62, 27, 55, 33, 69, 37, 52];
  }

  if (selectValue.value == "销售量") {
    yChartData.value = [66, 52, 36, 55, 75, 48, 59, 73, 56, 66, 45, 62, 70, 63, 65];
  }

  if (selectValue.value === "退款量") {
    yChartData.value = [70, 62, 56, 60, 72, 55, 61, 46, 58, 52, 60, 54, 52, 59, 57];
  }
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
const screenAdapter = () => {
  const titleFontSize = Math.max(9, Math.round(refChart.value?.offsetWidth / 136));
  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize
      }
    },
    // 圆点分类标题
    legend: {
      textStyle: {
        fontSize: titleFontSize
      }
    },
    xAxis: {
      //  改变x轴字体颜色和大小
      axisLabel: {
        fontSize: titleFontSize
      }
    },
    yAxis: {
      //  改变y轴字体颜色和大小
      axisLabel: {
        fontSize: titleFontSize
      }
    },
    series: [
      {
        itemStyle: {
          color: getCssVar("--el-color-primary") // 线颜色
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
