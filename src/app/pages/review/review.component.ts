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
  curTab = 'track';
  private pfmctrendUrl = 'performancereview/perf_trend';
  applyOption: any;
  loanOption: any;
  overdueOption: any;
  capacityOption: any;
  private bonustrendUrl = 'performancereview/bonus_trend';
  lineOption = {};

  tmSeniority = [];
  teamMbs = [];

  constructor(
    private bdService: BackendService,
    private waterMark: WaterMarkService,
    private cmnFn: CommonFnService,
  ) {
  }

  ngOnInit() {
    this.getPfmcTrend();
    this.getBonusTrend();

    this.getTmCapacity();
    this.getTmSeniority();
    this.getTmComp();

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

  getBonusTrend(): void {
    this.bdService
        .getAll(this.bonustrendUrl)
        .then((res) => {
          if ( res.code === 0) {
            let resData = res.data;
            let xAxisData = [];
            let seriesData = [];
            for (let item of resData) {
              xAxisData.push(item.month + '月');
              seriesData.push(+item.amt);
            }
            echart.LineChartOptions.xAxis.data = xAxisData;
            echart.LineChartOptions.series[0].data = seriesData;
            this.lineOption = echart.LineChartOptions;
          }
          this.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number }, 100);
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

  changeTab(type): void {
    if (type === this.curTab) {
      return;
    }
    this.curTab = type;
    this.getBonusTrend();
  }

}
