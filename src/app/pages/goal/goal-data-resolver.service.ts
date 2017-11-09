import { Injectable }             from '@angular/core';
import { Resolve } from '@angular/router';

import { BackendService } from '../../core/services/backend.service';

@Injectable()
export class GoalDataResolver implements Resolve<any> {
  private salegoalUrl = 'salegoal/member_goal ';
  constructor(private bdService: BackendService) {}

  resolve(): Promise<any> {

    return this.bdService.getDataByPost(this.salegoalUrl, {posId: localStorage.posId}).then(res => {
      if ( res.code === 0 && res.data) {
        return res.data;
      } else {
        return null;
      }
    });
  }
}
