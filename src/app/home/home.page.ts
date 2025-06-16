import { Contacts } from '@capacitor-community/contacts';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Component } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { Geolocation } from '@capacitor/geolocation';
import { DomSanitizer } from '@angular/platform-browser';
import { OnInit } from '@angular/core';
import { isPlatform } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  image: any;
  permission: any;
  contacts: any[] = [];
  ngOnInIt(){
    this.getContacts();

  }
  constructor(private sanitizer: DomSanitizer) {
    this.getCurrentPosition();
  }
  async getContacts() {
    try {
      const permission = await Contacts.requestPermissions();
      console.log('permission', permission.contacts);
      if (!permission.contacts) return;
      else if (permission.contacts == 'prompt') {
      }
      const result = await Contacts.getContacts({
        projection: {
          // Specify which fields should be retrieved.
          name: true,
          phones: true,
          postalAddresses: true,
        },
      });
      console.log(this.contacts);
      this.contacts = result.contacts;
      this.permission = permission;
    } catch (e) {
      console.log(e);
    }
  }
  openBrowser() {
    Browser.open({ url: 'https://www.udemy.com/' });
  }
  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('Changed', coordinates);
    const currentPosition = Geolocation.watchPosition({}, (position, err) => {
      console.log('Position', position);
    });
  }

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
    });
    this.image = this.sanitizer.bypassSecurityTrustResourceUrl(
      `data:image/jpeg;base64, ${image.base64String}`
    );
  };
}
