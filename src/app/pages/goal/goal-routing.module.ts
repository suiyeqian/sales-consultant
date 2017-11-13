import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GoalComponent } from './goal.component';
import { CanDeactivateGuard } from './can-deactivate-guard.service';
import { GoalDataResolver } from './goal-data-resolver.service';

const goalRoutes: Routes = [
  {
    path: '',
    component: GoalComponent,
    canDeactivate: [CanDeactivateGuard],
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
    GoalDataResolver,
    CanDeactivateGuard
  ]
})
export class GoalRoutingModule {}
