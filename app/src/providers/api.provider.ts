import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { JwtProvider } from './jwt.provider';

@Injectable()
export class ApiProvider {

  private API_URL = 'http://192.168.0.10:3000/api';

  constructor(
    public http: Http,
    private jwtProvider:JwtProvider
  ) {
  }

  private setHeaders(): Headers{
    let headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
    if(this.jwtProvider.latestToken){
      headersConfig['Authorization'] = `Token ${this.jwtProvider.latestToken}`;
    }
    return new Headers(headersConfig);
  }

  private formatErrors(error:any){
    return Observable.throw(error.json());
  }

  get(path: string, params: URLSearchParams = new URLSearchParams()): Observable<any> {
    return this.http.get(`${this.API_URL}${path}`, { headers: this.setHeaders(), search: params })
    .catch(this.formatErrors)
    .map((res:Response) => res.json());
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
      `${this.API_URL}${path}`,
      JSON.stringify(body),
      { headers: this.setHeaders() }
    )
    .catch(this.formatErrors)
    .map((res:Response) => res.json());
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
      `${this.API_URL}${path}`,
      JSON.stringify(body),
      { headers: this.setHeaders() }
    )
    .catch(this.formatErrors)
    .map((res:Response) => res.json());
  }

  delete(path): Observable<any> {
    return this.http.delete(
      `${this.API_URL}${path}`,
      { headers: this.setHeaders() }
    )
    .catch(this.formatErrors)
    .map((res:Response) => res.json());
  }

}
