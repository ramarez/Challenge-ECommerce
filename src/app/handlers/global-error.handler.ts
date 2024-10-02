import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { UserService } from "../modules/security/services/user.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    private static previousMessage: string;
    private static latestErrorTime: number;

    constructor(private injector: Injector) {
        GlobalErrorHandler.latestErrorTime = new Date().getTime();
        GlobalErrorHandler.previousMessage = "";
    }
    
    handleError(error: any): void {
        const curTime = new Date().getTime();
        if (error.message !== GlobalErrorHandler.previousMessage || (curTime - GlobalErrorHandler.latestErrorTime) > 5000) {
            GlobalErrorHandler.previousMessage = error.message;
            GlobalErrorHandler.latestErrorTime = curTime;

            const userService = this.injector.get(UserService);
            const currentUser = userService ? userService.currentUser : null;
            if (currentUser) {
                console.log("GlobalErrorHandler", currentUser, error.message);
            }
        }
    }
}
