import { Component, Input } from '@angular/core';

@Component({
  selector: 'my-ribbon',
  templateUrl: './ribbon.component.html',
  styleUrls: ['./ribbon.component.scss']
})
export class RibbonComponent {
  @Input() ribbonNum: number;
  @Input() contentTxt: string;

  constructor() {
  }

}
