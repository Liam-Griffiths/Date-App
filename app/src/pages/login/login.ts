import { Component } from '@angular/core';
import { MenuController, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user.provider';
import { Client_HomePage } from '../client/home/home';
import { Events } from 'ionic-angular';
import { Errors } from '../../models/errors.model';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

	loading: any;
	username: string;
	password: string;

	constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, 
				public loadingCtrl: LoadingController, public auth: UserProvider, public menu : MenuController, private toastCtrl:ToastController, public events: Events)
	{
		this.menu.enable(false);
		this.menu.swipeEnable(false);
	}

	ionViewDidLoad() {
		this.menu.enable(false);
		this.menu.swipeEnable(false);
	}

	
	ionViewWillLeave()
	{
		this.menu.enable(true);
		this.menu.swipeEnable(true);
	}

	login(){

		this.showLoader();

		const credentials = {email: this.username, password: this.password};

		this.auth.attemptAuth('login', credentials).subscribe(
		  user => {
			this.loading.dismiss();
			this.auth.startNotifications();
			this.menu.enable(true);
			this.menu.swipeEnable(true);
			this.auth.accessLevel = 1; // default to client nav
			this.events.publish('user:login');
			this.navCtrl.setRoot(Client_HomePage); // default to client mode for now
		  },
		  (errors:Errors) => {
			for(let field in errors.errors){
				
			  this.toastCtrl.create({
				message:`${field} ${errors.errors[field]}`,
				duration:3000
			  }).present();
			}
			this.loading.dismiss();
		  }
		);

	}

	showLoader(){
	
		this.loading = this.loadingCtrl.create({
			content: 'Authenticating...'
		});

		this.loading.present();

	}

}
