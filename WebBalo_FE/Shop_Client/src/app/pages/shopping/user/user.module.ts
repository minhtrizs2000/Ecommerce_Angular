import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisComponent } from './regis/regis.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export const authRoute: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dangky', component: RegisComponent },
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(authRoute),
  ],
  declarations: [LoginComponent, RegisComponent],
})
export class UserModule {}
