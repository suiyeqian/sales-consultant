import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabsetComponent } from './tabset.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TabsetComponent
  ],
  exports: [
    TabsetComponent
  ]
})
export class TabsetUiModule { }
