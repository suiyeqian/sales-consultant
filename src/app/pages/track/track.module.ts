import { NgModule } from '@angular/core';

import { TrackComponent } from './track.component';
import { MonthPerformanceComponent } from './month-performance/month-performance.component';
import { MonthForecastComponent } from './month-forecast/month-forecast.component';
import { AssessmentWarningComponent } from './assessment-warning/assessment-warning.component';
import { RiskControlComponent } from './risk-control/risk-control.component';

import { SharedModule } from '../../shared/shared.module';
import { RibbonModule } from '../../my-components/ribbon/ribbon.module';

import { AngularEchartsModule } from 'ngx-echarts';

@NgModule({
  imports: [
    SharedModule,
    AngularEchartsModule,
    RibbonModule
  ],
  declarations: [
    TrackComponent,
    MonthPerformanceComponent,
    MonthForecastComponent,
    AssessmentWarningComponent,
    RiskControlComponent
  ],
  exports: [ ],
  providers: [ ]
})
export class TrackModule { }
