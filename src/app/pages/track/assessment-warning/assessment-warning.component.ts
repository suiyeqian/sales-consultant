import { Component, OnInit, Input } from '@angular/core';

import { BackendService } from '../../../core/services/backend.service';
import * as echart from '../../../echarts';

@Component({
  selector: 'my-assessment-warning',
  templateUrl: './assessment-warning.component.html',
  styleUrls: ['./assessment-warning.component.scss']
})
export class AssessmentWarningComponent implements OnInit {
  private checkwarningUrl = 'performancetrack/check_warning';
  warningInfos = Object.assign({});
  @Input() timeProgress: number;

  constructor(
    private bdService: BackendService
  ) {
  }

  ngOnInit() {
    this.getWarning();
  }
  getWarning(): void {
    this.bdService
        .getAll(this.checkwarningUrl)
        .then((res) => {
          if ( res.code === 0) {
            let resData = res.data;
            resData.totalNum = resData.m2Number + resData.m1Number + resData.number;
            resData.cntRate = resData.totalNum / resData.goalCnt;
            resData.totalAmt = resData.m2Amt + resData.m1Amt + resData.amt;
            resData.amtRate = resData.totalAmt / resData.goalAmt;
            this.warningInfos = resData;
          }
        });
  }

}
