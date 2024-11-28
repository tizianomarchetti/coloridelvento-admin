import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Question } from "../interface/question";

export class QuestionForm {
    question: Question;

    /** form */
    form: FormGroup;
    /** form builder */
    formBuilder: FormBuilder;
    /** _parentComponent */
    _parentComponent: any;

    constructor(parentComponent: any) {
        this.formBuilder = new FormBuilder();
        this._parentComponent = parentComponent;

        this.question = this._parentComponent.question || new Question();
        
        this.form = this.formBuilder.group({
            title: [
                this.question['title_' + this._parentComponent.lang], [Validators.required]
            ]
        });
    }

    get title() { return this.form.get('title') }

}