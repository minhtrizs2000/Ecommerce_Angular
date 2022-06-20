import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../core/base-component';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/takeUntil';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { MustMatch } from '../../../core/helper/must-match.validator';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent extends BaseComponent implements OnInit {
  public users: any;
  public user: any;
  public page = 1;
  public pageSize = 10;
  public totalItems:any;
  public formsearch: any;
  public doneSetupForm: any;  
  public showUpdateModal:any;
  public formdata: any;
  submitted = false;
  public isCreate:boolean;

  fileName = 'users.xlsx';
  @ViewChild('user') htmlData:ElementRef;
  constructor(private fb: FormBuilder,injector: Injector,private route: ActivatedRoute, private router: Router) {
    super(injector);
  }
  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'hoTen': [''],
      'taiKhoan': ['']
    });
    this.search();
  }
  
  loadPage(page) { 
    this._api.post('/api/NguoiDung/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.users = res.data;
      this.totalItems =  res.totalItems;
      this.pageSize = res.pageSize;
    });
  } 
  
  search() { 
    this._api.post('/api/NguoiDung/search',{page: this.page, pageSize: this.pageSize, hoTen: this.formsearch.get('hoTen').value, taiKhoan: this.formsearch.get('taiKhoan').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.users = res.data;
      this.totalItems =  res.totalItems;
      this.pageSize = res.pageSize;
    });
  }
  
  display: boolean = false;
  show() {
    this.display = true;
  }
  
  get f() { return this.formdata.controls; }
  pwdCheckValidator(control){
    var filteredStrings = {search:control.value, select:'@#!$%&*'}
    var result = (filteredStrings.select.match(new RegExp('[' + filteredStrings.search + ']', 'g')) || []).join('');
    if(control.value.length < 6 || !result){
      return {matKhau: true};
    }
  }
  onSubmit(value) {
    this.submitted = true;
    if (this.formdata.invalid) {
      return;
    } 
    if(this.isCreate) { 
      let tmp = {
        hoTen:value.hoTen,
        diaChi:value.diaChi,
        gioiTinh:value.gioiTinh,
        email:value.email,
        taiKhoan:value.taiKhoan,
        matKhau:value.matKhau,
        role:value.role,
        ngaySinh:value.ngaySinh           
      };
      this._api.post('/api/NguoiDung/create-user',tmp).takeUntil(this.unsubscribe).subscribe(res => {
        alert('Thêm thành công');
        this.search();
        this.display = false;
      });
    } else { 
      let tmp = {
        hoTen:value.hoTen,
        diaChi:value.diaChi,
        gioiTinh:value.gioiTinh,
        email:value.email,
        taiKhoan:value.taiKhoan,
        matKhau:value.matKhau,
        role:value.role,
        ngaySinh:value.ngaySinh ,
        maNguoiDung:this.user.maNguoiDung,          
      };
      this._api.post('/api/NguoiDung/update-user',tmp).takeUntil(this.unsubscribe).subscribe(res => {
        alert('Cập nhật thành công');
        this.search();
        this.display = false;
      });
    }
  } 
  showAdd() {
    this.doneSetupForm = false;
    this.display = true; 
    this.isCreate = true;
    this.user = null;
    this.formdata = this.fb.group({
      'hoTen': ['', Validators.required],
      'ngaySinh': ['', Validators.required],
      'diaChi': [''],
      'gioiTinh': ['', Validators.required],
      'email': ['', [Validators.required,Validators.email]],
      'taiKhoan': ['', Validators.required],
      'matKhau': ['', [this.pwdCheckValidator]],
      'nhaplaimatkhau': ['', Validators.required],
      'role': ['', Validators.required],
    }, {
      validator: MustMatch('matKhau', 'nhaplaimatkhau')
    });
    this.formdata.get('ngaySinh').setValue(this.today);
    this.formdata.get('gioiTinh').setValue(this.genders[0].value); 
    this.formdata.get('role').setValue(this.roles[0].value);
    this.doneSetupForm = true;
  }
  public showEdit(row) {
    this.display = true; 
    this.doneSetupForm = false;
    this.isCreate = false;
    setTimeout(() => {
      this._api.get('/api/NguoiDung/get-by-id/'+ row.maNguoiDung).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.user = res; 
        let ngaySinh = new Date(this.user.ngaySinh);
        this.formdata = this.fb.group({
          'hoTen': [this.user.hoTen, Validators.required],
          'ngaySinh': [ngaySinh, Validators.required],
          'diaChi': [this.user.diaChi],
          'gioiTinh': [this.user.gioiTinh, Validators.required],
          'email': [this.user.email, [Validators.required,Validators.email]],
          'taiKhoan': [this.user.taiKhoan, Validators.required],
          'matKhau': [this.user.matKhau, [this.pwdCheckValidator]],
          'nhaplaimatkhau': [this.user.matKhau, Validators.required],
          'role': [this.user.role, Validators.required],
        }, {
          validator: MustMatch('matKhau', 'nhaplaimatkhau')
        }); 
        this.doneSetupForm = true;
      }); 
    }, 700);
  }
  delete(maNguoiDung:string) {
    this._api.post('/api/NguoiDung/delete-user', { MaNguoiDung:maNguoiDung }).takeUntil(this.unsubscribe).subscribe(res => {
      alert("Xóa thành công");
      this.search();
    },err=>{console.log(err)});
  }

  public openPDF():void {
    let DATA = document.getElementById('user');
    
    html2canvas(DATA).then(canvas => {
      
      let fileWidth = 208;
      let fileHeight = canvas.height * fileWidth / canvas.width;
      
      const FILEURI = canvas.toDataURL('image/png')
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)
      
      PDF.save('users.pdf');
    });     
  }
  exportExcel():void {
    let element = document.getElementById('user');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }
}
