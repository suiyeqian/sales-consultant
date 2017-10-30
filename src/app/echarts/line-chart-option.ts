export const LineChartOptions = {
  tooltip: {
    trigger: 'axis',
    // formatter: '{a0}: {c0}<br />{a1}: {c1}'
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
    // bottom: '11%',
    containLabel: true
  },
  xAxis:  {
      type: 'category',
      data: [],
      axisTick: {
        length: 10,
        lineStyle: {
          color: '#fff'
        }
      },
      axisLine: {
        lineStyle: {
          color: '#b7bac3',
          type: 'dashed'
        }
      },
      axisLabel: {
        textStyle: { color: '#fff' }
      }
  },
  yAxis: {
    type: 'value',
    // name: '单位(元)',
    // nameTextStyle: { color: '#fff' },
    axisTick: { show: false },
    axisLabel: {
      formatter: '{value} %'
    },
    axisLine: { show: false },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#b7bac3',
        type: 'dashed'
      }
    }
  },
  color: ['#f88681', '#fada71', '#3ae3bb', '#11b8ff', '#919af2', '#05e8e9'],
  textStyle: {
    color: '#fff'
  },
  series: []
};
