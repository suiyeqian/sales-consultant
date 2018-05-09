import { Component, OnInit, Input } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalComponent } from '../../../my-components/modal/modal.component';

import { BackendService } from '../../../core/services/backend.service';
import { CommonFnService } from '../../../core/services/commonfn.service';
import * as echart from '../../../echarts';
import { WaterMarkService } from '../../../core/services/watermark.service';

@Component({
  selector: 'my-tab-human',
  templateUrl: './tab-human.component.html',
  styleUrls: ['./tab-human.component.scss']
})
export class TabHumanComponent implements OnInit {
  @Input() isActive: boolean;
  posId = localStorage.posId;
  deviceWidth = document.body.clientWidth;
  private tmSeniorityUrl = 'humananls/seniority_anls';
  tmSeniority = [];
  private tmCompUrl = 'humananls/member_comp';
  teamMbs = [];

  private tmCapanlsUrl = 'humananls/cap_anls';
  capType = 'sixMonth';
  curCapLevel: any;
  capanlsOption: any;

  private tmBillinganlsUrl = 'humananls/billing_anls';
  billingType = 'sixMonth';
  curBillingLevel: any;
  billingAnlsOption: any;

  private tmLossanlsUrl = 'humananls/loss_anls';
  lossType = 'sixMonth';
  curLossLevel: any;
  lossAnlsOption: any;

  subNameUrl = 'achievementanls/sub_name';
  subLevels = [];
  curLevel: any;

  constructor(
    private bdService: BackendService,
    private cmnFn: CommonFnService,
    private modalService: NgbModal,
    private waterMark: WaterMarkService
  ) {
  }

  ngOnInit() {
    if (this.isActive) {
      this.getTmSeniority({value: '', text: '全部'});
      this.getTmComp();
      this.getTmCapanls({value: '', text: '全部'}, this.capType);
      this.getTmBillinganls({value: '', text: '全部'}, this.billingType);
      this.getTmLossanls({value: '', text: '全部'}, this.lossType);
    }
  }

  getTmSeniority(level): void {
    this.curLevel = level;
    this.bdService
        .getDataByPost(this.tmSeniorityUrl, {posId: localStorage.posId, subName: level.value})
        .then((res) => {
          this.tmSeniority = res.data;
        });
  }

  getTmComp(): void {
    this.teamMbs = [];
    let radius = Math.floor((this.deviceWidth - 150) / 4);
    let radarHeight = 6 * 75 * (this.deviceWidth / 750);
    this.bdService
        .getDataByPost(this.tmCompUrl, {posId: localStorage.posId})
        .then((res) => {
          if ( res.code === 0) {
            let codeArray = [];
            if (localStorage.posId === '2') {
              codeArray = [
                {name: '合同金额', code: 'S'},
                {name: '申请单量', code: 'N'},
                {name: '件均金额', code: 'A'},
                {name: '通过率', code: 'P'},
                {name: 'C-M2', code: 'C-M2'}
              ];
            } else {
              codeArray = [
                {name: '人均产能', code: 'AP'},
                {name: '活动率', code: 'AR'},
                {name: '达成率', code: 'CR'},
                {name: '满编率', code: 'FR'},
                {name: 'C-M2', code: 'C-M2'},
                {name: '开单率', code: 'SR'}
              ];
            }
            let resData = res.data;
            for (let item of resData){
              let indicator = [];
              let radarChartOpt = this.cmnFn.deepCopy(echart.RadarChartOptions, {});
              radarChartOpt.radar[0].radius = radius;
              radarChartOpt.radar[0].name.textStyle.fontSize = 11;
              radarChartOpt.radar[0].nameGap = 8;
              radarChartOpt.tooltip.textStyle.fontSize = 10;
              radarChartOpt.tooltip.position = 'bottom';
              let tooltipText = '';
              for (let data of item.dataList) {
                for (let codeItem of codeArray) {
                  if (data.name === codeItem.name) {
                    data.code = codeItem.code;
                  }
                }
                indicator.push({text: data.code, max: localStorage.posId === '2' ? 5 : 10});
                radarChartOpt.series[0].data[0].value.push(data.value);
                if (data.name === 'C-M2') {
                  tooltipText += `${data.name}: ${data.origValue}<br/>`;
                } else {
                  tooltipText += `${data.name}(${data.code}): ${data.origValue}<br/>`;
                }
              }
              radarChartOpt.radar[0].indicator = indicator;
              radarChartOpt.tooltip.formatter = function() {
                return tooltipText;
              };
              this.teamMbs.push({
                name: item.name,
                radarChartOpt: radarChartOpt
              });
            };
            setTimeout(() => {
              this.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number });
            }, 0);
          }
        });
  }

  // 产能分析
  getTmCapanls(level, type): void {
    this.curCapLevel = level;
    this.bdService
        .getDataByPost(this.tmCapanlsUrl, {posId: this.posId, subName: level.value, type: type})
        .then((res) => {
          if ( res.code === 0) {
            this.capanlsOption = this.cmnFn.deepCopy(echart.LineBarChartOptions, {});
            this.capanlsOption.xAxis[0].data = res.data.xAxis;
            this.capanlsOption.legend.data = ['人均产能', '有效人均产能'];
            this.capanlsOption.yAxis.splice(0, 1);
            this.capanlsOption.series.splice(2, 1);
            this.capanlsOption.series[0].name = this.capanlsOption.legend.data[0];
            this.capanlsOption.series[0].data = res.data.yAxis.bar;
            this.capanlsOption.series[1].name = this.capanlsOption.legend.data[1];
            this.capanlsOption.series[1].data = res.data.yAxis.bar2;
          }
        });
  }

  // 开单分析
  getTmBillinganls(level, type): void {
    this.curBillingLevel = level;
    this.bdService
        .getDataByPost(this.tmBillinganlsUrl, {posId: this.posId, subName: level.value, type: type})
        .then((res) => {
          if ( res.code === 0) {
            this.billingAnlsOption = this.cmnFn.deepCopy(echart.LineBarChartOptions, {});
            this.billingAnlsOption.xAxis[0].data = res.data.xAxis;
            this.billingAnlsOption.yAxis[0].name = '单位(人)';
            this.billingAnlsOption.yAxis[1].name = '';
            this.billingAnlsOption.legend.data = ['开单人力', '无效人力', '开单率'];
            this.billingAnlsOption.color = ['#05e8e9', '#d74b49', '#fad972'];
            this.billingAnlsOption.series[0] = {
              name: '开单人力',
              type: 'bar',
              stack: '总人力',
              barWidth: '30%',
              data: res.data.yAxis.bar
            };
            this.billingAnlsOption.series[1] = {
              name: '无效人力',
              type: 'bar',
              stack: '总人力',
              barWidth: '30%',
              data: res.data.yAxis.bar2
            };
            this.billingAnlsOption.series[2].name = this.billingAnlsOption.legend.data[2];
            this.billingAnlsOption.series[2].data = res.data.yAxis.line;
          }
        });
  }

  // 流失分析
  getTmLossanls(level, type): void {
    this.curLossLevel = level;
    this.bdService
        .getDataByPost(this.tmLossanlsUrl, {posId: this.posId, subName: level.value, type: type})
        .then((res) => {
          if ( res.code === 0) {
            this.lossAnlsOption = this.cmnFn.deepCopy(echart.LineBarChartOptions, {});
            this.lossAnlsOption.xAxis[0].data = res.data.xAxis;
            this.lossAnlsOption.yAxis[0].name = '单位(人)';
            this.lossAnlsOption.yAxis[1].name = '';
            this.lossAnlsOption.legend.data = ['入职人力', '离职人力', '流失率'];
            this.lossAnlsOption.series[0].name = this.lossAnlsOption.legend.data[0];
            this.lossAnlsOption.series[0].data = res.data.yAxis.bar;
            this.lossAnlsOption.series[1].name = this.lossAnlsOption.legend.data[1];
            this.lossAnlsOption.series[1].data = res.data.yAxis.bar2;
            this.lossAnlsOption.series[2].name = this.lossAnlsOption.legend.data[2];
            this.lossAnlsOption.series[2].data = res.data.yAxis.line;
          }
        });
  }

  switchTab(type, tabName): void {
    let curTabCode = tabName === '本月' ? 'curMonth' : 'sixMonth';
    if (this[type + 'Type'] === curTabCode) {
      return;
    }
    this[type + 'Type'] = curTabCode;
    switch (type) {
      case 'cap':
        this.getTmCapanls({value: '', text: '全部'}, this.capType);
        break;
      case 'billing':
        this.getTmBillinganls({value: '', text: '全部'}, this.billingType);
        break;
      default:
        this.getTmLossanls({value: '', text: '全部'}, this.lossType);
    }
  }

  getSelItems(): void {
    this.bdService
        .getDataByPost(this.subNameUrl, {posId: localStorage.posId})
        .then((res) => {
          if ( res.code === 0) {
            this.subLevels = res.data;
            this.subLevels.unshift({value: '', text: '全部'});
          }
        });
  }

  open(): void {
    const modalRef = this.modalService.open(NgbdModalComponent, { windowClass: 'fs-modal' });
    if (localStorage.posId === '2') {
      modalRef.componentInstance.isTeamLeader = true;
    }
  }

}
