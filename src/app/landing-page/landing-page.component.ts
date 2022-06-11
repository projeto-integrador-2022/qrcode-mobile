import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import CONTENTS from '../../assets/lib/contents.json';
import CONTENTS_PROD from '../../assets/lib/contents-prod.json';
import { Custumer } from '../models/custumer.model';
import { Qr } from '../models/qr.model';
import { DbService } from '../services/db.service';
import { VisitorServices } from '../services/visitors.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LandingPageComponent implements OnInit {
  SOCIAL_ICONS: any;
  checked: boolean = false;
  formGroup: any;
  qrData = <Qr>{};
  isCollapsed = false;
  announcementCharCount = 0;
  custumer = {} as Custumer;
  confirmVoucher: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private dbService: DbService,
    private visitorServices: VisitorServices) {
    if(environment.production){
      this.SOCIAL_ICONS = CONTENTS_PROD.SOCIAL_ICONS;
    }else{
      this.SOCIAL_ICONS = CONTENTS.SOCIAL_ICONS;
    }
    
  }

  ngOnInit(): void {
    this.createFormGroup();
    this.loadDbData(this.getUrl());
  }

  createFormGroup() {
    let emailregex: RegExp = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

    this.formGroup = this.formBuilder.group({
      'name': [null, [Validators.required, Validators.minLength(3)]],
      'email': [null, [Validators.required, Validators.pattern(emailregex)]],
    });
  }

  getUrl() {
    let urlFullLocation = window.location.pathname;
    let urlLocation = urlFullLocation.replace('/qrcode-mobile', '').replace('/', '');
    debugger;
    return urlLocation;
  }

  loadDbData(uuid: any) {
    this.dbService.getQr(uuid).subscribe(
      (data: any) => {
        this.qrData = data.find((x: any) => x.uuid == uuid);

        let str = this.qrData.announce;       
        if (str) {
          let array = str.split("");
          this.announcementCharCount = array.length;
        }       
      });

    this.getDeviceData();
  }

  setBoxHeight() {
    if (this.isCollapsed == true) {
      return 'auto';
    }
    if (this.announcementCharCount < 90) {
      return 'auto';
    }
    else return '200px'
  }

  onClick() {
    this.isCollapsed = !this.isCollapsed;
  }

  onCheck() {
    this.checked = true;
  }

  

  getDeviceData() {
    this.custumer.accessDate = new Date();
    this.custumer.os = navigator.platform;
    this.custumer.browser = navigator.userAgent;
    this.custumer.navigator = navigator.vendor;
    this.custumer.numberOfCores = navigator.hardwareConcurrency;

    this.getGeoLocation();
  }

  getGeoLocation() {
    this.visitorServices.getGEOLocation().subscribe(
      (data: any) => {
        this.custumer.city = data.geoplugin_city;
        this.custumer.state = data.geoplugin_region;
        this.custumer.ip = data.geoplugin_request;
      }
    )
  }

  saveRegistry() {
    console.log(this.custumer);
    
    this.visitorServices.saveCustumerData(this.custumer).subscribe();
  }


  navigateTo(redirect: string) {    
    let url;
    switch (redirect) {
      case 'officialpage':
        url = this.qrData.site_url;
        this.go(redirect, url);
        return;

      case 'whatsapp':
        url = this.qrData.whatsapp;
        this.go(redirect, url);
        return;

      case 'facebook':
        url = this.qrData.facebook;
        this.go(redirect, url);
        return;
      
      case 'instagram':
        url = this.qrData.instagram;
        this.go(redirect, url);
        return;
      
      case 'telegram':
        url = this.qrData.telegram;
        this.go(redirect, url);
        return;
      
      case 'youtube':
        url = this.qrData.youtube;
        this.go(redirect, url);
        return;

      case 'voucher':
        url = this.qrData.voucher_url;
        this.go(redirect, url);
        return;
    }
  }

  onSubmit(form: FormGroup) {
    this.confirmVoucher = true;
    this.custumer.name = form.value.name;
    this.custumer.email = form.value.email;
    this.saveExtras();

    this.saveRegistry();
  }

  go(redirect: string, url: string) {
    this.saveExtras();
    this.custumer.accessedPage = redirect
    this.custumer.sessionTime = Math.abs((new Date().getTime() - this.custumer.accessDate.getTime()) / 1000);
    this.saveRegistry();
    window.open(url, "_self");
  }

  saveExtras() {
    this.custumer.uuid = this.qrData.uuid;
    this.custumer.submitDate = new Date();   
  }

}
