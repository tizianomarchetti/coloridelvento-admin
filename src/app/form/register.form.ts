import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Utente } from "../interface/user";

export class RegisterForm {
    user: Utente;

    /** form */
    form: FormGroup;
    /** form builder */
    formBuilder: FormBuilder;
    /** _parentComponent */
    _parentComponent: any;

    constructor(parentComponent: any) {
        this.formBuilder = new FormBuilder();
        this._parentComponent = parentComponent;

        this.user = this._parentComponent.user || new Utente();
        
        this.form = this.formBuilder.group({
            email: [
                this.user.email,
                [Validators.required, Validators.email]
            ],
            password: [
                this.user.password,
                [Validators.required, Validators.minLength(8)]
            ]
        });
    }

    get email() { return this.form.get('email') }

    get password() { return this.form.get('password') }

}