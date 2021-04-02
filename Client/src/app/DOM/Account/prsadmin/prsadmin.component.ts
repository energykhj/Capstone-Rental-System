import { Component, OnInit, Input, Inject, Optional, ViewChild, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SharedService } from 'src/app/Services/shared.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';

export interface CategoryData {
  categoryId: number;
  name: string;
}

@Component({
  selector: 'app-prsadmin',
  templateUrl: './prsadmin.component.html',
  styleUrls: ['./prsadmin.component.scss'],
})
export class PRSAdminComponent implements OnInit {
  @Input()
  public userEmail: string;
  categoryForm: FormGroup;
  categoryList: CategoryData[];
  displayedColumns: string[] = ['id', 'name', 'action'];
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  // constructor(private fb: FormBuilder, private http:HttpClient) { }
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: SharedService,
    public dialog: MatDialog
  ) {
    this.loadCategoryList();
  }

  loadCategoryList() {
    this.service.getCategories().subscribe((data: any) => {
      this.categoryList = data;
      //this.dataSource = data; //new MatTableDataSource(data);
    });
  }

  ngOnInit() {
    this.categoryForm = this.fb.group({
      newCategory: new FormControl('', null),
    });
  }

  onSubmitAddNewCategory(value, opt, mess) {
    var val = {
      option: opt, // insert:1,update:2,delete:3
      Id: value.categoryId,
      Name: value.name,
    };
    this.service.manageCategory(val).subscribe(
      (res) => {
        this.service.alert('success', 'successfully ' + mess + '!!');
        this.loadCategoryList();
      },
      (error) => {
        console.log(error.error);
      }
    );
  }

  openDialog(action, obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '300px',
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event == 'Add') {
        this.addRowData(result.data);
      } else if (result.event == 'Update') {
        this.updateRowData(result.data);
      } else if (result.event == 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData(row_obj) {
    this.onSubmitAddNewCategory(row_obj, 1, 'insert');
  }

  updateRowData(row_obj) {
    this.categoryList = this.categoryList.filter((value, key) => {
      if (value.categoryId == row_obj.categoryId) {
        value.name = row_obj.name;
        this.onSubmitAddNewCategory(row_obj, 2, 'update');
      }
      return true;
    });
  }

  deleteRowData(row_obj) {
    this.categoryList = this.categoryList.filter((value, key) => {
      if (value.categoryId == row_obj.categoryId) {
        this.onSubmitAddNewCategory(row_obj, 3, 'delete');
      }
      return value.categoryId != row_obj.categoryId;
    });
  }
}

@Component({
  selector: 'app-popup',
  templateUrl: './prsadmin-popup.component.html',
  styleUrls: ['./prsadmin.component.scss'],
})
export class PopupComponent {
  action: string;
  local_data: any;

  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: CategoryData
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  doAction() {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
