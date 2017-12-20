import { Component, OnInit, AfterContentInit } from '@angular/core';

import { BackendService } from '../../core/services/backend.service';

import * as echart from '../../echarts';

@Component({
  selector: 'my-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss']
})
export class TrackComponent implements OnInit, AfterContentInit {
  private saleachievementUrl = 'performancetrack/sale_achievement';
  achievement = Object.assign({});
  saleProgressOption = {};

  constructor(
    private bdService: BackendService
  ) {
  }

  ngOnInit() {
    this.getSaleAchievement();
  }


  ngAfterContentInit() {
    if (document.body.scrollTop > 0) {
      document.body.scrollTop = 0;
    }
  }

  getSaleAchievement(): void {
    this.bdService
        .getDataByPost(this.saleachievementUrl, {posId: localStorage.posId})
        .then((res) => {
          if ( res.code === 0) {
            this.achievement = res.data;
            echart.ProgressChartOptions.series[0].data[0].value = res.data.monSaleRate;
            echart.ProgressChartOptions.series[0].data[0].itemStyle.normal.color =
              res.data.monSaleRate < res.data.dateRate ? '#d74b49' : '#05e8e9';
            echart.ProgressChartOptions.series[0].data[0].itemStyle.normal.label.textStyle.color =
              res.data.monSaleRate < res.data.dateRate ? '#d74b49' : '#05e8e9';
            echart.ProgressChartOptions.series[0].data[1].value = (100 - res.data.monSaleRate < 0) ? 0 : (100 - res.data.monSaleRate);
            this.saleProgressOption = echart.ProgressChartOptions;
          }
        });
  }

}
