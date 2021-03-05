import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserDetailsComponent } from './user-details.component';
import { ReactiveFormsModule } from '@angular/forms';


describe('UserDetailsComponent', () => {
    let component: UserDetailsComponent;
    let fixture: ComponentFixture<UserDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserDetailsComponent],
            imports: [
                RouterTestingModule,
                ReactiveFormsModule,
                MatDialogModule,
            ],
            providers: [
                { provide: MatDialog, useValue: {} },
                MatDialogRef
            ],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UserDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the app', () => {
        fixture = TestBed.createComponent(UserDetailsComponent);
        component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

    //   it("should have as titlle 'update-user'", () => {
    //     fixture = TestBed.createComponent(UserDetailsComponent);
    //     component = fixture.componentInstance;

    //     console.warn("component", component.onSubmitUpdateUserDetails)
    //     expect(component.onSubmitUpdateUserDetails).toBe("user");
    //   });

    it('should get province', () => {
        fixture = TestBed.createComponent(UserDetailsComponent);
        component = fixture.componentInstance;
        expect(component.loadProvinceList()).toBeTruthy();
    });
});
