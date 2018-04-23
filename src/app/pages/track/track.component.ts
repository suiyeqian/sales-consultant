import { Component, OnInit, AfterContentInit } from '@angular/core';

import { BackendService } from '../../core/services/backend.service';
import { Router } from '@angular/router';

import * as echart from '../../echarts';

@Component({
  selector: 'my-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss']
})
export class TrackComponent implements OnInit, AfterContentInit {
  private saleachievementUrl = 'performancetrack/sale_achievement';
  achievement = Object.assign({});
  saleProgressOption: any;

  constructor(
    private bdService: BackendService,
    private router: Router
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
            this.saleProgressOption = echart.ProgressChartOptions;
            this.saleProgressOption.series[0].data[0].value = res.data.monSaleRate;
            this.saleProgressOption.series[0].data[1].value = (100 - res.data.monSaleRate < 0) ? 0 : (100 - res.data.monSaleRate);
          }
        });
  }

  goToDetail(type): void {
    console.log(type);
    this.router.navigate(['/pages/track-detail/' + type]);
  }

}
