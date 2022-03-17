/**
 * The NavbarComponent is used to display the main views of the app after the user has logged in.
 * Signout the user when they wish to end their current movie-api session.
 * @module NavbarComponent
 */

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router
  ) {}

  ngOnInit(): void {}

  /**
   * After registration or signin a list of movies will be displayd to a user '
   */
  goToMoviesPage(): void {
    this.router.navigate(['movies']);
  }

  /**
   * After registration or signin a user navigates to 'profile page'
   */
  goToProfilePage(): void {
    this.router.navigate(['profile']);
  }

  /**
   * log out the current user and clear the localstorage. Then redirect the current user to 'welcome page'
   */
  logout(): void {
    localStorage.clear();
    this.router.navigate(['welcome']).then(() => {
      window.location.reload();
    });
  }
}
