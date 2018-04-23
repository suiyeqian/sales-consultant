import { Component, OnInit, AfterContentInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';

import { BackendService } from '../../../core/services/backend.service';
import { WaterMarkService } from '../../../core/services/watermark.service';

import * as echart from '../../../echarts';

@Component({
  selector: 'my-track-detail',
  templateUrl: './track-detail.component.html',
  styleUrls: ['./track-detail.component.scss']
})
export class TrackdetailComponent implements OnInit, AfterContentInit {
  private saledetailUrl = 'performancetrack/sale_detail';
  dateType = this.route.snapshot.params['type'] || 'day';
  navList = [
    {name: '合同金额', code: 'htje', datas: [{idxName: '合同金额', type: 'bar'}]},
    {name: '申请单量', code: 'sqdl', datas: [{idxName: '申请单量', type: 'bar'}]},
    {name: '通过单量', code: 'tgdl', datas: [{idxName: '通过单量', type: 'bar'}]},
    {name: '拒绝单量', code: 'jjdl', datas: [{idxName: '拒绝单量', type: 'bar'}]},
    {name: '放款单量', code: 'fkdl', datas: [{idxName: '放款单量', type: 'bar'}]},
    {name: '通过率', code: 'tgl', datas: [{idxName: '通过率', type: 'bar'}]},
    {name: '合同件均', code: 'htjj', datas: [{idxName: '合同件均', type: 'bar'}]},
    {name: '批核情况', code: 'phqk', datas: [{idxName: '批核金额', type: 'bar'}, {idxName: '批核件均', type: 'line'}]},
    {name: '签约情况', code: 'qyqk', datas: [{idxName: '签约金额', type: 'bar'}, {idxName: '签约件数', type: 'line'}]},
    {name: '待签情况', code: 'dqqk', datas: [{idxName: '待签金额', type: 'bar'}, {idxName: '待签件数', type: 'line'}]},
  ];
  curIndex = this.navList[0];
  isFirstPage = true;
  curPageList = this.navList.slice(0, 5);

  chartOption: any;

  constructor(
    private bdService: BackendService,
    private route: ActivatedRoute,
    private waterMark: WaterMarkService
  ) {
    let self = this;
    window.onorientationchange = function(){
      if (window.orientation === 90 || window.orientation === -90) {
        self.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number,
          wmk_z_index: '10000003', wmk_cols: 0}, 0);
      }
    };
  }

  ngOnInit() {
    // console.log(this.route.snapshot.params['type']);
    this.getSaleDetail(this.dateType, this.curIndex.code);
    if (window.orientation === 90 || window.orientation === -90) {
      this.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number,
        wmk_z_index: '10000003'}, 0);
      // this.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).userIdentify, wmk_z_index: '10000003'}, 100);
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
            console.log(res.data);
            // this.chartOption = echart.ProgressChartOptions;
          }
        });
  }

}
