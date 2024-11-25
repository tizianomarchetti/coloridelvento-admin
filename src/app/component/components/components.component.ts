import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatCheckboxChange } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ModaleComponent } from '../modale/modale.component';
import { BandMapperService } from 'src/app/services/band-mapper.service';
import { BandService } from 'src/app/services/band.service';
import { BandComponent } from 'src/app/interface/component';

@Component({
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.css']
})
export class ComponentsComponent implements OnInit {
  components: BandComponent[] = [];

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  columnLabels: any[] = [];

  checkableLength: number;

  formError: string = null;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private dialog: MatDialog, private router: Router, private route: ActivatedRoute, private bandService: BandService, 
    private bandMapper: BandMapperService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.displayedColumns = ['checked', 'name', 'img'];
    this.columnLabels = [
      {
        id: 'name',
        label: 'Nome'
      },
      {
        id: 'img',
        label: 'Foto'
      }
    ];

    this.dataSource = new MatTableDataSource();

    this.getComponents();
  }

  getComponents() {
    this.components = [];
    this.bandService.getComponents().subscribe((res: any) => {
      this.components = res.map(el => this.bandMapper.mapComponent(el));

      this.populateDataSource();
      this.setFilterPredicate();
      this.setSort();
      this.setPaginator();
    })
  }

  populateDataSource() {
    this.dataSource.data = [];
    this.components.forEach(event => {
      this.dataSource.data.push({...event});
    });
  }

  setFilterPredicate() {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return Object.keys(data).some(k => {
        return k != 'checked' && this.displayedColumns.includes(k) && data[k].toLowerCase().includes(filter.toLowerCase())
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
    (this.dataSource.filteredData || this.dataSource.data).forEach(el => {
      el.checked = event.checked;
    });
  }

  getFilteredDisplayedColumns() {
    return this.displayedColumns.filter(el => el != 'checked')
  }

  delete() {
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
        this.getComponents();
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
