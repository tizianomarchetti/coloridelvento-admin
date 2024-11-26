import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { QuizMainPage } from "../interface/quiz-main-page";

export class QuizMainPageForm {
    quizPage: QuizMainPage;

    /** form */
    form: FormGroup;
    /** form builder */
    formBuilder: FormBuilder;
    /** _parentComponent */
    _parentComponent: any;

    constructor(parentComponent: any) {
        this.formBuilder = new FormBuilder();
        this._parentComponent = parentComponent;

        this.quizPage = this._parentComponent.quizPage || new QuizMainPage();
        
        this.form = this.formBuilder.group({
            description: [
                this.quizPage.description, 
                [Validators.required]
            ],
            disclaimer: [
                this.quizPage.disclaimer, 
                [Validators.required]
            ]
        });
    }

    get description() { return this.form.get('description') }

    get disclaimer() { return this.form.get('disclaimer') }

}