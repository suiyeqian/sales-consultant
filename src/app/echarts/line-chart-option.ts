export const LineChartOptions = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type : 'line'
    },
    formatter: function(params) {
      let relVal = params[0].name;
      for (let i = 0, l = params.length; i < l; i++) {
           relVal += `<br/>
                      <span style="display:inline-block;margin-right:5px;border-radius:50%;width:9px;height:9px;
                      background-color:${params[i].color}"></span>
                      ${params[i].seriesName} : ${params[i].value}`;
       }
      return relVal;
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
    left: '2%',
    top: '6%',
    right: '2%',
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
      formatter: '{value}'
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
