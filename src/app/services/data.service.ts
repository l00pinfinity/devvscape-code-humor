import { Injectable } from '@angular/core';

export interface Images {
  userId: number;
  id: number;
  imageUrl: string;
  imageSize: number;
  imageHeight: number;
  imageWidth: number;
  sponsored: boolean;
  sponsoredLevel: number;
  views: number;
  downloads: number;
  likes: number;
  comments: number;
  color: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public images: Images[] = [
    {
      userId: 1,
      id: 0,
      imageUrl: 'https://via.placeholder.com/600/92c952',
      imageSize: 84535,
      imageHeight: 880,
      imageWidth: 720,
      sponsored: false,
      sponsoredLevel: 0,
      views: 0,
      downloads: 0,
      likes: 0,
      comments: 0,
      color: '#000000',
      createdAt: '2022-10-01 04:34:33'
    },
    {
      userId: 1,
      id: 1,
      imageUrl: 'https://via.placeholder.com/600/771796',
      imageSize: 84535,
      imageHeight: 880,
      imageWidth: 720,
      sponsored: false,
      sponsoredLevel: 0,
      views: 0,
      downloads: 0,
      likes: 0,
      comments: 0,
      color: '#000000',
      createdAt: '2021-10-01 04:34:33'
    },
    {
      userId: 1,
      id: 2,
      imageUrl: 'https://via.placeholder.com/600/24f355',
      imageSize: 84535,
      imageHeight: 880,
      imageWidth: 720,
      sponsored: false,
      sponsoredLevel: 0,
      views: 0,
      downloads: 0,
      likes: 0,
      comments: 0,
      color: '#000000',
      createdAt: '2020-10-01 04:34:33'
    },
    {
      userId: 1,
      id: 3,
      imageUrl: 'https://via.placeholder.com/600/92c952',
      imageSize: 84535,
      imageHeight: 880,
      imageWidth: 720,
      sponsored: false,
      sponsoredLevel: 0,
      views: 0,
      downloads: 0,
      likes: 0,
      comments: 0,
      color: '#000000',
      createdAt: '2022-10-01 04:34:33'
    },
    {
      userId: 1,
      id: 4,
      imageUrl: 'https://via.placeholder.com/600/771796',
      imageSize: 84535,
      imageHeight: 880,
      imageWidth: 720,
      sponsored: false,
      sponsoredLevel: 0,
      views: 0,
      downloads: 0,
      likes: 0,
      comments: 0,
      color: '#000000',
      createdAt: '2021-10-01 04:34:33'
    },
    {
      userId: 1,
      id: 5,
      imageUrl: 'https://via.placeholder.com/600/24f355',
      imageSize: 84535,
      imageHeight: 880,
      imageWidth: 720,
      sponsored: false,
      sponsoredLevel: 0,
      views: 0,
      downloads: 0,
      likes: 0,
      comments: 0,
      color: '#000000',
      createdAt: '2020-10-01 04:34:33'
    },
    {
      userId: 1,
      id: 6,
      imageUrl: 'https://via.placeholder.com/600/92c952',
      imageSize: 84535,
      imageHeight: 880,
      imageWidth: 720,
      sponsored: false,
      sponsoredLevel: 0,
      views: 0,
      downloads: 0,
      likes: 0,
      comments: 0,
      color: '#000000',
      createdAt: '2022-10-01 04:34:33'
    },
    {
      userId: 1,
      id: 7,
      imageUrl: 'https://via.placeholder.com/600/771796',
      imageSize: 84535,
      imageHeight: 880,
      imageWidth: 720,
      sponsored: false,
      sponsoredLevel: 0,
      views: 0,
      downloads: 0,
      likes: 0,
      comments: 0,
      color: '#000000',
      createdAt: '2021-10-01 04:34:33'
    },
    {
      userId: 1,
      id: 8,
      imageUrl: 'https://via.placeholder.com/600/24f355',
      imageSize: 84535,
      imageHeight: 880,
      imageWidth: 720,
      sponsored: false,
      sponsoredLevel: 0,
      views: 0,
      downloads: 0,
      likes: 0,
      comments: 0,
      color: '#000000',
      createdAt: '2020-10-01 04:34:33'
    }
  ];

  constructor() { }

  public getImages(): Images[] {
    return this.images;
  }

  public getImageById(id: number): Images {
    return this.images[id];
  }
}
