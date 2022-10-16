import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map, retry, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Images } from "../core/interface/images";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http:HttpClient) { }

  public getPaginatedImages(page:Number){
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

  public getImageById(id: number) {
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
      errorMessage = `Error: ${error.error.message}`;
    }else{
      errorMessage = `Error Code: ${error.status}\n Message: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
