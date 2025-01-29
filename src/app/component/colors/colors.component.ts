import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ModaleComponent } from '../modale/modale.component';
import { ColorGroup } from 'src/app/interface/color-group';
import { ColorForm } from 'src/app/form/color.form';
import { ColorService } from 'src/app/services/colors.service';
import { ColorMapperService } from 'src/app/services/color-mapper.service';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.css']
})
export class ColorsComponent implements OnInit {

  id: number;
  colorGroup: ColorGroup;
  // originalColorGroup: ColorGroup;
  headerColor: string;
  footerColor: string;
  btnColor: string;
  linkColor: string;
  headerGradient: boolean;
  footerGradient: boolean;
  btnGradient: boolean;

  columnLabels: any[] = [];

  form: ColorForm;
  formData: FormGroup;

  formError: string = null;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['criterio', 'valore'];

  editing: boolean = false;

  constructor(private colorService: ColorService, private colorMapper: ColorMapperService, private dialog: MatDialog, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.columnLabels = [
      {
        id: 'header',
        label: 'Header e menu'
      },
      {
        id: 'footer',
        label: 'Footer'
      },
      {
        id: 'btn',
        label: 'Bottoni'
      },
      {
        id: 'link',
        label: 'Link'
      }
    ];

    this.getColors();
  }

  getColors() {
    this.colorService.getColors().subscribe((res: any) => {
      this.colorGroup = this.colorMapper.mapColorGroup(res);

      this.headerColor = this.colorGroup.header;
      this.footerColor = this.colorGroup.footer;
      this.btnColor = this.colorGroup.btn;
      this.linkColor = this.colorGroup.link;
      this.headerGradient = this.colorGroup.headerGradient;
      this.footerGradient = this.colorGroup.footerGradient;
      this.btnGradient = this.colorGroup.btnGradient;

      this.initForm();
    }, (error) => {
      console.error(error);
      this.formError = error.error.message || error.message;
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    });
  }

  initForm() {
    this.form = new ColorForm(this);
    this.formData = this.form.form;
    this.setDataSource();
  }

  setDataSource() {
    this.dataSource = new MatTableDataSource();

    Object.keys(this.colorGroup).forEach(k => {
      if (k == 'header' || k == 'footer' || k == 'btn' || k == 'link')
        this.dataSource.data.push({
          criterio: k,
          valore: this.colorGroup[k]
        })
    });
  }

  formatField(element, col) {
    if (col == 'valore') {
      return element.valore.includes('gradient') 
        ? element.valore.replace('linear-gradient(to right, ', '').replace(')', '')
        : element.valore || '-';
    }
    else {
      if (element.criterio && this.columnLabels.find(el => el.id == element.criterio))
        return this.columnLabels.find(el => el.id == element.criterio).label
    }
    return element[col] || '-';
  }

  setHeaderColor(event) {
    if (!this.formData.value.headerGradient) {
      this.colorGroup.header = event.target.value;
    }
    else {
      if (event.target.id == 'header_1')
        this.colorGroup.header ='linear-gradient(to right, ' + event.target.value + ', ' + (this.formData.value.header_2 || '#000000') + ')';
      else
        this.colorGroup.header ='linear-gradient(to right, ' + this.formData.value.header_1 + ', ' + event.target.value + ')';
    }
  }

  setFooterColor(event) {
    if (!this.formData.value.footerGradient) {
      this.colorGroup.footer = event.target.value;
    }
    else {
      if (event.target.id == 'footer_1')
        this.colorGroup.footer ='linear-gradient(to right, ' + event.target.value + ', ' + (this.formData.value.footer_2 || '#000000') + ')';
      else
        this.colorGroup.footer ='linear-gradient(to right, ' + this.formData.value.footer_1 + ', ' + event.target.value + ')';
    }
  }

  setBtnColor(event) {
    if (!this.formData.value.btnGradient) {
      this.colorGroup.btn = event.target.value;
    }
    else {
      const btn1 = this.formData.value.btn_1
      const btn2 = this.formData.value.btn_2
      if (event.target.id == 'btn_1')
        this.colorGroup.btn ='linear-gradient(to right, ' + event.target.value + ', ' + (btn2 || '#000000') + ')';
      else
        this.colorGroup.btn ='linear-gradient(to right, ' + btn1 + ', ' + event.target.value + ')';
    }
  }

  setLinkColor(event) {
    this.colorGroup.link = event.target.value;
  }

  setHeaderGradient(event) {
    if (event.checked) {
      this.colorGroup.header = 'linear-gradient(to right, ' + this.formData.value.header_1 + ', ' + (this.formData.value.header_2 || '#000000') + ')';
    } else {
      this.colorGroup.header = this.formData.value.header_1;
    }
    this.colorGroup.headerGradient = event.checked;
  }

  setFooterGradient(event) {
    if (event.checked) {
      this.colorGroup.footer = 'linear-gradient(to right, ' + this.formData.value.footer_1 + ', ' + (this.formData.value.footer_2 || '#000000') + ')';
    } else {
      this.colorGroup.footer = this.formData.value.footer_1;
    }
    this.colorGroup.footerGradient = event.checked;
  }

  setBtnGradient(event) {
    if (event.checked) {
      this.colorGroup.btn = 'linear-gradient(to right, ' + this.formData.value.btn_1 + ', ' + (this.formData.value.btn_2 || '#000000') + ')';
    } else {
      this.colorGroup.btn = this.formData.value.btn_1;
    }
    this.colorGroup.btnGradient = event.checked;
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

    return this.colorGroup.header != this.headerColor || 
      this.colorGroup.footer != this.footerColor ||
      this.colorGroup.btn != this.btnColor ||
      this.colorGroup.link != this.linkColor ||
      this.colorGroup.headerGradient != this.headerGradient ||
      this.colorGroup.footerGradient != this.footerGradient ||
      this.colorGroup.btnGradient != this.btnGradient;
  }

  isModifiedValue(firstValue, secondValue) {
    if ((firstValue == '' && !secondValue) || (secondValue == '' && !firstValue))
      return false;
    return firstValue != secondValue;
  }

  onCancel() {
    this.colorGroup = {
      header: '' + this.headerColor,
      footer: '' + this.footerColor,
      btn: '' + this.btnColor,
      link: '' + this.linkColor,
      headerGradient: this.headerGradient || false,
      footerGradient: this.footerGradient || false,
      btnGradient: this.btnGradient || false
    }
    this.initForm();
    this.editing = false;
    this.formError = null;
  }

  save() {
    this.colorService.save(this.colorGroup).subscribe((res: any) => {
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
        this.getColors();
      })
    }, (error) => {
      console.error(error);
      this.formError = error.error.message || error.message;
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    })
  }

  scegliColoreTesto(hexColoreSfondo) {
    if (hexColoreSfondo.length === 7 && hexColoreSfondo.startsWith('#')) {
      // Rimuove il # iniziale se presente
      hexColoreSfondo = hexColoreSfondo.replace('#', '');

      // Converte il colore esadecimale in valori RGB
      const r = parseInt(hexColoreSfondo.substring(0, 2), 16) / 255;
      const g = parseInt(hexColoreSfondo.substring(2, 4), 16) / 255;
      const b = parseInt(hexColoreSfondo.substring(4, 6), 16) / 255;

      // Calcola la luminanza relativa
      const luminanza = (colore) => {
          return colore <= 0.03928 ? colore / 12.92 : Math.pow((colore + 0.055) / 1.055, 2.4);
      };

      const L = 0.2126 * luminanza(r) + 0.7152 * luminanza(g) + 0.0722 * luminanza(b);

      // Calcola il contrasto con bianco e nero
      const contrastoConBianco = (1.0 + 0.05) / (L + 0.05);
      const contrastoConNero = (L + 0.05) / (0.0 + 0.05);

      // Restituisce bianco o nero in base al contrasto maggiore
      return contrastoConBianco > contrastoConNero ? '#FFFFFF' : '#000000';
    }
  }

}
