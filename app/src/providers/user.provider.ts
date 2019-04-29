import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/distinctUntilChanged';
import { OneSignal } from '@ionic-native/onesignal';
import { Platform } from 'ionic-angular';

import { ApiProvider } from './api.provider';
import { JwtProvider } from './jwt.provider';
import { User } from '../models/user.model';

@Injectable()
export class UserProvider {
  private currentUserSubject = new BehaviorSubject<User>(new User());
  public currentUser = this.currentUserSubject.asObservable().distinctUntilChanged();

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  public accessLevel = 0;

  constructor(
    private oneSignal: OneSignal,
    private apiProvider: ApiProvider,
    public platform: Platform,
    //private http: Http,
    private jwtProvider: JwtProvider
  ) { };

  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {
    // If JWT detected, attempt to get & store user's info
    this.jwtProvider.getToken().then(token => {
      if (token) {
        this.apiProvider.get('/user')
          .subscribe(
          data => this.setAuth(data.user),
          err => this.purgeAuth()
          );
      } else {
        // Remove any potential remnants of previous auth states
        this.purgeAuth();
      }
    });
  }

  startNotifications(){
    if(this.platform.is('core') || this.platform.is('mobileweb')) {
      console.log("Browser Mode!");
    } else {
      this.oneSignal.startInit("d7d0f508-579e-44ca-b336-13dc2361ad3f", "472488914054");
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
      this.oneSignal.handleNotificationReceived().subscribe(() => {
      // do something when notification is received
      });
      this.oneSignal.handleNotificationOpened().subscribe(() => {
        // do something when a notification is opened
      });
      this.oneSignal.endInit();

      this.oneSignal.getIds().then(status => {
        console.log("hello");

        this.apiProvider.post('/test',  { onesignal_pid: status.userId }).subscribe(() => {
          return true;
        });

      });
    }
  }

  setAuth(user: User) {
    // Save JWT sent from server in localstorage
    this.jwtProvider.saveToken(user.token).then(()=>{

      console.log(user.token); // DEBUG MUST REMOVE
      // Set current user data into observable
      this.currentUserSubject.next(user);
      // Set isAuthenticated to true
      this.isAuthenticatedSubject.next(true);
    });
  }

  purgeAuth() {
    // Remove JWT from localstorage
    this.jwtProvider.destroyToken().then(()=>{
      // Set current user to an empty object
      this.currentUserSubject.next(new User());
      // Set auth status to false
      this.isAuthenticatedSubject.next(false);
    });
  }

  attemptAuth(type, credentials): Observable<User> {
    let route = (type === 'login') ? '/login' : '';
    return this.apiProvider.post('/users' + route, { user: credentials })
      .map(data => {
          this.setAuth(data.user);
          return data;
        });
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  // Update the user on the server (email, pass, etc)
  update(user): Observable<User> {
    return this.apiProvider
      .put('/user', { user })
      .map(data => {
        // Update the currentUser observable
        this.currentUserSubject.next(data.user);
        return data.user;
      });
  }

}
