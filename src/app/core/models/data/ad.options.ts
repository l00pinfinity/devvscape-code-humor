import { BannerAdOptions, BannerAdSize, BannerAdPosition, AdOptions } from "@capacitor-community/admob";

export const bannerTopOptions: BannerAdOptions = {
  adId: 'ca-app-pub-3940256099942544~3347511713',
  adSize: BannerAdSize.ADAPTIVE_BANNER,
  position: BannerAdPosition.TOP_CENTER,
  // npa: false,
};

export const bannerBottomOptions: BannerAdOptions = {
  adId: 'ca-app-pub-3940256099942544~3347511713',
  adSize: BannerAdSize.ADAPTIVE_BANNER,
  position: BannerAdPosition.BOTTOM_CENTER,
  npa: true,
};

export const rewardOptions: AdOptions = {
  adId: 'ca-app-pub-3940256099942544~3347511713',
};

export const interstitialOptions: AdOptions = {
  adId: 'ca-app-pub-3940256099942544~3347511713',
};