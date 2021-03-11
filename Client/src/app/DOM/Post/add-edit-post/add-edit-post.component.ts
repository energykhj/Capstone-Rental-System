import { Component, HostListener, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { SharedService } from 'src/app/Services/shared.service';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { ActivatedRoute } from '@angular/router';
import { DetailComponent } from 'src/app/DOM/Main/detail/detail.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { UserDetailsComponent } from 'src/app/DOM/Account/user-details/user-details.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ParentErrorStateMatcher } from 'src/app/DOM/Shared/validators';
import { DateValidator } from 'src/app/DOM/Shared/validators/date.validator';

@Component({
  selector: 'app-add-edit-post',
  templateUrl: './add-edit-post.component.html',
  styleUrls: ['./add-edit-post.component.scss'],
})
export class AddEditPostComponent implements OnInit {
  //@ViewChild('Form') addPropertyForm: NgForm;
  //@ViewChild('formTabs') formTabs: TabsetComponent;
  parentErrorStateMatcher = new ParentErrorStateMatcher();

  activeTabId = 0;
  maxTabNum = 4;

  addItemForm: FormGroup;

  categoryList: any = [];
  provinceList: any = [];

  photoUrls = [];
  photoFiles: any = [];
  itemDefaultPhotoUrl: any;
  isDefaultAddress: boolean = false;

  noImagePhotoUrl: string = environment.PhotoFileUrl + 'noImage.png';
  userId: string;

  @Input() public itemId: string;
  isNewItem: boolean;
  isReadOnly: boolean;
  isSubmitPressed: boolean;

  itemPkg: any = {
    item: {
      id: 0,
      userId: '',
      categoryId: 1,
      name: '',
      description: '',
      deposit: 0.0,
      fee: 0.0,
      startDate: new Date(),
      endDate: new Date(),
      //addressId: 0,
    },
    address: {
      id: 0,
      userId: '',
      isDefault: false,
      address1: '',
      address2: '',
      city: '',
      provinceId: 1,
      postalCode: '',
    },
  };

  validation_messages = {
    categoryId: [{ type: 'required', message: 'Category is required' }],
    name: [{ type: 'required', message: 'Name is required' }],
    description: [{ type: 'required', message: 'Description is required' }],
    deposit: [{ type: 'required', message: 'Deposit is required' }],
    fee: [{ type: 'required', message: 'Rental Fee is required' }],
    startDate: [{ type: 'required', message: 'Start Date is required' }],
    endDate: [
      { type: 'required', message: 'End Date is required' },
      { type: 'dateOrder', message: 'End Date should be greater than or equal Start Date' },
    ],
    provinceId: [{ type: 'required', message: 'Province is required' }],
    city: [{ type: 'required', message: 'City is required' }],
    address1: [{ type: 'required', message: 'Address1 is required' }],
    postalCode: [
      { type: 'required', message: 'Postal Code is required' },
      { type: 'pattern', message: 'format: A2A2A2' },
    ],
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: SharedService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {
    this.isReadOnly = true;
    this.isSubmitPressed = false;
    if (this.service.isLoginUser) {
      this.userId = this.service.isLoginUser;
      this.userId = this.userId.replace(/['"]+/g, '');
      this.itemPkg.item.userId = this.userId;
      this.itemPkg.address.userId = this.userId;

      this.loadProvinceList();
      this.loadCategoryList();
    } else {
      this.router.navigate(['/main']);
    }
  }

  ngOnInit() {
    this.itemId = this.route.snapshot.queryParamMap.get('itemId');
    this.createAddEditItemForm();
    this.priceInfo.get('endDate').disable();

    if (this.itemId != null) {
      this.loadItemPkg(this.itemId);
      this.loadItemPhotos(this.itemId);
      this.isNewItem = false;
    } else {
      this.isNewItem = true;
      this.isReadOnly = false;
      this.priceInfo.get('endDate').enable();
    }

    this.setFormData();
  }

  createAddEditItemForm() {
    this.addItemForm = this.fb.group({
      basicInfo: this.fb.group({
        categoryId: new FormControl(this.categoryList[0], Validators.required),
        name: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
      }),
      //      priceInfo: this.fb.group({
      priceInfo: new FormGroup(
        {
          deposit: new FormControl('', Validators.required),
          fee: new FormControl('', Validators.required),
          startDate: new FormControl('', Validators.required),
          endDate: new FormControl('', Validators.required),
        },

        (formGroup: FormGroup) => {
          var ret = DateValidator.compareDate(formGroup, 'startDate', 'endDate');
          return ret;
        }
      ),
      addressInfo: this.fb.group({
        provinceId: new FormControl(this.provinceList[0], Validators.required),
        city: new FormControl('', Validators.required),
        address1: new FormControl('', Validators.required),
        address2: new FormControl(),
        postalCode: new FormControl(
          '',
          Validators.compose([
            Validators.required,
            Validators.maxLength(7),
            Validators.pattern(
              '^[ABCEFGHJKLMNPRSTVXYabcefghjklmnprstvxy][0-9][ABCEFGHJKLMNPRSTVWXYZabcefghjklmnprstvwxyz] ?[0-9][ABCEFGHJKLMNPRSTVWXYZabcefghjklmnprstvwxyz][0-9]+$'
            ),
            //Validators.pattern('^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$')
          ])
        ),
      }),
      photoInfo: this.fb.group({
        photoFiles: new FormControl('', Validators.required),
      }),
    });
  }

  getFormData() {
    this.itemPkg.item.categoryId = this.basicInfo.get('categoryId').value;
    this.itemPkg.item.name = this.basicInfo.get('name').value;
    this.itemPkg.item.description = this.basicInfo.get('description').value;
    this.itemPkg.item.deposit = this.priceInfo.get('deposit').value;
    this.itemPkg.item.fee = this.priceInfo.get('fee').value;
    this.itemPkg.item.startDate = new Date(this.priceInfo.get('startDate').value);
    this.itemPkg.item.endDate = new Date(this.priceInfo.get('endDate').value);

    this.itemPkg.address.address1 = this.addressInfo.get('address1').value;
    this.itemPkg.address.address2 = this.addressInfo.get('address2').value;
    this.itemPkg.address.city = this.addressInfo.get('city').value;
    this.itemPkg.address.provinceId = this.addressInfo.get('provinceId').value;
    this.itemPkg.address.postalCode = this.addressInfo.get('postalCode').value.toUpperCase();
  }

  setFormData() {
    this.basicInfo.get('categoryId').setValue(this.itemPkg.item.categoryId);
    this.basicInfo.get('name').setValue(this.itemPkg.item.name);
    this.basicInfo.get('description').setValue(this.itemPkg.item.description);
    this.priceInfo.get('deposit').setValue(this.itemPkg.item.deposit);
    this.priceInfo.get('fee').setValue(this.itemPkg.item.fee);
    this.priceInfo.get('startDate').setValue(this.itemPkg.item.startDate);
    this.priceInfo.get('endDate').setValue(this.itemPkg.item.endDate);

    this.addressInfo.get('address1').setValue(this.itemPkg.address.address1);
    this.addressInfo.get('address2').setValue(this.itemPkg.address.address2);
    this.addressInfo.get('city').setValue(this.itemPkg.address.city);
    this.addressInfo.get('provinceId').setValue(this.itemPkg.address.provinceId);
    this.addressInfo.get('postalCode').setValue(this.itemPkg.address.postalCode);
  }

  get basicInfo() {
    return this.addItemForm.controls.basicInfo as FormGroup;
  }

  get priceInfo() {
    return this.addItemForm.controls.priceInfo as FormGroup;
  }

  get addressInfo() {
    return this.addItemForm.controls.addressInfo as FormGroup;
  }

  get photoInfo() {
    return this.addItemForm.controls.photoInfo as FormGroup;
  }

  loadItemPhotos(itemId: string) {
    this.service.getItemPhotos(itemId).subscribe(
      (data) => {
        data.forEach((element) => {
          //let photoUrl = environment.PhotoFileUrl + element.fileName;
          this.service.getItemPhotoFile(element.fileName).subscribe(
            function (fileName: string, data: any) {
              //fileName
              data.name = fileName;
              this.photoFiles.push(data);
              // Display photo
              var reader = new FileReader();
              reader.readAsDataURL(data);
              reader.onload = (events: any) => {
                var url = events.target.result as string;
                let safeUrl = this.sanitizer.bypassSecurityTrustUrl(url);
                this.photoUrls.push(safeUrl);
                // To-do: Check default
                this.itemDefaultPhotoUrl = this.photoUrls[0];
              };
            }.bind(this, element.fileName)
          );
        });
        this.itemDefaultPhotoUrl = this.photoUrls[0];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onChangeDefaultAddress() {
    this.getFormData();
    if (this.isDefaultAddress) {
      this.service.GetUserInfo.subscribe(
        (data: any) => {
          if (data.address) {
            this.itemPkg.address = {
              id: data.address.id,
              userId: data.address.userId,
              isDefault: data.address.isDefault,
              address1: data.address.address1,
              address2: data.address.address2,
              city: data.address.city,
              provinceId: data.address.provinceId,
              postalCode: data.address.postalCode,
            };
            this.isDefaultAddress = data.address.isDefault;
            this.setFormData();
          } else {
            this.dialog
              .open(UserDetailsComponent)
              .afterClosed()
              .subscribe((result) => {
                if (result == 'complete') {
                  this.onChangeDefaultAddress();
                } else {
                  this.isDefaultAddress = false;
                }
              });
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.itemPkg.address = {
        id: 0,
        userId: this.userId,
        isDefault: false,
        address1: '',
        address2: '',
        city: '',
        provinceId: 1,
        postalCode: '',
      };
      this.setFormData();
    }
  }

  loadCategoryList() {
    this.service.getCategories().subscribe((data: any) => {
      this.categoryList = data;
    });
  }

  loadProvinceList() {
    this.service.getProvinces().subscribe((data: any) => {
      this.provinceList = data;
    });
  }

  loadItemPkg(itemId: string) {
    this.service.getItem(itemId).subscribe((data: any) => {
      this.itemPkg = {
        item: data.item,
        address: data.address,
      };

      if (this.userId == this.itemPkg.item.userId) {
        this.isReadOnly = false;
        this.priceInfo.get('endDate').enable();
      }

      this.isDefaultAddress = data.address.isDefault;

      this.itemPkg.item.startDate = new Date(data.item.startDate);
      this.itemPkg.item.endDate = new Date(data.item.endDate);
      this.setFormData();
    });
  }

  public dropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          // Here you can access the real file
          console.log(droppedFile.relativePath, file);

          this.photoFiles.push(file);

          // Display photo
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (events: any) => {
            this.photoUrls.push(events.target.result);
            // To-do: Check default
            this.itemDefaultPhotoUrl = this.photoUrls[0];
          };
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }

  uploadPhoto() {
    var files = this.photoFiles;

    if (this.itemId == null) return;

    const formData: FormData = new FormData();

    formData.append('itemId', this.itemId);
    for (let i = 0; i < files.length; i++) {
      formData.append(files[i].name, files[i]);
    }

    this.service.uploadItemPhoto(formData).subscribe((data: any) => {
      let errorMsg: string = '';
      data.filePathList.forEach((element) => {
        if (element.indexOf('Err:') != -1) {
          errorMsg = errorMsg + element.substring(4) + '<br/>';
        }
      });
      if (errorMsg != '') {
        if (this.isNewItem == true) {
          this.service.Alert(
            'danger',
            'Item Created, but some photos lost<br/> Please, check error(s):<br/>' + errorMsg
          );
        } else {
          this.service.Alert(
            'danger',
            'Item Modified, but some photos lost<br/> Please, check error(s):<br/>' + errorMsg
          );
        }
      } else {
        if (this.isNewItem == true) {
          this.service.Alert('success', 'Item Created');
        } else {
          this.service.Alert('success', 'Item Modified');
        }
      }
    });
  }

  onBack() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    this.isSubmitPressed = true;

    if (this.basicInfo.invalid) {
      this.activeTabId = 0;
      return;
    }

    if (this.priceInfo.invalid) {
      this.activeTabId = 1;
      return;
    }

    if (this.addressInfo.invalid) {
      this.activeTabId = 2;
      return;
    }

    this.getFormData();

    if (this.isNewItem == true) {
      this.service.insertItem(this.itemPkg).subscribe((data: any) => {
        this.itemId = data.item.id;
        this.uploadPhoto();
      });
    } else {
      this.service.updateItem(this.itemPkg).subscribe((data: any) => {
        this.itemId = data.item.id;
        this.uploadPhoto();
      });
    }
  }

  selectNextTab() {
    this.activeTabId++;
    if (this.activeTabId > this.maxTabNum - 1 - (this.isReadOnly ? 1 : 0)) {
      this.activeTabId = 0;
    }
  }

  selectPreviousTab() {
    this.activeTabId--;
    if (this.activeTabId < 0) {
      this.activeTabId = this.maxTabNum - 1 - (this.isReadOnly ? 1 : 0);
    }
  }

  openDetail(id: any) {
    const dialogRef = this.dialog.open(DetailComponent, {
      // height: '500px',
      width: '600px',
      data: {
        dataKey: id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  deletePhoto(index: any) {
    this.photoFiles.splice(index, 1);
    this.photoUrls.splice(index, 1);
    this.itemDefaultPhotoUrl = this.photoUrls[0];
  }

  requestBorrow() {
    this.router.navigate(['/request-borrow'], { queryParams: { itemId: this.itemId } });
  }
}
