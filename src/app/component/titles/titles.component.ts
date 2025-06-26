import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { ModaleComponent } from '../modale/modale.component';
import { TitleGroup } from 'src/app/interface/title-group';
import { TitleForm } from 'src/app/form/title.form';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-titles',
  templateUrl: './titles.component.html',
  styleUrls: ['./titles.component.css']
})
export class TitlesComponent implements OnInit {
  id: number;
  titleGroup: TitleGroup;

  lang: string = null;

  section: string;

  dictionary: any = null;

  columnLabels: any[] = [];

  form: TitleForm;
  formData: FormGroup;

  formError: string = null;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['criterio', 'valore'];

  editing: boolean = false;

  constructor(private route: ActivatedRoute, private dictService: DictionaryService, private dialog: MatDialog, private cdr: ChangeDetectorRef) { 
    route.parent.url.subscribe(path => {
      this.section = path[0].path;
    })
  }

  ngOnInit() {
    this.columnLabels = [
      {
        id: 'menu',
        label: 'Titolo menù'
      },
      {
        id: 'section',
        label: 'Titolo sezione home'
      },
      {
        id: 'page',
        label: 'Titolo pagina'
      }
    ];
  }

  initForm() {
    this.dictService.getDictionary(this.lang).subscribe((res: any) => {
      this.dictionary = JSON.parse(res.result);
      
      this.titleGroup = {
        menu: this.dictionary.menu.label[this.section],
      }
      if (this.section == 'about' ||this.section == 'events' ||this.section == 'media') {
        this.titleGroup.section = this.dictionary.section[this.section].sectionTitle;
        this.titleGroup.page = this.dictionary.section[this.section].pageTitle;
      }
      else if (this.section == 'test') {
        this.titleGroup.page = this.dictionary.section[this.section].pageTitle;
      }
      else if (this.section == 'contacts') {
        this.titleGroup.section = this.dictionary.section[this.section].sectionTitle;
      }
      
      this.form = new TitleForm(this);
      this.formData = this.form.form;
      this.setDataSource();
    });
  }

  setDataSource() {
    this.dataSource = new MatTableDataSource();

    Object.keys(this.titleGroup).forEach(k => {
      this.dataSource.data.push({
        criterio: k,
        valore: this.titleGroup[k]
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

  setLang(lang: string) {
    this.lang = lang;
    this.initForm();
  }

  confirm() {
    if (this.formData.valid) {
      this.formError = null;
      if (this.isFormModified()) {
        this.dialog.open(ModaleComponent, {
          data: {
            body: "Procedere al salvataggio?",
            onConfirm: () => (this.save())
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
    Object.keys(this.formData.value).forEach(k => {
      if (this.isModifiedValue(this.formData.value[k], this.titleGroup[k] || null))
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
    this.initForm();
    this.editing = false;
    this.formError = null;
  }

  save() {
    this.dictionary.menu.label[this.section] = this.formData.value.menu;
    if (this.formData.value.section)
      this.dictionary.section[this.section].sectionTitle = this.formData.value.section;
    if (this.formData.value.page)
      this.dictionary.section[this.section].pageTitle = this.formData.value.page;
    this.dictService.save(this.lang, this.dictionary).subscribe((res: any) => {
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
        this.initForm();
      })
    }, (error) => {
      console.error(error);
      this.formError = error.error.message || error.message;
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    })
  }

}
