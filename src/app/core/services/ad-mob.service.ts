import { Injectable } from '@angular/core';
import { AdMob, BannerAdOptions, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';

@Injectable({
  providedIn: 'root'
})
export class AdMobService {

  constructor() { }

  async showBannerAd(adElementId: string, adUnitId: string) {
    const options: BannerAdOptions = {
      adId: adUnitId,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 60,
    };

    await AdMob.showBanner(options);

    const adElement = document.getElementById(adElementId);
    if (adElement) {
      adElement.style.height = '50px';
    }
  }

  async hideBannerAd(adElementId: string) {
    await AdMob.hideBanner();
    
    const adElement = document.getElementById(adElementId);
    if (adElement) {
      adElement.style.height = '0';
    }
  }
}