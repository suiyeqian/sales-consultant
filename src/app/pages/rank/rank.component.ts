import { Component, OnInit, AfterContentInit } from '@angular/core';

import { BackendService } from '../../core/services/backend.service';
import { WaterMarkService } from '../../core/services/watermark.service';

@Component({
  selector: 'my-rank',
  templateUrl: './rank.component.html',
  styleUrls: ['./rank.component.scss']
})
export class RankComponent implements OnInit, AfterContentInit {
  private myrankUrl = 'rankinginfo/my_rank';
  myRank = Object.assign({});
  imgClass: string;
  imgUrl: string;
  private toptenUrl = 'rankinginfo/top_ten';
  topTen = [];

  constructor(
    private bdService: BackendService,
    private waterMark: WaterMarkService
  ) {
  }

  ngOnInit() {
    this.getMyRank();
    this.getTopTen();
  }

  ngAfterContentInit() {
    if (document.body.scrollTop > 0) {
      document.body.scrollTop = 0;
    }
  }

  getMyRank(): void {
    this.bdService
        .getAll(this.myrankUrl)
        .then((res) => {
          if ( res.code === 0) {
            let resData = res.data;
            // let resData = {rank: 24, percent: 98};
            this.myRank = resData;
            if (resData.rank < 4) {
              this.imgClass = 'rank-top';
              this.imgUrl = '/assets/img/rank' + resData.rank + '.png';
            } else {
              if (resData.percent >= 90) {
                this.imgClass = 'rank-per-10';
                this.imgUrl = '/assets/img/rank-per-10.png';
              } else {
                this.imgClass = 'rank-other';
                this.imgUrl = '/assets/img/rank-other.png';
              }
            }
          };
        });
  }

  getTopTen(): void {
    this.bdService
        .getAll(this.toptenUrl)
        .then((res) => {
          if ( res.code === 0) {
            this.topTen = res.data;
          };
          this.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number }, 160);
        });
  }
}
