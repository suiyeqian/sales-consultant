export const PieChartOptions = {
  tooltip : {
    trigger: 'item',
    formatter: '{b}<br/><span style="color:#fbcb04">{d}%</span>',
    textStyle: { fontSize: 12 }
  },
  color: [],
  series : [
    {
      type: 'pie',
      radius : '75%',
      label: {
        normal: { show: false }
      },
      data: [],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};
