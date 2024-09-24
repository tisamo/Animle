import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {provideAnimations} from "@angular/platform-browser/animations";
import {TokenInterceptor} from "./shared/services/interceptors/token.interceptor";
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(withInterceptors([TokenInterceptor])), provideAnimations(), provideServiceWorker('ngsw-worker.js', {
    enabled: true,
    registrationStrategy: 'registerWhenStable:30000',
  }) ]
};
