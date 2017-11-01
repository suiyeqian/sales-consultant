import { Component, OnInit, Input } from '@angular/core';

import { BackendService } from '../../../core/services/backend.service';
import * as echart from '../../../echarts';

@Component({
  selector: 'my-month-performance',
  templateUrl: './month-performance.component.html',
  styleUrls: ['./month-performance.component.scss']
})
export class MonthPerformanceComponent implements OnInit {
  private mbScheduleUrl = 'performancetrack/member_schedule';
  mbsPerformance = [];
  private weeklytrendUrl = 'performancetrack/weekly_trend';
  trendOption = Object.assign({});
  @Input() timeProgress: number;

  constructor(
    private bdService: BackendService
  ) {
  }

  ngOnInit() {
    this.getMbSchedule();
    this.getWeeklyTrend();
  }

  getMbSchedule(): void {
    this.bdService
        .getDataByPost(this.mbScheduleUrl, {posId: localStorage.posId})
        .then((res) => {
          if ( res.code === 0) {
            this.mbsPerformance = res.data;
          }
        });
  }

  getWeeklyTrend(): void {
    this.bdService
        .getDataByPost(this.weeklytrendUrl, {posId: localStorage.posId})
        .then((res) => {
          if ( res.code === 0) {
            let resData = res.data;
            echart.LineBarChartOptions.xAxis[0].data = ['W1', 'W2', 'W3', 'W4', 'W5'];
            echart.LineBarChartOptions.series[0].data =
              [resData.w1AppNumber, resData.w2AppNumber, resData.w3AppNumber, resData.w4AppNumber, resData.w5AppNumber].reverse();
            echart.LineBarChartOptions.series[1].data =
              [resData.w1Number, resData.w2Number, resData.w3Number, resData.w4Number, resData.w5Number].reverse();
            echart.LineBarChartOptions.series[2].data =
              [resData.w1Amt, resData.w2Amt, resData.w3Amt, resData.w4Amt, resData.w5Amt].reverse();
            this.trendOption = echart.LineBarChartOptions;
          }
        });
  }

}
