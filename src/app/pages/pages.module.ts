import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { CoreModule } from '../core/core.module';

import { TrackModule } from './track/track.module';

import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  imports: [
    CoreModule,
    TrackModule,
    PagesRoutingModule
  ],
  declarations: [
    PagesComponent
  ],
  providers: [ ]
})
export class PagesModule { }
