import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SpinnerService } from '../core/services/spinner.service';

@Component({
  selector: 'my-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private spinner: SpinnerService,
  ) { }

  ngOnInit() {
    document.onclick = function() {
      let selBox = document.getElementsByClassName('sel-box');
      for (let i = 0; i < selBox.length; i++) {
        selBox[i].className = 'sel-box';
      }
    };
  }

}
