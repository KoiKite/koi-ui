<template>
  <div class="flex flex-justify-center">
    <el-segmented v-model="selectValue" :options="segmentedOptions" @change="getData" />
  </div>
  <div ref="refChart" style="width: 100%; height: 360px"></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted, onUnmounted } from "vue";

const selectValue = ref("边牧");

const segmentedOptions = ["边牧", "金毛", "萨摩耶"];

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
      left: "2%",
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
          color: "#2992ff" // 线颜色
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
                color: "#3e9dff"
              },
              {
                offset: 1,
                color: "#d4e9ff"
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
  if (selectValue.value == "边牧") {
    yChartData.value = [
      72, 33, 66, 26, 77, 
      36, 59, 35, 62, 27, 
      55, 33, 69, 37, 52
    ];
  }

  if (selectValue.value == "金毛") {
    yChartData.value = [
      66, 52, 36, 55, 75, 
      48, 59, 73, 56, 66, 
      45, 62, 70, 63, 65
    ];
  }

  if (selectValue.value === "萨摩耶") {
    yChartData.value = [
      70, 62, 56, 60, 72, 
      55, 61, 46, 58, 52, 
      60, 54, 52, 59, 57
    ];
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
