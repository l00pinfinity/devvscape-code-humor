import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Images } from '../interface/images';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http:HttpClient) { }

  public getPaginatedImages(page:Number):Observable<Images>{
    return this.http.get<Images> (environment.apiUrl + 'api/v1/devvscape/images/page/' + page).pipe(
      map((response:any) =>{
        return response.object.map((images:any) =>{
          return images;
        })
      }),
      shareReplay(1),
      retry(1),
      catchError(this.handleError)
    )
  }

  public getImages(){
    return this.http.get<Images> (environment.apiUrl + 'api/v1/devvscape/images').pipe(
      map((response:any) =>{
        return response.object.map((images:any) =>{
          return images;
        })
      }),
      shareReplay(1),
      retry(1),
      catchError(this.handleError)
    )
  }
  
  public getRandomImages(){
    return this.http.get<Images> (environment.apiUrl + 'api/v1/devvscape/images/random').pipe(
      map((response:any) =>{
        return response.object.map((images:any) =>{
          return images;
        })
      }),
      shareReplay(1),
      retry(1),
      catchError(this.handleError)
    )
  }

  public getImageById(id: number) :Observable<Images>{
    return this.http.get<Images> (environment.apiUrl + 'api/v1/devvscape/images/' + id).pipe(
      map((response:any) =>{
        return response.object.map((images:any) =>{
          return images;
        })
      }),
      shareReplay(1),
      retry(1),
      catchError(this.handleError)
    )
  }

  public handleError(error: HttpErrorResponse){
    let errorMessage:string;
    if(error.error instanceof ErrorEvent){
      //Client side error
      errorMessage = `Error: ${error.error.message}`;
    }else{
      //Server side error
      switch (error.status) {
        case 400:
          errorMessage = `Error Code: ${error.status} Bad request,something went wrong`;
          break;
        case 401:
          errorMessage = `Error Code: ${error.status} Unauthorized, something went wrong`;
          break;
        case 402:
          errorMessage = `Error Code: ${error.status} Payment required, something went wrong`;
          break;
        case 403:
          errorMessage = `Error Code: ${error.status} Forbidden, something went wrong`;
          break;
        case 404:
          errorMessage = `Error Code: ${error.status} Not found, something went wrong`;
          break;
        case 405:
          errorMessage = `Error Code: ${error.status} Method not allowed, something went wrong`;
          break;
        case 406:
          errorMessage = `Error Code: ${error.status} Not acceptable, something went wrong`;
          break;
      
        default:
          break;
      }
    }
    return throwError(errorMessage);
  }
}
