export const BarChartOptions = {
  tooltip: {
    trigger: 'axis',
    axisPointer: { type : 'shadow' }
  },
  color: ['#05e8e9'],
  calculable : true,
  xAxis : [
    {
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
      },
    }
  ],
  yAxis: [
    {
      type : 'value',
      name: '单位(万元)',
      nameTextStyle: { color: '#fff' },
      axisTick: { show: false },
      axisLabel: {
        formatter: '{value}',
        textStyle: { color: '#fff' }
      },
      axisLine: {  show: false },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#b7bac3',
          type: 'dashed'
        }
      },
    }
  ],
  series: [
    {
      type: 'bar',
      data: [],
      barWidth: '30%',
      itemStyle: {
        normal: {
          barBorderRadius: 5
        }
      }
    }
  ]
};
