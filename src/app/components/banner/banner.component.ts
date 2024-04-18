import { Component, Input, OnInit } from '@angular/core';
import { IonicSlides } from '@ionic/angular';
import { Banner } from 'src/app/interfaces/banner.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent  implements OnInit {
  serverUrl = environment.serverUrl;
  swiperModules = [IonicSlides];
  @Input() bannerImages: Banner[];

  constructor() { }

  ngOnInit() {}

}
