import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { Observable } from 'rxjs';

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
    },httpOptions);
  }

  signup(email: string, username: string, password: string, bio: string): Observable<any> {
    return this.http.post(environment.apiUrl + 'api/v1/auth/signup', {
      email, username, password, bio
    },httpOptions);
  }

  logout() {
    localStorage.removeItem('devvsapeAccessToken');
    localStorage.removeItem('devvscapEexpiresIn');
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
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
