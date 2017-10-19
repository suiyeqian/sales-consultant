import { NgModule } from '@angular/core';

import { InfoComponent } from './info.component';

import { SharedModule } from '../../shared/shared.module';
import { RibbonModule } from '../../my-components/ribbon/ribbon.module';
import { InfoRoutingModule } from './info-routing.module';

import { AngularEchartsModule } from 'ngx-echarts';

@NgModule({
  imports: [
    SharedModule,
    AngularEchartsModule,
    RibbonModule,
    InfoRoutingModule
  ],
  declarations: [
    InfoComponent
  ],
  exports: [ ],
  providers: [ ]
})
export class InfoModule { }
