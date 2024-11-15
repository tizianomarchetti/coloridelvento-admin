import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isLoggedIn().toPromise().then(() => {
      return this.authService.isAdmin().toPromise().then(() => {
        return true; // L'utente è autenticato, consenti l'accesso alla rotta
      }).catch(() => {
        this.router.navigate(['/']); // Reindirizza l'utente alla home  
        return false; // Non consentire l'accesso alla rotta
      })
    }).catch(() => {
      // const resolvedUrl = this.router.createUrlTree(next.url.map(segment => segment.toString()), next.params).toString();

      this.router.navigate(['/login'], {
        state: {from: state.url} //{from: resolvedUrl}
      }); // Reindirizza l'utente alla pagina di login
      
      return false; // Non consentire l'accesso alla rotta
    })
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      return this.canActivate(childRoute, state);
  }

}
