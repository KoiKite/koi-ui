<template>
  <div ref="refChart" class="w-full h-350px" v-loading="dataLoading"></div>
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
  // 局部刷新定时器
  handleDataTimer();
};

const refChart = ref();
const chartInstance = shallowRef();
const dataApi = ref<any>([]);

// 局部刷新定时器
const koiTimer = ref();
// 区域缩放的起点值
const startValue = ref(-1);
// 区域缩放的终点值
const endValue = ref(9);

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
  if (!chartInstance.value) return;

  const initOption = {
    // title: {
    //   text: "🐻地区异常订单排行",
    //   left: 0,
    //   top: 0,
    //   textStyle: {
    //     color: "#077EF8"
    //   }
    // },
    grid: {
      top: "10",
      left: "0",
      right: "0",
      bottom: "0",
      containLabel: true
    },
    tooltip: {
      show: true
    },
    xAxis: {
      type: "category"
    },
    yAxis: {
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
    },
    series: [
      {
        type: "bar",
        label: {
          color: "#8BADDA", // 设置顶部数字颜色
          show: true, // 开启数字显示
          position: "top" // 在上方显示数字
        },
        itemStyle: {
          // 这里设置柱形图圆角 [左上角，右上角，右下角，左下角]
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  };
  // 图表初始化配置
  chartInstance.value?.setOption(initOption);
  if (chartInstance.value) {
    // 鼠标移入停止定时器
    chartInstance.value.on("mouseover", () => {
      if (koiTimer.value) {
        clearInterval(koiTimer.value);
        koiTimer.value = null;
      }
    });

    // 鼠标移入启动定时器
    chartInstance.value.on("mouseout", () => {
      // 只有当前没有定时器时才启动
      if (!koiTimer.value) {
        handleDataTimer();
      }
    });
  }
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
      {
        name: "河南",
        value: 366
      },
      {
        name: "郑州",
        value: 356
      },
      {
        name: "广东",
        value: 335
      },
      {
        name: "福建",
        value: 320
      },
      {
        name: "浙江",
        value: 302
      },
      {
        name: "上海",
        value: 280
      },
      {
        name: "北京",
        value: 256
      },
      {
        name: "江苏",
        value: 236
      },
      {
        name: "四川",
        value: 290
      },
      {
        name: "重庆",
        value: 195
      },
      {
        name: "陕西",
        value: 160
      },
      {
        name: "湖南",
        value: 140
      },
      {
        name: "河北",
        value: 170
      },
      {
        name: "辽宁",
        value: 152
      },
      {
        name: "湖北",
        value: 120
      },
      {
        name: "江西",
        value: 99
      },
      {
        name: "天津",
        value: 107
      },
      {
        name: "吉林",
        value: 90
      },
      {
        name: "青海",
        value: 69
      },
      {
        name: "山东",
        value: 266
      },
      {
        name: "山西",
        value: 65
      },
      {
        name: "云南",
        value: 87
      },
      {
        name: "安徽",
        value: 79
      }
    ];
    // 获取服务器的数据, 对dataApi进行赋值之后, 调用updateChart方法更新图表
    dataApi.value = dataApi.value.sort((a: any, b: any) => {
      return b.value - a.value;
    });
    startValue.value++;
    endValue.value++;
    // 限制柱形图一直+1范围
    if (endValue.value > dataApi.value.length - 1) {
      startValue.value = 0;
      endValue.value = 9;
    }
    updateChart();
    dataLoading.value = false;
  }, 1000);
};

/** 修改图表数据 */
const updateChart = () => {
  if (!chartInstance.value) return;

  const colorArr = [
    ["#3A29D8", "#B5A7FF"],
    ["#0A84FF", "#6AC8FF"],
    ["#8BADDA", "#D0DAE5"],
    ["#FF4439", "#FFA826"]
  ];
  // 处理图表需要的数据
  const provinceArr = dataApi.value.map((item: any) => {
    return item.name;
  });
  const valueArr = dataApi.value.map((item: any) => {
    return item.value;
  });

  const dataOption = {
    xAxis: { data: provinceArr },
    series: [
      {
        data: valueArr,
        itemStyle: {
          label: {
            show: true,
            position: "top"
          },
          // 颜色样式部分
          // 柱状图颜色渐变
          color: (arg: any) => {
            let targetColorArr: any = "#8BADDA";
            if (arg.value > 300) {
              targetColorArr = colorArr[0];
            } else if (arg.value > 200) {
              targetColorArr = colorArr[1];
            } else if (arg.value > 100) {
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
      }
    ],
    // 推送数据
    dataZoom: {
      show: false,
      startValue: startValue.value,
      endValue: endValue.value
    }
  };
  // 图表数据变化配置
  chartInstance.value?.setOption(dataOption);
};

/** 图表自适应 */
const chartAdapter = () => {
  if (!refChart.value || !chartInstance.value) return;
  console.log("chartAdapter", chartAdapter)
  const offsetSize = ref(Math.round(refChart.value?.offsetWidth / 66));
  const adapterOption = {
    title: {
      textStyle: {
        fontSize: offsetSize.value
      }
    },
    series: [
      {
        // 圆柱的宽度
        barWidth: Math.round(offsetSize.value * 2.6)
      }
    ],
    xAxis: {
      // 改变x轴字体颜色和大小
      axisLabel: {
        fontSize: Math.round(offsetSize.value)
      }
    },
    yAxis: {
      //  改变y轴字体颜色和大小
      axisLabel: {
        fontSize: Math.round(offsetSize.value)
      }
    }
  };
  // 图表自适应变化配置
  chartInstance.value?.setOption(adapterOption);
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
