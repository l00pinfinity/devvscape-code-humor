import { Injectable } from '@angular/core';
import { Resolve,ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class DataResolverService implements Resolve<any>{

  constructor(private data: DataService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let id = Number(route.paramMap.get('id'));
    return this.data.getImageById(id);
  }
}
