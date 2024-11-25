import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatCheckboxChange } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Contatto } from 'src/app/interface/contact';
import { ContactMapperService } from 'src/app/services/contact-mapper.service';
import { ContactService } from 'src/app/services/contact.service';
import { ModaleComponent } from '../modale/modale.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  contacts: Contatto[] = [];

  footer: boolean;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  columnLabels: any[] = [];

  checkableLength: number;

  formError: string = null;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private dialog: MatDialog, private router: Router, private route: ActivatedRoute, private contactService: ContactService, 
    private contactMapper: ContactMapperService, private cdr: ChangeDetectorRef) { 
      this.footer = router.url.includes('footer');
  }

  ngOnInit() {
    this.displayedColumns = this.footer ? ['checked', 'desc', 'type'] :['checked', 'name', 'desc', 'type'];
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

    this.dataSource = new MatTableDataSource();

    this.getContacts();
  }

  getContacts() {
    this.contacts = [];
    this.contactService.getContacts(this.footer).subscribe((res: any) => {
      this.contacts = res.map(el => this.contactMapper.mapContact(el));

      this.populateDataSource();
      this.setFilterPredicate();
      this.setSort();
      this.setPaginator();
    })
  }

  populateDataSource() {
    this.dataSource.data = [];
    this.contacts.forEach(event => {
      this.dataSource.data.push({...event});
    });
  }

  setFilterPredicate() {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      console.log(data)
      return Object.keys(data).some(k => {
        console.log(k, this.displayedColumns)
        return k != 'checked' && k != 'icon' && this.displayedColumns.includes(k) && data[k] && data[k].toLowerCase().includes(filter.toLowerCase())
      });
    }

    this.updateCheckableLength();
  }

  setSort() {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  setPaginator() {
    if (this.paginator) {
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { 
        if (length == 0 || pageSize == 0) { return `0 di ${length}`; } 
        length = Math.max(length, 0); 
        const startIndex = page * pageSize; 
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; 
        return `${startIndex + 1} - ${endIndex} di ${length}`; 
      }
      this.dataSource.paginator = this.paginator;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    this.updateCheckableLength();
  }

  getColumnLabel(colId: string) {
    return this.columnLabels.find(el => el.id == colId).label
  }

  navigateTo(row) {
    this.router.navigate([row.id], { relativeTo: this.route });
  }

  updateCheckableLength() {
    this.checkableLength = (this.dataSource.filteredData || this.dataSource.data).length;

    this.displayedColumns = this.checkableLength == 0 
      ? this.displayedColumns.filter(el => el != 'checked')
      : (this.displayedColumns.includes('checked') ? this.displayedColumns : ['checked', ...this.displayedColumns]);
  }

  getCheckedLength() {
    const length = this.dataSource 
      ? (this.dataSource.filteredData || this.dataSource.data).filter(el => el.checked).length 
      : 0;
    return length;
  }

  selectAll(event: MatCheckboxChange) {
    (this.dataSource.filteredData || this.dataSource.data).filter(el => !el.admin).forEach(el => {
      el.checked = event.checked;
    });
  }

  getFilteredDisplayedColumns() {
    return this.displayedColumns.filter(el => el != 'checked')
  }

  delete() {
    this.formError = null;
    const ids: number[] = (this.dataSource.filteredData || this.dataSource.data).filter(el => el.checked).map(el => el.id);
    this.dialog.open(ModaleComponent, {
      data: {
        body: "Procedere all'eliminazione di " + ids.length + (ids.length == 1 ? " elemento?" : " elementi?"),
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
        this.getContacts();
        (document.getElementById('filterInput') as HTMLInputElement).value = '';
      })
    }, error => {
      console.error(error)
      this.formError = error.error.message || error.message;
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    })
  }

}
