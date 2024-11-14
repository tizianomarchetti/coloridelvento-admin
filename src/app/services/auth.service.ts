import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ROOT } from '../config/Constants';
import { map, shareReplay } from 'rxjs/operators';
import { Utente } from '../interface/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenUpdatedSubject: Subject<void> = new Subject<void>();

  private loginUrl = ROOT + "login";
  private registerUrl = ROOT + "register";
  private isLoggedInUrl = ROOT + "security/isLoggedIn"; //TODO dà sempre 401 perché rigenera la secret key

  constructor(private http: HttpClient) { }

  updateToken(): void {
    // Logica per aggiornare il token, ad esempio dopo il login
    this.tokenUpdatedSubject.next();
  }

  getTokenUpdatedEvent(): Observable<void> {
    return this.tokenUpdatedSubject.asObservable();
  }

  logout() {
    localStorage.removeItem('auth-token');
    sessionStorage.removeItem('auth-token');
  }

  login(email: string, password: string) {
    return this.http.post(this.loginUrl, {
      email: email,
      password: password
    }, { responseType: 'text' });
  }

  isLoggedIn(): Observable<boolean> {
    return this.http.get<any>(this.isLoggedInUrl).pipe(
      map(() => true),
      shareReplay(1) // Condividi il risultato dell'observable e memorizzalo nella cache per 1 sottoscrizione
    );
  }

  register(user: Utente) {
    return this.http.post(this.registerUrl, user);
  }
}
