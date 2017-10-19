export const RadarChartOptions = {
  tooltip: { show: false},
  radar: [
    {
      indicator: [],
      radius: 80,
      name: {
        textStyle: {
          color: '#fdcb04',
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
      name: '我的竞争力',
      type: 'radar',
      symbol: 'none',
      lineStyle: {
        normal: {
          opacity: 0
        }
      },
      areaStyle: {
        normal: {
          opacity: 1,
          color: {
            type: 'linear',
            x: 0, y: 0,
            x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#fb9a02' },
              { offset: 1, color: '#fdbf04' }
            ]
          }
       }
     },
      data: [{ value: [] }]
    }
  ]
};
