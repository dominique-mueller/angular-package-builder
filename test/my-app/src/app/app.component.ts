import { Component } from '@angular/core';

import { LIBDataService } from 'my-library';

/**
 * App Component
 */
@Component( {
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css'
  ]
} )
export class AppComponent {

  /**
   * App title
   */
  public readonly title: string;

  /**
   * Input label
   */
  public label: string;

  /**
   * Constructor
   *
   * @param dataService - Data service
   */
  constructor( private dataService: LIBDataService ) {
    this.title = 'My App!';
    this.label = 'My cool input!';
    dataService.setData( 'user', 'the_greatest_user' );
  }

}
