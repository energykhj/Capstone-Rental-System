import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

/* DOM Components */
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './DOM/Account/login/login.component';
import { RegisterComponent } from './DOM/Account/register/register.component';
import { HeaderComponent } from './DOM/Navigation/header/header.component';
import { SideMenuComponent } from './DOM/Navigation/side-menu/side-menu.component';
import { HomeComponent } from './DOM/Main/Home/home.component';
import { DetailComponent } from './DOM/Main/detail/detail.component';
import { PostComponent } from './DOM/post/post.component';
import { AddEditPostComponent } from './DOM/post/add-edit-post/add-edit-post.component';

/* Angular Material */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './DOM/Shared/angular-material.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/* Ngx Bootstrap */
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

/* FormsModule */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Angular Flex Layout */
import { FlexLayoutModule } from '@angular/flex-layout';

/* Authenticate */
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './Services/auth.service';
import { UserAccountComponent } from './DOM/Account/user-account/user-account.component';
import { AvatarComponent } from './Helpers/avatar/avatar.component';
import { UserDetailsComponent } from './DOM/Account/user-details/user-details.component';
import { AskComponent } from './DOM/ask/ask.component';
import { PostCardComponent } from './DOM/post/post-card/post-card.component';
import { MapsComponent } from './DOM/Navigation/maps/maps.component';
//import { UserdetailsComponent } from './Dom/Accont/userdetails/userdetails.component';

/* Currency Input */
import { CurrencyMaskInputMode, NgxCurrencyModule } from "ngx-currency";
/* Drag & Drop Files */
import { NgxFileDropModule } from 'ngx-file-drop';
import { AlertsComponent } from './DOM/Shared/alerts/alerts.component';
import { AlertModule } from 'ngx-bootstrap/alert';

export const customCurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  allowZero: true,
  decimal: ".",
  precision: 2,
  prefix: "CA$ ",
  suffix: "",
  thousands: ",",
  nullable: true,
  min: null,
  max: null,
  inputMode: CurrencyMaskInputMode.FINANCIAL
};

export function tokenGetter(){
  return localStorage.getItem("jwt");
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    SideMenuComponent,
    HomeComponent,
    DetailComponent,
    PostComponent,
    UserAccountComponent,
    AvatarComponent,
    UserDetailsComponent,
    AskComponent,
    AddEditPostComponent,
    PostCardComponent,
    MapsComponent,
    AlertsComponent,
    //UserdetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,

    ReactiveFormsModule,  
    FormsModule, 
    FlexLayoutModule,
    NgbModule,
    HttpClientModule,
    
    CarouselModule.forRoot(),
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    AlertModule.forRoot(),

    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:4200"],
        disallowedRoutes: []
      }
    }),

    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    NgxFileDropModule,
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
