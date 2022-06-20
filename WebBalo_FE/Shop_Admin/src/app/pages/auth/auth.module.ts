import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export const authRoute: Routes = [
  {path:'login',component: LoginComponent},
  {path:'register',component: RegisterComponent},
]
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(authRoute)
  ],
  declarations: [LoginComponent, RegisterComponent]
})
export class AuthModule { }
