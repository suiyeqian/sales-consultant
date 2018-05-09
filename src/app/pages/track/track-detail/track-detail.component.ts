import { Component, OnInit, AfterContentInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';

import { BackendService } from '../../../core/services/backend.service';
import { WaterMarkService } from '../../../core/services/watermark.service';
import { CommonFnService } from '../../../core/services/commonfn.service';
import * as echart from '../../../echarts';
import { NavList } from './constant';

@Component({
  selector: 'my-track-detail',
  templateUrl: './track-detail.component.html',
  styleUrls: ['./track-detail.component.scss']
})
export class TrackdetailComponent implements OnInit, AfterContentInit {
  private saledetailUrl = 'performancetrack/sale_detail';
  dateType = this.route.snapshot.params['type'] || 'day';
  navList = NavList;
  curIndex = this.navList[0];
  isFirstPage = true;
  curPageList = this.navList.slice(0, 5);

  chartOption: any;

  constructor(
    private bdService: BackendService,
    private route: ActivatedRoute,
    private waterMark: WaterMarkService,
    private cmnFn: CommonFnService
  ) {
    let self = this;
    window.onorientationchange = () => {
      if (window.orientation === 90 || window.orientation === -90) {
        this.getSaleDetail(this.dateType, this.curIndex.code);
        this.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number,
          wmk_z_index: '10000003'}, 0);
      }
    };
  }

  ngOnInit() {
    if (window.orientation === 90 || window.orientation === -90) {
      this.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number,
        wmk_z_index: '10000003'}, 0);
      this.getSaleDetail(this.dateType, this.curIndex.code);
    }
  }

  ngAfterContentInit() {
    if (document.body.scrollTop > 0) {
      document.body.scrollTop = 0;
    }
  }

  nextPage(): void {
    this.isFirstPage = !this.isFirstPage;
    if (this.isFirstPage) {
      this.curPageList = this.navList.slice(0, 5);
    } else {
      this.curPageList = this.navList.slice(5);
    }
    this.switchIndex(this.curPageList[0]);
  }

  switchIndex(item): void {
    this.curIndex = item;
    this.getSaleDetail(this.dateType, item.code);
  }

  getSaleDetail(dateType, index): void {
    this.bdService
        .getDataByPost(this.saledetailUrl, {posId: localStorage.posId, dateType: dateType, index: index})
        .then((res) => {
          if ( res.code === 0) {
            let legends = [];
            if (this.curIndex.datas.length === 1) {
              this.chartOption = this.cmnFn.deepCopy(echart.BarChartOptions, {});
              this.chartOption.yAxis[0].name = `单位(${this.curIndex.datas[0].unit})`;
            } else {
              this.chartOption = this.cmnFn.deepCopy(echart.LineBarChartOptions, {});
              this.chartOption.series.splice(1, 1);
              this.chartOption.legend.data = legends;
              this.chartOption.yAxis[0].name = `单位(${this.curIndex.datas[0].unit})`;
              this.chartOption.yAxis[1].name = `单位(${this.curIndex.datas[1].unit})`;
            }
            this.curIndex.datas.map((dataItem, idx) => {
              dataItem.value = res.data[dataItem.type];
              legends.push(dataItem.idxName);
              this.chartOption.series[idx].data = res.data.yAxis[dataItem.type];
              this.chartOption.series[idx].name = dataItem.idxName;
            });
            this.chartOption.grid = {
              left: '5%',
              right: '5%',
              top: '12%',
              bottom: '11%',
              containLabel: true
            };
            this.chartOption.xAxis[0].data = res.data.xAxis;
          }
        });
  }

}
