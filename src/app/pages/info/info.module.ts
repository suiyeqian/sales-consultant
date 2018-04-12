import { NgModule } from '@angular/core';

import { InfoComponent } from './info.component';

import { SharedModule } from '../../shared/shared.module';
import { InfoRoutingModule } from './info-routing.module';

import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  imports: [
    SharedModule,
    NgxEchartsModule,
    InfoRoutingModule
  ],
  declarations: [
    InfoComponent
  ],
  exports: [ ],
  providers: [ ]
})
export class InfoModule { }
