import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from '../app/DOM/Account/login/login.component';
import { RegisterComponent } from '../app/DOM/Account/register/register.component';
import { UserAccountComponent } from '../app/DOM/Account/user-account/user-account.component';
import { HomeComponent } from './DOM/Main/Home/home.component';
import { PostComponent } from './DOM/Post/post.component';
import { AskComponent } from 'src/app/DOM/Ask/ask.component';
import { AskDetailComponent } from 'src/app/DOM/Ask/ask-detail/ask-detail.component';
import { MyListComponent } from 'src/app/DOM/Myspace/my-list/my-list.component';
import { MyBorrowComponent } from 'src/app/DOM/Myspace/my-borrow/my-borrow.component';
import { EditorComponent } from 'src/app/DOM/Shared/editor/editor.component';
import { RequestBorrowComponent } from './DOM/Post/request-borrow/request-borrow.component';
import { AuthService } from '../app/Services/auth.service';
import { ChangePasswordComponent } from 'src/app/DOM/Account/change-password/change-password.component';
import { PRSAdminComponent } from 'src/app/DOM/Account/prsadmin/prsadmin.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user-account', component: UserAccountComponent, canActivate: [AuthService] },
  { path: 'post', component: PostComponent, canActivate: [AuthService] },
  { path: 'my-list', component: MyListComponent, canActivate: [AuthService] },
  { path: 'my-borrow', component: MyBorrowComponent, canActivate: [AuthService] },
  { path: 'ask', component: AskComponent, canActivate: [AuthService] },
  { path: 'ask-detail', component: AskDetailComponent, canActivate: [AuthService] },
  { path: 'editor', component: EditorComponent },
  { path: 'request-borrow', component: RequestBorrowComponent },  
  { path: 'prspassword', component: ChangePasswordComponent, canActivate: [AuthService] },
  { path: 'prsadmin', component: PRSAdminComponent, canActivate: [AuthService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
