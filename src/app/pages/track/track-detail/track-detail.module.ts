import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared/shared.module';
import { TrackdetailRoutingModule } from './track-detail-routing.module';
import { TrackdetailComponent } from './track-detail.component';

import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  imports: [
    SharedModule,
    NgxEchartsModule,
    TrackdetailRoutingModule
  ],
  declarations: [
    TrackdetailComponent,
  ],
  exports: [ ],
  providers: [ ]
})
export class TackdetailModule { }
