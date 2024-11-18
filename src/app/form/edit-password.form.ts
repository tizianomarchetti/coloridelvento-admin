import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { of } from "rxjs";

export class EditPasswordForm {
    _oldPassword: string;
    _newPassword: string;
    _confirmPassword: string;

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
            oldPassword: [
                this._oldPassword,
                [Validators.required, Validators.minLength(8)]
            ],
            newPassword: [
                this._newPassword,
                [Validators.required, Validators.minLength(8)]
            ],
            confirmPassword: [
                this._confirmPassword,
                [Validators.required, Validators.minLength(8), this.matchingPasswords.bind(this)]
            ],
        });
    }

    get oldPassword() { return this.form.get('oldPassword') }

    get newPassword() { return this.form.get('newPassword') }

    get confirmPassword() { return this.form.get('confirmPassword') }

    matchingPasswords(ctrl: FormControl) {
        if (ctrl.value && this.form && ctrl.value != this.newPassword.value) {
            return { mismatchedPasswords: true }
        }
        return null;
    }

}