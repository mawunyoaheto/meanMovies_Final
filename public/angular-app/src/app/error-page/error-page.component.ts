import { Component, Input, OnInit } from '@angular/core';

import { MoviesDataService } from './../movies-data.service';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {

  @Input()
  errorMessage: string="";

  constructor(private service:MoviesDataService) { }

  ngOnInit(): void {

  }

}
