import { Component, OnInit, AfterContentInit } from '@angular/core';

import { BackendService } from '../../core/services/backend.service';
import { WaterMarkService } from '../../core/services/watermark.service';

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
  private performancetrackUrl = 'performancetrack/app_track';
  private overdueremindUrl = 'performancetrack/over_remind';
  pageLength = 5;
  performancetracks: Array<any>;
  displayPerformance = [];
  pfmtckPages = [];
  pfmtckCurPage = 1;
  overduereminds: Array<any>;
  displayOverdue = [];
  overduermdPages = [];
  overduermdCurPage = 1;
  private custBdUrl = 'performancetrack/cust_bd_remind';
  custBdReminds = [];

  constructor(
    private bdService: BackendService,
    private waterMark: WaterMarkService
  ) {
  }

  ngOnInit() {
    this.getSaleAchievement();
    this.getPerformanceTrack();
    this.getOverdueRemind();
    this.getCustBd();
  }


  ngAfterContentInit() {
    if (document.body.scrollTop > 0) {
      document.body.scrollTop = 0;
    }
  }

  getSaleAchievement(): void {
    this.bdService
        .getAll(this.saleachievementUrl)
        .then((res) => {
          if ( res.code === 0) {
            this.achievement = res.data;
            echart.ProgressChartOptions.series[0].data[0].value = res.data.monSaleRate;
            echart.ProgressChartOptions.series[0].data[1].value = (100 - res.data.monSaleRate < 0) ? 0 : (100 - res.data.monSaleRate);
            this.saleProgressOption = echart.ProgressChartOptions;
          }
        });
  }

  getPerformanceTrack(): void {
    this.bdService
        .getAll(this.performancetrackUrl)
        .then((res) => {
          if ( res.code === 0) {
            this.performancetracks = res.data;
            let pageNum = Math.ceil( this.performancetracks.length / this.pageLength);
            for (let i = 0; i < pageNum; i ++) {
              this.pfmtckPages.push(i);
            }
            this.displayPerformance =
            this.performancetracks.slice(this.pageLength * (this.pfmtckCurPage - 1), this.pageLength * this.pfmtckCurPage);
          }
        });
  }

  getOverdueRemind(): void {
    this.bdService
        .getAll(this.overdueremindUrl)
        .then((res) => {
          if ( res.code === 0) {
            this.overduereminds = res.data;
            let pageNum = Math.ceil( this.overduereminds.length / this.pageLength);
            for (let i = 0; i < pageNum; i ++) {
              this.overduermdPages.push(i);
            }
            this.displayOverdue =
            this.overduereminds.slice(this.pageLength * (this.overduermdCurPage - 1), this.pageLength * this.overduermdCurPage);
          }
          // console.log(JSON.parse(localStorage.user))
          this.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number }, 230);
        });
  }

  getCustBd(): void {
    this.bdService
        .getAll(this.custBdUrl)
        .then((res) => {
          if ( res.code === 0) {
            this.custBdReminds = res.data;
          }
        });
  }

  // 表格翻页处理
  swipe(currentIndex: number, action = 'swipeleft', target: string) {
        if (action === 'swiperight') {
          if (currentIndex - 1 < 1) { return; }
          if (target === 'performancetrack') {
            this.pfmtckCurPage = currentIndex - 1;
          } else if (target === 'overdueremind') {
            this.overduermdCurPage = currentIndex - 1;
          }
        }
        if (action === 'swipeleft') {
          if (target === 'performancetrack') {
            if (currentIndex + 1 > this.pfmtckPages.length) { return; }
            this.pfmtckCurPage = currentIndex + 1;
          } else if (target === 'overdueremind') {
            if (currentIndex + 1 > this.overduermdPages.length) { return; }
            this.overduermdCurPage = currentIndex + 1;
          }
        }

        if (target === 'performancetrack') {
          // 申请追踪单当前页
          this.displayPerformance =
          this.performancetracks.slice(this.pageLength * (this.pfmtckCurPage - 1), this.pageLength * this.pfmtckCurPage);
        } else {
          // 逾期提醒当前页
          this.displayOverdue =
          this.overduereminds.slice(this.pageLength * (this.overduermdCurPage - 1), this.pageLength * this.overduermdCurPage);
        }
    }

}
