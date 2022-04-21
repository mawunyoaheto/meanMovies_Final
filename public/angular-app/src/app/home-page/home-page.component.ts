import { Component, OnInit } from '@angular/core';

import { UserDataService } from './../user-data.service';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  title =environment.homepage_title +" "+this.UserService.authourizedUser.name;

  constructor(private UserService:UserDataService) { }

  ngOnInit(): void {
    this.title =environment.homepage_title +" "+this.UserService.authourizedUser.name;
  }

}
