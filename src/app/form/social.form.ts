import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Social } from "../interface/social";

export class SocialForm {
    social: Social;

    /** form */
    form: FormGroup;
    /** form builder */
    formBuilder: FormBuilder;
    /** _parentComponent */
    _parentComponent: any;

    constructor(parentComponent: any) {
        this.formBuilder = new FormBuilder();
        this._parentComponent = parentComponent;

        this.social = this._parentComponent.social || new Social();
        
        this.form = this.formBuilder.group({
            url: [
                this._parentComponent.social ? this.social.type.url : null, [Validators.required]
            ],
            type: [
                this._parentComponent.social ? this._parentComponent.options.find(el => el.icon == this.social.type.icon) : null, 
                [Validators.required]
            ]
        });

    }

    get url() { return this.form.get('url') }

    get type() { return this.form.get('type') }

}