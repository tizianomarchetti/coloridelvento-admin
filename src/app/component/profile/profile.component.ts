import { Component, OnInit } from '@angular/core';
import { Utente } from 'src/app/interface/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: Utente;

  constructor() { }

  ngOnInit() {
  }

}
