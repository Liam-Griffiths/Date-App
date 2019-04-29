import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

//import { ApiProvider } from '../../../providers/api.provider';
import { HappyProvider } from '../../../providers/happy.provider';

import { Client_CustomerHappy } from './customer-happy/customer-happy';


@Component({
  selector: 'page-customer-service',
  templateUrl: 'customer-service.html'
})
export class Client_CustomerService {

  public page_title : string = "Customer Service"; 
  public currentResArr : any = [];

  private default: any = "1";

  constructor(public navCtrl: NavController, public happy : HappyProvider ) {}

  ionViewDidLoad() {
    this.default = "1";
    this.showAll();
    this.refresh();
  }

  public refresh()
  {
    this.happy.GetHappyRes();
    this.showAll();
  }

  public showAll()
  {
    this.currentResArr = this.happy.allArr;
  }

  public showHappy()
  {
    this.currentResArr = this.happy.happyArr;
  }

  public showSad()
  {
    this.currentResArr = this.happy.sadArr;
  }

  public navHappy(item:any)
  {
    console.dir(item);
    this.navCtrl.push(Client_CustomerHappy, {reviewObj: item});
  }

}
