import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';

import Swiper from 'swiper';
import { Autoplay } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';

export interface Slide {
  cardClass: string;
  illustration: string;
  icon: string;
  tag: string;
  titleStart: string;
  titleEm: string;
  titleEnd: string;
  description: string;
}

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('swiperRef', { static: false })
  private swiperRef!: ElementRef<
    HTMLElement & { swiper: Swiper; initialize: () => void }
  >;

  activeIndex = 0;

  readonly swiperConfig: SwiperOptions = {
    modules: [Autoplay],
    speed: 420,
    slidesPerView: 1,
    autoplay: {
      delay: 4500,
      disableOnInteraction: true,
    },
    on: {
      slideChange: (swiper: Swiper) => {
        this.activeIndex = swiper.activeIndex;
      },
    },
  };

  readonly slides: Slide[] = [
    {
      cardClass: 's1',
      illustration: '01',
      icon: '',
      tag: 'Welcome',
      titleStart: 'Memes made for ',
      titleEm: 'developers',
      titleEnd: ', by developers',
      description:
        'Devvscape is your escape — a community hub where programmers bond over debugging nightmares, API struggles, and the sweet victories of clean code.',
    },
    {
      cardClass: 's2',
      illustration: '02',
      icon: '',
      tag: 'Curated Feed',
      titleStart: 'A feed full of ',
      titleEm: 'relatable',
      titleEnd: ' dev humour',
      description:
        "Browse hand-picked memes on binary confusion, off-by-one errors, merge conflicts, and every Stack Overflow moment you've lived through.",
    },
    {
      cardClass: 's3',
      illustration: '03',
      icon: '',
      tag: 'Privacy First',
      titleStart: 'Zero data collected, ',
      titleEm: 'always',
      titleEnd: '',
      description:
        'We collect nothing. No tracking, no third-party sharing. All traffic is encrypted in transit and you can request deletion any time.',
    },
    {
      cardClass: 's4',
      illustration: '04',
      icon: '',
      tag: 'Global Community',
      titleStart: 'Available in ',
      titleEm: '6 languages',
      titleEnd: ' worldwide',
      description:
        'English, Spanish, German, French, Portuguese, and Swahili — share your own memes and connect with developers across the globe.',
    },
  ];

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe(async user => {
      if (user) {
        const successToast = await this.toastCtrl.create({
          message: 'Logged in...',
          duration: 5000,
          position: 'bottom',
          color: 'success',
        });
        await successToast.present();
        this.router.navigateByUrl('');
      }
    });
  }

  ngAfterViewInit(): void {
    this.initSwiper();
  }

  ngOnDestroy(): void {
    this.swiper?.destroy();
  }

  private initSwiper(): void {
    const el = this.swiperRef?.nativeElement as any;
    if (!el) return;

    Object.assign(el, this.swiperConfig);
    el.initialize();
  }

  private get swiper(): Swiper | undefined {
    return (this.swiperRef?.nativeElement as any)?.swiper;
  }

  goToSlide(index: number): void {
    this.activeIndex = index;
    this.swiper?.slideTo(index, 420);
  }

  skipToEnd(): void {
    this.goToSlide(this.slides.length - 1);
  }

  goToSignup(): void {
    this.navCtrl.navigateForward('/signup');
  }

  goToLogin(): void {
    this.navCtrl.navigateForward('/login');
  }
}
