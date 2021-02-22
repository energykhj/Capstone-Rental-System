import { Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  value = '';

  @Output() sidenavClose = new EventEmitter();

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

  onSearch(value){
    console.log('header');
    this.router.navigate(['/home'],{
      queryParams: {
        value: value
      }
    }).then(page => { window.location.reload();})
  }
}
