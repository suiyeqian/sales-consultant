export const RadarChartOptions = {
  tooltip: {
    show: true,
    textStyle: {},
    formatter: function (value) {}
  },
  radar: [
    {
      indicator: [],
      radius: 70,
      name: {
        textStyle: {
          color: '#fff',
          fontSize: 14
        }
      },
      splitLine: {
        lineStyle: { color: 'rgba(127,127,127,1)' }
      },
      splitArea: { show: false },
      axisLine: { show: false }
    }
  ],
  series: [
    {
      name: '我的团队竞争力',
      type: 'radar',
      symbol: 'none',
      lineStyle: {
        normal: {
          opacity: 0
        }
      },
      areaStyle: {
        normal: {
          opacity: 0.7,
          color: '#d74b49'
       }
     },
      data: [{ value: [] }]
    }
  ]
};
