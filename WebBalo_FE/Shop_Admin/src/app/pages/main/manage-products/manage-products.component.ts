import { Component, Injector, OnInit,ViewChild, ElementRef } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { BaseComponent } from '../../../core/base-component';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/takeUntil';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, NgForm } from '@angular/forms';
import { SanPham } from '../../../shared/models/SanPham';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';



interface Category {
  maLoai: string,
  tenLoai: string
}
interface Brand {
  maHang: string,
  tenHang: string
}
@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css']
})
export class ManageProductsComponent extends BaseComponent implements OnInit {
  public products: any;
  public product: any;
  public page = 1;
  public pageSize = 5;
  public totalItems:any;
  public formsearch: any;
  
  public categories: Category[];
  selectedCategory: Category;
  public brands: Brand[];
  selectedBrand: Brand;
  formProduct: FormBuilder;


  fileName = 'products.xlsx';
  @ViewChild('product') htmlData:ElementRef;
  constructor(private fb: FormBuilder,injector: Injector,private route: ActivatedRoute, private router: Router, private httpclient: HttpClient) {
    super(injector);
    
    this.product = new SanPham();
  }
  isEdit: boolean = false;
  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'tenSanPham': ['']
    });
    this.search();
  }
  
  loadPage(page) { 
    this._api.post('/api/SanPham/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.products = res.data;
      this.totalItems =  res.totalItems;
      this.pageSize = res.pageSize;
    });
  } 
  
  search() { 
    this._api.post('/api/SanPham/search',{page: this.page, pageSize: this.pageSize, tenSanPham: this.formsearch.get('tenSanPham').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.products = res.data;
      this.totalItems =  res.totalItems;
      this.pageSize = res.pageSize;
    });
  }
  
  displayAdd: boolean = false;
  showAdd() {
    this.displayAdd = true;
    this._api.get('/api/LoaiSanPham/get-all').takeUntil(this.unsubscribe).subscribe(res => {
      this.categories = res;
    }); 
    
    this._api.get('/api/HangSanPham/get-all').takeUntil(this.unsubscribe).subscribe(res => {
      this.brands = res;
    }); 
  }
  resetform(form) {
    if (form != null)
    form.resetForm();
  }
  
  Anh: any = null;
  onChange(event: any) {
    this.Anh = event.target.files[0];
    
    // var reader = new FileReader();
    // reader.readAsDataURL(event.target.files[0]);
    // reader.onload = (e: any) => {
    //   this.image = e.target.result;
    // }
    
    
  }
  upload(file?: any): Observable<any> {
    const apiURL = 'http://localhost:8961/api/SanPham/upload';
    const formData = new FormData();
    formData.append("file", file, file.name);
    return this.httpclient.post(apiURL, formData).pipe();
  }
  
  
  AddNewProduct(form: NgForm) {
    try {
      this.upload(this.Anh).subscribe(res => {
        const sanpham: SanPham = new SanPham();
        sanpham.MaSanPham="";
        sanpham.MaLoai = form.controls['maLoai'].value;
        sanpham.MaHang = form.controls['maHang'].value;
        sanpham.TenSanPham = form.controls['tenSanPham'].value;
        sanpham.XuatXu = form.controls['xuatXu'].value;
        sanpham.BaoHanh = form.controls['baoHanh'].value;
        sanpham.MauSac = form.controls['mauSac'].value;
        sanpham.GiaBan = form.controls['giaBan'].value;
        sanpham.MoTa = form.controls['moTa'].value;
        sanpham.Anh = res.filePath;
        this._api.post('/api/SanPham/create-product', sanpham).takeUntil(this.unsubscribe).subscribe(res => {
          alert("Thêm mới thành công");
          this.resetform(form);
          this.search();
          this.displayAdd = false;
        }, err => { console.log(err); });
      });
      
    }
    catch (error) {
      console.log(error);
    }
  }
  
  edit(product: SanPham) {
    this.product = product;
    this._api.get('/api/LoaiSanPham/get-all').takeUntil(this.unsubscribe).subscribe(res => {
      this.categories = res;
    }); 
    
    this._api.get('/api/HangSanPham/get-all').takeUntil(this.unsubscribe).subscribe(res => {
      this.brands = res;
    }); 
    this.isEdit = true;
  }
  
  SaveData() {
    try {
      this.upload(this.Anh).subscribe(res => { 
        this.product.Anh = res.filePath;
        this._api.post('/api/SanPham/update-product',this.product).takeUntil(this.unsubscribe).subscribe(res => {
          alert("Cập nhật thành công");
          this.isEdit = false;
          this.search();
        }, err => { console.log(err); });
        
      });
    }
    catch (error) {
      console.log(error);
    }
  }
  
  delete(maSanPham:string) {
    this._api.post('/api/SanPham/delete-product', { MaSanPham:maSanPham }).takeUntil(this.unsubscribe).subscribe(res => {
      alert("Xóa thành công");
      this.search();
    },err=>{console.log(err)});
  }
  public openPDF():void {
    let DATA = document.getElementById('product');
    
    html2canvas(DATA).then(canvas => {
      
      let fileWidth = 208;
      let fileHeight = canvas.height * fileWidth / canvas.width;
      
      const FILEURI = canvas.toDataURL('image/png')
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)
      
      PDF.save('products.pdf');
    });     
  }
  exportExcel():void {
    let element = document.getElementById('product');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }
  // exportExcelToDatabase():void {
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.products);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //   XLSX.writeFile(wb, this.fileName);
  // }
}