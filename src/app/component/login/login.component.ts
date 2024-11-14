import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginForm } from 'src/app/form/login.form';
import { Utente } from 'src/app/interface/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserMapperService } from 'src/app/services/user-mapper.service';
import _ from 'lodash';
import { RegisterForm } from 'src/app/form/register.form';
import { ModaleComponent } from '../modale/modale.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLogin: boolean = true;

  form: LoginForm | RegisterForm;
  formData: FormGroup;

  loginError: string;

  fromUrl: string;

  message: string;

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router, private dialog: MatDialog,
    private userMapper: UserMapperService) { 
    this.isLogin = route.snapshot.routeConfig.path == 'login';
  }

  ngOnInit() {
    this.authService.updateToken();
    this.fromUrl = history.state.from || '';

    this.form = this.isLogin ? new LoginForm(this) : new RegisterForm(this);
    this.formData = this.form.form;
  }

  doAction() {
    this.isLogin ? this.login() : null//this.register();
  }

  login() {
    if (this.formData.valid) {
      this.loginError = null;
      this.authService.login(this.form.email.value, this.form.password.value).subscribe((res: string) => {
        const rememberMe = this.formData.get('rememberMe').value == true;
        (rememberMe ? localStorage : sessionStorage).setItem('auth-token', res);

        this.authService.updateToken();
        this.router.navigate(['']);
      }, error => {
        console.error(error);
        this.loginError = error.message;
      });
    } else {
      console.log(this.formData.get('password').errors)
      console.log(this.formData.get('password').validator)
    }
  }

  register() {
    if (this.formData.valid) {
      this.dialog.open(ModaleComponent, {
        data: {
          body: "Procedere alla registrazione?",
          onConfirm: () => {
            this.authService.register(this.formData.value).subscribe((res: any) => {
              this.message = res.message;
            }, error => {
              console.error(error)
              this.message = error.error.message
            });
          }
        },
        autoFocus: false,
        restoreFocus: false,
        disableClose: true
      });      
    }
  }

}
