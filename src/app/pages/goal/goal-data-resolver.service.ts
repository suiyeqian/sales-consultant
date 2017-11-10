import { Injectable }             from '@angular/core';
import { Resolve, Router } from '@angular/router';

import { BackendService } from '../../core/services/backend.service';

@Injectable()
export class GoalDataResolver implements Resolve<any> {
  private salegoalUrl = 'salegoal/member_goal ';
  constructor(private bdService: BackendService, private router: Router) {}

  resolve(): Promise<any> {

    return this.bdService.getDataByPost(this.salegoalUrl, {posId: localStorage.posId}).then(res => {
      if ( res.code === 0 && res.data.length) {
        return res.data;
      } else {
        this.router.navigate(['/crisis-center']);
        return null;
      }
    });
  }
}
