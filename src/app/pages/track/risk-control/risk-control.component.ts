import { Component, OnInit } from '@angular/core';

import { BackendService } from '../../../core/services/backend.service';
import { CommonFnService } from '../../../core/services/commonfn.service';
import * as echart from '../../../echarts';
import { WaterMarkService } from '../../../core/services/watermark.service';

@Component({
  selector: 'my-risk-control',
  templateUrl: './risk-control.component.html',
  styleUrls: ['./risk-control.component.scss']
})
export class RiskControlComponent implements OnInit {
  private riskcontrolUrl = 'performancetrack/risk_management';
  riskControl = Object.assign({});
  riskControlOption1: any;
  riskControlOption2: any;
  cm2: number;
  private mbRiskUrl = 'performancetrack/member_risk';
  mbsRisk = [];
  hasOther = false;
  posId = localStorage.posId;

  constructor(
    private bdService: BackendService,
    private cmnFn: CommonFnService,
    private waterMark: WaterMarkService
  ) {
  }

  ngOnInit() {
    this.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number });
    this.getRiskcontrol();
    this.getMbRisk();
  }

  getRiskcontrol(): void {
    this.bdService
        .getDataByPost(this.riskcontrolUrl, {posId: this.posId})
        .then((res) => {
          if ( res.code === 0) {
            let commonOption = echart.GaugeChartOptions;
            let resData = res.data;
            this.riskControl = resData;
            this.cm2 = resData.cAmt > 0 ? resData.m2Amt / resData.cAmt * 100 : 0;
            this.riskControlOption1 = this.cmnFn.deepCopy(commonOption, {});
            this.riskControlOption1.series[0].axisLine.lineStyle.color[0][1] = '#d74b49';
            this.riskControlOption1.series[0].axisLine.lineStyle.color[0][0] =
              +resData.loanAmt ? (resData.overDueAmt / resData.loanAmt) : 0;
            this.riskControlOption1.series[0].data[0].value =
              +resData.loanAmt ? (resData.overDueAmt * 100 / resData.loanAmt).toFixed(2) : 0;
            this.riskControlOption2 = this.cmnFn.deepCopy(commonOption, {});
            this.riskControlOption2.series[0].axisLine.lineStyle.color[0][0] =
              +resData.loanNumber ? (resData.overDueNumber / resData.loanNumber) : 0;
            this.riskControlOption2.series[0].data[0].value =
              +resData.loanNumber ? (resData.overDueNumber * 100 / resData.loanNumber).toFixed(2) : 0;
          }
        });
  }

  getMbRisk(): void {
    this.bdService
        .getDataByPost(this.mbRiskUrl, {posId: this.posId})
        .then((res) => {
          if ( res.code === 0) {
            this.mbsRisk = res.data;
            this.hasOther = res.data.findIndex((item) => item.name === '其他') !== -1;
          }
          let waterMark = this.waterMark;
          setTimeout(function(){
            waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number });
          }, 0);
        });
  }
}
