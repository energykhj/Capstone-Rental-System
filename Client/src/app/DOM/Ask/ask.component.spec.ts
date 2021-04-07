import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import 'zone.js/dist/zone-testing';
import { SharedService } from 'src/app/Services/shared.service';
import { AuthService } from './../../Services/auth.service';
import { AskComponent } from 'src/app/DOM/Ask/ask.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export function tokenGetter() {
  return localStorage.getItem('jwt');
}

describe('AskComponent', () => {
  let component: AskComponent;
  let fixture: ComponentFixture<AskComponent>;
  let paginator;
  let sort;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AskComponent],
      providers: [
        { provide: AuthService },
        { provide: MatDialog, useValue: {} },
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        { provide: SharedService },
        { provide: MatTableModule },
        { provide: MatTableDataSource },
        JwtHelperService,
      ],
      imports: [
        HttpClientModule,
        NgbModule,
        HttpClientTestingModule,
        MatPaginatorModule,
        MatSortModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AskComponent);
    component = fixture.componentInstance;
    //component.paginator = TestBed.createComponent(MatPaginator).componentInstance;
    paginator = component.paginator;
    sort = component.sort;

    component.ngAfterViewInit();
    component.ngOnInit();

    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //   it('should populate datasource', () => {
  //     expect(component.dataSource).not.toBeNull();
  //   });

  // it('city filter should filter out 1 city', () => {
  //     component.applyFilter("");
  //     expect(component.dataSource.filteredData.length).toEqual(1);
  // })

  //   it('pagination should work', () => {
  //     let i = 1;
  //     while (component.dataSource.paginator.hasNextPage()) {
  //       i++;
  //       component.dataSource.paginator.nextPage();
  //     }
  //     expect(i).toEqual(4);
  //   });
});
