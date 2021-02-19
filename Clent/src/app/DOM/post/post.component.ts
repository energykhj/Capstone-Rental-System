//import { IPropertyBase } from './../../model/ipropertybase';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { SharedService } from '../../Services/shared.service';


@Component({
  selector: 'app-add-property',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']

})
export class PostComponent implements OnInit {
  //@ViewChild('Form') addPropertyForm: NgForm;
  @ViewChild('formTabs') formTabs: TabsetComponent;

  addPropertyForm: FormGroup;

  propertyTypes: Array<string> = ['House','Apartment','Duplex'];
  furnishTypes: Array<string> = ['Fully','Semi','unfurnished'];

  propertyView:  {
    Id: null,
    Name: '',
    Price: null,
    SellRent: null,
    PType: null,
    FType: null,
    BHK: null,
    BuiltArea: null,
    City: null,
    RTM: null
  };


  constructor(private fb:FormBuilder, private router: Router) { }

  ngOnInit(){
    this.CreateAddPropertyForm();
  }

  CreateAddPropertyForm(){
    this.addPropertyForm = this.fb.group({
      BasicInfo: this.fb.group({
      ellRent: [null, Validators.required],
      PType: [null, Validators.required],
      Name: [null, Validators.required]
      }),
      PriceInfo: this.fb.group({
        Price: [null, Validators.required],
        BuiltArea: [null, Validators.required]
      })      
    });
  }

  get BasicInfo(){
    return this.addPropertyForm.controls.BasicInfo as FormGroup;
  }

  get SellRent(){
    return this.BasicInfo.controls.SellRent as FormControl;
  }

  get PriceInfo(){
    return this.addPropertyForm.controls.PriceInfo as FormGroup;
  }

  get Price(){
    return this.PriceInfo.controls.Price as FormControl;
  }

  onBack(){
    this.router.navigate(['/']);
  }

  onSubmit(){
    if(this.BasicInfo.invalid){
      this.formTabs.tabs[0].active = true;
      return;
    }
    console.log('Congrats, form Submitted');
    console.log('SellRent=' + this.addPropertyForm.value.BasicInfo.SellRent);
    console.log(this.addPropertyForm);
  }

  selectTab(tabId: number) {
   // if(IsCurrentTabValid){
      this.formTabs.tabs[tabId].active = true;
  //  }    
  }

}