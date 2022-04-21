import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { Movie, Actor } from './movies/movies.component';

@Injectable({
  providedIn: 'root'
})
export class MoviesDataService {

  public errorMsg: string | undefined = undefined;
  private baseUrl = environment.apiURL;
  constructor(private _http: HttpClient) {

  }
  ngOnInit(): void {

  }
  getMovies(): Observable<Movie[]> {
    return this._http.get<Movie[]>(this.baseUrl + "movies");

  }

  public getMoviesByCount(offset: number, count: number): Observable<Movie[]> {
    const url: string = `${this.baseUrl}/movies?offset=${offset}&count=${count}`;
    return this._http.get<Movie[]>(url);
  }

  public getMovie(id: string): Observable<Movie> {
    const url: string = this.baseUrl + "movies/" + id;
    return this._http.get<Movie>(url);
  }

  public searchMovies(title: string): Observable<Movie[]> {
    console.log("Search Service",title);
    const url: string = `${this.baseUrl}/movies?search=${title}`;
    console.log(url);
    return this._http.get<Movie[]>(url);
  }


  public addMovie(movie: Movie) {
    return this._http.post(this.baseUrl + "movies/", movie);
  }


  public editMovie(movie: Movie) {
    return this._http.put(`${this.baseUrl}movies/${movie._id}`, movie);
  }

  deleteMovies(movieId: any): Observable<any> {
    return this._http.delete(`${this.baseUrl}movies/${movieId}`);
  }


  getActors(movie_Id: string): Observable<any> {
    let url = `${this.baseUrl}movies/${movie_Id}/actors`

    console.log('actors-list-url', url);
    return this._http.get<Actor[]>(url);

  }
  public addActor(movieId: string, actor: Actor) {
    console.log('add-actor-movieId', movieId)
    return this._http.post(`${this.baseUrl}movies/${movieId}/actors`, actor);
  }


  public editActor(actor: Actor) {
    return this._http.put(`${this.baseUrl}movies/actors/${actor._id}`, actor);
  }
  deleteActors(movieId: string, actorId: string): Observable<any> {
    // console.log('service-actorId',actorId)
    return this._http.delete(`${this.baseUrl}movies/${movieId}/actors/${actorId}`);
  }


  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }

    // this.errorMsg = error.message;
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

}
