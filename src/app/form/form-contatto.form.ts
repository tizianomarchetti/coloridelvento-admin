import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { FormContatto } from "../interface/contact-form";

export class FormContattoForm {
    contactForm: FormContatto;

    /** form */
    form: FormGroup;
    /** form builder */
    formBuilder: FormBuilder;
    /** _parentComponent */
    _parentComponent: any;

    constructor(parentComponent: any) {
        this.formBuilder = new FormBuilder();
        this._parentComponent = parentComponent;

        this.contactForm = this._parentComponent.contactForm || new FormContatto();
        
        this.form = this.formBuilder.group({
            email: [
                this.contactForm.email,
                [Validators.required, Validators.email, (control: AbstractControl): ValidationErrors | null => {
                    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Requires a TLD
                    const valid = emailRegex.test(control.value);
                    return valid ? null : { email: true };
                  }]
            ],
            subject: [
                this.contactForm.subject, 
                [Validators.required]
            ]
        });
    }

    get email() { return this.form.get('email') }

    get subject() { return this.form.get('subject') }

}