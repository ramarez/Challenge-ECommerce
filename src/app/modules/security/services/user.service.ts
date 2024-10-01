import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { AppStorage } from '../../shared/utils/app-storage';
import { BroadcastService } from '../../shared';
import { IUser } from '../models';

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
