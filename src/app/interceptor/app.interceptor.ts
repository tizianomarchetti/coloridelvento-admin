import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Aggiungi l'header di autorizzazione qui
    let token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
    if (token) {
        const authToken = 'Bearer ' + token;

        // Clona la richiesta e aggiungi l'header di autorizzazione
        request = request.clone({
        setHeaders: {
            Authorization: authToken
        }
        });
    }
    // Inoltra la richiesta clonata con l'header aggiunto
    return next.handle(request);
  }
}
