import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { EventForm } from 'src/app/form/event.form';
import { Evento } from 'src/app/interface/event';
import { EventMapperService } from 'src/app/services/event-mapper.service';
import { EventService } from 'src/app/services/event.service';
import { ModaleComponent } from '../modale/modale.component';
import { IFormComponent } from 'src/app/interface/i-form-component';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit, IFormComponent {
  id: number;
  event: Evento;

  columnLabels: any[] = [];

  isInsert: boolean;

  form: EventForm;
  formData: FormGroup;

  formError: string = null;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['criterio', 'valore'];

  editing: boolean = false;
  insertCompleted: boolean = false;

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private eventService: EventService, 
    private eventMapper: EventMapperService, private cdr: ChangeDetectorRef, private router: Router) { 
    route.params.subscribe(params => {
      this.id = params.id;
      this.isInsert = !this.id;
    });
  }

  ngOnInit() {
    this.columnLabels = [
      {
        id: 'location',
        label: 'Luogo'
      },
      {
        id: 'date',
        label: 'Data'
      },
      {
        id: 'time',
        label: 'Ora'
      }
    ];
    
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.isInsert = !this.id;

      if (this.isInsert) {
        this.initForm();
      } else {
        this.getEvento();
      }

      // if (params && params.id) {
      //   this.eventService.getEvent(params.id).subscribe((event: any) => {
      //     this.event = this.eventMapper.mapEvent(event);
      //   })
      // }
      // this.isInsert = !params.id;
    });
  }

  initForm() {
    this.form = new EventForm(this);
    this.formData = this.form.form;
  }

  getEvento() {
    this.dataSource = new MatTableDataSource();
    this.eventService.getEvent(this.id).subscribe((event: any) => {
      this.event = this.eventMapper.mapEvent(event);
      this.initForm();
      this.setDataSource();
    })
  }

  setDataSource() {
    this.dataSource = new MatTableDataSource();

    Object.keys(this.event).forEach(k => {
      if (k != 'id') {
        this.dataSource.data.push({
          criterio: k,
          valore: this.event[k]
        })
      }
    });
  }

  formatField(element, col) {
    if (col == 'valore') {
      if (element.valore) {
        if (element.criterio == 'date')
          return this.eventMapper.formatDateFromBe(element.valore)
        else if (element.criterio == 'time')
          return this.eventMapper.formatTimeFromBe(element.valore)
        else return element.valore
      }
      else return '-';
    }
    else {
      if (element.criterio)
        return this.columnLabels.find(el => el.id == element.criterio).label
    }
    return element[col] || '-';
  }

  confirm() {
    // Object.keys(this.formData.value).forEach(k => {
    //   if (this.controlMetadata.find(el => el.id == k).type == 'checkbox')
    //     this.formData.value[k] = !!this.formData.value[k];
    // })
    if (this.formData.valid) {
      this.formError = null;
      if (this.isInsert || this.isFormModified()) {
        // Object.keys(this.formData.value).forEach(k => {
        //   if (this.controlMetadata.find(el => el.id == k).type != 'checkbox' && this.formData.value[k] == '')
        //     this.formData.value[k] = null;
        // })
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
      if (this.isModifiedValue(this.formData.value[k], this.event[k] || null))
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
    this.isInsert ? this.initForm() : this.getEvento();
    this.editing = false;
    this.formError = null;
  }

  create(event: Evento) {
    this.eventService.create(event).subscribe((res: any) => {
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

  edit(event: Evento) {
    this.eventService.edit(event, this.id).subscribe((res: any) => {
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
        this.getEvento();
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
        body: "Procedere all'eliminazione dell'evento?",
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
    this.eventService.bulkDelete(ids).subscribe((res: any) => {
      this.dialog.open(ModaleComponent, {
        data: {
          body: res.message,
          showPositiveCta: false
        },
        autoFocus: false,
        restoreFocus: false,
        disableClose: true
      }).afterClosed().subscribe(() => {
        this.router.navigate(['/events'])
      })
    }, error => {
      console.error(error)
      this.formError = error.error.message || error.message;
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    })
  }

}
