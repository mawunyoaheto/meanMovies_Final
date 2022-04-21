import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { UserDataService } from './../user-data.service';
import { AuthenticationService } from '../authentication.service';
import { environment } from './../../environments/environment';

export class User {
  #_id!: string;
  #name!: string;
  #email!: string;
  #password!: string;

  get _id() { return this.#_id };
  get name() { return this.#name };
  get email() { return this.#email };
  get password() { return this.#password }

  set _id(id: string) {
    this.#_id = id;
  }
  set name(name: string) {
    this.#name = name;
  }

  set email(email: string) {
    this.#email = email;
  }

  set password(passsword: string) {
    this.#password = passsword;
  }

  constructor(user: any) {
    this.#_id = user.id;
    this.#name = user.name;
    this.#email = user.email;
    this.#password = user.password;
  }
}
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users!: User[];
  name: any
  get authorized(){return this.authService.isLoggedIn;};

  title=environment.users_component_title

  offset = environment.offset;
  count = environment.count;
  selected = environment.selected;
  showErrorPage = false;
  errorMsg!: string;

  previousButtonDisabled = true;
  nextButtonDisabled = true;
  editState = false;
  constructor(private userService: UserDataService,
    private router: Router,
    private authService:AuthenticationService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  fillUsersFromService(users: User[]) {
    this.users = users;
    this.nextButtonDisabled = (users.length > 0) ? false : true;
  }

  loadUsers(): void {
    console.log('load clicked');
    this.userService.getUsers().subscribe({
      next: (response) => this.fillUsersFromService(response),
      error: (e) => this.displayError(e),
      complete: () => console.info('complete')
    });

  }


  onBlock(id: string) {
    this.userService.blockUser(id).subscribe({
      next: (response) => console.log(response),
      error: (e) => this.displayError(e),
      complete: () => this.loadUsers()
    })
  }

  onChange($event: any, selectedValueFromDropDown: any) {
    this.offset = 0;
    this.count = parseInt(selectedValueFromDropDown);

    this.userService.getUsersByCount(this.offset, this.count).subscribe({
      next: response => this.fillUsersFromService(response),
      error: (e) => {
      }
    });
  }


  previous(itemsPerPage: any) {
    itemsPerPage = parseInt(itemsPerPage);
    if ((this.offset - itemsPerPage) <= 0) {
      this.offset = 0
      this.previousButtonDisabled = !this.previousButtonDisabled;
    } else {
      this.offset -= itemsPerPage;
    }
    this.count = itemsPerPage;

    this.userService.getUsersByCount(this.offset, this.count).subscribe({
      next: response => this.fillUsersFromService(response),
      error: (e) => this.displayError(e),
      complete: () => console.log('previous')
    });
  }

  next(itemsPerPage: any) {
    itemsPerPage = parseInt(itemsPerPage);
    this.offset = this.offset + itemsPerPage;
    this.count = itemsPerPage;

    this.userService.getUsersByCount(this.offset, this.count).subscribe({
      next: response => this.fillUsersFromService(response),
      error: (e) => this.displayError(e),
      complete: () => this.previousButtonDisabled = false

    });
  }

  displayError(error: Error) {
    this.errorMsg = error.message;
    this.showErrorPage = !this.showErrorPage;
    console.log(this.showErrorPage);
  }

  editUser(user: User) {
  }

  resetPassword(user: User) {
  }
}
