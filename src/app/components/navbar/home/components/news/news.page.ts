import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { AdMobService } from 'src/app/core/services/ad-mob.service';
import { loadBestStories, loadNewStories, loadTopStories } from 'src/app/core/store/actions/hacker-news.actions';
import { selectTopStories, selectBestStories, selectNewStories, selectHackerNewsError } from 'src/app/core/store/selectors/hacker-news.selectors';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {

  topStories$ = this.store.pipe(select(selectTopStories));
  bestStories$ = this.store.pipe(select(selectBestStories));
  newStories$ = this.store.pipe(select(selectNewStories));
  error$ = this.store.pipe(select(selectHackerNewsError));

  constructor(private store: Store, private adMobService: AdMobService, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.store.dispatch(loadTopStories());
    this.store.dispatch(loadBestStories());
    this.store.dispatch(loadNewStories());
  }

  ionViewWillEnter() {
    this.adMobService.showBannerAd('news-banner-ad','ca-app-pub-6424707922606590/7406922852');
  }
}
