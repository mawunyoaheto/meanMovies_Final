import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { MoviesDataService } from './../movies-data.service';
import { AuthenticationService } from '../authentication.service';
import { Movie } from '../movies/movies.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  movies!: Movie[];
  searchForm!:FormGroup
  showErrorPage = false;
  errorMsg!: string;
  constructor(public formBuilder: FormBuilder,
    private _moviesService: MoviesDataService,
    private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      title: ['', Validators.required],
    })
  }


  search(){
    this._moviesService.searchMovies(this.searchForm.controls['title'].value).subscribe({
      next: (response) => this.fillMoviesFromService(response),
      error: (e) => this.displayError(e),
      complete: () => console.log(this.movies)
    });
  }

  private fillMoviesFromService(movies: Movie[]) {
    this.movies = movies;
  }

  displayError(error: Error) {
    this.errorMsg = error.message;
    this.showErrorPage = !this.showErrorPage;
    console.log(this.showErrorPage);
  }
}
