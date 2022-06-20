import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../core/base-component';
import { NonLabel,
  AoLabel,
  BaloLabel,
  QuanLabel,
  AoKhoacLabel,
  NonValue,
  AoValue,
  BaloValue,
  QuanValue,
  AoKhoacValue } from 'src/app/core/constant/category/CategoryConstants';
@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent extends BaseComponent implements OnInit {
  public list_category: any;
  public page = 1;
  public pageSize = 3;
  public totalItems:any;
  public products_group:any;
  constructor(injector: Injector, private route: ActivatedRoute) {
    super(injector);
  }
  public namecategories:any;

  ngOnInit(): void {
    window.scroll(0,0);
    this.route.params.subscribe(params => {
      let id = params['id'];
      this._api.post('/api/LoaiSanPham/get-category-by-group',{page: this.page, pageSize: this.pageSize, manhom: id}).takeUntil(this.unsubscribe).subscribe(res => {
        this.list_category = res.data;
        this.totalItems = res.totalItems;
        setTimeout(() => {
          this.loadScripts();
        });
      });
    });
    this.getGroupProduct();
    switch (this.list_category.maNhom) {
      case NonValue:
        this.namecategories = NonLabel
        break;
      case AoValue:
        this.namecategories = AoLabel
        break;
      case BaloValue:
        this.namecategories = BaloLabel
        break;
      case QuanValue:
        this.namecategories = QuanLabel
        break;
      case AoKhoacValue:
        this.namecategories = AoKhoacLabel
        break;
    
      default:
        this.namecategories = NonLabel
        break;
    }
    console.log(this.namecategories);
    
  }

  loadPage(page) { 
    this._route.params.subscribe(params => {
      let id = params['id'];
      this._api.post('/api/LoaiSanPham/get-category-by-group', { page: page, pageSize: this.pageSize, manhom: id}).takeUntil(this.unsubscribe).subscribe(res => {
        this.list_category = res.data;
        this.totalItems = res.totalItems;
        }, err => { });       
   });
  }

  getGroupProduct(){
    this._api.get('/api/NhomSanPham/get-all').takeUntil(this.unsubscribe).subscribe(res => {
      this.products_group = res;
    }); 
  }
}
