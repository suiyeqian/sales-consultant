import { Component, OnInit } from '@angular/core';

import { BackendService } from '../../../core/services/backend.service';
import * as echart from '../../../echarts';

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

  constructor(
    private bdService: BackendService
  ) {
  }

  ngOnInit() {
    this.getRiskcontrol();
  }

  getRiskcontrol(): void {
    this.bdService
        .getAll(this.riskcontrolUrl)
        .then((res) => {
          // if ( res.code === 0) {
            let commonOption = echart.GaugeChartOptions;
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
            // let resData = res.data;
            //
            let resData = Object.assign({});
            resData.overDueNumber = 18;
            resData.loanNumber = 100;
            resData.overDueAmt = 18000;
            resData.loanAmt = 100000;
            resData.cAmt = 100;
            resData.m2Amt = 1.8;

            this.riskControl = resData;
            this.cm2 = resData.cAmt > 0 ? resData.m2Amt / resData.cAmt * 100 : 0;
            this.riskControlOption1 = deepCopy(commonOption, {});
            this.riskControlOption1.series[0].axisLine.lineStyle.color[0][1] = '#d74b49';
            this.riskControlOption1.series[0].axisLine.lineStyle.color[0][0] =
              +resData.loanAmt ? (resData.overDueAmt / resData.loanAmt) : 0;
            this.riskControlOption1.series[0].data[0].value =
              +resData.loanAmt ? (resData.overDueAmt * 100 / resData.loanAmt).toFixed(2) : 0;
            this.riskControlOption2 = deepCopy(commonOption, {});
            this.riskControlOption2.series[0].axisLine.lineStyle.color[0][0] =
              +resData.loanNumber ? (resData.overDueNumber / resData.loanNumber) : 0;
            this.riskControlOption2.series[0].data[0].value =
              +resData.loanNumber ? (resData.overDueNumber * 100 / resData.loanNumber).toFixed(2) : 0;
          // }
        });
  }
}
