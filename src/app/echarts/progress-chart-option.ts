export const ProgressChartOptions = {
  series : [
    {
      type : 'pie',
      radius : [40, 60],
      itemStyle : {
        normal : {
          label : {
            formatter : '当前进度',
            textStyle: {
              color: '#fff',
              fontSize : 12,
              baseline : 'top'
            }
          }
        },
      },
      data : [
        {
          value: 0,
          itemStyle: {
            normal: {
              color: '#d74b49',
              label : {
                show : true,
                position : 'center',
                formatter : '{c}%',
                textStyle: {
                  color: '#d74b49',
                  fontSize : 24,
                  fontWeight : 'bold',
                  baseline : 'bottom'
                }
              },
              labelLine : {
                show : false
              }
            }
          }
        },
        {
          value: 100 - 0,
          itemStyle: {
            normal: {
              color: '#29293b',
              label: {
                show: true,
                position: 'center'
              },
              labelLine: { show : false }
            },
          }
        },
      ]
    },
  ]
};
