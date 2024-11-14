export class Utente {
    id: number;
    email: string;
    password: string;
    active: boolean = false;
    token?: string;
}
