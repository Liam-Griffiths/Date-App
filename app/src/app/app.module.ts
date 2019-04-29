import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { OneSignal } from '@ionic-native/onesignal';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { HappyProvider } from '../providers/happy.provider';
import { UserProvider } from '../providers/user.provider';
import { JwtProvider } from '../providers/jwt.provider';
import { ApiProvider } from '../providers/api.provider';

import { Client_HomePage } from '../pages/client/home/home';
import { Client_CustomerService } from '../pages/client/customer-service/customer-service';
import { Client_CustomerHappy } from '../pages/client/customer-service/customer-happy/customer-happy';

@NgModule({
  declarations: [
    MyApp,
    Client_HomePage,
    LoginPage,
    Client_CustomerService,
    Client_CustomerHappy,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Client_HomePage,
    LoginPage,
    Client_CustomerService,
    Client_CustomerHappy,
  ],
  providers: [
    HappyProvider,
    UserProvider,
    JwtProvider,
    ApiProvider,
    StatusBar,
    SplashScreen,
    OneSignal,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
