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

    lastTicketUrlValue: string = null;

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
            ],
            flagGratuito: [
                this.event.flagGratuito
            ],
            ticketUrl: [
                this.event.ticketUrl
            ]
        });

        if (this.event.flagGratuito) {
            this.ticketUrl.disable();
            this.ticketUrl.setValue(null);
        }

        // Aggancia la logica di disabilitazione dinamica
        this.flagGratuito.valueChanges.subscribe((gratuito) => {
            if (gratuito) {
                this.ticketUrl.disable();
                this.lastTicketUrlValue = this.ticketUrl.value;
                this.ticketUrl.setValue(null);
            } else {
                this.ticketUrl.enable();
                this.ticketUrl.setValue(this.lastTicketUrlValue);
            }
        });
    }

    get location() { return this.form.get('location') }

    get date() { return this.form.get('date') }

    get time() { return this.form.get('time') }

    get flagGratuito() { return this.form.get('flagGratuito') }

    get ticketUrl() { return this.form.get('ticketUrl') }

}