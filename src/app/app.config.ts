import { ApplicationConfig, ErrorHandler, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpStatusesInterceptor } from './interceptors/http-statuses.interceptor';
import { GlobalErrorHandler } from './handlers/global-error.handler';
import { ApiInterceptor } from './interceptors/api.interceptor';
import { CartStore } from './shopping/stores/cart-store';

export const appConfig: ApplicationConfig = {
    providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
        provideRouter(routes), 
        provideHttpClient(withInterceptorsFromDi()),
        { provide: HTTP_INTERCEPTORS, useClass: HttpStatusesInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        CartStore,
    ]
};
