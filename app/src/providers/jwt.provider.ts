import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class JwtProvider {
  constructor(private storage: Storage) { };
  public latestToken:string;
  getToken(): Promise<String> {
    return this.storage.ready().then(() => this.storage.get('jwtToken') as Promise<string>).then(token => {
      this.latestToken = token;
      return token;
    });
  }
  saveToken(token: string): Promise<void> {
    this.latestToken = token;
    return this.storage.ready().then(() => this.storage.set('jwtToken', token) as Promise<void>);
  }
  destroyToken():Promise<void>{
    this.latestToken = null;
    return this.storage.remove('jwtToken');
  }
}
