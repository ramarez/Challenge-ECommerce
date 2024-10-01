import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { MessageService } from '../../notification/services/message.service';
import { UserService } from '../../security';

export const ShoppingGuard: CanActivateFn = (route, state) => {
    if (!inject(UserService).isLogged) {
        inject(MessageService).error("You are not authorized to use the system until it is registered.", "User unregistered", {autoClose: true, keepAfterRouteChange: true});
        inject(Router).navigate(['/login']);
        return false;
    }

    return true;
};
