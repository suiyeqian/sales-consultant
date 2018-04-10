import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesComponent } from './pages.component';
import { CoreModule } from '../core/core.module';

import { TrackModule } from './track/track.module';

import { PagesRoutingModule } from './pages-routing.module';

import { NgbdModalComponent } from '../my-components/modal/modal.component';

@NgModule({
  imports: [
    CoreModule,
    TrackModule,
    PagesRoutingModule,
    CommonModule
  ],
  declarations: [
    PagesComponent,
    NgbdModalComponent
  ],
  entryComponents: [ NgbdModalComponent ],
  providers: [ ]
})
export class PagesModule { }
