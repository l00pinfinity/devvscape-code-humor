import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class VersionService {

  constructor(private firestore: Firestore) { }

  async getCurrentVersion() {
    try {
      const docRef = doc(this.firestore, 'appSettings', 'general');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return data['currentVersion'];
      } else {
        throw new Error('Document does not exist');
      }
    } catch (error) {
      throw new Error('Unable to fetch app version: ' + error);
    }
  }
}
