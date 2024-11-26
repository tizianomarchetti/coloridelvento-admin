import { Injectable } from '@angular/core';
import { ROOT } from '../config/Constants';
import { HttpClient } from '@angular/common/http';
import { Contatto } from '../interface/contact';
import { FormContatto } from '../interface/contact-form';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactsUrl: string = ROOT + 'contact/getAll';
  contactUrl: string = ROOT + 'contact/getById';
  updateContactUrl: string = ROOT + 'contact/update';
  createContactUrl: string = ROOT + 'contact/create';
  bulkDeleteUrl: string = ROOT + 'contact/delete';

  contactFormUrl: string = ROOT + 'contact/getContactForm';
  updateContactFormUrl: string = ROOT + 'contact/updateContactForm';

  constructor(private http: HttpClient) { }

  getContacts(flagFooter: boolean) {
    return this.http.post(this.contactsUrl, { flagFooter });
  }

  getContact(id: number) {
    return this.http.post(this.contactUrl, { id });
  }

  edit(contact: Contatto, id: number) {
    return this.http.put(this.updateContactUrl, {
      ...contact,
      id: id
    });
  }

  create(contact: Contatto) {
    return this.http.post(this.createContactUrl, contact);
  }

  bulkDelete(ids: number[]) {
    return this.http.put(this.bulkDeleteUrl, { ids });
  }

  getContactForm() {
    return this.http.get(this.contactFormUrl);
  }

  editContactForm(form: FormContatto) {
    return this.http.put(this.updateContactFormUrl, { form });
  }
}
