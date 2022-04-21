import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MoviesDataService } from '../movies-data.service';
import {Movie } from '../movies/movies.component';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {

  movie!: Movie
  movieId!: string
  errorMsg!: string;
  showErrorPage = false;

  constructor(private movieService: MoviesDataService,
    private route: ActivatedRoute,
    private _router: Router,
    private appService: AppService) {
    this.movie = new Movie({ _id: "1", title: "Lord of the rings", year: 2022, actors: [{ name: "Mike Pence", awards: 3 }, { name: "Joana Annan", awards: 8 }] });
  }

  ngOnInit(): void {
    this.movieId = this.route.snapshot.params["movieId"];

    this.movieService.getMovie(this.movieId).subscribe({
      next: (response) => this.fillMovieFromService(response),
      error: (e) => console.error(e),
      complete: () => console.log('get movie', this.movie)
    });
  }

  private fillMovieFromService(movie: Movie): void {
    this.movie = movie;
    console.log('got movie', movie);
  }

  onDelete(movie_id: string) {
    this.movieService.deleteMovies(movie_id).subscribe({
      next: (response) => console.log('delete-response', response),
      error: (e) => this.displayError(e),
      complete: () => {
        this._redirect()
        console.info('delete successful')
      }
    });

    console.log('deleted movieId: ' + movie_id);
  }

  displayError(error: Error) {
    this.errorMsg = error.message;
    this.showErrorPage = !this.showErrorPage;
    console.log(this.showErrorPage);
  }


  _redirect(){
    this._router.navigate(['movies']);
  }
}
