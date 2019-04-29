import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserProvider } from '../providers/user.provider';
import { HappyProvider } from '../providers/happy.provider';

import { LoginPage } from '../pages/login/login';

// Business Owner / Client Pages
import {Client_HomePage} from '../pages/client/home/home';
import {Client_CustomerService} from '../pages/client/customer-service/customer-service';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  activepage: any;


  // Business Owner / Client Pages Array
  client_pages =  [
                    Client_HomePage,
                    Client_CustomerService,
                    Client_HomePage,
                    Client_CustomerService,
                    Client_HomePage,
                    Client_CustomerService
                  ];

  nav_pages: any ;
  rootPage:any = LoginPage;

  constructor(platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen, 
              public auth: UserProvider, 
              public happy: HappyProvider,
              public events: Events) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

     /* var notificationOpenedCallback = function(jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      };
  
      window["plugins"].OneSignal
        .startInit("d7d0f508-579e-44ca-b336-13dc2361ad3f", "472488914054")
        .handleNotificationOpened(notificationOpenedCallback)
        .endInit();*/

    });
    events.subscribe('user:login', () => {
      console.log("Log in event!");
      this.showNav();
      this.happy.GetHappyRes();
    });
  }

  public navigate(page){
    this.nav.push(page);
  }

  public getTitle(page){
    let temp_page = new page();
    return (temp_page.page_title);
  }

  public showNav()
  {
    console.log('shownav');
    if(this.auth.accessLevel > 0)
    {
      console.log('greater than 0');
      if(this.auth.accessLevel == 1) // Client Access Nav
      {
        console.log('equals 1');
        this.nav_pages = this.client_pages;
        console.dir(this.nav_pages);
      }
    }
  }

}

