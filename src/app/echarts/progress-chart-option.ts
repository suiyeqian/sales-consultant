export const ProgressChartOptions = {
  series : [
    {
      type : 'pie',
      radius : [40, 60],
      silent: true,
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
                textStyle: {
                  color: '#d74b49',
                  fontSize : 24,
                  fontWeight : 'bold',
                  baseline : 'bottom'
                },
                position : 'center',
                formatter : '{c}%',
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
                position: 'center',
                textStyle: {
                  color: '#fff'
                }
              },
              labelLine: { show : false }
            },
          }
        },
      ]
    },
  ]
};
