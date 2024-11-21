import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BandComponent } from "../interface/component";

export class ComponentForm {
    component: BandComponent;

    /** form */
    form: FormGroup;
    /** form builder */
    formBuilder: FormBuilder;
    /** _parentComponent */
    _parentComponent: any;

    constructor(parentComponent: any) {
        this.formBuilder = new FormBuilder();
        this._parentComponent = parentComponent;

        this.component = this._parentComponent.component || new BandComponent();
        
        this.form = this.formBuilder.group({
            name: [
                this.component.name, [Validators.required]
            ],
            img: [
                this.component.img, [Validators.required]
            ],
            bio: [
                this.component.bio
            ]
        });
    }

    get name() { return this.form.get('name') }

    get img() { return this.form.get('img') }

}