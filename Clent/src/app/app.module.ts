import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

/* DOM Components */
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './DOM/Account/login/login.component';
import { RegisterComponent } from './DOM/Account/register/register.component';
import { UserdetailsComponent } from './DOM/userdetails/userdetails.component';
import { HeaderComponent } from './DOM/Navigation/header/header.component';
import { SideMenuComponent } from './DOM/Navigation/side-menu/side-menu.component';
import { MainComponent } from './DOM/main/main.component';
import { PostComponent } from './DOM/post/post.component';

/* Angular Material */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './DOM/Shared/angular-material.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/* FormsModule */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Angular Flex Layout */
import { FlexLayoutModule } from '@angular/flex-layout';

/* Authenticate */
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './Services/auth.service';
import { UserAccountComponent } from './Dom/Account/user-account/user-account.component';
import { AvatarComponent } from './Helpers/avatar/avatar.component';

export function tokenGetter(){
  return localStorage.getItem("jwt");
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserdetailsComponent,
    HeaderComponent,
    SideMenuComponent,
    MainComponent,
    PostComponent,
    UserAccountComponent,
    AvatarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,

    ReactiveFormsModule,  
    FormsModule, 
    FlexLayoutModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:4200"],
        disallowedRoutes: []
      }
    }),
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
