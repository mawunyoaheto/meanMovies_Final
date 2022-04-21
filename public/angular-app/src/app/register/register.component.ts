import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

import { UserDataService } from './../user-data.service';
import { User } from '../users/users.component';
import { AuthenticationService } from '../authentication.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerUserForm!: FormGroup;
  title=environment.register_user_html_component_title;
  editState= false;
  editData!:User;


  get authorized(){return this.authService.isLoggedIn};

  constructor(private userService: UserDataService,
    private router: Router, public formBuilder: FormBuilder,
    private authService: AuthenticationService) { }

  ngOnInit(): void {

    this.registerUserForm = this.formBuilder.group({
      _id: [null],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    });

    if (this.editState==true) {
      this.registerUserForm.patchValue({
        _id: this.editData._id,
        name: this.editData.name,
        email: this.editData.email
      });
    } else {
      this.registerUserForm.reset();
    }
  }

  addUser() {
    this.userService.registerUser(this.registerUserForm.value).subscribe({
      next: (response) => console.log('add-user', response),
      error: (e) => console.log('add-user-error', e),
      complete: () =>{

        if(this.authorized==true){
          console.log('register-authorized',this.authorized);
          this.router.navigate(['users']);
        }else{
          console.log('register-unauthorized',this.authorized);
          this.router.navigate(['']);
        }

      }
    })
  }

  onPasswordChange() {
    if (this.registerUserForm.controls['confirm_password'].value == this.registerUserForm.controls['password'].value) {
      this.registerUserForm.controls['confirm_password'].setErrors(null);
    } else {
      console.log('password-mismatch');
      this.registerUserForm.controls['confirm_password'].setErrors({ mismatch: true });
    }
  }
}


