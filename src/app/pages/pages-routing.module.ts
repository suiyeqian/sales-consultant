import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { TrackComponent } from './track/track.component';

import { AuthGuard } from '../core/services/auth-guard.service';
// import { UserInfoResolver }   from './user-info-resolver.service';

const pagesRoutes: Routes = [
  {
    path: 'pages',
    component: PagesComponent,
    canActivate: [ AuthGuard ],
    // resolve: { userInfo: UserInfoResolver },
    children: [
      {
        path: '',
        children: [
          { path: '', redirectTo: 'track', pathMatch: 'full' },
          { path: 'track', component: TrackComponent },
          { path: 'review', loadChildren: 'app/pages/review/review.module#ReviewModule'},
          { path: 'rank', loadChildren: 'app/pages/rank/rank.module#RankModule'},
          { path: 'info', loadChildren: 'app/pages/info/info.module#InfoModule'},
          { path: 'goal', loadChildren: 'app/pages/goal/goal.module#GoalModule'}
        ]
      }
    ]
  },
  { path: '**', redirectTo: 'pages/track' }
];

@NgModule({
  imports: [
    RouterModule.forChild(pagesRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    // UserInfoResolver
  ]
})
export class PagesRoutingModule {}
