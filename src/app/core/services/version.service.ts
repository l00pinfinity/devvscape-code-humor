import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  version:string = "v.1.1";

  constructor() { }

  getCurrentVersion(){
    return this.version;
  }
}
