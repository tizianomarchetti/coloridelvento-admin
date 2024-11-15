import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export class AcceptRegistrationForm {
    /** form */
    form: FormGroup;
    /** form builder */
    formBuilder: FormBuilder;
    /** _parentComponent */
    _parentComponent: any;
    
    _admin: boolean = false;

    constructor(parentComponent: any) {
        this.formBuilder = new FormBuilder();
        this._parentComponent = parentComponent;
        
        this.form = this.formBuilder.group({
            admin: [
                this._admin,
                [Validators.required]
            ]
        });
    }

    get admin() { return this.form.get('admin') }
    
}