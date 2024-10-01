import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../../modules/security/services/user.service';
import { MessageService } from '../../modules/notification';

export const ShoppingGuard: CanActivateFn = (route, state) => {
    if (!inject(UserService).isLogged) {
        inject(MessageService).error("You are not authorized to use the system until it is registered.", "User unregistered", {autoClose: true, keepAfterRouteChange: true});
        inject(Router).navigate(['/login']);
        return false;
    }

    return true;
};
