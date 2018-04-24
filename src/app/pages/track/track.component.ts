import { Component, OnInit, AfterContentInit } from '@angular/core';

import { BackendService } from '../../core/services/backend.service';
import { WaterMarkService } from '../../core/services/watermark.service';
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
    private router: Router,
    private waterMark: WaterMarkService
  ) {
    window.onorientationchange = () => {
      this.backToTop();
      setTimeout(() => {
        this.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).userIdentify}, 0);
      }, 800);
    };
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
    this.router.navigate(['/pages/track-detail/' + type]);
  }

  backToTop(): void {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop > 0) {
      window.requestAnimationFrame(this.backToTop);
      window.scrollTo(0, 0);
    }
  }

}
