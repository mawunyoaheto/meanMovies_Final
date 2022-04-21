import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  get authorized() { return this.authService.isLoggedIn };

  loginForm!: FormGroup;

  constructor(private _router: Router,
    public formBuilder: FormBuilder,
    private authService: AuthenticationService) { }

  ngOnInit(): void {
  }
  onHome(): void {
    this._router.navigate(['']);
  }

  onMovies(): void {
    this._router.navigate(['movies']);
  }

  onSearch(): void {
    this._router.navigate(['search']);
  }

  onUsers(): void {
    this._router.navigate(['users']);
  }
  onRegister(): void {
    this._router.navigate(['register']);

  }
}
