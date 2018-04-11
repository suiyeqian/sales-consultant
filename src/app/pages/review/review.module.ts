import { NgModule } from '@angular/core';

import { ReviewComponent } from './review.component';

import { SharedModule } from '../../shared/shared.module';
import { SelBoxModule } from '../../my-components/select-box/select-box.module';
import { ReViewRoutingModule } from './review-routing.module';

import { AngularEchartsModule } from 'ngx-echarts';

@NgModule({
  imports: [
    SharedModule,
    AngularEchartsModule,
    SelBoxModule,
    ReViewRoutingModule
  ],
  declarations: [
    ReviewComponent
  ],
  exports: [ ],
  providers: [ ]
})
export class ReviewModule { }
