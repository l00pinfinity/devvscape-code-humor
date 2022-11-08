import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  version:string = "v.1.3";

  constructor() { }

  getCurrentVersion(){
    return this.version;
  }
}
