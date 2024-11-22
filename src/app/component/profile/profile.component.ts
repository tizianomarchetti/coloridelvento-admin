import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Utente } from 'src/app/interface/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserMapperService } from 'src/app/services/user-mapper.service';
import { UserService } from 'src/app/services/user.service';
import { ModaleComponent } from '../modale/modale.component';
import { EditPasswordForm } from 'src/app/form/edit-password.form';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: Utente;

  columnLabels: any[] = [];

  form: EditPasswordForm;
  formData: FormGroup;

  formError: string = null;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['criterio', 'valore'];

  editing: boolean = false;

  constructor(private dialog: MatDialog, private authService: AuthService,
    private cdr: ChangeDetectorRef, private userService: UserService, private userMapper: UserMapperService) { }

  ngOnInit() {
    this.columnLabels = [
      {
        id: 'email',
        label: 'Email'
      }
    ];

    this.getUtente();
  }

  getUtente(passwordModified: boolean = false) {
    this.dataSource = new MatTableDataSource();
    this.userService.getById(this.authService.getUserProfile().id).subscribe((user: any) => {
      this.user = this.userMapper.mapUtente(user);
      if (passwordModified)
        this.updateStorage(this.user.password);
      this.initForm();
      this.setDataSource();
    })
  }

  initForm() {
    this.form = new EditPasswordForm(this);
    this.formData = this.form.form;
  }

  setDataSource() {
    this.dataSource = new MatTableDataSource();

    Object.keys(this.user).forEach(k => {
      if (k == 'email') {
        this.dataSource.data.push({
          criterio: k,
          valore: this.user[k]
        })
      }
    });
  }

  formatField(element, col) {
    if (col == 'valore') {
      return element.valore || '-';
    }
    else {
      if (element.criterio)
        return this.columnLabels.find(el => el.id == element.criterio).label
    }
    return element[col] || '-';
  }

  confirm() {
    if (this.formData.valid) {
      this.formError = null;
      if (this.isFormModified()) {
        this.dialog.open(ModaleComponent, {
          data: {
            body: "Procedere al salvataggio?",
            onConfirm: () => (this.edit(this.formData.value))
          },
          autoFocus: false,
          restoreFocus: false,
          disableClose: true
        })
      } else {
        this.editing = false;
      }
    } else {
      this.formError = 'Compilare correttamente tutti i campi obbligatori.';
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    }
  }

  cancel() {
    if (this.isFormModified()) {
      this.dialog.open(ModaleComponent, {
        data: {
          body: "Tornare indietro? Le modifiche verranno perse.",
          onConfirm: () => {
            this.onCancel();
          }
        },
        autoFocus: false,
        restoreFocus: false,
        disableClose: true
      })
    } else {
      this.onCancel();
    }
  }

  isFormModified() {
    let modified: boolean = false;
    Object.keys(this.formData.value).forEach(k => {
      if (this.isModifiedValue(this.formData.value[k], this.user[k] || null))
        modified = true;
    })
    
    return modified;
  }

  isModifiedValue(firstValue, secondValue) {
    if ((firstValue == '' && !secondValue) || (secondValue == '' && !firstValue))
      return false;
    return firstValue != secondValue;
  }

  onCancel() {
    this.getUtente();
    this.editing = false;
    this.formError = null;
  }

  edit(data: any) {
    this.userService.checkPassword(this.user.id, data.oldPassword).subscribe(() => {
      this.userService.editPassword(this.user.id, data.newPassword).subscribe((res: any) => {
        this.dialog.open(ModaleComponent, {
          data: {
            body: res.message,
            showPositiveCta: false
          },
          autoFocus: false,
          restoreFocus: false,
          disableClose: true
        }).afterClosed().subscribe(() => {
          this.editing = false;
          this.getUtente(true);
        })
      }, (error) => {
        console.error(error);
        this.formError = error.error.message || error.message;
        this.cdr.detectChanges();
        window.scrollTo(0, 0);
      })
    }, (error) => {
      console.error(error);
      this.formError = error.error.message || error.message;
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    });
  }

  updateStorage(password: string) {
    if (localStorage.getItem('user-data')) {
      let oldUser = JSON.parse(localStorage.getItem('user-data'));
      oldUser.password = password;
      localStorage.setItem('user-data', JSON.stringify(oldUser));
    }

    if (sessionStorage.getItem('user-data')) {
      let oldUser = JSON.parse(sessionStorage.getItem('user-data'));
      oldUser.password = password;
      sessionStorage.setItem('user-data', JSON.stringify(oldUser));
    }
  }

}
