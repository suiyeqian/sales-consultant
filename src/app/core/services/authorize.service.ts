import { Injectable } from '@angular/core';

@Injectable()
export class AuthorizeService {

  constructor() {
  }

  public normalizeParameters(parameters) {
    let sortable = [];
    for (let p of Object.keys(parameters)) {
      if (parameters[p]) {
        let nvp = parameters[p];
        sortable.push([ p + ' ' + nvp, [p, nvp]]);
      }
    }
    sortable.sort(function(a, b) {
        if (a[0] < b[0]) { return -1; }
        if (a[0] > b[0]) { return 1; }
        return 0;
    });
    let sorted = [];
    for (let s of sortable) { sorted.push(s[1]); }
    return this.formEncode(sorted);
  }

  public formEncode(arr) {
    let form = '';
    for (let p of arr){
      let value = p[1];
      if (value == null) { value = ''; }
      if (form !== '') { form += '&'; }
      form += this.percentEncode(p[0]) + '=' + this.percentEncode(value);
    }
    return encodeURIComponent(form);
  }

  public percentEncode(s): string {
    if (s == null) {
      return '';
    }
    if (s instanceof Array) {
      let e = '';
      for (let i of s) {
        if (e !== '') { e += '&'; }
        e += this.percentEncode(i);
      }
      return e;
    }
    s = encodeURIComponent(s);
    s = s.replace(/\!/g, '%21');
    s = s.replace(/\*/g, '%2A');
    s = s.replace(/\'/g, '%27');
    s = s.replace(/\(/g, '%28');
    s = s.replace(/\)/g, '%29');
    return s;
  }
}
