import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Evento } from "../interface/event";

export class EventForm {
    event: Evento;

    /** form */
    form: FormGroup;
    /** form builder */
    formBuilder: FormBuilder;
    /** _parentComponent */
    _parentComponent: any;

    constructor(parentComponent: any) {
        this.formBuilder = new FormBuilder();
        this._parentComponent = parentComponent;

        this.event = this._parentComponent.event || new Evento();
        
        this.form = this.formBuilder.group({
            location: [
                this.event.location, [Validators.required]
            ],
            date: [
                this.event.date, [Validators.required]
            ],
            time: [
                this.event.time, [Validators.required]
            ]
        });
    }

    get location() { return this.form.get('location') }

    get date() { return this.form.get('date') }

    get time() { return this.form.get('time') }

}