import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { JwtProvider } from '../../../providers/jwt.provider';
import { ApiProvider } from '../../../providers/api.provider';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class Client_HomePage {

  public page_title : string = "Home"; 
  mailInput: string;

  constructor(public navCtrl: NavController, private jwtProvider: JwtProvider, private apiProvider: ApiProvider) {

  }


  uploadCsv()
  {
    this.jwtProvider.getToken().then(token => {
      if (token) {
        this.apiProvider.post('/mail',{ Token: token, mailInput: this.mailInput})
          .subscribe(
          data => console.log("success up"),
          err => console.log("failed to upload")
          );
        } else {
          // Remove any potential remnants of previous auth states
            console.log("fail not logged in");

          }
      });
    }

}
