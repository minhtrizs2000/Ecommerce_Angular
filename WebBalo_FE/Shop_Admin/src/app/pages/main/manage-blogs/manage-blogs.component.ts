import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../core/base-component';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/takeUntil';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, NgForm } from '@angular/forms';
import { TinTuc } from '../../../shared/models/TinTuc';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/core/authentication.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-manage-blogs',
  templateUrl: './manage-blogs.component.html',
  styleUrls: ['./manage-blogs.component.css']
})
export class ManageBlogsComponent extends BaseComponent implements OnInit {
  
  public blogs: any;
  public blog: any;
  public page = 1;
  public pageSize = 10;
  public totalItems:any;
  public formsearch: any;
  user:any;
  formBlog: FormBuilder;
  
  fileName = 'blogs.xlsx';
  @ViewChild('blog') htmlData:ElementRef;
  constructor(
    private fb: FormBuilder,
    injector: Injector,
    private route: ActivatedRoute, 
    private router: Router,
    private httpclient: HttpClient,
    private authenticationService: AuthenticationService,) {
      super(injector);
      
      this.blog = new TinTuc();
    }
    isEdit: boolean = false;
    ngOnInit(): void {
      this.formsearch = this.fb.group({
        'tieuDe': ['']
      });
      this.search();
      this.authenticationService.user.subscribe((res) => {
        this.user = res;
        console.log(this.user);
      })
    }
    
    loadPage(page) { 
      this._api.post('/api/TinTuc/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
        this.blogs = res.data;
        this.totalItems =  res.totalItems;
        this.pageSize = res.pageSize;
      });
    } 
    
    search() { 
      this.page = 1;
      this.pageSize = 5;
      this._api.post('/api/TinTuc/search',{page: this.page, pageSize: this.pageSize, tieuDe: this.formsearch.get('tieuDe').value}).takeUntil(this.unsubscribe).subscribe(res => {
        this.blogs = res.data;
        this.totalItems =  res.totalItems;
        this.pageSize = res.pageSize;
      });
    }
    
    displayAdd: boolean = false;
    showAdd() {
      this.displayAdd = true;
      
    }
    resetform(form) {
      if (form != null)
      form.resetForm();
    }
    
    Anh: any = null;
    onChange(event: any) {
      this.Anh = event.target.files[0];
    }
    upload(file?: any): Observable<any> {
      const apiURL = 'http://localhost:8961/api/TinTuc/upload';
      const formData = new FormData();
      formData.append("file", file, file.name);
      return this.httpclient.post(apiURL, formData).pipe();
    }
    
    
    AddNewBlog(form: NgForm) {
      console.log(form.value);
      try {
        this.upload(this.Anh).subscribe(res => {
          const tintuc: TinTuc = new TinTuc();
          tintuc.MaTinTuc="";
          tintuc.TieuDe = form.controls['tieuDe'].value;
          tintuc.MoTa = form.controls['moTa'].value;
          tintuc.NoiDung = form.controls['noiDung'].value;
          tintuc.MaNguoiDung = form.controls['maNguoiDung'].value;
          tintuc.NgayDang = form.controls['ngayDang'].value;
          tintuc.Anh = res.filePath;
          debugger;
          this._api.post('/api/TinTuc/create-blog', tintuc).takeUntil(this.unsubscribe).subscribe(res => {
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
    
    edit(blog: TinTuc) {
      this.blog = blog;
      this.isEdit = true;
    }
    
    SaveData() {
      try {
        this.upload(this.Anh).subscribe(res => { 
          this.blog.Anh = res.filePath;
          this._api.post('/api/TinTuc/update-blog',this.blog).takeUntil(this.unsubscribe).subscribe(res => {
            alert("Cập nhật thành công");
            this.search();
            this.isEdit = false;
          }, err => { console.log(err); });
        });
      }
      catch (error) {
        console.log(error);
      }
    }
    
    delete(maTinTuc:string) {
      this._api.post('/api/TinTuc/delete-blog', { MaTinTuc:maTinTuc }).takeUntil(this.unsubscribe).subscribe(res => {
        alert("Xóa thành công");
        this.search();
      },err=>{console.log(err)});
    }

    public openPDF():void {
      let DATA = document.getElementById('blog');
      
      html2canvas(DATA).then(canvas => {
        
        let fileWidth = 208;
        let fileHeight = canvas.height * fileWidth / canvas.width;
        
        const FILEURI = canvas.toDataURL('image/png')
        let PDF = new jsPDF('p', 'mm', 'a4');
        let position = 0;
        PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)
        
        PDF.save('blogs.pdf');
      });     
    }
    exportExcel():void {
      let element = document.getElementById('blog');
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, this.fileName);
    }
  }
  