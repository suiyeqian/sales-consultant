import { Injectable }    from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { AuthorizeService } from './authorize.service';
import * as CryptoJS from 'crypto-js';
import { Router, RouterState, RouterStateSnapshot } from '@angular/router';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class BackendService {
  private apiUrl = 'http://10.17.2.161:9994/bdss/';
  private baseUrl = this.apiUrl;
  // private apiUrl = window.location.origin;
  // private baseUrl = this.apiUrl + '/servegateway/rest/bdss/';
  firstOverdue = true;
  headersObj = {
    'X-Requested-Token': localStorage.getItem('accessToken'),
    'X-Requested-SystemCode' : 'neo_bdss',
    'X-Requested-DeviceId':  localStorage.getItem('weiXinDeviceId'),
    'X-Requested-APICode': 'access_token_weixin_device',
    'X-Requested-Version': '1.0'
  };
  private refreshUrl = `${this.apiUrl}/servegateway/rest/bduser/weixin/user/access_token`;

  constructor(
    private http: Http,
    private router: Router,
    private oauth: AuthorizeService) { }

  getAll(url: string ): Promise<any> {
    let jsonHeaders = this.setHeader('GET', url, {});
    return this.http.get(this.baseUrl + url, {headers: jsonHeaders})
               .toPromise()
               .then(this.handleData)
               .catch(this.handleError);
  }

  getDataByPost(url: string, params: Object): Promise<any> {
    // this.headersObj['X-Requested-Timestamp'] = Math.floor(new Date().getTime() / 1000).toString();
    // this.headersObj['X-Requested-Nonce'] = this.MathRand();
    // let jsonHeaders = new Headers(this.headersObj);
    // let obj = Object.assign({}, this.headersObj, params);
    // let form = this.oauth.normalizeParameters(obj);
    // let result = 'POST&' + this.oauth.percentEncode(this.baseUrl + url) + '&' + form;
    // let signature = CryptoJS.HmacSHA1(result, result).toString(CryptoJS.enc.Base64);
    // jsonHeaders.append('X-Requested-Authorization', signature);
    let jsonHeaders = this.setHeader('POST', url, params);
    jsonHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    let body = this.urlEncode(params);
    return this.http.post(this.baseUrl + url, body, {headers: jsonHeaders})
           .toPromise()
           .then(this.handleData)
           .catch(this.handleError);
  }

  updateByJson(url: string, params: Object): Promise<any> {
    let jsonHeaders = this.setHeader('POST', url, params);
    jsonHeaders.append('Content-Type', 'application/json');
    return this.http.post(this.baseUrl + url, params, {headers: jsonHeaders})
           .toPromise()
           .then(this.handleData)
           .catch(this.handleError);
  }

  setHeader( type, url, params) {
    this.headersObj['X-Requested-Timestamp'] = Math.floor(new Date().getTime() / 1000).toString();
    this.headersObj['X-Requested-Nonce'] = this.MathRand();
    let headers = new Headers(this.headersObj);
    let obj = Object.assign({}, this.headersObj, params);
    let form = this.oauth.normalizeParameters(obj);
    let result = type + '&' + this.oauth.percentEncode(this.baseUrl + url) + '&' + form;
    let signature = CryptoJS.HmacSHA1(result, result).toString(CryptoJS.enc.Base64);
    headers.append('X-Requested-Authorization', signature);
    return headers;
  }

  getNewToken() {
    if (this.firstOverdue) {
      this.firstOverdue = false;
      const state: RouterState = this.router.routerState;
      const snapshot: RouterStateSnapshot = state.snapshot;
      let url = snapshot.url;
      let headersObj = {
        'X-Requested-SystemCode' : 'neo_bdss',
        'X-Requested-APICode': 'app_api',
        'X-Requested-Timestamp': Math.floor(new Date().getTime() / 1000),
        'X-Requested-Nonce': this.MathRand(),
        'X-Requested-Version': '1.0'
      };
      let headers = new Headers(headersObj);
      let refreshToken = localStorage.getItem('refreshToken');
      let obj = Object.assign({}, headersObj, {'refreshToken': refreshToken});
      let form = this.oauth.normalizeParameters(obj);
      let result = 'POST' + '&' + this.oauth.percentEncode(this.refreshUrl) + '&' + form;
      let signature = CryptoJS.HmacSHA1(result, result).toString(CryptoJS.enc.Base64);
      headers.append('X-Requested-Authorization', signature);
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let body = 'refreshToken=' + refreshToken;
      this.http.post(this.refreshUrl, body, { headers: headers })
             .toPromise()
             .then(response => {
               if (response.json().code === 50012 || response.json().code === 60000) {
                 localStorage.clear();
               } else {
                 localStorage.setItem('accessToken', response.json().data.accessToken);
                 localStorage.setItem('refreshToken', response.json().data.refreshToken);
                 localStorage.setItem('weiXinDeviceId', response.json().data.weiXinDeviceId);
                 localStorage.setItem('user', JSON.stringify(response.json().data));
               }
               this.firstOverdue = true;
               window.location.reload();
             })
             .catch(this.handleError);
    }
  }

  MathRand() {
    let Num = '';
    for (let i = 0; i < 6; i++) {
      Num += Math.floor(Math.random() * 10);
    }
    return Num;
  }

  urlEncode(obj: Object): string {
    let urlSearchParams = new URLSearchParams();
    for (let key of Object.keys(obj)) {
        urlSearchParams.append(key, obj[key]);
    }
    return urlSearchParams.toString();
  }

  private handleData(response: any) {
    if (!localStorage.getItem('weiXinDeviceId') || response.json().code === 60000) {
       localStorage.clear();
       window.location.reload();
     }
     if (response.json().code === 50013) { this.getNewToken(); }
     if (!response.json().data) { return {}; }
     return response.json();
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
