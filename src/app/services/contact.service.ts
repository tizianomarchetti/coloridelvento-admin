import { Injectable } from '@angular/core';
import { ROOT } from '../config/Constants';
import { HttpClient } from '@angular/common/http';
import { Contatto } from '../interface/contact';
import { FormContatto } from '../interface/contact-form';
import { Social } from '../interface/social';

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

  socialsUrl: string = ROOT + 'contact/social/getAll';
  socialUrl: string = ROOT + 'contact/social/getById';
  updateSocialUrl: string = ROOT + 'contact/social/update';
  createSocialUrl: string = ROOT + 'contact/social/create';
  bulkDeleteSocialUrl: string = ROOT + 'contact/social/delete';

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

  // socials

  getSocials() {
    return this.http.get(this.socialsUrl);
  }

  getSocial(id: number) {
    return this.http.post(this.socialUrl, { id });
  }

  editSocial(social: Social, id: number) {
    return this.http.put(this.updateSocialUrl, {
      ...social,
      id: id
    });
  }

  createSocial(social: Social) {
    return this.http.post(this.createSocialUrl, social);
  }

  bulkDeleteSocial(ids: number[]) {
    return this.http.put(this.bulkDeleteSocialUrl, { ids });
  }
}
