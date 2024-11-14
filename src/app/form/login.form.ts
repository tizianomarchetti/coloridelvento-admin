import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export class LoginForm {
    _email: string;
    _password: string;
    _rememberMe: boolean = true;

    /** form */
    form: FormGroup;
    /** form builder */
    formBuilder: FormBuilder;
    /** _parentComponent */
    _parentComponent: any;

    constructor(parentComponent: any) {
        this.formBuilder = new FormBuilder();
        this._parentComponent = parentComponent;
        
        this.form = this.formBuilder.group({
            email: [
                this._email,
                [Validators.required, Validators.email]
            ],
            password: [
                this._password,
                [Validators.required, Validators.minLength(8)]
            ],
            rememberMe: [
                this._rememberMe,
                [Validators.required]
            ]
        });
    }

    get email() { return this.form.get('email') }

    get password() { return this.form.get('password') }

    get rememberMe() { return this.form.get('rememberMe') }

}