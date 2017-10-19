import { NgModule } from '@angular/core';

import { RankComponent } from './rank.component';

import { SharedModule } from '../../shared/shared.module';
import { RibbonModule } from '../../my-components/ribbon/ribbon.module';
import { RankRoutingModule } from './rank-routing.module';

@NgModule({
  imports: [
    SharedModule,
    RibbonModule,
    RankRoutingModule
  ],
  declarations: [
    RankComponent
  ],
  exports: [ ],
  providers: [ ]
})
export class RankModule { }
