import { Injectable } from '@angular/core';

@Injectable()
export class CommonFnService {

  constructor() {}

  public deepCopy(parent, child = {}) {
    for (let i in parent) {
      if (!parent.hasOwnProperty(i)) {
        continue;
      }
      if (typeof parent[i] === 'object') {
        child[i] = (parent[i].constructor === Array) ? [] : {};
        this.deepCopy(parent[i], child[i]);
      } else {
        child[i] = parent[i];
      }
    }
    return child;
  }

}
