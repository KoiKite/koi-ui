<template>
  <div ref="refChart" class="w-full h-350px"></div>
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
const allData = ref([
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
]);

// 局部刷新定时器
const koiTimer = ref();
// 区域缩放的起点值
const startValue = ref(-1);
// 区域缩放的终点值
const endValue = ref(9);

onMounted(() => {
  // 图表初始化
  initChart();
  // 获取接口数据
  getData();
  // 调用Echarts图表自适应方法
  screenAdapter();
  // 局部刷新定时器
  getDataTimer();
  // Echarts图表自适应触发
  window.addEventListener("resize", screenAdapter);
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
  // 覆盖默认主题
  // echarts.registerTheme('myTheme', skin);
  chartInstance.value = echarts.init(refChart.value);
  // 初始化加载图标样式
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
      top: "12%",
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
      type: 'value',
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
          color: "#077EF8", // 设置顶部数字颜色
          show: true, // 开启数字显示
          position: "top" // 在上方显示数字
        }
      }
    ]
  };
  // 图表初始化配置
  chartInstance.value?.setOption(initOption);

  // 鼠标移入停止定时器
  chartInstance.value.on("mouseover", () => {
    clearInterval(koiTimer.value);
  });

  // 鼠标移入启动定时器
  chartInstance.value.on("mouseout", () => {
    getDataTimer();
  });
};

/** 获取接口数据 */
const getData = () => {
  // 调用接口方法
  // getModuleData().then(res => {
  //       allData.value = res.data;
  //       updateChart();
  //       // echarts查不到数据，将初始化echarts的方法全部放置到接口方法中即可。
  // })
  // 获取服务器的数据, 对allData进行赋值之后, 调用updateChart方法更新图表
  allData.value = allData.value.sort((a, b) => {
    return b.value - a.value;
  });
  startValue.value++;
  endValue.value++;
  // 限制柱形图一直+1范围
  if (endValue.value > allData.value.length - 1) {
    startValue.value = 0;
    endValue.value = 9;
  }
  updateChart();
};

/** 修改图表数据 */ 
const updateChart = () => {
  const colorArr = [
    ["#0BA82C", "#4FF778"],
    ["#2E72BF", "#23E5E5"],
    ["#5052EE", "#AB6EE5"],
    ["hotpink", "lightsalmon"]
  ];
  // 处理图表需要的数据
  const provinceArr = allData.value.map(item => {
    return item.name;
  });
  const valueArr = allData.value.map(item => {
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
            let targetColorArr: any = "lightpink";
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
const screenAdapter = () => {
  const titleFontSize = ref(Math.round(refChart.value?.offsetWidth / 50));
  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize.value
      }
    },
    series: [
      {
        // 圆柱的宽度
        barWidth: Math.round(titleFontSize.value * 2),
        itemStyle: {
          //颜色样式部分
          label: {
            textStyle: {
              fontSize: Math.round(titleFontSize.value * 0.8) //字体大小
            }
          }
        }
      }
    ],
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
    }
  };
  // 图表自适应变化配置
  chartInstance.value?.setOption(adapterOption);
  chartInstance.value?.resize();
};

/** 定时器 */
const getDataTimer = () => {
  koiTimer.value = setInterval(() => {
    // 执行刷新数据的方法
    getData();
  }, 2000);
};
</script>

<style scoped></style>
