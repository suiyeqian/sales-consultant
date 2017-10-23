export const LineBarChartOptions = {
  tooltip: {
    trigger: 'axis',
    axisPointer: { type : 'shadow' }
  },
  calculable : true,
  legend: {
    data: ['合同金额', '申请单量', '放款单量'],
    right: 0,
    textStyle: { color: '#fff' }
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
      name: '单位(万元)',
      nameTextStyle: { color: '#fff' },
      splitNumber: 3,
      axisTick: { show: false },
      axisLabel: {
        formatter: '{value}',
        textStyle: { color: '#fff' }
      },
      axisLine: {
        lineStyle: { show: false }
      },
      splitLine: {
        lineStyle: {
            color: '#030519',
            type: 'dashed'
        }
      },
    },
    {
      type : 'value',
      name: '单位(件)',
      nameTextStyle: { color: '#fff' },
      splitNumber: 3,
      axisTick: { show: false },
      axisLabel: {
        textStyle: { color: '#ccc' }
      },
      axisLine: { show: false },
      splitLine: { show: false },
    }
  ],
  series: [
    {
      name: '合同金额',
      type: 'line',
      symbol: 'circle',
      data: [],
      itemStyle: {
        normal: {
          color: '#4b6577',
        },
        opacity: 0
      },
      lineStyle: {
        normal: {
          color: '#4b6577',
        }
      }
    },
    {
      name: '申请单量',
      type: 'bar',
      yAxisIndex: 1,
      data: [],
      barWidth: '40%',
      itemStyle: {
        normal: {
          color: '#d74b49',
          barBorderRadius: 5
        }
      }
    },
    {
      name: '放款单量',
      type: 'bar',
      yAxisIndex: 1,
      data: [],
      barGap: '15%',
      barWidth: '40%',
      itemStyle: {
        normal: {
          color: '#05e8e9',
          barBorderRadius: 5
        }
      }
    }
  ]
};
