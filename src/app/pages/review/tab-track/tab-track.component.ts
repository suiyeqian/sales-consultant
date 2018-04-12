import { Component, OnInit, Input } from '@angular/core';

import { BackendService } from '../../../core/services/backend.service';
import { CommonFnService } from '../../../core/services/commonfn.service';
import * as echart from '../../../echarts';
import { WaterMarkService } from '../../../core/services/watermark.service';

@Component({
  selector: 'my-tab-track',
  templateUrl: './tab-track.component.html',
  styleUrls: ['./tab-track.component.scss']
})
export class TabTrackComponent implements OnInit {
  @Input() isActive: boolean;
  private pfmctrendUrl = 'achievementanls/month_trend';
  applyOption: any;
  loanOption: any;
  overdueOption: any;
  private pfmcTotalUrl = 'achievementanls/year_achv';
  pfmcTotal = {};

  private subNameUrl = 'achievementanls/sub_name';
  curLevel = {value: '', text: '全部'};

  constructor(
    private bdService: BackendService,
    private cmnFn: CommonFnService,
    private waterMark: WaterMarkService
  ) {
  }

  ngOnInit() {
    if (this.isActive) {
      this.getPfmcData(this.curLevel);
    }
  }

  getPfmcData(level): void {
    this.curLevel = level;
    this.bdService
        .getDataByPost(this.pfmctrendUrl, {posId: localStorage.posId, subName: level.value})
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

    this.bdService
        .getDataByPost(this.pfmcTotalUrl, {posId: localStorage.posId, subName: level.value})
        .then((res) => {
          if ( res.code === 0) {
            this.pfmcTotal = res.data;
          }
        });
  }

}
