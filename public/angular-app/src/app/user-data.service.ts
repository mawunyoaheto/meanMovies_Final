import { LoginToken } from './login/login.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

import { User } from './users/users.component';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
public authourizedUser={
name:'',
authorized:false
};

  public errorMsg: string | undefined = undefined;
  private baseUrl = environment.apiURL;
  constructor(private _http:HttpClient) { }

  public registerUser(user: User) {
    console.log(user);
    return this._http.post(`${this.baseUrl}users`, user);
  }

  getUsers(): Observable<User[]> {
    return this._http.get<User[]>(`${this.baseUrl}users`);

  }

  userLogin(user:User):Observable<LoginToken>{
    return this._http.post<LoginToken>(`${this.baseUrl}users/login`,user);
  }

  public getUsersByCount(offset: number, count: number): Observable<User[]> {
    const url: string = `${this.baseUrl}/users?offset=${offset}&count=${count}`;
    return this._http.get<User[]>(url);
  }

  blockUser(userId: string): Observable<User> {
    console.log(userId);
    return this._http.delete<User>(`${this.baseUrl}users/${userId}`);
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
