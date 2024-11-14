import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isLoggedIn().toPromise().then(() => {
      this.router.navigate(['/']); // Reindirizza l'utente alla home
      return false; // L'utente è già autenticato, non consentire l'accesso alla rotta
    }).catch(() => {
      return true; // L'utente è autenticato, consenti l'accesso alla rotta
    })
  }
}
