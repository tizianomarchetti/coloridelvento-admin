import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BandComponent } from "../interface/component";

export class PhotoForm {
    _title: string;

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
            title: [
                this._title//, [Validators.required]
            ]
        });
    }

    get title() { return this.form.get('title') }

}