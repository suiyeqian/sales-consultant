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
  deviceWidth = document.body.clientWidth;
  curTab: string;
  private pfmctrendUrl = 'achievementanls/month_trend';
  applyOption: any;
  loanOption: any;
  overdueOption: any;
  private pfmcTotalUrl = 'achievementanls/year_achv';
  pfmcTotal = {};

  private tmCapacityUrl = 'humananls/capacity_anls';
  capacityOption: any;
  private tmSeniorityUrl = 'humananls/seniority_anls';
  tmSeniority = [];
  private tmCompUrl = 'humananls/member_comp';
  teamMbs = [];

  legendList = [];
  legendColorList = ['#f88681', '#fada71', '#3ae3bb', '#11b8ff', '#919af2', '#05e8e9'];
  private prodctPandOUrl = 'productanls/month_trend';
  passRateOption: any;
  overdueRateOption: any;
  private prodctCompositionUrl = 'productanls/total_achv';
  applyOrderOption: any;
  loanAmtOption: any;
  avgAmtOption: any;

  constructor(
    private bdService: BackendService,
    private waterMark: WaterMarkService,
    private cmnFn: CommonFnService,
  ) {}

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
            this.applyOption.series.splice(1, 1);
            this.applyOption.xAxis[0].data = xAxisData;
            this.applyOption.legend.data = ['申请单量', '通过率'];
            this.applyOption.series[0].data =
              [resData.m1AppNumber, resData.m2AppNumber, resData.m3AppNumber, resData.m4AppNumber,
                 resData.m5AppNumber, resData.m6AppNumber].reverse();
            this.applyOption.series[1].name = '通过率';
            this.applyOption.yAxis[1].axisLabel.formatter = '{value} %';
            this.applyOption.yAxis[1].name = null;
            this.applyOption.series[1].data =
              [resData.m1PassRate, resData.m2PassRate, resData.m3PassRate, resData.m4PassRate,
                resData.m5PassRate, resData.m6PassRate].reverse();
            this.applyOption.tooltip.formatter = function(params) {
              let relVal = params[0].name;
              for (let i = 0, l = params.length; i < l; i++) {
                relVal += `<br/>
                           <span style="display:inline-block;margin-right:5px;border-radius:50%;width:9px;height:9px;
                           background-color:${params[i].color}"></span>
                           ${params[i].seriesName} : ${params[i].value}`;
                if (params[i].seriesName === '通过率') {
                  relVal += '%';
                }
               }
              return relVal;
            };
            // 放款情况
            this.loanOption = this.cmnFn.deepCopy(echart.LineBarChartOptions, {});
            this.loanOption.series.splice(0, 1);
            this.loanOption.xAxis[0].data = xAxisData;
            this.loanOption.legend.data = ['放款单量', '放款金额'];
            this.loanOption.series[0].data =
              [resData.m1Number, resData.m2Number, resData.m3Number, resData.m4Number, resData.m5Number, resData.m6Number].reverse();
            // this.loanOption.yAxis[1].axisLabel.formatter = function (value) {
            //     return value / 10000;
            //   };
            this.loanOption.series[1].name = '放款金额';
            this.loanOption.series[1].data =
              [resData.m1Amt, resData.m2Amt, resData.m3Amt, resData.m4Amt, resData.m5Amt, resData.m6Amt]
              .map(item => (item / 10000).toFixed(2))
              .reverse();
            // 逾期情况
            this.overdueOption = this.cmnFn.deepCopy(echart.LineBarChartOptions, {});
            this.overdueOption.series.splice(1, 1);
            this.overdueOption.xAxis[0].data = xAxisData;
            this.overdueOption.legend.data = ['逾期单量', '逾期金额'];
            this.overdueOption.series[0].name = '逾期单量';
            this.overdueOption.series[0].itemStyle.normal.color = '#4993d8';
            this.overdueOption.series[0].data =
              [resData.m1OvdNumber, resData.m2OvdNumber, resData.m3OvdNumber, resData.m4OvdNumber,
                 resData.m5OvdNumber, resData.m6OvdNumber].reverse();
            this.overdueOption.series[1].name = '逾期金额';
            // this.overdueOption.yAxis[1].axisLabel.formatter = function (value) {
            //   return value / 10000;
            // };
            this.overdueOption.series[1].data =
              [resData.m1OvdAmt, resData.m2OvdAmt, resData.m3OvdAmt, resData.m4OvdAmt, resData.m5OvdAmt, resData.m6OvdAmt]
              .map(item => (item / 10000).toFixed(2))
              .reverse();
          }
          this.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number });
        });
  }

  getPfmcTotal(): void {
    this.bdService
        .getDataByPost(this.pfmcTotalUrl, {posId: localStorage.posId})
        .then((res) => {
          this.pfmcTotal = res.data;
        });
  }

  getTmCapacity(): void {
    this.bdService
        .getDataByPost(this.tmCapacityUrl, {posId: localStorage.posId})
        .then((res) => {
          let chartDom = document.getElementById('capacityChart');
          if ( res.code === 0) {
            chartDom.style['height'] = 24 * res.data.dataList.length + 142 + 'px';
            let resData = res.data;
            let xAxisData = [];
            let seriesData = [];
            for (let i = 0; i < resData.months.length; i ++) {
              xAxisData.push(resData.months[i] + '月');
              let dataset = [];
              for (let item of resData.dataList) {
                dataset.push((item['m' + (i + 1) + 'Amt'] / 10000).toFixed(2));
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
          let waterMark = this.waterMark;
          setTimeout(function(){
            waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number });
          }, 0);
        });
  }

  getTmSeniority(): void {
    this.bdService
        .getDataByPost(this.tmSeniorityUrl, {posId: localStorage.posId})
        .then((res) => {
          this.tmSeniority = res.data;
        });
  }

  getTmComp(): void {
    this.teamMbs = [];
    let radius = Math.floor((this.deviceWidth - 150) / 4);
    let radarHeight = 6 * 75 * (this.deviceWidth / 750);
    this.bdService
        .getDataByPost(this.tmCompUrl, {posId: localStorage.posId})
        .then((res) => {
          if ( res.code === 0) {
            let codeArray = [];
            if (localStorage.posId === '2') {
              codeArray = [
                {name: '合同金额', code: 'S'},
                {name: '申请单量', code: 'N'},
                {name: '件均金额', code: 'A'},
                {name: '通过率', code: 'P'},
                {name: 'C-M2', code: 'C-M2'}
              ];
            } else {
              codeArray = [
                {name: '人均产能', code: 'AP'},
                {name: '活动率', code: 'AR'},
                {name: '达成率', code: 'CR'},
                {name: '满编率', code: 'FR'},
                {name: 'C-M2', code: 'C-M2'},
                {name: '开单率', code: 'SR'}
              ];
            }
            let resData = res.data;
            for (let item of resData){
              let indicator = [];
              let radarChartOpt = this.cmnFn.deepCopy(echart.RadarChartOptions, {});
              radarChartOpt.radar[0].radius = radius;
              radarChartOpt.radar[0].name.textStyle.fontSize = 11;
              radarChartOpt.radar[0].nameGap = 8;
              radarChartOpt.tooltip.textStyle.fontSize = 10;
              radarChartOpt.tooltip.position = 'bottom';
              let tooltipText = '';
              for (let data of item.dataList) {
                for (let codeItem of codeArray) {
                  if (data.name === codeItem.name) {
                    data.code = codeItem.code;
                  }
                }
                indicator.push({text: data.code, max: localStorage.posId === '2' ? 5 : 10});
                radarChartOpt.series[0].data[0].value.push(data.value);
                if (data.name === 'C-M2') {
                  tooltipText += `${data.name}: ${data.origValue}<br/>`;
                } else {
                  tooltipText += `${data.name}(${data.code}): ${data.origValue}<br/>`;
                }
              }
              radarChartOpt.radar[0].indicator = indicator;
              radarChartOpt.tooltip.formatter = function() {
                return tooltipText;
              };
              this.teamMbs.push({
                name: item.name,
                radarChartOpt: radarChartOpt
              });
            };
            let waterMark = this.waterMark;
            setTimeout(function(){
              waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number });
            }, 0);
          }
        });
  }

  getProdctPandO(): void {
    this.bdService
        .getDataByPost(this.prodctPandOUrl, {posId: localStorage.posId})
        .then((res) => {
          this.passRateOption = this.cmnFn.deepCopy(echart.LineChartOptions, {});
          this.overdueRateOption = this.cmnFn.deepCopy(echart.LineChartOptions, {});
          let xAxisData = [];
          for (let month of res.data.months) {
            xAxisData.push(month + '月');
          }
          this.passRateOption.xAxis.data = xAxisData;
          this.overdueRateOption.xAxis.data = xAxisData;
          let legendData = [];
          for (let item of res.data.dataList){
            legendData.push(item.productName);
            this.passRateOption.series.push({
              name: item.productName,
              type: 'line',
              symbol: 'circle',
              symbolSize: 8,
              data: [item.m6PassRate, item.m5PassRate, item.m4PassRate, item.m3PassRate, item.m2PassRate, item.m1PassRate]
            });
            this.overdueRateOption.series.push({
              name: item.productName,
              type: 'line',
              symbol: 'circle',
              symbolSize: 8,
              data: [item.m6OvdRate, item.m5OvdRate, item.m4OvdRate, item.m3OvdRate, item.m2OvdRate, item.m1OvdRate]
            });
          }
          this.passRateOption.legend.data = legendData;
          this.overdueRateOption.legend.data = legendData;
        });
  }

  getProdctComposition(): void {
    this.bdService
        .getDataByPost(this.prodctCompositionUrl, {posId: localStorage.posId})
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
            // this.avgAmtOption.yAxis[0].axisLabel.formatter = function (value) {
            //     return value / 10000;
            //   };
            this.avgAmtOption.series[0].name = '件均金额';
            this.avgAmtOption.series[0].data = avgAmtArrays.map(item => (item / 10000).toFixed(2));
          }
          this.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number }, 100);
        });
  }

  changeTab(type): void {
    if (type === this.curTab) {
      return;
    }
    this.curTab = type;
    this.capacityOption = null;
    switch (type) {
      case 'human':
        this.getTmCapacity();
        this.getTmSeniority();
        this.getTmComp();
        break;
      case 'produce':
        this.getProdctPandO();
        this.getProdctComposition();
        break;
      default:
        this.getPfmcTrend();
        this.getPfmcTotal();
      }
  }
}
