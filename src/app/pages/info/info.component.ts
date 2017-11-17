import { Component, OnInit, AfterContentInit } from '@angular/core';

import { BackendService } from '../../core/services/backend.service';
import { WaterMarkService } from '../../core/services/watermark.service';
import { CommonFnService } from '../../core/services/commonfn.service';

import * as echart from '../../echarts';

@Component({
  selector: 'my-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit, AfterContentInit {
  myInfo = Object.assign({});
  private userUrl = 'personalinfo/my_info';
  private mycompUrl = 'personalinfo/my_comp';
  radarOption: any;
  private growthtrackUrl = 'personalinfo/growth_track';
  growthTrack = [];

  constructor(
    private bdService: BackendService,
    private waterMark: WaterMarkService,
    private cmnFn: CommonFnService
  ) {
  }

  ngOnInit() {
    this.getInfo();
    this.getMyComp();
    this.getGrowthTrack();
    this.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number });
  }

  ngAfterContentInit() {
    if (document.body.scrollTop > 0) {
      document.body.scrollTop = 0;
    }
  }

  getInfo(): void {
    this.setMyInfo();
    this.bdService
    .getAll(this.userUrl)
    .then(res => {
      if ( res.code === 0 && res.data) {
        localStorage.setItem('user', JSON.stringify(res.data));
        this.setMyInfo();
      }
    });
  }

  setMyInfo(): void {
    let userInfo = JSON.parse(localStorage.user);
    if (userInfo.sex === '男') {
      userInfo.avatarUrl = 'assets/img/man.png';
    } else {
      userInfo.avatarUrl = 'assets/img/woman.png';
    }
    this.myInfo = userInfo;
  }

  getMyComp(): void {
    this.bdService
        .getDataByPost(this.mycompUrl, {posId: localStorage.posId})
        .then((res) => {
          if ( res.code === 0) {
            let resData = res.data, indicator = [], dataVals = [];
            for (let item of resData) {
              indicator.push({text: item.name, max: 5});
              dataVals.push(item.value);
            }
            this.radarOption = this.cmnFn.deepCopy(echart.RadarChartOptions, {});
            this.radarOption.radar[0].indicator = indicator;
            this.radarOption.series[0].data[0].value = dataVals;
            this.radarOption.tooltip.formatter = function(value) {
              let text = '';
              for (let item of resData) {
                text += item.name + ': ' + item.origValue + '<br/>';
              }
              return text;
            };
          }
        });
  }

  getGrowthTrack(): void {
    this.bdService
        .getAll(this.growthtrackUrl)
        .then((res) => {
          if ( res.code === 0) {
            let resData = res.data;
            this.growthTrack = resData;
          }
          let waterMark = this.waterMark;
          setTimeout(function(){
            waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number });
          }, 0);
        });
  }

}
