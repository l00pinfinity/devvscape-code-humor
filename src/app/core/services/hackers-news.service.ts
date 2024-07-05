import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HackerNewsService {
  private baseUrl = 'https://hacker-news.firebaseio.com/v0';

  constructor(private http: HttpClient) { }

  getTopStories(): Observable<any[]> {
    return this.http.get<number[]>(`${this.baseUrl}/topstories.json`).pipe(
      map(ids => ids.slice(0, 10)),
      switchMap(ids => forkJoin(ids.map(id => this.getStory(id)))),
      catchError(error => {
        console.error('Error fetching top stories', error);
        return of([]);
      })
    );
  }

  getBestStories(): Observable<any[]> {
    return this.http.get<number[]>(`${this.baseUrl}/beststories.json`).pipe(
      map(ids => ids.slice(0, 10)),
      switchMap(ids => forkJoin(ids.map(id => this.getStory(id)))),
      catchError(error => {
        console.error('Error fetching best stories', error);
        return of([]); 
      })
    );
  }

  getNewStories(): Observable<any[]> {
    return this.http.get<number[]>(`${this.baseUrl}/newstories.json`).pipe(
      map(ids => ids.slice(0, 10)),
      switchMap(ids => forkJoin(ids.map(id => this.getStory(id)))),
      catchError(error => {
        console.error('Error fetching new stories', error);
        return of([]);
      })
    );
  }

  getStory(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/item/${id}.json`).pipe(
      catchError(error => {
        console.error(`Error fetching story with id ${id}`, error);
        return of(null);
      })
    );
  }
}
