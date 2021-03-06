import { NgModule } from '@angular/core';

import { TrackComponent } from './track.component';
import { MonthPerformanceComponent } from './month-performance/month-performance.component';
import { MonthForecastComponent } from './month-forecast/month-forecast.component';
import { RiskControlComponent } from './risk-control/risk-control.component';
import { SelBoxModule } from '../../my-components/select-box/select-box.module';

import { SharedModule } from '../../shared/shared.module';
import { RibbonModule } from '../../my-components/ribbon/ribbon.module';

import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  imports: [
    SharedModule,
    NgxEchartsModule,
    RibbonModule,
    SelBoxModule
  ],
  declarations: [
    TrackComponent,
    MonthPerformanceComponent,
    MonthForecastComponent,
    RiskControlComponent
  ],
  exports: [ ],
  providers: [ ]
})
export class TrackModule { }
