import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  bandExploded: boolean = false;
  mediaExploded: boolean = false;
  contattiExploded: boolean = false;
  quizExploded: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
