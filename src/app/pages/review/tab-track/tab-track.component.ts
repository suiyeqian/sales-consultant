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
  private pfmctrendUrl = 'achievementanls/achievement';
  applyOption: any;
  applyArr = [];
  loanOption: any;
  loanArr = [];
  overdueOption: any;
  // private pfmcTotalUrl = 'achievementanls/year_achv';
  subNameUrl = 'achievementanls/sub_name';
  applyLevel = {value: '', text: '全部'};
  loanLevel = {value: '', text: '全部'};
  overdueLevel = {value: '', text: '全部'};

  constructor(
    private bdService: BackendService,
    private cmnFn: CommonFnService,
    private waterMark: WaterMarkService
  ) {
  }

  ngOnInit() {
    if (this.isActive) {
      this.getSqqkData(this.applyLevel);
      this.getFkqkData(this.loanLevel);
      this.getYqqkData(this.overdueLevel);
    }
  }
  // 申请情况
  getSqqkData(level): void {
    this.applyLevel = level;
    this.bdService
        .getDataByPost(this.pfmctrendUrl, {posId: localStorage.posId, subName: level.value, type: 'sqqk'})
        .then((res) => {
          if ( res.code === 0) {
            let resData = res.data;
            this.applyArr = resData.totAchv;
            this.applyOption = this.cmnFn.deepCopy(echart.LineBarChartOptions, {});
            this.applyOption.series.splice(1, 1);
            this.applyOption.xAxis[0].data = resData.xAxis;
            this.applyOption.legend.data = ['申请单量', '通过率'];
            this.applyOption.series[0].data = resData.yAxis.cntList;
            this.applyOption.series[1].name = '通过率';
            this.applyOption.yAxis[1].axisLabel.formatter = '{value} %';
            this.applyOption.yAxis[1].name = null;
            this.applyOption.series[1].data = resData.yAxis.rateList;
            // this.applyOption.tooltip.formatter = function(params) {
            //   let relVal = params[0].name;
            //   for (let i = 0, l = params.length; i < l; i++) {
            //     relVal += `<br/>
            //                <span style="display:inline-block;margin-right:5px;border-radius:50%;width:9px;height:9px;
            //                background-color:${params[i].color}"></span>
            //                ${params[i].seriesName} : ${params[i].value}`;
            //     if (params[i].seriesName === '通过率') {
            //       relVal += '%';
            //     }
            //    }
            //   return relVal;
            // };
          }
          this.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number });
        });

    // this.bdService
    //     .getDataByPost(this.pfmcTotalUrl, {posId: localStorage.posId, subName: level.value})
    //     .then((res) => {
    //       if ( res.code === 0) {
    //         this.pfmcTotal = res.data;
    //       }
    //     });
  }
// 放款情况
  getFkqkData(level): void {
    this.loanLevel = level;
    this.bdService
        .getDataByPost(this.pfmctrendUrl, {posId: localStorage.posId, subName: level.value, type: 'fkqk'})
        .then((res) => {
          if ( res.code === 0) {
            let resData = res.data;
            this.loanArr = resData.totAchv;
            this.loanOption = this.cmnFn.deepCopy(echart.LineBarChartOptions, {});
            this.loanOption.series.splice(0, 1);
            this.loanOption.xAxis[0].data = resData.xAxis;
            this.loanOption.legend.data = ['放款单量', '放款金额'];
            this.loanOption.series[0].data = resData.yAxis.cntList;
            this.loanOption.series[1].name = '放款金额';
            this.loanOption.series[1].data = resData.yAxis.amtList.map(item => (item / 10000).toFixed(2));
          }
          this.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number });
        });
  }
// 逾期情况
    getYqqkData(level): void {
      this.overdueLevel = level;
      this.bdService
          .getDataByPost(this.pfmctrendUrl, {posId: localStorage.posId, subName: level.value, type: 'yqqk'})
          .then((res) => {
            if ( res.code === 0) {
              let resData = res.data;
              let xAxisData = [];
              // 逾期情况
              this.overdueOption = this.cmnFn.deepCopy(echart.LineBarChartOptions, {});
              this.overdueOption.series.splice(1, 1);
              this.overdueOption.xAxis[0].data = resData.xAxis;
              this.overdueOption.legend.data = ['逾期单量', '逾期金额'];
              this.overdueOption.series[0].name = '逾期单量';
              this.overdueOption.series[0].itemStyle.normal.color = '#4993d8';
              this.overdueOption.series[0].data = resData.yAxis.cntList;
              this.overdueOption.series[1].name = '逾期金额';
              this.overdueOption.series[1].data = resData.yAxis.amtList.map(item => (item / 10000).toFixed(2));
            }
          });
    }

}
