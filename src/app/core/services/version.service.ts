import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  version = 'v.2.0.0';

  constructor() {}

  getCurrentVersion() {
    return this.version;
  }
}
