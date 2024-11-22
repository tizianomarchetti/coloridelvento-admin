import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { ModaleComponent } from '../modale/modale.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-band',
  templateUrl: './band.component.html',
  styleUrls: ['./band.component.css']
})
export class BandComponent implements OnInit {
  lang: string = null;

  dictionary: any = null;
  editorContent: string = '';
  originalContent: string = '';

  editing: boolean = false;

  formError: string = null;

  constructor(private dictService: DictionaryService, private dialog: MatDialog, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

  setLang(lang: string) {
    this.lang = lang;
    this.getDictionary();
  }

  getDictionary() {
    this.dictService.getDictionary(this.lang).subscribe((res: any) => {
      this.dictionary = JSON.parse(res.result);
      this.editorContent = this.dictionary.section.about.resume || '';
      this.originalContent = this.editorContent;
    });
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
    return this.originalContent != this.editorContent;
  }

  onCancel() {
    this.getDictionary();
    this.editing = false;
    this.formError = null;
  }

  confirm() {
    if (this.editorContent && this.editorContent != '') {
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

  save() {
    this.dictionary.section.about.resume = this.editorContent;
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
        this.getDictionary();
      })
    }, (error) => {
      console.error(error);
      this.formError = error.error.message || error.message;
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    })
  }

}
