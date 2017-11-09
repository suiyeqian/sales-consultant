import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GoalComponent } from './goal.component';
import { GoalDataResolver }   from './goal-data-resolver.service';

const goalRoutes: Routes = [
  {
    path: '',
    component: GoalComponent,
    resolve: { goalData: GoalDataResolver }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(goalRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    GoalDataResolver
  ]
})
export class GoalRoutingModule {}
