import { Injectable } from '@angular/core';
import { CanDeactivate, UrlTree } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ModaleComponent } from '../component/modale/modale.component';
import { IFormComponent } from '../interface/i-form-component';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<IFormComponent> {
  confirmDlg: MatDialogRef<ModaleComponent>;

  constructor(private dialog: MatDialog) {}

  canDeactivate(component: IFormComponent): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    const subject = new Subject<boolean>();
    
    if (component.isFormModified()) {
      this.confirmDlg = this.dialog.open(ModaleComponent, {
        data: {
          body: "Tornare indietro? Le modifiche verranno perse.",
          onConfirm: () => {
            subject.next(true);
          }
        },
        autoFocus: false,
        restoreFocus: false,
        disableClose: true
      });
      // this.confirmDlg.componentInstance.subject = subject;

      return subject.asObservable();
    } 
    
    return true;
  }
  
}
