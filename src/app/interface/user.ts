export class Utente {
    id: number;
    email: string;
    password: string;
    active: boolean = false;
    admin: boolean = false;
    token?: string;
}
