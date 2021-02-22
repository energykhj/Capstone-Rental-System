import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from 'src/app/Services/shared.service';
import { ParentErrorStateMatcher} from 'src/app/validators';
import { UserInfo } from 'src/app/Models/user';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})

export class UserDetailsComponent implements OnInit {

  userDetails: any=[];
  userAccount: any=[];
  address: any=[];
  UserData: any=[];
  //loginUser: any=[];

  loginUser: UserInfo = {
    account: {},
    details: {},
    address: {}
  }
  
  //loginUser: User;
  id: string;
  status: number;
  userEmail: string;  
  PhotoFileName:string="";
  PhotoFilePath:string="";
  userDetailsForm: FormGroup;  
  parentErrorStateMatcher = new ParentErrorStateMatcher();
  ProvinceList:any=[];
  selectedProvince: string;
  
  validation_messages = {
    'firstName':[
      { type: 'required', message: 'First name is required' }
    ],
    'lastName': [
      { type: 'required', message: 'Last name is required' }
    ],
    'address1': [
      { type: 'required', message: 'Address is required' }
    ],
    'city': [
      { type: 'required', message: 'City is required' }
    ],
    'postalCode': [
      { type: 'required', message: 'PostalCode is required' },
      { type: 'pattern', message: 'format: A2A2A2' }
    ],
    'province': [
      { type: 'required', message: 'Province is required' }
    ],
    'phone': [
      { type: 'required', message: 'Phone is required' },
      { type: 'pattern', message: 'format: 1234567890/123 456 7890/123-456-7890' },      
      { type: 'minlength', message: 'Phone number must be 12 digits' },
      { type: 'maxlength', message: 'Phone number must be 10 digits'  },
    ],
  };

  constructor(private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<UserDetailsComponent>,
    private service:SharedService) { 
      this.id = this.service.isLoginUser;
      if(this.service.isLoginUser){
        this.createForms();
        this.getUser();
        this.loadProvinceList();
      }
      else{
        this.router.navigate(['/main']);
      }
    }
  
  ngOnInit(): void {
    //this.createForms();
  }

  getUser(){
    this.id = this.id.replace(/['"]+/g, '');
    this.service.GetUserInfo.subscribe((data:any)=>{
      this.loginUser = data;
      this.userAccount = data.account;
      this.userDetails = data.details;
      this.address = data.address;
      this.userEmail = this.userAccount.email;
      
      if(this.loginUser.details != null){
        this.PhotoFileName = data.details.photoUrl; 
        //this.PhotoFilePath = environment.PhotoUrl+this.PhotoFileName;
        this.status = data.details.statusId;
      }
      else{
        //this.PhotoFileName = "Resources/Avatar/anonymous.jpg";
        this.PhotoFileName = "anonymous.jpg";
        this.status = 0;
      } 
      this.PhotoFilePath = environment.PhotoUrlAvatar + this.PhotoFileName;

      // alert(this.PhotoFilePath);    
    },  error => {
      console.log(error);
    })
  }

  uploadPhoto(event:any){ 
    var file=event.target.files[0];

    const formData:FormData=new FormData();
    formData.append('uploadedFile',file, file.name);
    formData.append('id',this.id);
    //formData.append("id", this.id);
    this.service.uploadPhoto(formData).subscribe((data:any)=>{
      //alert(data.filePath);
      this.PhotoFileName=data.filePath;//toString();
      this.PhotoFilePath=environment.PhotoUrlAvatar+this.PhotoFileName;
    })
  }
  
  onSubmitUpdateUserDetails(value){     
    this.loginUser.details.photourl = this.PhotoFileName;
    this.service.UpdateUser(this.loginUser).subscribe(res=>{
        this.router.navigate(['/home']); 
        //this.dialogRef.close();
        }, error => {
          console.log(error);
        })
  }

  createForms() {
    // user links form validations
    this.userDetailsForm = this.fb.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      postalCode: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(6),
        Validators.pattern('^[ABCEFGHJKLMNPRSTVXYabcefghjklmnprstvxy][0-9][ABCEFGHJKLMNPRSTVWXYZabcefghjklmnprstvwxyz] ?[0-9][ABCEFGHJKLMNPRSTVWXYZabcefghjklmnprstvwxyz][0-9]+$')
        //Validators.pattern('^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$')
      ])),
      phone: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(15),
        Validators.minLength(10),
        Validators.pattern('^[0-9]{3}[\s.-]?[0-9]{3}[\s.-]?[0-9]{4}$'),
      ])),
      address1: new FormControl('', Validators.required),
      address2: new FormControl(),
      city: new FormControl('', Validators.required),
      province: new FormControl(this.ProvinceList[0], Validators.required),
    })
  }  
  
  loadProvinceList(){
    this.service.getProvinces().subscribe((data:any)=>{
      this.ProvinceList=data;
    });
  }

  formattedPostalCode(){
    var  pc = this.userDetailsForm.value.postalCode.toUpperCase(); 
      this.address.postalCode = pc;
  }

  formattedPhone(){
    var  re = this.userDetailsForm.value.phone; 
    re = re.replace(/[().-]+/g, '');   
    var match = re.match(/^(\d{3})(\d{3})(\d{4})$/);
    var str = this.userDetailsForm.value.phone; 
    if (match) {
      this.userDetailsForm.value.phone = match[1] + '-' + match[2] + '-' + match[3];
      this.userDetails.phone = match[1] + '-' + match[2] + '-' + match[3];
      console.log(this.userDetailsForm.value.phone);
    }
  }
}

