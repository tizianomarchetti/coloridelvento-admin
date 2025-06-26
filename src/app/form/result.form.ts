import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Result } from "../interface/result";

export class ResultForm {
    result: Result;

    /** form */
    form: FormGroup;
    /** form builder */
    formBuilder: FormBuilder;
    /** _parentComponent */
    _parentComponent: any;

    constructor(parentComponent: any) {
        this.formBuilder = new FormBuilder();
        this._parentComponent = parentComponent;

        this.result = this._parentComponent.result || new Result();
        
        this.form = this.formBuilder.group({
            desc: [
                this.result['desc_' + this._parentComponent.lang], [Validators.required]
            ],
            cartone: [
                this.result['cartone_' + this._parentComponent.lang], [Validators.required]
            ],
            img: [
                this.result.img, [Validators.required]
            ]
        });
    }

    get desc() { return this.form.get('desc') }

    get cartone() { return this.form.get('cartone') }

    get img() { return this.form.get('img') }

}