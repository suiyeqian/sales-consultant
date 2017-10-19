export const GaugeChartOptions = {
  tooltip : { show: false },
  series: [
    {
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      radius: '95%',
      axisLine: {
        show: true,
        lineStyle: {
          color: [
            [0, '#05e8e9'],
            [1, '#fff']
          ],
          width: 23
        }
      },
      splitLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      pointer: { show: false },
       detail : {
        show : true,
        offsetCenter: [0, -15],
        formatter: '{value}%',
        textStyle: {
            fontSize : 20,
            color: '#05e8e9',
            fontWeight: 'bold'
        }
      },
      data: [{value: 0}]
    }
  ]
};
