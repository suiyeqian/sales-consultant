export const LineChartOptions = {
  tooltip: {
    show: false
  },
  xAxis:  {
      type: 'category',
      data: [],
      axisTick: { show: false },
      axisLabel: {
        textStyle: {
          color: '#ccc'
        }
      }
  },
  yAxis: {
    type: 'value',
    name: '单位(元)',
    nameTextStyle: {
      color: '#ccc'
    },
    splitNumber: 3,
    axisTick: { show: false },
    axisLabel: {
      formatter:  function (value) {
        return value / 1000 + 'k';
      },
      textStyle: {
        color: '#ccc'
      }
    },
    axisLine: { show: false },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#3a3b45']
      }
    },
  },
  color: ['#fe4504'],
  textStyle: {
    color: '#fdcb04'
  },
  series: [
    {
        type: 'line',
        data: [],
        label: {
          normal: {
           show: true,
           position: 'bottom',
           fontSize: 14
         }
        },
        symbol: 'circle',
        symbolSize: 10
    }
  ]
};
