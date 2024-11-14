import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ModaleComponent } from './component/modale/modale.component';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'coloridelvento-admin';

  isLoggedIn$: Observable<boolean>;

  constructor(private dialog: MatDialog, private authService: AuthService, private router: Router,
    private cdr : ChangeDetectorRef) {
    this.isLoggedIn$ = authService.isLoggedIn();
    this.authService.getTokenUpdatedEvent().subscribe(() => {
      // Update isLoggedIn$ when token is updated
      this.isLoggedIn$ = this.authService.isLoggedIn();
    });
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges(); //per evitare expression changed after it has been checked su isLoggedIn$
  }

  logout() {
    this.dialog.open(ModaleComponent, {
      data: {
        body: "Vuoi uscire dall'app?",
        onConfirm: () => {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      },
      autoFocus: false,
      restoreFocus: false,
      disableClose: true
    });
  }
}
