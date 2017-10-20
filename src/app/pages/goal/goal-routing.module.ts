import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GoalComponent } from './goal.component';

const goalRoutes: Routes = [
  {
    path: '',
    component: GoalComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(goalRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class GoalRoutingModule {}
