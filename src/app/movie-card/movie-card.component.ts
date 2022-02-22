import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
//import { UserRegistrationService } from '../fetch-api-data.service';
import { DescriptionCardComponent } from '../description-card/description-card.component';
import { DirectorCardComponent } from '../director-card/director-card.component';
import { GenreCardComponent } from '../genre-card/genre-card.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  movies: any[] = [];
  username: any = localStorage.getItem('username');
  currentUser: any = null;
  currentFavs: any = null;
  isInFavs: boolean = false;
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public router: Router,
    public snackBar: MatSnackBar
    ) { }

  // inline Annotation for the return, which is void(None)
ngOnInit(): void {
  this.getMovies();
  this.getCurrentUser();
}

getCurrentUser(): void {
    this.fetchApiData.getUserProfile().subscribe((resp: any) => {
      this.currentUser = resp;
      this.currentFavs = resp.Favorites;
      return (this.currentUser, this.currentFavs);
    });
  }

getMovies(): void {
  this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  openGenreDialog(
    Name: string,
    Description: string
  ): void {
    this.dialog.open(GenreCardComponent, {
      data: {
        Name,
        Description,
      },
      width: '500px'
    });
  }

  openDescriptionDialog(
    Title: string,
    Genre: string,
    Description: string,
    Year: number
  ): void {
    this.dialog.open(DescriptionCardComponent, {
      data: {
        Title,
        Genre,
        Description,
        Year
      },
      width: '500px'
    });
  }

  openDirectorDialog(
    Name: string,
    Bio: string,
    Birth: Date,
    Death: Date
  ): void {
    this.dialog.open(DirectorCardComponent, {
      data: {
        Name,
        Bio,
        Birth,
        Death
      },
      width: '500px'
    });
  }

  openProfile(): void {
    this.router.navigate(['profile']);
  }

  logOut(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }

  addToFavs(movieId: string): void {
    //checking if the title is already in favs
    if (this.currentFavs.filter(function (e: any) { return e._id === movieId; }).length > 0) {
      this.snackBar.open('Already in your favorite list', 'OK', { duration: 1000 });
      return
    } else {
      this.fetchApiData.addFavoriteMovies(movieId).subscribe((resp: any) => {
        this.getCurrentUser();
        this.ngOnInit();
        this.snackBar.open('Added to your favorite list', 'OK', { duration: 1000 });
      });
    }
  }
  
  removeFromFavs(movieId: string): void {
    this.fetchApiData.deleteFavoriteMovies(movieId).subscribe((resp: any) => {
      this.snackBar.open('Removed from favs', 'OK', { duration: 2000 });
      this.getCurrentUser();
      this.ngOnInit();
      2000
    });
  }

  favCheck(movieId: string): any {
    let favIds = this.currentFavs.map(function (fav: any) { return fav._id });
    if (favIds.includes(movieId)) {
      this.isInFavs = true;
      return this.isInFavs;
    };
  }

}