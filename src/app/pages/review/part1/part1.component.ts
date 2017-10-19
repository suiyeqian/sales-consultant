import { Component, OnInit } from '@angular/core';

import { BackendService } from '../../../core/services/backend.service';
import * as echart from '../../../echarts';

@Component({
  selector: 'my-last-month-review',
  templateUrl: './part1.component.html',
  styleUrls: ['./part1.component.scss']
})
export class LastMonthReviewComponent implements OnInit {
  private pfmcanalysisUrl = 'performancereview/perf_anls';
  pfmcAnalysis = Object.assign({});
  private pfmctrendUrl = 'performancereview/perf_trend';
  trendOption = {};
  private pfmccompositionUrl = 'performancereview/perf_form';
  pfmcComposition = [];
  legendList = [];
  // legendColorList = ['#f3c143', '#ec7c30', '#b3b239', '#dd9261'];
  legendColorList = ['rgba(255,144,0,1)', 'rgba(254,183,5,1)', 'rgba(254,216,26,1)', '#fd6204', '#f95959', '#98d083', '#ebcbae'];
  loanOrderOption: any;
  contractValueOption: any;

  constructor(
    private bdService: BackendService
  ) {
  }

  ngOnInit() {
    this.getPfmcAnalysis();
    this.getPfmcTrend();
    this.getPfmcComposition();
  }

  getPfmcAnalysis(): void {
    this.bdService
        .getAll(this.pfmcanalysisUrl)
        .then((res) => {
          if ( res.code === 0) {
            this.pfmcAnalysis = res.data;
          }
        });
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
            echart.LineBarChartOptions.xAxis[0].data = xAxisData;
            echart.LineBarChartOptions.series[0].data =
              [resData.m1Amt, resData.m2Amt, resData.m3Amt, resData.m4Amt, resData.m5Amt, resData.m6Amt].reverse();
            echart.LineBarChartOptions.series[1].data =
              [resData.m1AppNumber, resData.m2AppNumber, resData.m3AppNumber, resData.m4AppNumber, resData.m5AppNumber,
              resData.m6AppNumber].reverse();
            echart.LineBarChartOptions.series[2].data =
              [resData.m1Number, resData.m2Number, resData.m3Number, resData.m4Number, resData.m5Number, resData.m6Number].reverse();
            this.trendOption = echart.LineBarChartOptions;
          }
        });
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
            this.pfmcComposition = res.data;
            let loanOrderChartData = [];
            let cntAmtChartData = [];
            for (let item of res.data) {
              this.legendList.push(item.prodName);
              loanOrderChartData.push({value: item.loanNum, name: item.prodName});
              cntAmtChartData.push({value: item.cntAmt, name: item.prodName});
            }
            this.loanOrderOption = deepCopy(commonOption, {});
            this.loanOrderOption.series[0].data = loanOrderChartData;
            this.contractValueOption = deepCopy(commonOption, {});
            this.contractValueOption.series[0].data = cntAmtChartData;
          }
        });
  }
}
