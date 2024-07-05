import { Component, OnInit } from '@angular/core';
import { AdMobService } from 'src/app/core/services/ad-mob.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  constructor(private adMobService: AdMobService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.adMobService.showBannerAd('notification-banner-ad','ca-app-pub-6424707922606590/1224657880');
  }

}
