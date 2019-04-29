import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class AdminHomePage {

  public page_title : string = "Home"; 

  constructor(public navCtrl: NavController) {

  }

}
