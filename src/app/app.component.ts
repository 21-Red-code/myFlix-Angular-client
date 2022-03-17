/**
 * The AppComponent is the root component that is rendered in the index.html file. Its template renders a router-outlet element, which displays content defined
 * by the routes in the app-routing-module.
 * @module AppComponent
 */

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'myFlix-Angular-client';
}
