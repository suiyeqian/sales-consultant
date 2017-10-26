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
  curTab = 'track';
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
            let seriesData = [];
            for (let item of resData) {
              xAxisData.push(item.month + '月');
              seriesData.push(+item.amt);
            }
            echart.LineChartOptions.xAxis.data = xAxisData;
            echart.LineChartOptions.series[0].data = seriesData;
            this.lineOption = echart.LineChartOptions;
          }
          this.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number }, 100);
        });
  }

  changeTab(type): void {
    if (type === this.curTab) {
      return;
    }
    this.curTab = type;
    this.getBonusTrend();
  }

}
