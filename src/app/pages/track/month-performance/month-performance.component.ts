import { Component, OnInit, Input } from '@angular/core';

import { BackendService } from '../../../core/services/backend.service';
import { CommonFnService } from '../../../core/services/commonfn.service';
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
  trendOption: any;
  hasOther = false;
  @Input() timeProgress: number;

  private subNameUrl = 'performancetrack/sub_name';
  curLevel = {value: '', text: '全部'};

  constructor(
    private bdService: BackendService,
    private cmnFn: CommonFnService
  ) {
  }

  ngOnInit() {
    this.getMbSchedule();
    this.getWeeklyTrend(this.curLevel);
  }

  getMbSchedule(): void {
    this.bdService
        .getDataByPost(this.mbScheduleUrl, {posId: localStorage.posId})
        .then((res) => {
          if ( res.code === 0) {
            let idx = res.data.findIndex((item) => {
              return item.name === '其他' && item.amt === 0;
            });
            this.hasOther = res.data.findIndex((item) => item.name === '其他' && item.amt > 0) !== -1;
            this.mbsPerformance = res.data;
            if (idx !== -1) {
              this.mbsPerformance.splice(idx, 1);
            }
          }
        });
  }

  getWeeklyTrend(level): void {
    this.curLevel = level;
    this.bdService
        .getDataByPost(this.weeklytrendUrl, {posId: localStorage.posId, subName: level.value})
        .then((res) => {
          if ( res.code === 0) {
            let resData = res.data;
            this.trendOption = this.cmnFn.deepCopy(echart.LineBarChartOptions, {});
            this.trendOption.xAxis[0].data = ['W1', 'W2', 'W3', 'W4', 'W5'];
            this.trendOption.series[0].data =
              [resData.w1AppNumber, resData.w2AppNumber, resData.w3AppNumber, resData.w4AppNumber, resData.w5AppNumber].reverse();
            this.trendOption.series[1].data =
              [resData.w1Number, resData.w2Number, resData.w3Number, resData.w4Number, resData.w5Number].reverse();
            this.trendOption.series[2].data =
              [resData.w1Amt, resData.w2Amt, resData.w3Amt, resData.w4Amt, resData.w5Amt].reverse();
          }
        });
  }

}
