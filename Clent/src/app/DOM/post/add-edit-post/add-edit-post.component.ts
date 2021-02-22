//import { IPropertyBase } from './../../model/ipropertybase';
import { Component, HostListener, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { SharedService } from '../../../Services/shared.service';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { ActivatedRoute } from '@angular/router';
import { DetailComponent } from './../../Main/detail/detail.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-post',
  templateUrl: './add-edit-post.component.html',
  styleUrls: ['./add-edit-post.component.scss']
})
export class AddEditPostComponent implements OnInit {
  //@ViewChild('Form') addPropertyForm: NgForm;
  @ViewChild('formTabs') formTabs: TabsetComponent;

  addItemForm: FormGroup;

  categoryList:any=[];
  provinceList:any=[];

  photoUrls=[];
  itemDefaultPhotoUrl: any;

  userId: string;
  
  @Input() public itemId: string;
  isNewItem: boolean;
  isReadOnly: boolean;
  selectedFiles: any=[];

  itemPkg: any = {
    item: {
      id: 0,
      userId: "",
      categoryId: 1,
      name: "",
      description: "",
      deposit: 0.00,
      fee: 0.00,
      startDate: new Date(),
      endDate: new Date(),
      //addressId: 0,
    },
    address: {
      id: 0,
      userId: "",
      idDefault: false,
      address1: "",
      address2: "",
      city: "",
      provinceId: 1,
      postalCode: "",
    }
  };

  validation_messages = {
    'categoryId':[
      { type: 'required', message: 'Category is required' }
    ],
    'name': [
      { type: 'required', message: 'Name is required' }
    ],
    'description': [
      { type: 'required', message: 'Description is required' }
    ],
    'deposit': [
      { type: 'required', message: 'Deposit is required' }
    ],
    'fee': [
      { type: 'required', message: 'Rental Fee is required' }
    ],
    'startDate': [
      { type: 'required', message: 'Start Date is required' }
    ],
    'endDate': [
      { type: 'required', message: 'End Date is required' }
    ],
    'provinceId': [
      { type: 'required', message: 'Province is required' }
    ],
    'city': [
      { type: 'required', message: 'City is required' }
    ],
    'address1': [
      { type: 'required', message: 'Address1 is required' }
    ],
    'postalCode': [
      { type: 'required', message: 'Postal Code is required' },
      { type: 'pattern', message: 'format: A2A2A2' }
    ],
  };

  constructor(private fb:FormBuilder, 
            private router: Router, 
            private service:SharedService,
            private route: ActivatedRoute,
            public dialog: MatDialog) { 
    this.isReadOnly = true;
    if(this.service.isLoginUser){
      this.userId = this.service.isLoginUser;
      this.userId = this.userId.replace(/['"]+/g, '');
      this.itemPkg.item.userId = this.userId;
      this.itemPkg.address.userId = this.userId;
  
      this.loadProvinceList();
      this.loadCategoryList();
    }
    else{
      this.router.navigate(['/main']);
    }
  }

  ngOnInit(){
    this.itemId = this.route.snapshot.queryParamMap.get('itemId');
    this.createAddEditItemForm();

    if (this.itemId != null){
      this.loadItemPkg(this.itemId);
      this.isNewItem = false;
    }
    else{
      this.isNewItem = true;
      this.isReadOnly = false;
    }
  }

  createAddEditItemForm(){
    this.addItemForm = this.fb.group({
      basicInfo: this.fb.group({
        categoryId: new FormControl(this.categoryList[0], Validators.required),
        name: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required)
      }),
      priceInfo: this.fb.group({
        deposit: new FormControl('', Validators.required),
        fee: new FormControl('', Validators.required),
        startDate: new FormControl('', Validators.required),
        endDate: new FormControl('', Validators.required)
      }),
      addressInfo: this.fb.group({
        provinceId: new FormControl(this.provinceList[0], Validators.required),
        city: new FormControl('', Validators.required),
        address1: new FormControl('', Validators.required),
        address2: new FormControl(),
        postalCode: new FormControl('', Validators.compose([
          Validators.required,
          Validators.maxLength(6),
          Validators.pattern('^[ABCEFGHJKLMNPRSTVXYabcefghjklmnprstvxy][0-9][ABCEFGHJKLMNPRSTVWXYZabcefghjklmnprstvwxyz] ?[0-9][ABCEFGHJKLMNPRSTVWXYZabcefghjklmnprstvwxyz][0-9]+$')
          //Validators.pattern('^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$')
        ]))
      }),
      photoInfo: this.fb.group({
        photoFiles: new FormControl('', Validators.required)
      })        
    });
  }

  loadCategoryList(){
    this.service.getCategories().subscribe((data:any)=>{
      this.categoryList=data;
    });
  }

  loadProvinceList(){
    this.service.getProvinces().subscribe((data:any)=>{
      this.provinceList=data;
    });
  }

  loadItemPkg(itemId: string){
    this.service.getItem(itemId).subscribe((data:any)=>{
      this.itemPkg={
        item: data.item,
        address: data.address
      }
      
      if (this.userId == this.itemPkg.item.userId){
        this.isReadOnly = false;
      }
    });
  }

  get basicInfo(){
    return this.addItemForm.controls.basicInfo as FormGroup;
  }

  get priceInfo(){
    return this.addItemForm.controls.priceInfo as FormGroup;
  }

  get addressInfo(){
    return this.addItemForm.controls.addressInfo as FormGroup;
  }  
  
  get photoInfo(){
    return this.addItemForm.controls.photoInfo as FormGroup;
  }

  public files: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {

    this.selectedFiles = [];
    this.photoUrls = [];
    this.files = files;
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          console.log(droppedFile.relativePath, file);

          this.selectedFiles.push(file);

          // Display photo
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload=(events:any)=>{
            this.photoUrls.push(events.target.result);
            // To-do: Check default
            this.itemDefaultPhotoUrl = this.photoUrls[0];
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }
  
  public fileOver(event){
    console.log(event);
  }

  public fileLeave(event){
    console.log(event);
  }

  uploadPhoto(){

    var files = this.selectedFiles;
    if (files.length == 0) return;
    if (this.itemId == null) return;

    const formData:FormData=new FormData();

    formData.append("itemId", this.itemId);
    for (let i = 0; i < files.length; i++)
    {
      formData.append(files[i].name, files[i]);
    }

    this.service.uploadItemPhoto(formData).subscribe((data:any)=>{
      //this.PhotoFileName=data.toString();
      //this.PhotoFilePath=this.service.PhotoUrl+this.PhotoFileName;

      console.log(data.filePathList[0]);
    })
  }

  onBack(){
     this.router.navigate(['/']);
  }

  onSubmit(){

    if(this.basicInfo.invalid){
      this.formTabs.tabs[0].active = true;
      return;
    }

    if(this.priceInfo.invalid){
      this.formTabs.tabs[1].active = true;
      return;
    }

    if(this.addressInfo.invalid){
      this.formTabs.tabs[2].active = true;
      return;
    }

    if (this.isNewItem == true){
      this.service.insertItem(this.itemPkg).subscribe((data:any)=>{
        //this.PhotoFileName=data.toString();
        //this.PhotoFilePath=this.service.PhotoUrl+this.PhotoFileName;

        //console.log(this.PhotoFileName);

        this.itemId = data.item.id;
        this.uploadPhoto();
      });
    }
    else{
      this.service.updateItem(this.itemPkg).subscribe((data:any)=>{
        this.itemId = data.item.id;
        this.uploadPhoto();
      });
    }
  }

  selectTab(tabId: number) {
   // if(IsCurrentTabValid){
      this.formTabs.tabs[tabId].active = true;
  //  }
  }

  selectNextTab() {    
    let tabId = this.formTabs.tabs.findIndex(tab => tab.active === true);
    tabId++;
    if (tabId > this.formTabs.tabs.length - 1){
      tabId = 0;
    }
    this.formTabs.tabs[tabId].active = true;
  }

  selectPreviousTab() {
    let tabId = this.formTabs.tabs.findIndex(tab => tab.active === true);
    tabId--;
    if (tabId <= 0){
      tabId = this.formTabs.tabs.length - 1;
    }
    this.formTabs.tabs[tabId].active = true;
  }

  openDetail(id:any) {
    const dialogRef = this.dialog.open(DetailComponent, {
      // height: '500px',
      width: '600px',
      data:{
        dataKey: id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}