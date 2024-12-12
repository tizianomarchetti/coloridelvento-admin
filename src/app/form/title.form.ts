import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TitleGroup } from "../interface/title-group";

export class TitleForm {
    titleGroup: TitleGroup;

    /** form */
    form: FormGroup;
    /** form builder */
    formBuilder: FormBuilder;
    /** _parentComponent */
    _parentComponent: any;

    constructor(parentComponent: any) {
        this.formBuilder = new FormBuilder();
        this._parentComponent = parentComponent;

        this.titleGroup = this._parentComponent.titleGroup || new TitleGroup();
        
        this.form = this.formBuilder.group({
            menu: [
                this.titleGroup.menu, [Validators.required]
            ],
            section: [
                this.titleGroup.section, this.titleGroup.section ? [Validators.required] : null
            ],
            page: [
                this.titleGroup.page, this.titleGroup.page ? [Validators.required] : null
            ]
        });
    }

    get menu() { return this.form.get('menu') }

    get section() { return this.form.get('section') }

    get page() { return this.form.get('page') }

}