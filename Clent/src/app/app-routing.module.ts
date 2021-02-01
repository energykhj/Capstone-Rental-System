import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from '../app/DOM/Account/login/login.component';
import { RegisterComponent } from '../app/DOM/Account/register/register.component';
import { UserAccountComponent } from '../app/DOM/Account/user-account/user-account.component';
import { MainComponent } from '../app/DOM/main/main.component';
import { PostComponent } from '../app/DOM/post/post.component';
import { AuthService } from '../app/Services/auth.service';

const routes: Routes = [
  {path: 'main', component:MainComponent},
  {path: '', redirectTo: '/main', pathMatch:'full'},
  {path: 'login', component:LoginComponent},
  {path: 'register', component:RegisterComponent},
  {path: 'user-account', component:UserAccountComponent},
  {path: 'post', component:PostComponent, canActivate: [AuthService]},];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
