import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Answer } from "../interface/answer";

export class AnswerForm {
    answer: Answer;

    /** form */
    form: FormGroup;
    /** form builder */
    formBuilder: FormBuilder;
    /** _parentComponent */
    _parentComponent: any;

    constructor(parentComponent: any) {
        this.formBuilder = new FormBuilder();
        this._parentComponent = parentComponent;

        this.answer = this._parentComponent.answer || new Answer();
        
        this.form = this.formBuilder.group({
            desc: [
                this.answer['desc_' + this._parentComponent.lang], [Validators.required]
            ]
        });
    }

    get desc() { return this.form.get('desc') }

}