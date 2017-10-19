import { Injectable }             from '@angular/core';
import { Resolve } from '@angular/router';

import { BackendService } from '../core/services/backend.service';

@Injectable()
export class UserInfoResolver implements Resolve<any> {
  private userUrl = 'personalinfo/my_info';
  constructor(private bdService: BackendService) {}

  resolve(): Promise<any> {

    return this.bdService.getAll(this.userUrl).then(res => {
      if ( res.code === 0 && res.data) {
        return res.data;
        // localStorage.clear();
        // localStorage.setItem('user', JSON.stringify(res.data));
      } else {
        alert('用户不存在！');
        return null;
      }
    });
  }
}
