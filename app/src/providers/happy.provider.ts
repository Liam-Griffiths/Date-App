
import { Injectable } from '@angular/core';
import { ApiProvider } from './api.provider';

@Injectable()
export class HappyProvider {

    public happyPercent : number = 0.0; // 0 is 100% sadness, 1 is 100% happiness
    public happyCount : number = 0;
    public sadCount : number = 0;

    public allArr : any = [];
    public happyArr : any = [];
    public sadArr : any = [];

    constructor(private apiProvider: ApiProvider) {}
  
    GetHappyRes()
    {
        this.apiProvider.get('/happy/').subscribe(
            data => this.ProcessHappyRes(data),
            err => console.log("failed")
        );
    }

    ProcessHappyRes(data)
    {

        console.log("hi");
        
        data.data.forEach(element => {
            console.log("test");
            if(element.isHappy == true)
            {
                this.happyCount++;
                this.happyArr.push(element);
            }
            if(element.isHappy == false)
            {
                this.sadCount++;
                this.sadArr.push(element);
            }
            this.allArr.push(element);
        });

        let t = this.happyCount + this.sadCount;
        this.happyPercent = (this.happyCount / t);

        console.dir(this.allArr);
        console.dir(this.sadArr);
        console.dir(this.happyArr);

    }

}
