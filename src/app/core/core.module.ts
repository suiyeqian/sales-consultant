import { NgModule,  Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { throwIfAlreadyLoaded } from './module-import-guard';

import { TabnavComponent } from './tabnav/tabnav.component';

import { BackendService } from './services/backend.service';
import { AuthGuard } from './services/auth-guard.service';
import { SpinnerService } from './services/spinner.service';
import { WaterMarkService } from './services/watermark.service';
import { AuthorizeService } from './services/authorize.service';
import { CommonFnService } from './services/commonfn.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    TabnavComponent,
  ],
  exports: [
    TabnavComponent,
  ],
  providers: [
    AuthGuard,
    BackendService,
    SpinnerService,
    WaterMarkService,
    AuthorizeService,
    CommonFnService
  ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
      throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
