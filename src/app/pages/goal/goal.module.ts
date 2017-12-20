import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { GoalComponent } from './goal.component';

import { SharedModule } from '../../shared/shared.module';
import { RibbonModule } from '../../my-components/ribbon/ribbon.module';
import { GoalRoutingModule } from './goal-routing.module';

@NgModule({
  imports: [
    SharedModule,
    RibbonModule,
    GoalRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    GoalComponent
  ],
  exports: [ ],
  providers: [ ]
})
export class GoalModule { }
