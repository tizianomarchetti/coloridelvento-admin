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
            title: [
                this._parentComponent.dictionary.section.test.results[this.result.most_answers].title, [Validators.required]
            ],
            text: [
                this._parentComponent.dictionary.section.test.results[this.result.most_answers].text, [Validators.required]
            ],
            img: [
                this.result.img, [Validators.required]
            ]
        });
    }

    get title() { return this.form.get('title') }

    get text() { return this.form.get('text') }

    get img() { return this.form.get('img') }

}