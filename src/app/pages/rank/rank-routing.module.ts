import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RankComponent } from './rank.component';

const rankRoutes: Routes = [
  {
    path: '',
    component: RankComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(rankRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class RankRoutingModule {}
