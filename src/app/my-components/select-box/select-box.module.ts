import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelBoxComponent } from './select-box.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SelBoxComponent
  ],
  exports: [
    SelBoxComponent
  ]
})
export class SelBoxModule { }
