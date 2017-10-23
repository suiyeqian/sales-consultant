import { Component, OnInit, AfterContentInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { BackendService } from '../../core/services/backend.service';
import { WaterMarkService } from '../../core/services/watermark.service';

@Component({
  selector: 'my-goal',
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.scss']
})
export class GoalComponent implements OnInit, AfterContentInit {
  private saleachievementUrl = 'performancetrack/sale_achievement';
  achievement = Object.assign({});
  goalVal = 1000000;
  goalForm = new FormGroup ({});
  teams = [
    {id: 1, name: '慕容笑笑', per: 20},
    {id: 2, name: '张三', per: 10},
    {id: 3, name: '童耀毅', per: 10},
    {id: 4, name: '李四', per: 10},
    {id: 5, name: '王二', per: 10},
    {id: 6, name: '黄彩霞', per: 10},
    {id: 7, name: '赵帅', per: 30},
  ];
  goalSum: Number;

  constructor(
    private bdService: BackendService,
    private waterMark: WaterMarkService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.getSaleAchievement();
    let initGoals = Object.assign({});
    for (let item of this.teams) {
      initGoals['single' + item.id] = item.per;
    }
    this.goalForm = this.fb.group(initGoals);
    this.countSum();
    this.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number }, 230);
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
          }
          this.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number });
        });
  }

  countSum() {
    let sum = 0;
    for (let item of this.teams) {
      sum += this.goalVal * this.goalForm.value['single' + item.id] / 100;
    }
    this.goalSum = sum;
  }

}
