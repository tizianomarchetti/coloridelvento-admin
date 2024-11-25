import { ContactType } from "./contact-type";

export class Contatto {
    id: number;
    name?: string;
    desc: string;
    type: ContactType;
    footer: boolean;
}
