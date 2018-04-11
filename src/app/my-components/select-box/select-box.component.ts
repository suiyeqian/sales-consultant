import { Component, Input, EventEmitter, Output, OnChanges } from '@angular/core';

@Component({
  selector: 'my-select-box',
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.scss']
})
export class SelBoxComponent implements OnChanges {
  ifShowSelBox: boolean;
  @Input() seledItem: any;
  @Input() selItems = [];
  @Output() getSelItems = new EventEmitter<number>();
  @Output() onSelChanged = new EventEmitter<number>();

  constructor() {
  }

  ngOnChanges() {
  }

  showSelBox(): void {
    this.ifShowSelBox = !this.ifShowSelBox;
    this.getSelItems.emit();
  }
  switchSel(selected): void {
    this.seledItem = selected;
    this.ifShowSelBox = false;
    this.onSelChanged.emit(selected);
  }

}
