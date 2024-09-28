import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { HttpStatusCodes } from '../utils/http-status-codes';
import { MessageService } from '../notification/services/message.service';

@Injectable()
export class HttpStatusesInterceptor implements HttpInterceptor {
    constructor(private injector: Injector) {}
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .pipe(catchError((errorResponse: HttpErrorResponse) => {
                switch (errorResponse.status) {
                    case HttpStatusCodes.Status400BadRequest:
                        this.handleStatus400BadRequest(errorResponse);
                        break;
                    case HttpStatusCodes.Status403Forbidden:
                        this.handleStatus403Forbidden(errorResponse);
                        break;
                    default:
                        this.handleOtherError(errorResponse);
                }
                
                return throwError(() => errorResponse);
            }));
    }

    protected showMessageError(message: string) {
        const messageService = this.injector.get(MessageService, null);
        if (messageService) {
            messageService.error(message, undefined, {autoClose: true, keepAfterRouteChange: true});
        }
    }

    protected handleOtherError(errorResponse: HttpErrorResponse): void {
        let errorMessage = errorResponse.message
            ?? "An error has occurred at the website and your support team will need to fix the problem. " +
            "A preliminary report has been sent to the support team.Please do follow - up on the preliminary " +
            "report using the Report a Problem page";

        if (typeof errorResponse.error === "object") {
            if (errorResponse.error.error && errorResponse.error.error.message) {
                errorMessage = errorResponse.error.error.message;
            }
        } else {
            errorMessage = errorResponse.error;
        }

        this.showMessageError(errorMessage);
    }

    private handleStatus400BadRequest(errorResponse: HttpErrorResponse): boolean {
        let errorMessage = errorResponse.message
            ?? "Request not understood. There may be a network issue. Please attempt to submit your request again. If this problem persists, please use the Report a Problem page found on the menu to alert your support team.";

        if (typeof errorResponse.error === "object") {
            // OData errors
            if (errorResponse.error.error && errorResponse.error.error.message) {
                errorMessage = errorResponse.error.error.message;
            }

            // Validation errors
            if (errorResponse.error) {
                errorMessage = Object
                    .keys(errorResponse.error)
                    .map(key =>
                        `${key}: ${Array.isArray(errorResponse.error[key]) ? (<string[]>errorResponse.error[key]).join(", ") : errorResponse.error[key]}`)
                    .join("\n");
            }
        } else {
            errorMessage = errorResponse.error;
        }

        this.showMessageError(errorMessage);
        return false;
    }

    private handleStatus403Forbidden(errorResponse: HttpErrorResponse): void {
        this.showMessageError(
            "You don’t have authorisation for this feature. Please refresh your page. If this problem persists, " +
            "please use the Report a Problem page found on the menu to alert your support team."
        );
    }
}