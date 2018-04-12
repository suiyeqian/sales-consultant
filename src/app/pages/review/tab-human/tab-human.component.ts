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
  deviceWidth = document.body.clientWidth;
  private tmCapacityUrl = 'humananls/capacity_anls';
  capacityOption: any;
  private tmSeniorityUrl = 'humananls/seniority_anls';
  tmSeniority = [];
  private tmCompUrl = 'humananls/member_comp';
  teamMbs = [];

  private subNameUrl = 'achievementanls/sub_name';
  subLevels = [];
  curLevel = {value: '', text: '全部'};

  constructor(
    private bdService: BackendService,
    private cmnFn: CommonFnService,
    private modalService: NgbModal,
    private waterMark: WaterMarkService
  ) {
  }

  ngOnInit() {
    if (this.isActive) {
      this.getTmCapacity();
      this.getTmSeniority();
      this.getTmComp();
    }
  }

  getTmCapacity(): void {
    this.bdService
        .getDataByPost(this.tmCapacityUrl, {posId: localStorage.posId})
        .then((res) => {
          let chartDom = document.getElementById('capacityChart');
          if ( res.code === 0) {
            chartDom.style['height'] = 24 * res.data.dataList.length + 142 + 'px';
            let resData = res.data;
            let xAxisData = [];
            let seriesData = [];
            for (let i = 0; i < resData.months.length; i ++) {
              xAxisData.push(resData.months[i] + '月');
              let dataset = [];
              for (let item of resData.dataList) {
                dataset.push((item['m' + (i + 1) + 'Amt'] / 10000).toFixed(2));
              }
              seriesData.push({
                name: resData.months[i] + '月',
                type: 'bar',
                stack: '总量',
                barWidth: 14,
                data: dataset
              });
            }
            let yAxisData = [];
            for (let item of resData.dataList) {
              yAxisData.push(item.name);
            }
            this.capacityOption = echart.StackBarChartOptions;
            this.capacityOption.legend.data = xAxisData;
            this.capacityOption.yAxis.data = yAxisData;
            this.capacityOption.series = seriesData;
          }
          let waterMark = this.waterMark;
          setTimeout(function(){
            waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number });
          }, 0);
        });
  }

  getTmSeniority(): void {
    this.bdService
        .getDataByPost(this.tmSeniorityUrl, {posId: localStorage.posId})
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
            let waterMark = this.waterMark;
            setTimeout(function(){
              waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number });
            }, 0);
          }
        });
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
