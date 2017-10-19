import { Component, OnInit, AfterContentInit } from '@angular/core';

import { BackendService } from '../../core/services/backend.service';
import { WaterMarkService } from '../../core/services/watermark.service';

import * as echart from '../../echarts';

@Component({
  selector: 'my-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit, AfterContentInit {
  private bonustrendUrl = 'performancereview/bonus_trend';
  lineOption = {};

  constructor(
    private bdService: BackendService,
    private waterMark: WaterMarkService
  ) {
  }

  ngOnInit() {
    this.getBonusTrend();
    this.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number }, 100);
  }

  ngAfterContentInit() {
    if (document.body.scrollTop > 0) {
      document.body.scrollTop = 0;
    }
  }

  getBonusTrend(): void {
    this.bdService
        .getAll(this.bonustrendUrl)
        .then((res) => {
          if ( res.code === 0) {
            let resData = res.data;
            let xAxisData = [];
            for (let item of resData.months) {
              xAxisData.push(item + '月');
            }
            echart.LineChartOptions.xAxis.data = xAxisData;
            echart.LineChartOptions.series[0].data =
              [resData.m1Amt, resData.m2Amt, resData.m3Amt, resData.m4Amt, resData.m5Amt, resData.m6Amt].reverse();
            this.lineOption = echart.LineChartOptions;
          }
          this.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number }, 100);
        });
  }

}
