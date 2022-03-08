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
  FavMovies: any[] = [];
  username: any = localStorage.getItem('username');
  currentUser: any = null;
  currentFavs: any[] = [];
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

  /**
   * use API call to get the current user info
   * @function getCurrentUser
   * @return user's info and user's favorite movies list
   */
getCurrentUser(): void {
    this.fetchApiData.getUserProfile().subscribe((resp: any) => {
      this.currentUser = resp;
      this.currentFavs = resp.FavMovies;
      return (this.currentUser, this.currentFavs);
    });
  }

/**
 * use API call to get all the movies
 * @function getMovies
 * @return all the movies in json format
 */
getMovies(): void {
  this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }
  
  /**
   * open a dialog to dispaly the current movie genre info
   * @param Name {string}
   * @param Description {string}
   */
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

  /**
   * open a dialog to display the cureent movie description
   * @param title {string}
   * @param description {string}
   * @button synopsis
   */
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

  /**
   * open a dialog to display the current movie director biography
   * @param name {string}
   * @param bio {string}
   * @param birth {string}
   * @param death {string}
   */
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

  /**
   * use API end-point to add user favorite movie
   * @function addToFavs
   * @param movieID {string}
   * @param title {string}
   * @returns movie id and two methods based on the response
   */
  addToFavs(movieId: string): void {
    //checking if the title is already in favs
    if (this.currentFavs.filter(function (e: any) { return e._id === movieId; }).length > 0) {
      this.snackBar.open('Already in your favorite list', 'OK', { duration: 3000 });
      return
    } else {
      this.fetchApiData.addFavoriteMovies(movieId).subscribe((resp: any) => {
        this.getCurrentUser();
        this.ngOnInit();
        this.snackBar.open('Added to your favorite list', 'OK', { duration: 3000 });
      });
    }
  }
  
  /**
   * use API end-point to remove user favorite
   * @function removeFromFavs
   * @param MovieId {string}
   * @returns updated user's data in json format
   */
  

  removeFav(movieId: string): void {
    this.fetchApiData.deleteFavoriteMovies(movieId).subscribe((resp: any) => {
      this.snackBar.open('Removed from favs', 'OK', { duration: 2000 });
    });
    this.ngOnInit();
  }
  // removeFromFavs(movieId: string): void {
  //   this.fetchApiData.deleteFavoriteMovies(movieId).subscribe((resp: any) => {
  //     this.snackBar.open('Removed from favs', 'OK', { duration: 2000 });
  //     this.getCurrentUser();
  //     this.ngOnInit();
  //     2000
  //   });
  // } 

  /**
   * check if the movie is the user's favorite?
   * @param movieId 
   * @returns boolean
   */

  favCheck(movieId: string): any {
    return this.currentFavs.some((id) => id === movieId);
  }
  // favCheck(movieId: string): any {
  //   let favIds = this.currentFavs.map((fav: any) => { return fav._id });
  //   if (favIds.includes(movieId)) {
  //     this.isInFavs = true;
  //     return this.isInFavs;
  //   };
  // }

  /**
   * toggle add/remove user's favorite movie
   * @Function add or remove a movie to/from user's favorite list 
   * @param movie 
   */
  toggleFavorite(movie: any): void {
    this.favCheck(movie._id)
      ? this.removeFav(movie._id)
      : this.addToFavs(movie._id);
  }
}
