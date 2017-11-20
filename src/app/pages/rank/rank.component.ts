import { Component, OnInit, AfterContentInit } from '@angular/core';

import { BackendService } from '../../core/services/backend.service';
import { WaterMarkService } from '../../core/services/watermark.service';

@Component({
  selector: 'my-rank',
  templateUrl: './rank.component.html',
  styleUrls: ['./rank.component.scss']
})
export class RankComponent implements OnInit, AfterContentInit {
  curRank = '';
  private myrankUrl = 'rankinginfo/my_rank';
  myRank = Object.assign({});
  imgClass: string;
  imgUrl: string;
  private loantoptenUrl = 'rankinginfo/loan_top_ten';
  loanTopTen = [];
  private cm2toptenUrl = 'rankinginfo/cm2_top_ten';
  cm2TopTen = [];

  constructor(
    private bdService: BackendService,
    private waterMark: WaterMarkService
  ) {
  }

  ngOnInit() {
    this.getMyRank();
  }

  ngAfterContentInit() {
    if (document.body.scrollTop > 0) {
      document.body.scrollTop = 0;
    }
  }

  getMyRank(): void {
    this.bdService
        .getDataByPost(this.myrankUrl, {posId: localStorage.posId})
        .then((res) => {
          if ( res.code === 0) {
            let resData = res.data;
            this.myRank = resData;
          };
          this.changeTab('loan');
        });
  }

  getLoanTopTen(): void {
    this.bdService
        .getAll(this.loantoptenUrl)
        .then((res) => {
          if ( res.code === 0) {
            this.loanTopTen = res.data;
          };
          let waterMark = this.waterMark;
          setTimeout(function(){
            waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number });
          }, 0);
        });
  }

  getCm2TopTen(): void {
    this.bdService
        .getAll(this.cm2toptenUrl)
        .then((res) => {
          if ( res.code === 0) {
            this.cm2TopTen = res.data;
          };
          let waterMark = this.waterMark;
          setTimeout(function(){
            waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number });
          }, 0);
        });
  }

  changeTab(type): void {
    if (type === this.curRank) {
      return;
    }
    if (type === 'loan') {
      this.getLoanTopTen();
      this.myRank.rank = this.myRank.loanRank;
    } else {
      this.getCm2TopTen();
      this.myRank.rank = this.myRank.cm2Rank;
    }
    this.curRank = type;
    if (this.myRank.rank < 4) {
      this.imgClass = 'rank-top';
      this.imgUrl = 'assets/img/top-bg.jpg';
    } else {
      this.imgClass = 'rank-other';
      this.imgUrl = 'assets/img/rank-bg.jpg';
    }
  }
}
