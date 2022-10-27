import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  public setSession(response: { expiresIn: moment.DurationInputArg1; accessToken: string; }){
    const expiresAt = moment().add(response.expiresIn, 'second');

    localStorage.removeItem('devvsapeAccessToken');
    localStorage.setItem('devvsapeAccessToken', response.accessToken);
    localStorage.setItem('devvscapEexpiresIn', JSON.stringify(expiresAt.valueOf()));
  }

  public getAccessToken():string | null{
    return localStorage.getItem('devvsapeAccessToken');
  }
}
