import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { BandComponent } from 'src/app/interface/component';
import { BandMapperService } from 'src/app/services/band-mapper.service';
import { BandService } from 'src/app/services/band.service';
import { ModaleComponent } from '../modale/modale.component';
import { ComponentForm } from 'src/app/form/component.form';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { IFormComponent } from 'src/app/interface/i-form-component';

@Component({
  selector: 'app-component',
  templateUrl: './component.component.html',
  styleUrls: ['./component.component.css']
})
export class ComponentComponent implements OnInit, IFormComponent {
  id: number;
  component: BandComponent;

  image: any;

  lang: string = null;

  isInsert: boolean;

  form: ComponentForm;
  formData: FormGroup;

  dictionary: any = null;
  editorContent: string = '';
  originalContent: string = '';

  formError: string = null;

  editing: boolean = false;
  insertCompleted: boolean = false;

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private bandService: BandService, 
    private bandMapper: BandMapperService, private cdr: ChangeDetectorRef, private router: Router,
    private dictService: DictionaryService) {}

  ngOnInit() {    
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.isInsert = !this.id;
      if (!this.isInsert) this.getComponent(false);
    });
  }

  initForm() {
    this.dictService.getDictionary(this.lang).subscribe((res: any) => {
      this.dictionary = JSON.parse(res.result);
      this.editorContent = this.component ? (this.dictionary.section.about.bio[this.component.bio] || '') : '';
      this.originalContent = this.editorContent;
      this.form = new ComponentForm(this);
      this.formData = this.form.form;
    });
  }

  getComponent(initForm: boolean = true) {
    this.bandService.getComponent(this.id).subscribe((component: any) => {
      this.component = this.bandMapper.mapComponent(component);
      if (initForm) this.initForm();
    })
  }

  setLang(lang: string) {
    this.lang = lang;
    this.initForm();
    // if (this.isInsert) this.initForm();
    // else this.getComponent();
  }

  clickFileInput() {
    document.getElementById('file').click();
  }

  onFileChange(event: any) {
    const file = event.target.files[0]; // <--- File Object for future use.
    if(event.target.files.length > 0) {
      const fileType = file.type;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (fileType != 'image/webp') {
          this.formData.get('img').setErrors({ format: true });
        }
        else {
          this.image = reader.result;
        }
      }
    }
    this.formData.controls['img'].setValue(file ? file.name : null); // <-- Set Value for Validation
  }

  confirm() {
    if (this.formData.valid && this.editorContent && this.editorContent != '') {
      this.formError = null;
      if (this.isInsert || this.isFormModified()) {
        this.dialog.open(ModaleComponent, {
          data: {
            body: "Procedere al salvataggio?",
            onConfirm: () => (this.isInsert ? this.create() : this.edit())
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
    if (!this.formData) return false;

    let modified: boolean = false;
    if (this.insertCompleted)
      return false;
    if (this.isInsert) {
      return Object.keys(this.formData.controls).some(ctrl => this.formData.get(ctrl).value && this.formData.get(ctrl).value != '')
        || this.editorContent && this.editorContent != '';
    }
    Object.keys(this.formData.value).forEach(k => {
      if (this.isModifiedValue(this.formData.value[k], this.component[k] || null))
        modified = true;
    })
    
    return modified || this.originalContent != this.editorContent;
  }

  isModifiedValue(firstValue, secondValue) {
    if ((firstValue == '' && !secondValue) || (secondValue == '' && !firstValue))
      return false;
    return firstValue != secondValue;
  }

  onCancel() {
    this.isInsert ? this.initForm() : this.getComponent();
    this.editing = false;
    this.formError = null;
  }

  create() {
    const component: BandComponent = this.formData.value;
    component.bio = component.name.toLowerCase().split(' ').join('_'); //TODO se riesci trova un modo di creare un codice univoco
    this.dictionary.section.about.bio[component.bio] = this.editorContent;
    this.bandService.createComponent(component, this.image, this.dictionary, this.lang).subscribe((res: any) => {
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
      this.formError = error.error.message || error.message;
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    })
  }

  edit() {
    const component: BandComponent = this.formData.value;
    this.dictionary.section.about.bio[this.component.bio] = this.editorContent;
    this.bandService.editComponent(component, this.id, this.image, this.dictionary, this.lang, this.component.img).subscribe((res: any) => {
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
        this.getComponent();
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
        body: "Procedere all'eliminazione del componente?",
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
    this.bandService.bulkDeleteComponents(ids).subscribe((res: any) => {
      this.dialog.open(ModaleComponent, {
        data: {
          body: res.message,
          showPositiveCta: false
        },
        autoFocus: false,
        restoreFocus: false,
        disableClose: true
      }).afterClosed().subscribe(() => {
        this.router.navigate(['/components'])
      })
    }, error => {
      console.error(error)
      this.formError = error.error.message || error.message;
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    })
  }

}
