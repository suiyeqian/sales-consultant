export const StackBarChartOptions = {
  tooltip : {
    trigger: 'axis',
    axisPointer : {
        type : 'shadow'
    }
  },
  legend: {
    data: [],
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
      textStyle: { color: '#fff' },
      formatter:  function (value) {
        return value / 10000;
      },
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
    data: [],
    axisTick: { show: false },
    axisLabel: {
      textStyle: { color: '#fff' }
    },
    axisLine: { show: false },
    splitLine: {show: false },
  },
  series: []
};
