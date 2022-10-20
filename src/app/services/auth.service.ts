import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http:HttpClient) { }

  login(usernameOrEmail:string,password:string):Observable<any>{
    return this.http.post(environment.apiUrl + 'api/v1/auth/signin',{
      usernameOrEmail,password
    });
  }

  signup(email:string,username:string,password:string,bio:string):Observable<any>{
    return this.http.post(environment.apiUrl + 'api/v1/auth/signup',{
      email,username,password,bio
    });
  }

  setSession(response: { expiresIn: moment.DurationInputArg1; accessToken: string; }): any {
    const expiresAt = moment().add(response.expiresIn,'second');

    sessionStorage.setItem('accessToken',response.accessToken);
    sessionStorage.setItem('expiresIn',JSON.stringify(expiresAt.valueOf()));
  }

  logout(){
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('expiresIn');
  }

  public isLoggedIn(){
    return moment().isBefore(this.getExpiration());
  }
  
  isLoggedOut(){
    return !this.isLoggedIn();
  }

  getExpiration(): moment.MomentInput {
    const expiration = sessionStorage.getItem('expiresIn');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}
