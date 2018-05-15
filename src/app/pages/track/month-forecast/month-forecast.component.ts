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
  // private positionPoint = [3.8, 15.3, 27, 38.5, 50, 61.6, 73.2, 85]; //8列
  private positionPoint7 = [3.8, 17, 30, 43, 57, 70, 83.1]; //7列
  private positionPoint6 = [3.7, 13.4, 25.7, 39.7, 55.7, 74.3]; //6列
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

  constructor( private bdService: BackendService) {}

  ngOnInit() {
    this.getAchieveForecast();
    if (this.myPosId === '2') {
      this.getRiskCoff();
    }
  }

  getAchieveForecast(): void {
    this.bdService
        .getDataByPost(this.achieveforecastUrl, {posId: this.myPosId})
        .then((res) => {
          if ( res.code === 0) {
            let resData = res.data;
            // 计算提成系数和位置及预计奖金
            // resData.expectAmt = 50000;
            let expectAmt = this.myPosId === '2' ? (resData.expectAmt / 10000) : resData.totalScore;
            let posiArr = this.myPosId === '2' ?  this.positionPoint6 : this.positionPoint7;
            [resData.coefficient, this.myPctPosition] =
              this.getCoffAndPos(resData.sections, resData.coefficients, expectAmt, posiArr);
            resData.royaltyAmt = this.myPosId === '2' ?
              resData.expectAmt * resData.coefficient / 100 : resData.cardinality * resData.coefficient;
            // 计算已完成的提成系数的位置及已完成奖金
            if (this.myPosId === '2') {
              let cmpeAmt = resData.cmpeAmt / 10000;
              [resData.realCoefficient, this.myRealPctPosition] =
                this.getCoffAndPos(resData.sections, resData.coefficients, cmpeAmt, this.positionPoint6);
              resData.cmpeBonus = resData.cmpeAmt * resData.realCoefficient / 100;
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
            resData.coefficients = [...resData.coefficients, 0];
            [resData.coefficient, this.myRskCfPosition] =
              this.getCoffAndPos(resData.sections, resData.coefficients, resData.cm2Rate, this.positionPoint6);
            resData.ctrlAwd = +resData.cardinality * resData.coefficient;
            this.riskCoff = resData;
          }
        });
  }

  getCoffAndPos( sectionArr, coffArr, slideNum = 0, posiArr): Array<any> {
    let coefficient, position;
    if (!sectionArr || !coffArr) {
      return [0, posiArr[0]];
    }
    for (let i = sectionArr.length - 1; i >= 0; i--) {
      if (+slideNum === +sectionArr[i]) {
        position = posiArr[i] + '%';
        coefficient = coffArr[i];
        break;
      }
      if (+slideNum > +sectionArr[i]) {
        coefficient = coffArr[i];
        if (i === sectionArr.length - 1) {
          position = 5 + sectionArr[i] + '%';
          break;
        }
        let interval_n = +sectionArr[i + 1] - sectionArr[i];
        let interval_p = +posiArr[i + 1] - posiArr[i];
        position = +posiArr[i] + (slideNum - sectionArr[i]) * interval_p / interval_n + '%';
        break;
      }
    }
    return [coefficient, position];
  }
}
