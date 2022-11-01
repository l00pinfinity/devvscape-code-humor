import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { Observable, throwError } from 'rxjs';
import { map, shareReplay, retry, catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type':'application/json'})
};

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient) { }

  login(usernameOrEmail: string, password: string): Observable<any> {
    return this.http.post(environment.apiUrl + 'api/v1/auth/signin', {
      usernameOrEmail, password
    },httpOptions).pipe(
      map((response:any) =>{
        return response.object.map((loginResponse:any) =>{
          console.log(loginResponse);
          return loginResponse;
        })
      }),
      shareReplay(1),
      catchError(this.handleError)
    );
  }

  signup(email: string, username: string, password: string, bio: string): Observable<any> {
    return this.http.post(environment.apiUrl + 'api/v1/auth/signup', {
      email, username, password, bio
    },httpOptions);
  }

  public handleError(error: HttpErrorResponse){
    let errorMessage:string;
    if(error.error instanceof ErrorEvent){
      //Client side error
      errorMessage = `Error: ${error.message}`;
    }else{
      //Server side error
      switch (error.status) {
        case 400:
          errorMessage = `Bad request,something went wrong Code: ${error.status}`;
          break;
        case 401:
          errorMessage = `Unauthorized, You have entered an invalid username or password Code: ${error.status}`;
          break;
        case 402:
          errorMessage = `Payment required, something went wrong Code: ${error.status}`;
          break;
        case 403:
          errorMessage = `Forbidden, something went wrong Code: ${error.status}`;
          break;
        case 404:
          errorMessage = `Not found, something went wrong Code: ${error.status}`;
          break;
        case 405:
          errorMessage = `Method not allowed, something went wrong Code: ${error.status}`;
          break;
        case 406:
          errorMessage = `Not acceptable, something went wrong Code: ${error.status}`;
          break;
      
        default:
          break;
      }
    }
    return throwError(errorMessage);
  }

  logout() {
    localStorage.removeItem('devvsapeAccessToken');
    localStorage.removeItem('devvscapEexpiresIn');
    localStorage.removeItem('devvscapeFirstAppLoad');
  }

  public isLoggedIn() {
    return !!localStorage.getItem('devvsapeAccessToken');
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration(): moment.MomentInput {
    const expiration = localStorage.getItem('devvscapEexpiresIn');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  refresh(): void {
    window.location.reload();
  }
}
