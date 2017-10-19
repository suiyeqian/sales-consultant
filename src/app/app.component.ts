import { Component } from '@angular/core';

/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  styles: [`
    :host {
      display: block;
    }
  `],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {

  constructor(
  ) {}

}
