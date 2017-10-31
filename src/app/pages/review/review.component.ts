import { Component, OnInit, AfterContentInit } from '@angular/core';

import { BackendService } from '../../core/services/backend.service';
import { WaterMarkService } from '../../core/services/watermark.service';
import { CommonFnService } from '../../core/services/commonfn.service';

import * as echart from '../../echarts';

@Component({
  selector: 'my-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit, AfterContentInit {
  curTab: string;
  private pfmctrendUrl = 'performancereview/perf_trend';
  applyOption: any;
  loanOption: any;
  overdueOption: any;
  capacityOption: any;

  tmSeniority = [];
  teamMbs = [];
  products = ['工薪贷', '按揭贷', '精英贷', '保单贷', '生意贷'];
  passRateOption: any;
  private pfmccompositionUrl = 'performancereview/perf_form';
  legendList = [];
  legendColorList = ['#f88681', '#fada71', '#3ae3bb', '#11b8ff', '#919af2', '#05e8e9'];
  applyOrderOption: any;
  loanAmtOption: any;
  overdueRateOption: any;
  avgAmtOption: any;

  constructor(
    private bdService: BackendService,
    private waterMark: WaterMarkService,
    private cmnFn: CommonFnService,
  ) {
  }

  ngOnInit() {
    this.changeTab('track');
    this.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number }, 100);
  }

  ngAfterContentInit() {
    if (document.body.scrollTop > 0) {
      document.body.scrollTop = 0;
    }
  }

  getPfmcTrend(): void {
    this.bdService
        .getAll(this.pfmctrendUrl)
        .then((res) => {
          if ( res.code === 0) {
            let resData = res.data;
            let xAxisData = [];
            for (let item of resData.months) {
              xAxisData.push(item + '月');
            }
            this.applyOption = this.cmnFn.deepCopy(echart.LineBarChartOptions, {});
            this.applyOption.xAxis[0].data = xAxisData;
            this.applyOption.legend.data = ['申请单量', '放款单量', '通过率'];
            this.applyOption.yAxis[1].name = null;
            this.applyOption.series[0].data =
              [resData.m1AppNumber, resData.m2AppNumber, resData.m3AppNumber, resData.m4AppNumber,
                 resData.m5AppNumber, resData.m6AppNumber].reverse();
            this.applyOption.series[1].data =
              [resData.m1Number, resData.m2Number, resData.m3Number, resData.m4Number, resData.m5Number, resData.m6Number].reverse();
            this.applyOption.series[2].name = '通过率';
            this.applyOption.series[2].data =
              [resData.m1Amt, resData.m2Amt, resData.m3Amt, resData.m4Amt, resData.m5Amt, resData.m6Amt].reverse();

            this.loanOption = this.cmnFn.deepCopy(echart.LineBarChartOptions, {});
            this.loanOption.xAxis[0].data = xAxisData;
            this.loanOption.legend.data = ['放款单量', '放款金额'];
            this.loanOption.series[1].data =
              [resData.m1Number, resData.m2Number, resData.m3Number, resData.m4Number, resData.m5Number, resData.m6Number].reverse();
            this.loanOption.series[2].name = '放款金额';
            this.loanOption.series[2].data =
              [resData.m1Amt, resData.m2Amt, resData.m3Amt, resData.m4Amt, resData.m5Amt, resData.m6Amt].reverse();

            this.overdueOption = this.cmnFn.deepCopy(echart.LineBarChartOptions, {});
            this.overdueOption.xAxis[0].data = xAxisData;
            this.overdueOption.legend.data = ['逾期单量', '逾期金额'];
            this.overdueOption.series[0].name = '逾期单量';
            this.overdueOption.series[0].data =
              [resData.m1AppNumber, resData.m2AppNumber, resData.m3AppNumber, resData.m4AppNumber,
                 resData.m5AppNumber, resData.m6AppNumber].reverse();
            this.overdueOption.series[2].name = '逾期金额';
            this.overdueOption.series[2].data =
              [resData.m1Amt, resData.m2Amt, resData.m3Amt, resData.m4Amt, resData.m5Amt, resData.m6Amt].reverse();
          }
        });
  }

  getTmCapacity(): void {
    this.capacityOption = echart.StackBarChartOptions;
  }

  getTmSeniority(): void {
    this.tmSeniority = [
      {mob: '0-2', appNum: 1, loanNum: 1, avgAmt: 20, passRate: 15},
      {mob: '3-6', appNum: 1, loanNum: 1, avgAmt: 20, passRate: 15},
      {mob: '7-12', appNum: 1, loanNum: 1, avgAmt: 20, passRate: 15},
      {mob: '12+', appNum: 1, loanNum: 1, avgAmt: 20, passRate: 15},
    ];
  }

  getTmComp(): void {
    this.teamMbs = [
      {name: '李一', radarChartOpt: this.cmnFn.deepCopy(echart.RadarChartOptions, {})},
      {name: '王二', radarChartOpt: this.cmnFn.deepCopy(echart.RadarChartOptions, {})},
      {name: '张三', radarChartOpt: this.cmnFn.deepCopy(echart.RadarChartOptions, {})},
      {name: '李四', radarChartOpt: this.cmnFn.deepCopy(echart.RadarChartOptions, {})},
      {name: '孙五', radarChartOpt: this.cmnFn.deepCopy(echart.RadarChartOptions, {})},
      {name: '吴六', radarChartOpt: this.cmnFn.deepCopy(echart.RadarChartOptions, {})},
      {name: '钱七', radarChartOpt: this.cmnFn.deepCopy(echart.RadarChartOptions, {})}
    ];
    let indicator = [
      {text: 'A', max: 5},
      {text: 'B', max: 5},
      {text: 'C', max: 5},
      {text: 'D', max: 5},
      {text: 'E', max: 5},
    ];
    let dataVals = [];
    for (let item of this.teamMbs) {
      item.radarChartOpt.radar[0].indicator = indicator;
      item.radarChartOpt.radar[0].radius = 60;
      item.radarChartOpt.series[0].name = item.name;
      for (let i = 0; i < 5; i++) {
        item.radarChartOpt.series[0].data[0].value.push(Math.floor(Math.random() * 5) + 1);
      }
    }
  }

  getPassRate(): void {
    this.passRateOption = this.cmnFn.deepCopy(echart.LineChartOptions, {});
    this.passRateOption.xAxis.data = ['1月', '2月', '3月', '4月', '5月', '6月'];
    this.passRateOption.legend.data = this.products;
    for (let item of this.products) {
      let datas = [];
      for (let i = 0; i < 6; i++) {
        datas.push(Math.floor(Math.random() * 100));
      }
      this.passRateOption.series.push({
        name: item,
        type: 'line',
        symbol: 'circle',
        symbolSize: 8,
        data: datas
      });
    }
  }

  getPfmcComposition(): void {
    this.bdService
        .getAll(this.pfmccompositionUrl)
        .then((res) => {
          if ( res.code === 0) {
            let commonOption = echart.PieChartOptions;
            commonOption.color = this.legendColorList;
            let deepCopy = function(parent, clone) {
              let child = clone || {};
              for (let i in parent) {
                if (!parent.hasOwnProperty(i)) {
                  continue;
                }
                if (typeof parent[i] === 'object') {
                  child[i] = (parent[i].constructor === Array) ? [] : {};
                  deepCopy(parent[i], child[i]);
                } else {
                  child[i] = parent[i];
                }
              }
              return child;
            };
            let loanOrderChartData = [];
            let cntAmtChartData = [];
            for (let item of res.data) {
              this.legendList.push(item.prodName);
              loanOrderChartData.push({value: item.loanNum, name: item.prodName});
              cntAmtChartData.push({value: item.cntAmt, name: item.prodName});
            }
            this.applyOrderOption = deepCopy(commonOption, {});
            this.applyOrderOption.series[0].data = loanOrderChartData;
            this.loanAmtOption = deepCopy(commonOption, {});
            this.loanAmtOption.series[0].data = cntAmtChartData;
          }
        });
  }

  getOverdueRate(): void {
    this.overdueRateOption = this.cmnFn.deepCopy(echart.LineChartOptions, {});
    this.overdueRateOption.xAxis.data = ['1月', '2月', '3月', '4月', '5月', '6月'];
    this.overdueRateOption.legend.data = this.products;
    for (let item of this.products) {
      let datas = [];
      for (let i = 0; i < 6; i++) {
        datas.push(Math.floor(Math.random() * 100));
      }
      this.overdueRateOption.series.push({
        name: item,
        type: 'line',
        symbol: 'circle',
        symbolSize: 8,
        data: datas
      });
    }
  }

  getAvgAmt(): void {
    this.avgAmtOption = this.cmnFn.deepCopy(echart.BarChartOptions, {});
    this.avgAmtOption.xAxis[0].data = this.products;
    this.avgAmtOption.series[0].name = '件均金额';
    let datas = [];
    for (let item of this.products) {
      datas.push(Math.floor(Math.random() * 10));
    }
    this.avgAmtOption.series[0].data = datas;
  }

  changeTab(type): void {
    if (type === this.curTab) {
      return;
    }
    this.curTab = type;
    switch (type) {
      case 'human':
        this.getTmCapacity();
        this.getTmSeniority();
        this.getTmComp();
        break;
      case 'produce':
        this.getPassRate();
        this.getPfmcComposition();
        this.getOverdueRate();
        this.getAvgAmt();
        break;
      default:
        this.getPfmcTrend();
      }
  }
}
