export class Evento {
    id: number;
    location: string;
    date: string;
    time: string;
    flagGratuito?: boolean;
    ticketUrl?: string;

    constructor() {
        this.flagGratuito = false;
    }
}
