import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Contatto } from "../interface/contact";

export class ContactForm {
    contact: Contatto;

    /** form */
    form: FormGroup;
    /** form builder */
    formBuilder: FormBuilder;
    /** _parentComponent */
    _parentComponent: any;

    constructor(parentComponent: any) {
        this.formBuilder = new FormBuilder();
        this._parentComponent = parentComponent;

        this.contact = this._parentComponent.contact || new Contatto();
        
        this.form = this.formBuilder.group({
            name: [
                this.contact.name, [Validators.required]
            ],
            desc: [
                this.contact.desc, [Validators.required]
            ],
            type: [
                this._parentComponent.contact ? this._parentComponent.options.find(el => el.url == this.contact.type.url) : null, 
                [Validators.required]
            ]
        });

    }

    get name() { return this.form.get('name') }

    get desc() { return this.form.get('desc') }

    get type() { return this.form.get('type') }

}