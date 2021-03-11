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
import { PostComponent } from './DOM/Post/post.component';
import { AddEditPostComponent } from './DOM/Post/add-edit-post/add-edit-post.component';

/* Angular Material */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from '../app/Helpers/angular-material.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/* Ngx Bootstrap */
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxEditorModule } from 'ngx-editor';

/* FormsModule */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Angular Flex Layout */
import { FlexLayoutModule } from '@angular/flex-layout';

/* Authenticate */
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './Services/auth.service';
import { UserAccountComponent } from './DOM/Account/user-account/user-account.component';
import { AvatarComponent } from './DOM/Navigation/avatar/avatar.component';
import { UserDetailsComponent } from './DOM/Account/user-details/user-details.component';
import { AskComponent } from './DOM/Ask/ask.component';
import { PostCardComponent } from './DOM/Post/post-card/post-card.component';
import { MapsComponent } from './DOM/Navigation/maps/maps.component';

/* Currency Input */
import { CurrencyMaskInputMode, NgxCurrencyModule } from 'ngx-currency';
import { customCurrencyMaskConfig } from 'src/environments/environment';

/* Drag & Drop Files */
import { NgxFileDropModule } from 'ngx-file-drop';
import { AlertsComponent } from './DOM/Shared/alerts/alerts.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { MyListComponent } from './DOM/Myspace/my-list/my-list.component';
import { MyBorrowComponent } from './DOM/Myspace/my-borrow/my-borrow.component';
import { AskDetailComponent } from './DOM/Ask/ask-detail/ask-detail.component';
import { EditorComponent } from './DOM/Shared/editor/editor.component';
import { RequestBorrowComponent } from './DOM/Post/request-borrow/request-borrow.component';
import { UserDetailsViewComponent } from './DOM/Account/user-details-view/user-details-view.component';

/* Services */
import { SharedService } from 'src/app/Services/shared.service';
import { AuthenticationService } from 'src/app/Services/authentication.service';

/* Pipes */
import { AuthImgPipe } from '../app/Helpers/auth-img.pipe';

import { environment } from 'src/environments/environment';

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
    MyListComponent,
    MyBorrowComponent,
    AskDetailComponent,
    EditorComponent,
    RequestBorrowComponent,
    UserDetailsViewComponent,
    AuthImgPipe,
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
    NgxEditorModule,

    CarouselModule.forRoot(),
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    AlertModule.forRoot(),

    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('jwt');
        },
        allowedDomains: environment.allowedDomains,
        disallowedRoutes: environment.disallowedRoutes,
      },
    }),

    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    NgxFileDropModule,
  ],
  providers: [AuthService, SharedService, AuthenticationService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
