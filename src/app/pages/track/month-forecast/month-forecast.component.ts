import { Component, OnInit, Input } from '@angular/core';

import { BackendService } from '../../../core/services/backend.service';

@Component({
  selector: 'my-month-forecast',
  templateUrl: './month-forecast.component.html',
  styleUrls: ['./month-forecast.component.scss']
})
export class MonthForecastComponent implements OnInit {
  private achieveforecastUrl = 'performancetrack/achievement_forecast';
  achieveforecast = Object.assign({});
  private positionPoint = [3.6, 14.4, 28.6, 45.5, 65.2];
  myPctPosition: string;
  myRealPctPosition: string;
  bonusShow = false;
  awardShow = false;
  @Input() timeProgress: number;

  constructor(
    private bdService: BackendService
  ) {
  }

  ngOnInit() {
    this.getAchieveForecast();
  }

  getAchieveForecast(): void {
    this.bdService
        .getAll(this.achieveforecastUrl)
        .then((res) => {
          // if ( res.code === 0) {
            // let resData = res.data;
            let resData = {
              goalAmt: 50000,
              expectAmt: 0,
              completionRate: 10,
              sections: [0, 5, 15, 30, 45],
              coefficients: [1.0, 2.3, 3.1, 3.4, 4.0],
              coefficient: 1.0,
              royaltyAmt: 0,
              cmpeAmt: 29800,
              cmpeBonus: 0
            };
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
          // }
        });
  }

}
