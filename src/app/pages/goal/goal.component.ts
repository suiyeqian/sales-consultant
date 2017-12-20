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
  posId = localStorage.posId;
  private salegoalUrl = 'salegoal/member_goal';
  goalData = [];
  formDataset = Object.assign({});
  goalForm = new FormGroup ({});
  goalSum: Number;
  private updateUrl = 'salegoal/update_goal';
  supGoalname: string;
  myGoalName: string;
  remind: string;

  constructor(
    private bdService: BackendService,
    private route: ActivatedRoute,
    private waterMark: WaterMarkService,
    private fb: FormBuilder
  ) {
    switch (this.posId) {
      case '3':
        [this.supGoalname, this.myGoalName, this.remind] =
        ['小区目标', '营业部目标', '每月第四个工作日之后目标自动锁定，不可更改'];
        break;
      case '4':
        [this.supGoalname, this.myGoalName, this.remind] = ['大区目标', '小区目标', '下级目标由系统后台上传，不可更改'];
        break;
      case '5':
        [this.myGoalName, this.remind] = ['大区目标', '下级目标由系统后台上传，不可更改'];
        break;
      default:
        [this.supGoalname, this.myGoalName, this.remind] = ['营业部目标', '团队目标', '每月15日之后目标自动锁定，不可更改'];
    }
  }

  ngOnInit() {
    this.route.data
        .subscribe((data) => {
          this.goalData = data.goalData;
          this.formDataset = this.goalData[0];
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
    this.formDataset.changed = false;
    let initForm = Object.assign({});
    for (let item of this.formDataset.goalList) {
      item.isValid = false;
      initForm[item.id] = {value: item.goalAmt, disabled: this.formDataset.isSet ? false : true};
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

  minus(mbId) {
    if (!this.formDataset.isSet) {
      return;
    }
    let curVal = + this.goalForm.controls.goalList.value[mbId];
    if (Number.isInteger(curVal) && curVal > 0) {
      this.goalForm.controls.goalList.patchValue({
        [mbId]: curVal - 1
      });
      this.formDataset.changed = this.checkDiff();
      this.countSum();
    }
  }

  plus(mbId) {
    if (!this.formDataset.isSet) {
      return;
    }
    let curVal = + this.goalForm.controls.goalList.value[mbId];
    if (Number.isInteger(curVal) && curVal < this.formDataset.goalAmt) {
      this.goalForm.controls.goalList.patchValue({
        [mbId]: 1 + curVal
      });
      this.formDataset.changed = this.checkDiff();
      this.countSum();
    }
  }

  onKey(mbId) {
    let curVal = + this.goalForm.controls.goalList.value[mbId];
    if (!Number.isInteger(curVal)) {
      this.formDataset.goalList.find((item) => item.id === mbId).isValid = true;
    } else {
      this.formDataset.goalList.find((item) => item.id === mbId).isValid = false;
      if (curVal > this.formDataset.goalAmt) {
        this.goalForm.controls.goalList.patchValue({
          [mbId]: this.formDataset.goalAmt
        });
      }
      if (curVal < 0) {
        this.goalForm.controls.goalList.patchValue({
          [mbId]: 0
        });
      }
    }
    this.countSum();
  }

  checkDiff(): boolean {
    let editData = this.goalForm.controls.goalList.value;
    for (let item of this.formDataset.goalList) {
      if (+ item.goalAmt !== + editData[item.id]) {
        return true;
      }
    }
  }

  countSum() {
    let sum = 0;
    for (let item of this.formDataset.goalList) {
      // item.countAmt = Math.ceil(this.formDataset.goalAmt * this.goalForm.controls.goalList.value[item.id] / 100);
      // sum += item.countAmt;
      sum += + this.goalForm.controls.goalList.value[item.id];
    }
    this.goalSum = Number.isInteger(sum) ? sum : 0 ;
  }

  onSubmit() {
    let goalArr = [];
    for (let member of this.formDataset.goalList){
      let amtVal = + this.goalForm.controls.goalList.value[member.id];
      if (!Number.isInteger(amtVal)) {
        alert('目标金额设定必须为整数!');
        return;
      }
      goalArr.push({
        id: member.id,
        name: member.name,
        goalAmt: Number.isNaN(amtVal) ? 0 : amtVal * 10000,
        // rate: this.goalForm.controls.goalList.value[member.id]
      });
    }
    if (this.goalSum === 0) {
      alert('目标分配不可以全部为0');
      return ;
    }
    let body = {
      posId: this.posId,
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
        .getDataByPost(this.salegoalUrl, {posId: this.posId, reload: '1'}).then(res => {
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
