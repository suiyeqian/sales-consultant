import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReviewComponent } from './review.component';

const reviewRoutes: Routes = [
  {
    path: '',
    component: ReviewComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(reviewRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ReViewRoutingModule {}
