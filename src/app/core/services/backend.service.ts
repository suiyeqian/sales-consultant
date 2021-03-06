import { Injectable }    from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { AuthorizeService } from './authorize.service';
import * as CryptoJS from 'crypto-js';
import { Router, RouterState, RouterStateSnapshot } from '@angular/router';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class BackendService {
  // private apiUrl = 'http://10.17.2.110:8989';
  private apiUrl = window.location.origin;
  private baseUrl = `${this.apiUrl}/servegateway/rest/bdss/`;
  firstOverdue = true;
  headersObj = {
    'X-Requested-Token': localStorage.getItem('bdss_accessToken'),
    'X-Requested-SystemCode' : 'neo_bdss',
    'X-Requested-DeviceId':  localStorage.getItem('bdss_weiXinDeviceId'),
    'X-Requested-APICode': 'access_token_weixin_device',
    'X-Requested-Version': '1.0'
  };
  private refreshUrl = `${this.apiUrl}/servegateway/rest/bduser/weixin/user/access_token`;

  constructor(
    private http: Http,
    private router: Router,
    private oauth: AuthorizeService) { }

  getAll(url: string ): Promise<any> {
    let jsonHeaders = this.setHeader('GET', url);
    return this.http.get(this.baseUrl + url, {headers: jsonHeaders})
               .toPromise()
               .then(response => {
                 if (!localStorage.getItem('bdss_weiXinDeviceId') || response.json().code === 60000) {
                    localStorage.clear();
                    window.location.reload();
                  }
                  if (response.json().code === 50013) {
                    this.getNewToken();
                  }
                  if (!response.json().data) { return {}; }
                  return response.json();
               })
               .catch(this.handleError);
  }

  getDataByPost(url: string, params: Object): Promise<any> {
    let jsonHeaders = this.setHeader('POST', url, params);
    jsonHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    let body = this.urlEncode(params);
    return this.http.post(this.baseUrl + url, body, {headers: jsonHeaders})
           .toPromise()
           .then(response => {
             if (!localStorage.getItem('bdss_weiXinDeviceId') || response.json().code === 60000) {
                localStorage.clear();
                window.location.reload();
              }
              if (response.json().code === 50013) {
                this.getNewToken();
              }
              if (!response.json().data) { return {}; }
              return response.json();
           })
           .catch(this.handleError);
  }

  setHeader( type, url, params = {}) {
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
      let refreshToken = localStorage.getItem('bdss_refreshToken');
      let obj = Object.assign({}, headersObj, {'refreshToken': refreshToken});
      let form = this.oauth.normalizeParameters(obj);
      let result = 'POST' + '&' + this.oauth.percentEncode(this.refreshUrl) + '&' + form;
      let signature = CryptoJS.HmacSHA1(result, result).toString(CryptoJS.enc.Base64);
      headers.append('X-Requested-Authorization', signature);
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let body = 'refreshToken=' + refreshToken;
      this.http.post(this.refreshUrl, body, { headers: headers })
             .toPromise()
             .then(res => {
               if (res.json().code === 50012 || res.json().code === 60000) {
                 localStorage.clear();
               } else {
                 localStorage.setItem('bdss_accessToken', res.json().data.accessToken);
                 localStorage.setItem('bdss_refreshToken', res.json().data.refreshToken);
                 localStorage.setItem('bdss_weiXinDeviceId', res.json().data.weiXinDeviceId);
                 localStorage.setItem('user', JSON.stringify(res.json().data));
                 localStorage.setItem('posId', res.json().data.posId ? res.json().data.posId : '2');
                 switch (res.json().data.posId) {
                   case '3':
                     localStorage.setItem('teamName', '营业部');
                     break;
                   case '4':
                     localStorage.setItem('teamName', '小区');
                     break;
                   case '5':
                     localStorage.setItem('teamName', '大区');
                     break;
                   default:
                     localStorage.setItem('teamName', '团队');
                 }
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

  private handleError(error: any): Promise<any> {
    // if(error && error.status){
    //   alert("后台接口异常，错误码："+error.status);
    //   console.warn("接口异常，错误码："+error.status);
    // }else{
    //   console.error(error);
    // }
    return Promise.reject(error.message || error);
  }
}
