import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { AcceptRegistrationForm } from 'src/app/form/accept-registration.form';
import { Utente } from 'src/app/interface/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserMapperService } from 'src/app/services/user-mapper.service';
import { UserService } from 'src/app/services/user.service';
import { ModaleComponent } from '../modale/modale.component';

@Component({
  selector: 'app-accept',
  templateUrl: './accept.component.html',
  styleUrls: ['./accept.component.css']
})
export class AcceptComponent implements OnInit {
  isAdmin: boolean = false;
  userToAccept: Utente = null;

  form: AcceptRegistrationForm;
  formData: FormGroup;

  message: string;

  constructor(private route: ActivatedRoute, private userService: UserService, private userMapper: UserMapperService,
    private dialog: MatDialog, private authService: AuthService) {

    authService.isAdmin().subscribe(() => {
      this.isAdmin = true;

      route.url.subscribe(path =>{
        const id = +path[1];
        userService.getById(id).subscribe((res: any) => {
          if (res) {
            const user: Utente = userMapper.mapUtente(res);
            this.userToAccept = user;
            if (this.userToAccept.active) {
              this.message = "Utente già attivo.";
            }
          }
          else this.message = "Utente non trovato.";
        }, error => this.message = error.error.message) //Utente non trovato.
      });

    }, (error) => this.message = error.error.message);
    
  }

  ngOnInit() {
    this.form = new AcceptRegistrationForm(this);
    this.formData = this.form.form;
  }

  handleRegistration(accept: boolean) {
    this.dialog.open(ModaleComponent, {
      data: {
        body: "Procedere al salvataggio?",
        onConfirm: () => {
          accept ? this.accept() : this.refuse();
        }
      },
      autoFocus: false,
      restoreFocus: false,
      disableClose: true
    })
  }

  accept() {
    const asAdmin = this.form.admin.value;
    this.userService.accept(this.userToAccept.id, asAdmin).subscribe((result: any) => {
      this.message = result.message;
    }, error => this.message = error.error.message)
  }

  refuse() {
    this.userService.refuse(this.userToAccept.id).subscribe((result: any) => {
      this.message = result.message;
    }, error => this.message = error.error.message)
  }

}
