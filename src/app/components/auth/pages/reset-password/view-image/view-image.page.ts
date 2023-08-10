import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Image } from 'src/app/core/interface/image';
import { ImageService } from 'src/app/core/services/image.service';

@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.page.html',
  styleUrls: ['./view-image.page.scss'],
})
export class ViewImagePage implements OnInit {
  public image: Image;

  constructor(
    private imageService: ImageService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.imageService.getImagePostById(id.toString());
  }

  getBackButtonText() {
    const win = window as any;
    const mode = win && win.Ionic && win.Ionic.mode;
    return mode === 'ios' ? 'Inbox' : '';
  }
}
