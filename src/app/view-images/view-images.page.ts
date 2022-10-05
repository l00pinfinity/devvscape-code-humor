import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService, Images } from '../services/data.service';

@Component({
  selector: 'app-view-message',
  templateUrl: './view-images.page.html',
  styleUrls: ['./view-images.page.scss'],
})
export class ViewImagesPage implements OnInit {
  public images: Images;

  constructor(
    private data: DataService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.images = this.data.getImageById(parseInt(id, 10));
  }

  getBackButtonText() {
    const win = window as any;
    const mode = win && win.Ionic && win.Ionic.mode;
    return mode === 'ios' ? 'Back' : '';
  }
}
