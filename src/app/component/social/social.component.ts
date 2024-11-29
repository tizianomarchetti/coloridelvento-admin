import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Social } from 'src/app/interface/social';
import { ContactMapperService } from 'src/app/services/contact-mapper.service';
import { ContactService } from 'src/app/services/contact.service';
import { ModaleComponent } from '../modale/modale.component';
import { SocialForm } from 'src/app/form/social.form';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.css']
})
export class SocialComponent implements OnInit {
  id: number;
  social: Social;

  footer: boolean;

  columnLabels: any[] = [];

  isInsert: boolean;

  form: SocialForm;
  formData: FormGroup;

  options: any[] = [];

  formError: string = null;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['criterio', 'valore'];

  editing: boolean = false;
  insertCompleted: boolean = false;

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private contactService: ContactService, 
    private contactMapper: ContactMapperService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    this.columnLabels = [
      {
        id: 'url',
        label: 'URL'
      },
      {
        id: 'type',
        label: 'Tipologia'
      }
    ];

    this.options = [
      { icon: 'fa-brands fa-instagram' },
      { icon: 'fab fa-facebook-f' },
      { icon: 'fa-brands fa-youtube' },
      { icon: 'fa-brands fa-spotify' },
      { icon: 'fa-brands fa-soundcloud' },
    ];
    
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.isInsert = !this.id;

      if (this.isInsert) {
        this.initForm();
      } else {
        this.getSocial();
      }
    });
  }

  initForm() {
    this.form = new SocialForm(this);
    this.formData = this.form.form;
  }

  getSocial() {
    this.dataSource = new MatTableDataSource();
    this.contactService.getSocial(this.id).subscribe((contact: any) => {
      this.social = this.contactMapper.mapSocial(contact);
      this.initForm();
      this.setDataSource();
    })
  }

  setDataSource() {
    this.dataSource = new MatTableDataSource();

    this.dataSource.data.push({
      criterio: 'url',
      valore: this.social.type.url
    });

    this.dataSource.data.push({
      criterio: 'type',
      valore: 
        this.social.type.icon.includes('instagram')
          ? 'Instagram'
            : this.social.type.icon.includes('facebook')
            ? 'Facebook'
              : this.social.type.icon.includes('youtube')
              ? 'Youtube'
                : this.social.type.icon.includes('spotify')
                ? 'Spotify'
                  : 'Soundcloud'
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
        if (this.formData.value[k] && this.formData.value[k].icon != this.social[k].icon)
          modified = true;
      }
      else {
        if (this.isModifiedValue(this.formData.value[k], this.social ? this.social.type.url : null))
          modified = true;
      }
    });
    
    return modified;
  }

  isModifiedValue(firstValue, secondValue) {
    if ((firstValue == '' && !secondValue) || (secondValue == '' && !firstValue))
      return false;
    return firstValue != secondValue;
  }

  onCancel() {
    this.isInsert ? this.initForm() : this.getSocial();
    this.editing = false;
    this.formError = null;
  }

  create(social: Social) {
    this.contactService.createSocial(social).subscribe((res: any) => {
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

  edit(social: Social) {
    this.contactService.editSocial(social, this.id).subscribe((res: any) => {
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
        this.getSocial();
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
        body: "Procedere all'eliminazione del contatto social?",
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
    this.contactService.bulkDeleteSocial(ids).subscribe((res: any) => {
      this.dialog.open(ModaleComponent, {
        data: {
          body: res.message,
          showPositiveCta: false
        },
        autoFocus: false,
        restoreFocus: false,
        disableClose: true
      }).afterClosed().subscribe(() => {
        this.router.navigate(['/socials'])
      })
    }, error => {
      console.error(error)
      this.formError = error.error.message || error.message;
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    })
  }

}
