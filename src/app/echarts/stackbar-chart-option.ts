export const StackBarChartOptions = {
  tooltip : {
    trigger: 'axis',
    axisPointer : {
        type : 'shadow'
    }
  },
  legend: {
    data: ['1月', '2月', '3月', '4月', '5月', '6月'],
    bottom: 0,
    textStyle: { color: '#fff' },
    itemWidth: 14,
    itemHeight: 10
  },
  grid: {
    left: '0%',
    right: '13%',
    containLabel: true
  },
  color: ['#f88681', '#fada71', '#3ae3bb', '#11b8ff', '#919af2', '#05e8e9'],
  xAxis:  {
    type: 'value',
    name: '万元',
    nameTextStyle: { color: '#fff' },
    nameLocation: 'end',
    axisLine: { show: false },
    axisLabel: {
      textStyle: { color: '#fff' }
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#dcdcdc'
      }
    }
  },
  yAxis: {
    type: 'category',
    data: ['李一一一', '王二', '张三', '赵四', '孙五', '吴六', '钱七'],
    axisTick: { show: false },
    axisLabel: {
      textStyle: { color: '#fff' }
    },
    axisLine: { show: false },
    splitLine: {show: false },
  },
  series: [
    {
      name: '1月',
      type: 'bar',
      stack: '总量',
      barWidth: 14,
      data: [320, 302, 301, 334, 390, 330, 320]
    },
    {
      name: '2月',
      type: 'bar',
      stack: '总量',
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: '3月',
      type: 'bar',
      stack: '总量',
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      name: '4月',
      type: 'bar',
      stack: '总量',
      data: [150, 212, 201, 154, 190, 330, 410]
    },
    {
      name: '5月',
      type: 'bar',
      stack: '总量',
      data: [820, 832, 901, 934, 1290, 1330, 1320]
    },
    {
      name: '6月',
      type: 'bar',
      stack: '总量',
      data: [320, 432, 501, 234, 290, 330, 320]
    }
  ]
};
