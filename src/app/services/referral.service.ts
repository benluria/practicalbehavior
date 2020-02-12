import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ReferralService {
    constructor(private http: HttpClient) { }
    public referralCount = 0;

    async sendReferral(referral: any) {
        try {
            const resp = await this.http.post(`${environment.apiUrl}/referral`, {referral}).toPromise();
            console.log(resp);
            this.referralCount++;
            return resp;
        } catch (err) {
            console.log(err);
        }
    }

    async getInfo() {
        //insurance
        //
    }

    async validateRecaptcha(token: string): Promise<any> {
        try {
            const resp = await this.http.post(`${environment.apiUrl}/recaptcha`, {recaptcha: token}).toPromise();
            return resp;
        } catch (err) {
            console.error(err);
        }
    }
    
}