import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TrackdetailComponent } from './track-detail.component';

const trackdetailRoutes: Routes = [
  {
    path: '',
    component: TrackdetailComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(trackdetailRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class TrackdetailRoutingModule {}
