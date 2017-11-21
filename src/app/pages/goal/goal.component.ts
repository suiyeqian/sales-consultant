import { Component, OnInit, AfterContentInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { BackendService } from '../../core/services/backend.service';
import { WaterMarkService } from '../../core/services/watermark.service';

@Component({
  selector: 'my-goal',
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.scss']
})
export class GoalComponent implements OnInit, AfterContentInit {
  private salegoalUrl = 'salegoal/member_goal';
  goalData = [];
  formDataset = Object.assign({});
  goalForm = new FormGroup ({});
  goalSum: Number;
  private updateUrl = 'salegoal/update_goal';
  supGoalname: string;
  myGoalName: string;

  constructor(
    private bdService: BackendService,
    private route: ActivatedRoute,
    private waterMark: WaterMarkService,
    private fb: FormBuilder
  ) {
    switch (localStorage.posId) {
      case '3':
        [this.supGoalname, this.myGoalName] = ['小区目标', '营业部目标'];
        break;
      case '4':
        [this.supGoalname, this.myGoalName] = ['大区目标', '小区目标'];
        break;
      case '5':
        this.myGoalName = '大区目标';
        break;
      default:
        [this.supGoalname, this.myGoalName] = ['营业部目标', '团队目标'];
    }
  }

  ngOnInit() {
    this.route.data
        .subscribe((data) => {
          this.goalData = data.goalData;
          this.formDataset = this.goalData[0];
          this.formDataset.changed = false;
          this.setForm();
          let self = this;
          setTimeout(function(){
            self.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number });
          }, 0);
        });
  }

  ngAfterContentInit() {
    if (document.body.scrollTop > 0) {
      document.body.scrollTop = 0;
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.checkDiff()) {
      return Observable.of(window.confirm('页面有修改尚未提交，确定离开?'));
    }
    return true;
  }

  setForm(): void {
    let initForm = Object.assign({});
    for (let item of this.formDataset.goalList) {
      initForm[item.id] = {value: item.rate, disabled: this.formDataset.isSet ? false : true};
    }
    this.goalForm = this.fb.group({
      month: this.formDataset.month,
      goalList: this.fb.group(initForm)
    });
    this.countSum();
  }

  monthChange(month) {
    this.formDataset = this.goalData.find((item) => item.month === month);
    this.setForm();
  }

  rateChange() {
    let self = this;
    setTimeout(function(){
      self.countSum();
      self.formDataset.changed = self.checkDiff();
    }, 0);
  }

  checkDiff(): boolean {
    let editData = this.goalForm.controls.goalList.value;
    for (let item of this.formDataset.goalList) {
      if (item.rate !== editData[item.id]) {
        return true;
      }
    }
  }

  countSum() {
    let sum = 0;
    for (let item of this.formDataset.goalList) {
      sum += this.formDataset.goalAmt * this.goalForm.controls.goalList.value[item.id] / 100;
    }
    this.goalSum = sum;
  }

  onSubmit() {
    let goalArr = [];
    for (let member of this.formDataset.goalList){
      goalArr.push({
        id: member.id,
        goalAmt: this.formDataset.goalAmt * this.goalForm.controls.goalList.value[member.id] / 100
      });
    }
    let body = {
      posId: localStorage.posId,
      month: this.goalForm.value.month,
      goalList: JSON.stringify(goalArr)
    };
    this.bdService
        .getDataByPost(this.updateUrl, body)
        .then((res) => {
          if (res.code === 0) {
            this.reGetData();
            alert('设定成功');
          } else {
            alert(`设定失败：${res.msg}` );
          }
        });
  }

  reGetData() {
    this.bdService
        .getDataByPost(this.salegoalUrl, {posId: localStorage.posId}).then(res => {
          if ( res.code === 0 ) {
            this.goalData = res.data;
            this.formDataset = this.goalData.find((item) => item.month === this.formDataset.month);
            this.formDataset.changed = this.checkDiff();
            this.setForm();
          } else {
            alert('系统错误，请刷新重试！');
          }
    });
  }

  reset() {
    if (window.confirm('确定重置吗?')) {
      this.setForm();
    }
  }

}
