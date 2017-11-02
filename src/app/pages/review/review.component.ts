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
  private pfmctrendUrl = 'achievementanls/month_trend';
  applyOption: any;
  loanOption: any;
  overdueOption: any;

  private tmCapacityUrl = 'humananls/capacity_anls';
  capacityOption: any;
  private tmCompUrl = 'humananls/member_comp';
  teamMbs = [];

  tmSeniority = [];

  legendList = [];
  legendColorList = ['#f88681', '#fada71', '#3ae3bb', '#11b8ff', '#919af2', '#05e8e9'];
  products = ['工薪贷', '按揭贷', '精英贷', '保单贷', '生意贷'];
  passRateOption: any;
  overdueRateOption: any;
  private pfmccompositionUrl = 'productanls/total_achv';
  applyOrderOption: any;
  loanAmtOption: any;
  avgAmtOption: any;



  constructor(
    private bdService: BackendService,
    private waterMark: WaterMarkService,
    private cmnFn: CommonFnService,
  ) {
  }

  ngOnInit() {
    this.changeTab('track');
  }

  ngAfterContentInit() {
    if (document.body.scrollTop > 0) {
      document.body.scrollTop = 0;
    }
  }

  getPfmcTrend(): void {
    this.bdService
        .getDataByPost(this.pfmctrendUrl, {posId: localStorage.posId})
        .then((res) => {
          if ( res.code === 0) {
            let resData = res.data;
            let xAxisData = [];
            for (let item of resData.months) {
              xAxisData.push(item + '月');
            }
            // 申请情况
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
            this.applyOption.yAxis[1].axisLabel.formatter = '{value} %';
            this.applyOption.series[2].data =
              [resData.m1PassRate, resData.m2PassRate, resData.m3PassRate, resData.m4PassRate,
                resData.m5PassRate, resData.m6PassRate].reverse();
            // 放款情况
            this.loanOption = this.cmnFn.deepCopy(echart.LineBarChartOptions, {});
            this.loanOption.xAxis[0].data = xAxisData;
            this.loanOption.legend.data = ['放款单量', '放款金额'];
            this.loanOption.series[1].data =
              [resData.m1Number, resData.m2Number, resData.m3Number, resData.m4Number, resData.m5Number, resData.m6Number].reverse();
            this.loanOption.series[2].name = '放款金额';
            this.loanOption.yAxis[1].axisLabel.formatter = function (value) {
                return value / 10000;
              };
            this.loanOption.series[2].data =
              [resData.m1Amt, resData.m2Amt, resData.m3Amt, resData.m4Amt, resData.m5Amt, resData.m6Amt].reverse();
            // 逾期情况
            this.overdueOption = this.cmnFn.deepCopy(echart.LineBarChartOptions, {});
            this.overdueOption.xAxis[0].data = xAxisData;
            this.overdueOption.legend.data = ['逾期单量', '逾期金额'];
            this.overdueOption.series[0].name = '逾期单量';
            this.overdueOption.series[0].data =
              [resData.m1OvdNumber, resData.m2OvdNumber, resData.m3OvdNumber, resData.m4OvdNumber,
                 resData.m5OvdNumber, resData.m6OvdNumber].reverse();
            this.overdueOption.series[2].name = '逾期金额';
            this.overdueOption.yAxis[1].axisLabel.formatter = function (value) {
                return value / 10000;
              };
            this.overdueOption.series[2].data =
              [resData.m1OvdAmt, resData.m2OvdAmt, resData.m3OvdAmt, resData.m4OvdAmt, resData.m5OvdAmt, resData.m6OvdAmt].reverse();
          }
          this.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number });
        });
  }

  getTmCapacity(): void {
    this.bdService
        .getDataByPost(this.tmCapacityUrl, {posId: localStorage.posId})
        .then((res) => {
          if ( res.code === 0) {
            let resData = res.data;
            let xAxisData = [];
            let seriesData = [];
            for (let i = 0; i < resData.months.length; i ++) {
              xAxisData.push(resData.months[i] + '月');
              let dataset = [];
              for (let item of resData.dataList) {
                dataset.push(item['m' + (i + 1) + 'Amt']);
              }
              seriesData.push({
                name: resData.months[i] + '月',
                type: 'bar',
                stack: '总量',
                barWidth: 14,
                data: dataset
              });
            }
            let yAxisData = [];
            for (let item of resData.dataList) {
              yAxisData.push(item.name);
            }
            this.capacityOption = echart.StackBarChartOptions;
            this.capacityOption.legend.data = xAxisData;
            this.capacityOption.yAxis.data = yAxisData;
            this.capacityOption.series = seriesData;
          }
        });
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
    this.bdService
        .getDataByPost(this.tmCompUrl, {posId: localStorage.posId})
        .then((res) => {
          if ( res.code === 0) {
            let indicator = [
              {text: 'A', max: 5},
              {text: 'B', max: 5},
              {text: 'C', max: 5},
              {text: 'D', max: 5},
              {text: 'E', max: 5},
            ];
            let resData = res.data;
            for (let item of resData){
              let radarChartOpt = this.cmnFn.deepCopy(echart.RadarChartOptions, {});
              radarChartOpt.radar[0].indicator = indicator;
              radarChartOpt.radar[0].radius = 60;
              radarChartOpt.tooltip.position = 'top';
              let tooltipText = '';
              for (let data of item.dataList) {
                radarChartOpt.series[0].data[0].value.push(data.value);
                tooltipText += data.name + ': ' + data.origValue + '<br/>';
              }
              radarChartOpt.tooltip.formatter = function() {
                return tooltipText;
              };
              this.teamMbs.push({
                name: item.name,
                radarChartOpt: radarChartOpt
              });
            };
            // console.log(res.data);
            this.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' +
             JSON.parse(localStorage.user).number }, 280 * Math.ceil(res.data.length / 2));
          }
        });
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
        .getDataByPost(this.pfmccompositionUrl, {posId: localStorage.posId})
        .then((res) => {
          if ( res.code === 0) {
            // 产品份额
            echart.PieChartOptions.color = this.legendColorList;
            let loanOrderChartData = [];
            let cntAmtChartData = [];
            let legendList = [];
            let avgAmtArrays = [];
            for (let item of res.data) {
              legendList.push(item.productName);
              loanOrderChartData.push({value: item.appNum, name: item.productName});
              cntAmtChartData.push({value: item.loanAmt, name: item.productName});
              avgAmtArrays.push(item.avgAmt);
            }
            this.legendList = legendList;
            this.applyOrderOption = this.cmnFn.deepCopy(echart.PieChartOptions, {});
            this.applyOrderOption.series[0].data = loanOrderChartData;
            this.loanAmtOption = this.cmnFn.deepCopy(echart.PieChartOptions, {});
            this.loanAmtOption.series[0].data = cntAmtChartData;
            // 件均金额
            this.avgAmtOption = this.cmnFn.deepCopy(echart.BarChartOptions, {});
            this.avgAmtOption.xAxis[0].data = legendList;
            this.avgAmtOption.yAxis[0].axisLabel.formatter = function (value) {
                return value / 10000;
              };
            this.avgAmtOption.series[0].name = '件均金额';
            this.avgAmtOption.series[0].data = avgAmtArrays;
          }
          this.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number }, 100);
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
        break;
      default:
        this.getPfmcTrend();
      }
  }
}
