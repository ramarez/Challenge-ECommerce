import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppStorage } from "../modules/shared";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
    private readonly requestTokenKey = "XSRF-REQUEST-TOKEN";

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let headers = req.headers;

        const requestToken = AppStorage.getItem<string>(this.requestTokenKey);
        if (requestToken) {
            headers = headers.set("X-XSRF-TOKEN", requestToken);
        }

        req = req.clone({
            url: `${req.url}`,
            headers: headers,
        });
        return next.handle(req);
    }
}
