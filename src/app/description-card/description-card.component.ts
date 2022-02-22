import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-description-card',
  templateUrl: './description-card.component.html',
  styleUrls: ['./description-card.component.scss']
})
export class DescriptionCardComponent implements OnInit {

  constructor(

    /**
     * Uses Inject to get the movie details from the movie object
     */
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Title: string,
      ImagePath: any,
      Year: number,
      Description: string,
      Genre: string
    }
  ) { }

  ngOnInit(): void {
  }

}
