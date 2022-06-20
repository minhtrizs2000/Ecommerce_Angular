import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/core/base-component';

@Component({
  selector: 'app-manage-best-selling',
  templateUrl: './manage-best-selling.component.html',
  styleUrls: ['./manage-best-selling.component.css']
})


export class ManageBestSellingComponent extends BaseComponent implements OnInit {
  public products: any;
  public page = 1;
  public pageSize = 100;
  public totalItems:any;
  public formsearch: any;
  public getBestSelling:any;
  public arrTenSanPham = [];
  public arrSoLuong = [];

  @ViewChild('best-selling') htmlData:ElementRef;
  constructor(private fb: FormBuilder,injector: Injector,private route: ActivatedRoute, private router: Router, private httpclient: HttpClient) {
    super(injector);
  }
  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'tenSanPham': ['']
    });
    this.search();
  }  
  search() { 
    this._api.post('/api/ThongKe/get-sanpham-banchay',{page: this.page, pageSize: this.pageSize, tenSanPham: this.formsearch.get('tenSanPham').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.products = res;
      this.products.data.forEach(item => {
        this.arrTenSanPham.push(item.tenSanPham);
      });
      this.products.data.forEach(item => {
        this.arrSoLuong.push(item.slbc);
      });
      this.getBestSelling = {
        labels: this.arrTenSanPham,
        datasets: [
          {
            label: 'Số lượng bán chạy',
            backgroundColor: '#42A5F5',
            data: this.arrSoLuong
          },
        ]
      }
    });
  }
  public openPDF():void {
    let DATA = document.getElementById('best-selling');
    
    html2canvas(DATA).then(canvas => {
      
      let fileWidth = 208;
      let fileHeight = canvas.height * fileWidth / canvas.width;
      
      const FILEURI = canvas.toDataURL('image/png')
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)
      
      PDF.save('best-selling.pdf');
    });     
  }
}
