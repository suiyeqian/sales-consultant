import { Component, OnInit, Input } from '@angular/core';

import { BackendService } from '../../../core/services/backend.service';
import { CommonFnService } from '../../../core/services/commonfn.service';
import * as echart from '../../../echarts';
import { WaterMarkService } from '../../../core/services/watermark.service';

@Component({
  selector: 'my-tab-produce',
  templateUrl: './tab-produce.component.html',
  styleUrls: ['./tab-produce.component.scss']
})
export class TabProduceComponent implements OnInit {
  @Input() isActive: boolean;
  private trendUrl = 'productanls/trend';
  private scatterUrl = 'productanls/cur_month';
  list = [
    {
      title: '申请单量分析',
      type: 'sqdl',
      curSubTab: 'trend',
      curLevel: {},
      unit: '件',
      chartOption: this.cmnFn.deepCopy(echart.LineChartOptions, {})
    }, {
      title: '放款金额分析',
      type: 'fkje',
      curSubTab: 'trend',
      curLevel: {},
      unit: '万元',
      chartOption: this.cmnFn.deepCopy(echart.LineChartOptions, {})
    }, {
      title: '件均金额分析',
      type: 'jjje',
      curSubTab: 'trend',
      curLevel: {},
      unit: '万元',
      chartOption: this.cmnFn.deepCopy(echart.LineChartOptions, {})
    }, {
      title: '通过率分析',
      type: 'tgl',
      curSubTab: 'trend',
      curLevel: {},
      unit: '%',
      chartOption: this.cmnFn.deepCopy(echart.LineChartOptions, {})
    }, {
      title: 'C-M2分析',
      type: 'cm2',
      curSubTab: 'trend',
      curLevel: {},
      unit: '%',
      chartOption: this.cmnFn.deepCopy(echart.LineChartOptions, {})
    }
  ];

  legendList = [];
  legendColorList = ['#f88681', '#fada71', '#3ae3bb', '#11b8ff', '#919af2', '#05e8e9'];
  private prodctPandOUrl = 'productanls/month_trend';
  passRateOption: any;
  overdueRateOption: any;
  private prodctCompositionUrl = 'productanls/total_achv';
  applyOrderOption: any;
  loanAmtOption: any;
  avgAmtOption: any;

  subNameUrl = 'achievementanls/sub_name';

  constructor(
    private bdService: BackendService,
    private cmnFn: CommonFnService,
    private waterMark: WaterMarkService
  ) {
  }

  ngOnInit() {
    if (this.isActive) {
      for (let item of this.list) {
        this.getTrend({value: '', text: '全部'}, item.type);
      }
    }
  }

  getTrend(level, type): void {
    let curItem = this.list.find((item) => item.type === type);
    curItem.curLevel = level;
    this.bdService
        .getDataByPost(this.trendUrl, {posId: localStorage.posId, subName: level.value, type: type})
        .then((res) => {
          if ( res.code === 0) {
            curItem.chartOption = this.cmnFn.deepCopy(echart.LineChartOptions, {});
            curItem.chartOption.xAxis.data = res.data.xAxis;
            let legendData = [];
            for (let item of res.data.yAxis){
              legendData.push(item.name);
              curItem.chartOption.series.push({
                name: item.name,
                type: 'line',
                symbol: 'circle',
                symbolSize: 8,
                data: item.list
              });
            }
            curItem.chartOption.legend.data = legendData;
            curItem.chartOption.yAxis.name = `单位(${curItem.unit})`;
            curItem.chartOption.grid.top = '12%';
            if (curItem.type === 'tgl' || curItem.type === 'cm2') {
              curItem.chartOption.yAxis.axisLabel.formatter = '{value} %';
              curItem.chartOption.tooltip.formatter = function(params) {
                let relVal = params[0].name;
                for (let i = 0, l = params.length; i < l; i++) {
                     relVal += `<br/>
                                <span style="display:inline-block;margin-right:5px;border-radius:50%;width:9px;height:9px;
                                background-color:${params[i].color}"></span>
                                ${params[i].seriesName} : ${params[i].value} %`;
                 }
                return relVal;
              };
            }
          }
          this.waterMark.load({ wmk_txt: JSON.parse(localStorage.user).name + ' ' + JSON.parse(localStorage.user).number });
        });
  }

  getScatterChart(type): void {
    let curItem = this.list.find((item) => item.type === type);
    this.bdService
        .getDataByPost(this.scatterUrl, {posId: localStorage.posId, type: type})
        .then((res) => {
          if ( res.code === 0) {
            curItem.chartOption = this.cmnFn.deepCopy(echart.LineChartOptions, {});
            curItem.chartOption.xAxis.data = res.data.xAxis;
            let legendData = [];
            curItem.chartOption.dataZoom = [{
              type: 'inside',
              startValue: 0,
              endValue: 5,
              zoomLock: true
            }];
            if (curItem.type === 'sqdl' || curItem.type === 'fkje') {
              curItem.chartOption.tooltip.axisPointer.type = 'shadow';
              for (let i = 0; i < res.data.yAxis.length; i++) {
                legendData.push(res.data.yAxis[i].name);
                curItem.chartOption.series.push({
                  name: res.data.yAxis[i].name,
                  type: 'bar',
                  stack: '总量',
                  barWidth: '30%',
                  data: res.data.yAxis[i].list
                });
              }
            } else {
              let symbols = ['circle', 'rect', 'triangle', 'diamond', 'pin', 'roundRect', 'arrow'];
              for (let i = 0; i < res.data.yAxis.length; i++) {
                legendData.push(res.data.yAxis[i].name);
                curItem.chartOption.series.push({
                  name: res.data.yAxis[i].name,
                  type: 'scatter',
                  symbol: symbols[i],
                  symbolSize: 12,
                  data: res.data.yAxis[i].list
                });
              }
            }
            curItem.chartOption.legend.data = legendData;
            curItem.chartOption.yAxis.name = `单位(${curItem.unit})`;
            curItem.chartOption.grid.top = '12%';
            if (curItem.type === 'tgl' || curItem.type === 'cm2') {
              curItem.chartOption.yAxis.axisLabel.formatter = '{value} %';
              curItem.chartOption.tooltip.formatter = function(params) {
                let relVal = params[0].name;
                for (let i = 0, l = params.length; i < l; i++) {
                     relVal += `<br/>
                                <span style="display:inline-block;margin-right:5px;border-radius:50%;width:9px;height:9px;
                                background-color:${params[i].color}"></span>
                                ${params[i].seriesName} : ${params[i].value} %`;
                 }
                return relVal;
              };
            }
          }
        });
  }

  switchChart(tabName, itemType): void {
    let curItem = this.list.find((item) => item.type === itemType);
    let curTabCode = tabName === '本月' ? 'curMonth' : 'trend';
    if (curItem.curSubTab === curTabCode) { return; }
    curItem.curSubTab = curTabCode;
    if (curItem.curSubTab === 'trend') {
      this.getTrend({value: '', text: '全部'}, itemType);
    } else {
      this.getScatterChart(itemType);
    }
  }

}
