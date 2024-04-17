import { Component, OnInit } from '@angular/core';
import { BannerService } from 'src/app/services/banner/banner.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-add-banner',
  templateUrl: './add-banner.page.html',
  styleUrls: ['./add-banner.page.scss'],
})
export class AddBannerPage implements OnInit {
  bannerImage: any;
  banner_file: any;
  files: any;

  constructor(
    private bannerService: BannerService,
    private globalService: GlobalService
  ) { }

  ngOnInit() {
  }

  onPreview(event) {
    this.globalService.showLoader();
    console.log('event: ', event);
    const files = event.target.files;
    if (files.length == 0) return;
    const mimeType = files[0].type;
    if(mimeType.match(/image\/*/) == null) return;
    this.files = files;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log('result: ', reader.result);
      this.bannerImage = reader.result;
    };
    reader.readAsDataURL(file);
    this.banner_file = file;
    this.globalService.hideLoader();
  }

  async onSave() {
    try {
      this.globalService.showLoader();
      console.log('file', this.banner_file);
      let postData = new FormData;
      postData.append('banner', this.banner_file, this.banner_file.name);
      const response = await this.bannerService.addBanner(postData);
      console.log('response: ', response);
      this.globalService.hideLoader();
    } catch(e) { 
      this.globalService.hideLoader();
      console.log(e);
    }
  }

}
