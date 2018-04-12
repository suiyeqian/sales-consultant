import { Component, OnInit, Input } from '@angular/core';

import { BackendService } from '../../../core/services/backend.service';
import { CommonFnService } from '../../../core/services/commonfn.service';
import * as echart from '../../../echarts';
import { WaterMarkService } from '../../../core/services/watermark.service';

@Component({
  selector: 'my-tab-produce',
  templateUrl: './tab-produce.component.html',
  styleUrls: ['./tab-produce.component.scss']
})
export class TabProduceComponent implements OnInit {
  @Input() isActive: boolean;
  private trendUrl = 'productanls/trend';
  private scatterUrl = 'productanls/cur_month';
  list = [
    {
      title: '申请单量分析',
      type: 'sqdl',
      curSubTab: 'trend',
      curLevel: {},
      chartOption: this.cmnFn.deepCopy(echart.LineChartOptions, {})
    }, {
      title: '放款金额分析',
      type: 'fkje',
      curSubTab: 'trend',
      curLevel: {},
      chartOption: this.cmnFn.deepCopy(echart.LineChartOptions, {})
    }, {
      title: '件均金额分析',
      type: 'jjje',
      curSubTab: 'trend',
      curLevel: {},
      chartOption: this.cmnFn.deepCopy(echart.LineChartOptions, {})
    }, {
      title: '通过率分析',
      type: 'tgl',
      curSubTab: 'trend',
      curLevel: {},
      chartOption: this.cmnFn.deepCopy(echart.LineChartOptions, {})
    }, {
      title: 'C-M2分析',
      type: 'cm2',
      curSubTab: 'trend',
      curLevel: {},
      chartOption: this.cmnFn.deepCopy(echart.LineChartOptions, {})
    }
  ];

  legendList = [];
  legendColorList = ['#f88681', '#fada71', '#3ae3bb', '#11b8ff', '#919af2', '#05e8e9'];
  private prodctPandOUrl = 'productanls/month_trend';
  passRateOption: any;
  overdueRateOption: any;
  private prodctCompositionUrl = 'productanls/total_achv';
  applyOrderOption: any;
  loanAmtOption: any;
  avgAmtOption: any;

  private subNameUrl = 'achievementanls/sub_name';

  constructor(
    private bdService: BackendService,
    private cmnFn: CommonFnService,
    private waterMark: WaterMarkService
  ) {
  }

  ngOnInit() {
    if (this.isActive) {
      for (let item of this.list) {
        this.getTrend({value: '', text: '全部'}, item.type);
      }
    }
  }

  getTrend(level, type): void {
    let curItem = this.list.find((item) => item.type === type);
    curItem.curLevel = level;
    this.bdService
        .getDataByPost(this.trendUrl, {posId: localStorage.posId, subName: level.value, type: type})
        .then((res) => {
          if ( res.code === 0) {
            curItem.chartOption = this.cmnFn.deepCopy(echart.LineChartOptions, {});
            curItem.chartOption.xAxis.data = res.data.xAxis;
            let legendData = [];
            for (let item of res.data.yAxis){
              legendData.push(item.name);
              curItem.chartOption.series.push({
                name: item.name,
                type: 'line',
                symbol: 'circle',
                symbolSize: 8,
                data: item.list
              });
            }
            curItem.chartOption.legend.data = legendData;
            if (curItem.type === 'tgl' || curItem.type === 'cm2') {
              curItem.chartOption.yAxis.axisLabel.formatter = '{value} %';
            }
          }
        });
  }

  getScatterChart(type): void {
    let curItem = this.list.find((item) => item.type === type);
    this.bdService
        .getDataByPost(this.scatterUrl, {posId: localStorage.posId, type: type})
        .then((res) => {
          if ( res.code === 0) {
            curItem.chartOption = this.cmnFn.deepCopy(echart.LineChartOptions, {});
            curItem.chartOption.xAxis.data = res.data.xAxis;
            let symbols = ['circle', 'rect', 'triangle', 'diamond', 'pin', 'roundRect', 'arrow'];
            let legendData = [];
            curItem.chartOption.dataZoom = [{
              type: 'inside',
              startValue: 0,
              endValue: 4,
              zoomLock: true
            }];
            for (let i = 0; i < res.data.yAxis.length; i++) {
              legendData.push(res.data.yAxis[i].name);
              curItem.chartOption.series.push({
                name: res.data.yAxis[i].name,
                type: 'scatter',
                symbol: symbols[i],
                symbolSize: 12,
                data: res.data.yAxis[i].list
              });
            }
            curItem.chartOption.legend.data = legendData;
            if (curItem.type === 'tgl' || curItem.type === 'cm2') {
              curItem.chartOption.yAxis.axisLabel.formatter = '{value} %';
              curItem.chartOption.tooltip.formatter = function(params) {
                let relVal = params[0].name;
                for (let i = 0, l = params.length; i < l; i++) {
                     relVal += `<br/>
                                <span style="display:inline-block;margin-right:5px;border-radius:50%;width:9px;height:9px;
                                background-color:${params[i].color}"></span>
                                ${params[i].seriesName} : ${params[i].value} %`;
                 }
                return relVal;
              };
            }
          }
        });
  }

  switchChart(tabName, itemType): void {
    let curItem = this.list.find((item) => item.type === itemType);
    if (curItem.curSubTab === tabName) {
      return;
    }
    curItem.curSubTab = tabName;
    if (tabName === 'trend') {
      this.getTrend(curItem.curLevel, itemType);
    } else {
      this.getScatterChart(itemType);
    }
  }

  // getProdctPandO(): void {
  //   this.bdService
  //       .getDataByPost(this.prodctPandOUrl, {posId: localStorage.posId})
  //       .then((res) => {
  //         this.passRateOption = this.cmnFn.deepCopy(echart.LineChartOptions, {});
  //         this.overdueRateOption = this.cmnFn.deepCopy(echart.LineChartOptions, {});
  //         let xAxisData = [];
  //         for (let month of res.data.months) {
  //           xAxisData.push(month + '月');
  //         }
  //         this.passRateOption.xAxis.data = xAxisData;
  //         this.overdueRateOption.xAxis.data = xAxisData;
  //         let legendData = [];
  //         for (let item of res.data.dataList){
  //           legendData.push(item.productName);
  //           this.passRateOption.series.push({
  //             name: item.productName,
  //             type: 'line',
  //             symbol: 'circle',
  //             symbolSize: 8,
  //             data: [item.m6PassRate, item.m5PassRate, item.m4PassRate, item.m3PassRate, item.m2PassRate, item.m1PassRate]
  //           });
  //           this.overdueRateOption.series.push({
  //             name: item.productName,
  //             type: 'line',
  //             symbol: 'circle',
  //             symbolSize: 8,
  //             data: [item.m6OvdRate, item.m5OvdRate, item.m4OvdRate, item.m3OvdRate, item.m2OvdRate, item.m1OvdRate]
  //           });
  //         }
  //         this.passRateOption.legend.data = legendData;
  //         this.overdueRateOption.legend.data = legendData;
  //       });
  // }
  //
  // getProdctComposition(): void {
  //   this.bdService
  //       .getDataByPost(this.prodctCompositionUrl, {posId: localStorage.posId})
  //       .then((res) => {
  //         if ( res.code === 0) {
  //           // 产品份额
  //           echart.PieChartOptions.color = this.legendColorList;
  //           let loanOrderChartData = [];
  //           let cntAmtChartData = [];
  //           let legendList = [];
  //           let avgAmtArrays = [];
  //           for (let item of res.data) {
  //             legendList.push(item.productName);
  //             loanOrderChartData.push({value: item.appNum, name: item.productName});
  //             cntAmtChartData.push({value: item.loanAmt, name: item.productName});
  //             avgAmtArrays.push(item.avgAmt);
  //           }
  //           this.legendList = legendList;
  //           this.applyOrderOption = this.cmnFn.deepCopy(echart.PieChartOptions, {});
  //           this.applyOrderOption.series[0].data = loanOrderChartData;
  //           this.loanAmtOption = this.cmnFn.deepCopy(echart.PieChartOptions, {});
  //           this.loanAmtOption.series[0].data = cntAmtChartData;
  //           // 件均金额
  //           this.avgAmtOption = this.cmnFn.deepCopy(echart.BarChartOptions, {});
  //           this.avgAmtOption.xAxis[0].data = legendList;
  //           // this.avgAmtOption.yAxis[0].axisLabel.formatter = function (value) {
  //           //     return value / 10000;
  //           //   };
  //           this.avgAmtOption.series[0].name = '件均金额';
  //           this.avgAmtOption.series[0].data = avgAmtArrays.map(item => (item / 10000).toFixed(2));
  //         }
  //         this.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number }, 100);
  //       });
  // }

}
