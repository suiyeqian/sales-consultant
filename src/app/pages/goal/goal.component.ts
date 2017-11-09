import { Component, OnInit, AfterContentInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { BackendService } from '../../core/services/backend.service';
import { WaterMarkService } from '../../core/services/watermark.service';

@Component({
  selector: 'my-goal',
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.scss']
})
export class GoalComponent implements OnInit, AfterContentInit {
  private salegoalUrl = 'salegoal/member_goal ';
  goalData = [];
  formDataset = Object.assign({});
  goalForm = new FormGroup ({});
  goalSum: Number;
  private updateUrl = 'salegoal/update_goal ';

  constructor(
    private bdService: BackendService,
    private route: ActivatedRoute,
    private waterMark: WaterMarkService,
    private fb: FormBuilder
  ) {
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

  setForm(): void {
    let initForm = Object.assign({});
    for (let item of this.formDataset.goalList) {
      initForm['goal' + item.id] = {value: item.rate, disabled: this.formDataset.isSet ? false : true};
    }
    this.goalForm = this.fb.group({
      month: this.formDataset.month,
      goalList: this.fb.group(initForm)
    });
    // console.log(this.goalForm);
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
    }, 0);
  }

  countSum() {
    let sum = 0;
    for (let item of this.formDataset.goalList) {
      sum += this.formDataset.goalAmt * this.goalForm.controls.goalList.value[`goal${item.id}`] / 100;
    }
    this.goalSum = sum;
  }

  onSubmit() {
    let body = {
      posId: localStorage.posId,
      month: this.goalForm.value.month,
      goalList: []
    };
    for (let member of this.formDataset.goalList){
      body.goalList.push({
        id: member.id,
        goalAmt: this.formDataset.goalAmt * this.goalForm.controls.goalList.value[`goal${member.id}`] / 100
      });
    }
    this.bdService
        .updateByJson(this.updateUrl, body)
        .then((res) => {
          if (res.code === 0) {
            console.log(res);
            alert('保存成功');
          } else {
            alert(res.msg);
          }
        });
  }

  reset() {
    this.setForm();
  }

}
