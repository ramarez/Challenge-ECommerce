import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { inject } from '@angular/core';
import { MessageService } from '../../notification/services/message.service';

export const ShoppingGuard: CanActivateFn = (route, state) => {
    if (!inject(UserService).isLogged) {
        inject(MessageService).error("You are not authorized to use the system until it is registered.", "User unregistered", {autoClose: true, keepAfterRouteChange: true});
        inject(Router).navigate(['/login']);
        return false;
    }

    return true;
};
