import { Injectable } from '@angular/core';
import { AppStorage } from '../utils/app-storage';
import { IUser } from '../models/user';
import { BroadcastService } from './broadcast.service';
import { AccountService } from './account.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    static readonly CurrentUserChangedEventName = "CurrentUserChanged";
    private readonly currentUserKey = "current-user";
    private _currentUser = AppStorage.getItem<IUser>(this.currentUserKey);

    constructor(private broadcastService: BroadcastService) { 
        this.broadcastService.on<IUser>(AccountService.UserLoginEventName).subscribe(loggedUser => {
            this.setCurrentUser(loggedUser);
        });
    }

    get isLogged(): boolean {
        return !!this._currentUser;
    }

    get currentUser(): IUser {
        return this._currentUser;
    }

    private setCurrentUser(user: IUser): void {
        this._currentUser = user;

        AppStorage.setItem(this.currentUserKey, this._currentUser);
    }

}
