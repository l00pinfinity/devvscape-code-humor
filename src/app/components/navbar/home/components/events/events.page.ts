import { Component, OnInit } from '@angular/core';
import { AdMobService } from 'src/app/core/services/ad-mob.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

  constructor(private adMobService: AdMobService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.adMobService.hideBannerAd('home-banner-ad');
  }

  ionViewWillLeave() {
    this.adMobService.showBannerAd('news-banner-ad', 'ca-app-pub-6424707922606590/7406922852');
  }

}
