import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-modale',
  templateUrl: './modale.component.html',
  styleUrls: ['./modale.component.css']
})
export class ModaleComponent implements OnInit {

  constructor(private dialog: MatDialogRef<ModaleComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if (!(this.data.showPositiveCta === false)) this.data.showPositiveCta = true;
  }

  /**
   * Applica le modifiche e chiude la modale
   */
  confirm = () => {
    this.data.onConfirm();
    this.dialog.close();
  };

  /**
   * Chiude la dialog
   */
  close = () => {
    this.dialog.close();
  };

}
