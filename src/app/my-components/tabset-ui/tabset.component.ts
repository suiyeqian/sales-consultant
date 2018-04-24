import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'my-tabset-ui',
  templateUrl: './tabset.component.html',
  styleUrls: ['./tabset.component.scss']
})
export class TabsetComponent {
  @Input() tabList: Array<any>;
  @Input() curTab: any;
  @Output() onTabChanged = new EventEmitter<any>();

  constructor() {
  }

  switchTab(tab): void {
    this.curTab = tab;
    this.onTabChanged.emit(tab);
  }

}
