import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from '../app/DOM/Account/login/login.component';
import { RegisterComponent } from '../app/DOM/Account/register/register.component';
import { UserAccountComponent } from '../app/DOM/Account/user-account/user-account.component';
import { HomeComponent } from './DOM/Main/Home/home.component';
import { PostComponent } from '../app/DOM/post/post.component';
import { AskComponent } from 'src/app/DOM/ask/ask.component';
import { AuthService } from '../app/Services/auth.service';

const routes: Routes = [
  {path: 'home', component:HomeComponent},
  {path: '', redirectTo: '/home', pathMatch:'full'},
  {path: 'login', component:LoginComponent},
  {path: 'register', component:RegisterComponent},
  {path: 'user-account', component:UserAccountComponent},
  {path: 'post', component:PostComponent, canActivate: [AuthService]},
  {path: 'ask', component:AskComponent, canActivate: [AuthService]},];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
