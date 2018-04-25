export const LineBarChartOptions = {
  tooltip: {
    trigger: 'axis',
    axisPointer: { type : 'shadow' },
  },
  calculable : true,
  legend: {
    data: ['申请单量', '放款单量', '合同金额'],
    bottom: 0,
    textStyle: { color: '#fff' },
  },
  grid: {
    left: '4%',
    top: '16%',
    right: '4%',
    bottom: '12%',
    containLabel: true
  },
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
      name: '单位(件)',
      nameTextStyle: { color: '#fff' },
      axisTick: { show: false },
      axisLabel: {
        textStyle: { color: '#fff' },
        margin: 4,
        fontSize: 9,
      },
      axisLine: { show: false },
      splitLine: {
        show: false,
        lineStyle: {
          color: '#b7bac3',
          type: 'dashed'
        }
      },
    },
    {
      type : 'value',
      name: '单位(万元)',
      nameTextStyle: { color: '#fff' },
      axisTick: { show: false },
      axisLabel: {
        formatter: '{value}',
        textStyle: { color: '#fff' },
        margin: 4,
        fontSize: 9,
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
      name: '申请单量',
      type: 'bar',
      yAxisIndex: 0,
      data: [],
      barWidth: '30%',
      itemStyle: {
        normal: {
          color: '#05e8e9',
          barBorderRadius: 5
        }
      }
    },
    {
      name: '放款单量',
      type: 'bar',
      yAxisIndex: 0,
      data: [],
      barGap: '20%',
      barWidth: '30%',
      itemStyle: {
        normal: {
          color: '#d74b49',
          barBorderRadius: 5
        }
      }
    },
    {
      name: '合同金额',
      type: 'line',
      symbol: 'circle',
      yAxisIndex: 1,
      data: [],
      itemStyle: {
        normal: {
          color: '#fad972',
        },
        opacity: 0
      },
      lineStyle: {
        normal: {
          color: '#fad972',
        }
      }
    },
  ]
};
