import { NgModule } from '@angular/core';

import { ReviewComponent } from './review.component';
import { TabTrackComponent } from './tab-track/tab-track.component';
import { TabHumanComponent } from './tab-human/tab-human.component';
import { TabProduceComponent } from './tab-produce/tab-produce.component';

import { SharedModule } from '../../shared/shared.module';
import { SelBoxModule } from '../../my-components/select-box/select-box.module';
import { ReViewRoutingModule } from './review-routing.module';

import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  imports: [
    SharedModule,
    NgxEchartsModule,
    SelBoxModule,
    ReViewRoutingModule
  ],
  declarations: [
    ReviewComponent,
    TabTrackComponent,
    TabHumanComponent,
    TabProduceComponent
  ],
  exports: [ ],
  providers: [ ]
})
export class ReviewModule { }
