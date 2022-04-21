import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserDataService } from '../user-data.service';
import { AuthenticationService } from '../authentication.service';
import { environment } from 'src/environments/environment';

export class LoginToken{
  success:boolean=false;
  token: string=";"
}

export class Credentials {
  name!: string;
  email!: string;
  password!: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  get name() { return this.userAuth.name };
  get authorized() { return this.userAuth.isLoggedIn };

  welcome_msg=environment.login_sucess_message;

  loginForm!: FormGroup;

  constructor(private _router: Router,
    public formBuilder: FormBuilder,
    private userService: UserDataService,
    private userAuth: AuthenticationService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      _id: [null],
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  onLogin() {
    this.userService.userLogin(this.loginForm.value).subscribe({
      next: (loginToken) => this._login(loginToken),
      error: (e) => console.log(e),
      complete: () => this._loginCompleted()
    })
  }

  onLogout() {
    this.userAuth.deleteToken();
    this._router.navigate(['']);
  }

  _login(loginToken: LoginToken): void {
    console.log("loginResponse", loginToken);
    this.userAuth.token = loginToken.token;
    this._router.navigate(['']);
  }

  _loginCompleted(){
    this.userAuth.isLoggedIn = true;
    this.userService.authourizedUser.authorized = this.authorized;
    this.loginForm.reset();
    this._redirect();
  }

  _redirect(){
    this._router.navigate(['movies']);
  }

}
