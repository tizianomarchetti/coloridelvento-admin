import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { FormContattoForm } from 'src/app/form/form-contatto.form';
import { FormContatto } from 'src/app/interface/contact-form';
import { IFormComponent } from 'src/app/interface/i-form-component';
import { ContactMapperService } from 'src/app/services/contact-mapper.service';
import { ContactService } from 'src/app/services/contact.service';
import { ModaleComponent } from '../modale/modale.component';

@Component({
  selector: 'app-form-contatto',
  templateUrl: './form-contatto.component.html',
  styleUrls: ['./form-contatto.component.css']
})
export class FormContattoComponent implements OnInit, IFormComponent {
  contactForm: FormContatto;

  columnLabels: any[] = [];

  form: FormContattoForm;
  formData: FormGroup;

  formError: string = null;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['criterio', 'valore'];

  editing: boolean = false;

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private contactService: ContactService, 
    private contactMapper: ContactMapperService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    this.columnLabels = [
      {
        id: 'email',
        label: 'Indirizzo mail'
      },
      {
        id: 'subject',
        label: 'Oggetto mail'
      }
    ];
    
    this.getContactForm();
  }

  initForm() {
    this.form = new FormContattoForm(this);
    this.formData = this.form.form;
  }

  getContactForm() {
    this.dataSource = new MatTableDataSource();
    this.contactService.getContactForm().subscribe((contactForm: any) => {
      this.contactForm = this.contactMapper.mapContactForm(contactForm);
      this.initForm();
      this.setDataSource();
    })
  }

  setDataSource() {
    this.dataSource = new MatTableDataSource();

    Object.keys(this.contactForm).forEach(k => {
      this.dataSource.data.push({
        criterio: k,
        valore: this.contactForm[k]
      })
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
      if (this.isFormModified()) {
        this.dialog.open(ModaleComponent, {
          data: {
            body: "Procedere al salvataggio?",
            onConfirm: () => (this.edit(this.formData.value))
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
    Object.keys(this.formData.value).forEach(k => {
      if (this.isModifiedValue(this.formData.value[k], this.contactForm[k] || null))
        modified = true;
    })
    
    return modified;
  }

  isModifiedValue(firstValue, secondValue) {
    if ((firstValue == '' && !secondValue) || (secondValue == '' && !firstValue))
      return false;
    return firstValue != secondValue;
  }

  onCancel() {
    this.getContactForm();
    this.editing = false;
    this.formError = null;
  }

  edit(contactForm: FormContatto) {
    this.contactService.editContactForm(contactForm).subscribe((res: any) => {
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
        this.getContactForm();
        this.setDataSource();
      })
    }, (error) => {
      console.error(error);
      this.formError = error.error.message || error.message;
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    })
  }

}
