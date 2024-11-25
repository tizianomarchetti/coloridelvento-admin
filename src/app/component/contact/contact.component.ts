import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Contatto } from 'src/app/interface/contact';
import { ContactMapperService } from 'src/app/services/contact-mapper.service';
import { ContactService } from 'src/app/services/contact.service';
import { ModaleComponent } from '../modale/modale.component';
import { ContactForm } from 'src/app/form/contact.form';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  id: number;
  contact: Contatto;

  footer: boolean;

  columnLabels: any[] = [];

  isInsert: boolean;

  form: ContactForm;
  formData: FormGroup;

  options: any[] = [];

  formError: string = null;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['criterio', 'valore'];

  editing: boolean = false;
  insertCompleted: boolean = false;

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private contactService: ContactService, 
    private contactMapper: ContactMapperService, private cdr: ChangeDetectorRef, private router: Router) { 
    this.footer = router.url.includes('footer');
  }

  ngOnInit() {
    this.columnLabels = [
      {
        id: 'name',
        label: 'Nome'
      },
      {
        id: 'desc',
        label: 'Descrizione'
      },
      {
        id: 'type',
        label: 'Tipologia'
      }
    ];

    this.options = [
      { url: 'tel:', icon: 'fas fa-phone', color: this.footer ? null : 'dark'},
      { url: 'mailto:', icon: this.footer ? 'fas fa-envelope' :'fa-regular fa-envelope', color: this.footer ? null : 'danger'},
      { url: 'https://wa.me/', icon: 'fa-brands fa-whatsapp', color: this.footer ? null : 'success'},
    ]
    
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.isInsert = !this.id;

      if (this.isInsert) {
        this.initForm();
      } else {
        this.getContact();
      }
    });
  }

  initForm() {
    this.form = new ContactForm(this);
    this.formData = this.form.form;
  }

  getContact() {
    this.dataSource = new MatTableDataSource();
    this.contactService.getContact(this.id).subscribe((contact: any) => {
      this.contact = this.contactMapper.mapContact(contact);
      this.initForm();
      this.setDataSource();
    })
  }

  setDataSource() {
    this.dataSource = new MatTableDataSource();

    Object.keys(this.contact).forEach(k => {
      if (k != 'id' && k != 'footer') {
        if (k == 'type') {
          this.dataSource.data.push({
            criterio: k,
            valore: 
              this.contact[k].url == 'tel:'
                ? 'Telefono'
                  : this.contact[k].url == 'mailto:'
                  ? 'Email'
                    : 'Whatsapp'
          })
        }
        else
          this.dataSource.data.push({
            criterio: k,
            valore: this.contact[k]
          })
      }
    });
  }

  formatField(element, col) {
    if (col == 'valore') {
      return element.valore || '-';
    }
    else {
      if (element.criterio)
        return this.columnLabels.find(el => el.id == element.criterio).label
    }
    return element[col] || '-';
  }

  confirm() {
    if (this.formData.valid) {
      this.formError = null;
      if (this.isInsert || this.isFormModified()) {
        this.dialog.open(ModaleComponent, {
          data: {
            body: "Procedere al salvataggio?",
            onConfirm: () => (this.isInsert ? this.create(this.formData.value) : this.edit(this.formData.value))
          },
          autoFocus: false,
          restoreFocus: false,
          disableClose: true
        })
      } else {
        this.editing = false;
      }
    } else {
      this.formError = 'Compilare correttamente tutti i campi obbligatori.';
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    }
  }

  cancel() {
    if (this.isFormModified()) {
      this.dialog.open(ModaleComponent, {
        data: {
          body: "Tornare indietro? Le modifiche verranno perse.",
          onConfirm: () => {
            this.onCancel();
          }
        },
        autoFocus: false,
        restoreFocus: false,
        disableClose: true
      })
    } else {
      this.onCancel();
    }
  }

  isFormModified() {
    let modified: boolean = false;
    if (this.insertCompleted)
      return false;
    if (this.isInsert) {
      return Object.keys(this.formData.controls).some(ctrl => this.formData.get(ctrl).value && this.formData.get(ctrl).value != '')
    }
    Object.keys(this.formData.value).forEach(k => {
      if (k == 'type') {
        modified = this.formData.value[k] && this.formData.value[k].url != this.contact[k].url
      }
      else {
        if (this.isModifiedValue(this.formData.value[k], this.contact[k] || null))
          modified = true;
      }
    })
    
    return modified;
  }

  isModifiedValue(firstValue, secondValue) {
    if ((firstValue == '' && !secondValue) || (secondValue == '' && !firstValue))
      return false;
    return firstValue != secondValue;
  }

  onCancel() {
    this.isInsert ? this.initForm() : this.getContact();
    this.editing = false;
    this.formError = null;
  }

  create(contact: Contatto) {
    contact.footer = this.footer;
    this.contactService.create(contact).subscribe((res: any) => {
      this.dialog.open(ModaleComponent, {
        data: {
          body: res.message,
          showPositiveCta: false
        },
        autoFocus: false,
        restoreFocus: false,
        disableClose: true
      }).afterClosed().subscribe(() => {
        this.insertCompleted = true;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.navigate([res.created], { relativeTo: this.route.parent });
      })
    }, (error) => {
      console.error(error);
      this.formError = error.message;
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    })
  }

  edit(contact: Contatto) {
    this.contactService.edit(contact, this.id).subscribe((res: any) => {
      this.dialog.open(ModaleComponent, {
        data: {
          body: res.message,
          showPositiveCta: false
        },
        autoFocus: false,
        restoreFocus: false,
        disableClose: true
      }).afterClosed().subscribe(() => {
        this.editing = false;
        this.getContact();
        this.setDataSource();
      })
    }, (error) => {
      console.error(error);
      this.formError = error.error.message || error.message;
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    })
  }

  delete() {
    const ids: number[] = [this.id];
    this.dialog.open(ModaleComponent, {
      data: {
        body: "Procedere all'eliminazione del contatto?",
        onConfirm: () => {
          this.doDelete(ids);
        }
      },
      autoFocus: false,
      restoreFocus: false,
      disableClose: true
    })
  }

  doDelete(ids: number[]) {
    this.contactService.bulkDelete(ids).subscribe((res: any) => {
      this.dialog.open(ModaleComponent, {
        data: {
          body: res.message,
          showPositiveCta: false
        },
        autoFocus: false,
        restoreFocus: false,
        disableClose: true
      }).afterClosed().subscribe(() => {
        this.router.navigate([this.footer ? '/footer-contacts' : '/contacts'])
      })
    }, error => {
      console.error(error)
      this.formError = error.error.message || error.message;
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    })
  }

}
