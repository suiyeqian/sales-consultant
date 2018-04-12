import { Component, Input, EventEmitter, Output, OnChanges } from '@angular/core';

import { BackendService } from '../../core/services/backend.service';

@Component({
  selector: 'my-select-box',
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.scss']
})
export class SelBoxComponent implements OnChanges {
  ifShowSelBox: boolean;
  selItems = [];
  @Input() seledItem: any;
  @Input() dataUrl: string;
  // @Output() getSelItems = new EventEmitter<number>();
  @Output() onSelChanged = new EventEmitter<number>();

  constructor(
    private bdService: BackendService
  ) {
  }

  ngOnChanges() {
  }

  showSelBox(): void {
    this.ifShowSelBox = !this.ifShowSelBox;
    this.bdService
        .getDataByPost(this.dataUrl, {posId: localStorage.posId})
        .then((res) => {
          if ( res.code === 0) {
            this.selItems = res.data;
            this.selItems.unshift({value: '', text: '全部'});
          }
        });
    // this.getSelItems.emit();
  }
  switchSel(selected): void {
    this.seledItem = selected;
    this.ifShowSelBox = false;
    this.onSelChanged.emit(selected);
  }

}
