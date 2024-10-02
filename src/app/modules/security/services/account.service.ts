import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BroadcastService } from '../../shared';
import { IUser } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    static readonly UserLoginEventName = "UserLogin";
    static readonly UserLogoutEventName = "UserLogout";

    private loginPromise: Promise<boolean> = (null as any) as Promise<boolean>;
    private logoutPromise: Promise<void> = (null as any) as Promise<void>;

    constructor(protected http: HttpClient,
        private broadcastService: BroadcastService
    ) {

    }

    login(email: string, password: string): Promise<boolean>  {
        if (email == "user@ecommerce.com" && password == "1234") {
            this.broadcastService.broadcast(AccountService.UserLoginEventName, {email: email, password: password} as IUser);
            this.loginPromise = Promise.resolve<boolean>(true);
        } else {
            this.loginPromise = Promise.reject("Invalid credentials");
        }

        return this.loginPromise;
    }

    logout(): Promise<void> {
        this.broadcastService.broadcast(AccountService.UserLoginEventName, null);
        this.logoutPromise = Promise.resolve();
        
        return this.logoutPromise;
    }
}
