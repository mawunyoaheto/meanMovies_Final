import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import { MoviesDataService } from '../movies-data.service';
import { AppService } from './../app.service';


export class Actor {
  #_id!: string;
  #name!: string;
  #awards!: number;

  get _id() { return this.#_id; }
  get name() { return this.#name; }
  get awards() { return this.#awards; }

  set _id(_id: string) { this.#_id = _id; }

  set name(name: string) { this.#name = name; }
  set awards(awards: number) { this.#awards = awards; }

  constructor(actor: any) {
    this.#_id = actor._id;
    this.#name = actor.name;
    this.#awards = actor.awards;
  }
}



export class Movie {
  #_id!: string;
  #title!: string;
  #year!: number;
  #actors!: Actor[];

  get _id() { return this.#_id; }
  get actors() { return this.#actors; }
  get title() { return this.#title; }
  get year() { return this.#year; }

  set _id(_id: string) { this.#_id = _id; }

  set actors(actors: Actor[]) { this.#actors = actors; }
  set title(title: string) { this.#title = title; }
  set year(year: number) { this.#year = year; }

  constructor(movie: any) {
    this.#_id = movie._id;
    this.#actors = movie.actors;
    this.#title = movie.title;
    this.#year = movie.year;
  }
}

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
  movies!: Movie[];

  showForm = false;
  showErrorPage = false;
  addNewFormEditState = false;
  editData!: Movie;
  title: any
  errorMsg!: string;
  offset = environment.offset;
  count = environment.count;
  selected = environment.selected;

  previousButtonDisabled = true;
  nextButtonDisabled = true;

  constructor(private _moviesService: MoviesDataService,
    private _router: Router, private appService: AppService) {
  }

  loadMovies(): void {
    console.log('load clicked');
    this._moviesService.getMovies().subscribe({
      next: (response) => this.fillMoviesFromService(response),
      error: (e) => this.displayError(e),
      complete: () => console.info('complete')
    });

  }

  onDelete(movie_id: string) {
    this._moviesService.deleteMovies(movie_id).subscribe({
      next: (response) => console.log('delete-response', response),
      error: (e) => this.displayError(e),
      complete: () => {
        this.loadMovies();
        console.info('delete successful')
      }
    });

    console.log('deleted movieId: ' + movie_id);
  }


  ngOnInit(): void {

    this.loadMovies();
  }
  private fillMoviesFromService(movies: Movie[]) {
    this.movies = movies;
    this.nextButtonDisabled = (movies.length > 0) ? false : true;
  }
  openForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.addNewFormEditState = false;
    }
  }

  closeForm(event: boolean) {
    if (event) {
      this.addNewFormEditState = false;

      this.loadMovies();
      this.openForm();
    }
  }

  onAddMovie(): void {
    this._router.navigate(['addmovie']);
  }

  editMovie(movie: Movie) {
    this.addNewFormEditState = true;
    this.editData = movie;
    this.openForm();
  }


  onChange($event: any, selectedValueFromDropDown: any) {

    this.offset = 0;
    this.count = parseInt(selectedValueFromDropDown);

    console.log(this.offset)
    this._moviesService.getMoviesByCount(this.offset, this.count).subscribe({
      next: response => this.fillMoviesFromService(response),
      error: (e) => this.displayError(e)
    });
  }

  next(itemsPerPage: any) {
    itemsPerPage = parseInt(itemsPerPage);
    this.offset = this.offset + itemsPerPage;
    this.count = itemsPerPage;

    this._moviesService.getMoviesByCount(this.offset, this.count).subscribe({
      next: response => this.fillMoviesFromService(response),
      error: (e) => {
      },
      complete: () => {
        if (this.movies.length == 0) {
        }
        this.previousButtonDisabled = false
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

    this._moviesService.getMoviesByCount(this.offset, this.count).subscribe({
      next: response => this.fillMoviesFromService(response),
      error: (e) => this.displayError(e),
      complete: () => console.log('previous')
    });
  }

  displayError(error: Error) {
    this.errorMsg = error.message;
    this.showErrorPage = !this.showErrorPage;
    console.log(this.showErrorPage);
  }
}
