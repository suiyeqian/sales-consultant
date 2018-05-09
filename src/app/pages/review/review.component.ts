import { Component, OnInit, AfterContentInit } from '@angular/core';

import * as echart from '../../echarts';

@Component({
  selector: 'my-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit, AfterContentInit {
  curTab: string;

  constructor() {}

  ngOnInit() {
    this.changeTab('track');

  }

  ngAfterContentInit() {
    if (document.body.scrollTop > 0) {
      document.body.scrollTop = 0;
    }
  }

  changeTab(type): void {
    if (type === this.curTab) {
      return;
    }
    this.curTab = type;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop > 0) {
      window.scrollTo(0, 0);
    }
  }
}
