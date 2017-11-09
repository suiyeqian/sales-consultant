import { Component, OnInit, Input } from '@angular/core';

import { BackendService } from '../../../core/services/backend.service';

@Component({
  selector: 'my-month-forecast',
  templateUrl: './month-forecast.component.html',
  styleUrls: ['./month-forecast.component.scss']
})
export class MonthForecastComponent implements OnInit {
  myPosId = localStorage.posId;
  private achieveforecastUrl = 'performancetrack/achievement_forecast';
  achieveforecast = Object.assign({});
  private positionPoint = [3.6, 14.4, 28.6, 45.5, 65.2];
  myPctPosition: string;
  myRealPctPosition: string;
  bonusShow = false;
  awardShow = false;
  private riskCoffUrl = 'performancetrack/risk_coff';
  riskCoff = Object.assign({});
  myRskCfPosition: string;
  ctrlAwdShow = false;
  bonusSumShow = false;
  @Input() timeProgress: number;

  constructor(
    private bdService: BackendService
  ) {
  }

  ngOnInit() {
    this.getAchieveForecast();
    if (this.myPosId === '2') {
      this.getRiskCoff();
    }
  }

  getAchieveForecast(): void {
    this.bdService
        .getDataByPost(this.achieveforecastUrl, {posId: localStorage.posId})
        .then((res) => {
          if ( res.code === 0) {
            let resData = res.data;
            // 计算提成系数和位置及预计奖金
            let expectAmt = resData.expectAmt / 10000;
            for (let i = resData.sections.length - 1; i >= 0; i--) {
              if (+expectAmt === +resData.sections[i]) {
                this.myPctPosition = this.positionPoint[i] + '%';
                resData.coefficient = resData.coefficients[i];
                resData.royaltyAmt = resData.expectAmt * resData.coefficient / 100;
                break;
              }
              if (+expectAmt > +resData.sections[i]) {
                resData.coefficient = resData.coefficients[i];
                resData.royaltyAmt = resData.expectAmt * resData.coefficient / 100;
                if (i === resData.sections.length - 1) {
                  this.myPctPosition = '76%';
                  break;
                }
                let interval_n = +resData.sections[i + 1] - resData.sections[i];
                let interval_p = +this.positionPoint[i + 1] - this.positionPoint[i];
                this.myPctPosition = +this.positionPoint[i] + (expectAmt - resData.sections[i]) * interval_p / interval_n + '%';
                break;
              }
            }
            // 计算已完成的提成系数的位置及已完成奖金
            let cmpeAmt = resData.cmpeAmt / 10000;
            for (let i = resData.sections.length - 1; i >= 0; i--) {
              if (+cmpeAmt === +resData.sections[i]) {
                this.myRealPctPosition = this.positionPoint[i] + '%';
                resData.cmpeBonus = resData.cmpeAmt * resData.coefficients[i] / 100;
                break;
              }
              if (+cmpeAmt > +resData.sections[i]) {
                resData.cmpeBonus = resData.cmpeAmt * resData.coefficients[i] / 100;
                if (i === resData.sections.length - 1) {
                  this.myRealPctPosition = '71%';
                  break;
                }
                let interval_n = +resData.sections[i + 1] - resData.sections[i];
                let interval_p = +this.positionPoint[i + 1] - this.positionPoint[i];
                this.myRealPctPosition = +this.positionPoint[i] + (cmpeAmt - resData.sections[i]) * interval_p / interval_n + '%';
                break;
              }
            }
            this.achieveforecast = resData;
          }
        });
  }

  getRiskCoff(): void {
    this.bdService
        .getAll(this.riskCoffUrl)
        .then((res) => {
          if ( res.code === 0) {
            let resData = res.data;
            resData.sections = [0, ...resData.sections];
            // 计算提成系数和位置及预计奖金
            for (let i = resData.sections.length - 1; i >= 0; i--) {
              if (+resData.cm2Rate === +resData.sections[i]) {
                this.myRskCfPosition = this.positionPoint[i] + '%';
                resData.coefficient = resData.coefficients[i];
                resData.ctrlAwd = +resData.cardinality * resData.coefficient;
                break;
              }
              if (+resData.cm2Rate > +resData.sections[i]) {
                resData.coefficient = resData.coefficients[i];
                resData.ctrlAwd = +resData.cardinality * resData.coefficient;
                if (i === resData.sections.length - 1) {
                  this.myRskCfPosition = '76%';
                  break;
                }
                let interval_n = +resData.sections[i + 1] - resData.sections[i];
                let interval_p = +this.positionPoint[i + 1] - this.positionPoint[i];
                this.myRskCfPosition = +this.positionPoint[i] + (resData.cm2Rate - resData.sections[i]) * interval_p / interval_n + '%';
                break;
              }
            }
            this.riskCoff = resData;
          }
        });
  }

}
