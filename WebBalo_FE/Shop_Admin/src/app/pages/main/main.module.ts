import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManageCategoriesComponent } from './manage-categories/manage-categories.component';
import { ManageProductsGroupComponent } from './manage-products-group/manage-products-group.component';
import { ManageProductsComponent } from './manage-products/manage-products.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { ManageProductBrandComponent } from './manage-product-brand/manage-product-brand.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {EditorModule} from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {PanelModule} from 'primeng/panel';
import {TableModule} from 'primeng/table';
import { RoleGuard } from '../../core/auth.guard';
import { Role } from '../../shared/models/Role';
import { DateVNPipe } from '../../shared/pipes/DateVN.pipe';
import { ManageBestSellingComponent } from './manage-best-selling/manage-best-selling.component';
import {ChartModule} from 'primeng/chart';
import { ManageAmountComponent } from './manage-amount/manage-amount.component';
import { ManageBlogsComponent } from './manage-blogs/manage-blogs.component';

export const mainRoute: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo:'manage-products-group',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'manage-products-group',
        component: ManageProductsGroupComponent,
      },
      {
        path: 'manage-categories',
        component: ManageCategoriesComponent,
      },
      {
        path: 'manage-product-brand',
        component: ManageProductBrandComponent,
      },
      {
        path: 'manage-products',
        component: ManageProductsComponent,
      },
      {
        path: 'manage-users',
        component: ManageUsersComponent,
        canActivate: [RoleGuard], data: { roles: [Role.Admin] },
       
      },
      {
        path: 'manage-orders',
        component: ManageOrdersComponent,
        canActivate: [RoleGuard], data: { roles: [Role.Admin] },
      },
      {
        path: 'manage-blogs',
        component: ManageBlogsComponent,
      },
      {
        path: 'manage-best-selling',
        component: ManageBestSellingComponent,
        canActivate: [RoleGuard], data: { roles: [Role.Admin] },
      },
      {
        path: 'manage-amount',
        component: ManageAmountComponent,
        canActivate: [RoleGuard], data: { roles: [Role.Admin] },
      },
    ]
  }
]
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forChild(mainRoute),
    NgbModule,
    FormsModule,
    DialogModule,
    EditorModule,
    ButtonModule,
    DropdownModule,
    PanelModule,
    TableModule,
    ChartModule
  ],
  declarations: [MainComponent, DashboardComponent, ManageCategoriesComponent, ManageProductsGroupComponent, ManageProductsComponent, ManageUsersComponent, ManageOrdersComponent, ManageProductBrandComponent, DateVNPipe, ManageBestSellingComponent, ManageAmountComponent, ManageBlogsComponent]
})
export class MainModule { }
