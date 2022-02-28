import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserProfileEditComponent } from '../user-profile-edit/user-profile-edit.component';
import { DirectorCardComponent } from '../director-card/director-card.component';

import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-profile-card',
  templateUrl: './user-profile-card.component.html',
  styleUrls: ['./user-profile-card.component.scss']
})
export class UserProfileCardComponent implements OnInit {
  user: any = localStorage.getItem('username');
  favorite: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getFavs();
  }

  /**
   * call API end-point to get the current user's information
   * @function getCurrentUser
   * @param 
   * @return user's data in json format
   */
  getCurrentUser(): void {
    this.fetchApiData.getUserProfile().subscribe((resp: any) => {
      this.user = resp;
      //this.favorite = resp.FavMovies;
      console.log(this.user)
      return (this.user, this.favorite);
    });
  }

  /**
   * open a dialog to edit the user profile
   * @module EditProfileComponent
   */
  openEditUserProfile(): void {
    this.dialog.open(UserProfileEditComponent, {
      width: '500px'
    });
  }

  /**
   * get user's FavoriteMovies from the user's data
   */
  getFavs() {
    const user = localStorage.getItem('user');
    this.fetchApiData.getUserProfile().subscribe((resp: any) => {
      this.favorite = resp.FavMovies;
      console.log(this.favorite);
    return this.favorite;
    });
  }

  // getFavs() {
  //   let movies: any[] = [];
  //   this.fetchApiData.getAllMovies().subscribe((res: any) => {
  //     movies = res;
  //     movies.forEach((movie: any) => {
  //       if (this.user.favorite.includes(movie._id)) {
  //         this.favorite.push(movie);
  //       }
  //     });
  //   });
  //   return this.favorite;
  // }
  
  /**
   * use API end-point to remove user favorite
   * @function removeFav
   * @param movieId {string}
   * @returns updated user's favorite list in json format
   */
  removeFav(movieId: string): void {
    this.fetchApiData.deleteFavoriteMovies(movieId).subscribe((res: any) => {
      this.snackBar.open('Removed from favorite', 'OK', {
        duration: 2000,
      });
      this.ngOnInit();
      // console.log(this.favorite);
      return this.favorite;
    })
  }

  /**
   * call API end-point to remove the current user
   * @function deleteUser
   * @param Username {any}
   * @return remove status
   */
  deleteProfile(): void {
    if (confirm('Are you sure? This cannot be undone.')) {
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open('Your account was deleted', 'OK', {duration: 2000});
      });
      this.router.navigate(['welcome'])
      this.fetchApiData.deleteUserProfile().subscribe(() => {
        localStorage.clear();
      });
    }
  }
}
