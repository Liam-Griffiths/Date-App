import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

//import { ApiProvider } from '../../../providers/api.provider';
//import { HappyProvider } from '../../../../providers/happy.provider';


@Component({
  selector: 'page-customer-happy',
  templateUrl: 'customer-happy.html'
})
export class Client_CustomerHappy {

  public page_title : string = "Customer Happy Response"; 
  public currentResArr : any = [];
  private reviewObj : any;

  public createdAt = "";
  public clicked = "";
  public clickedTimestamp = "";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.reviewObj = this.navParams.get('reviewObj');
  }

  ionViewDidLoad() {

    this.reviewObj = this.navParams.get('reviewObj');
    console.dir(this.reviewObj);

    this.createdAt = this.reviewObj.createdAt;
    this.clicked = this.reviewObj.clicked;
    this.clickedTimestamp = this.reviewObj.clickedTimestamp;

  }




}
