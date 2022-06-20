import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/core/base-component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-manage-amount',
  templateUrl: './manage-amount.component.html',
  styleUrls: ['./manage-amount.component.css']
})
export class ManageAmountComponent extends BaseComponent implements OnInit {
  data: any;
  chartOptions: any;
  public slsp:number;
  public sllsp:any;
  public slnsp:any;
  public slhsp:any;
  public sldh:any;
  public slnd:any;
  public sltt:any;

  @ViewChild('amount') htmlData:ElementRef;
  constructor(injector: Injector) {
    super(injector);
  }
  
  ngOnInit(): void {
    this._api.get('/api/ThongKe/get-SLSP').takeUntil(this.unsubscribe).subscribe(res => {
      this.slsp = res;
      this._api.get('/api/ThongKe/get-SLLSP').takeUntil(this.unsubscribe).subscribe(res => {
        this.sllsp = res;
        this._api.get('/api/ThongKe/get-SLNSP').takeUntil(this.unsubscribe).subscribe(res => {
          this.slnsp = res;
          this._api.get('/api/ThongKe/get-SLHSP').takeUntil(this.unsubscribe).subscribe(res => {
            this.slhsp = res;
            this._api.get('/api/ThongKe/get-SLDH').takeUntil(this.unsubscribe).subscribe(res => {
              this.sldh = res;
              this._api.get('/api/ThongKe/get-SLND').takeUntil(this.unsubscribe).subscribe(res => {
                this.slnd = res;
                this._api.get('/api/ThongKe/get-SLTT').takeUntil(this.unsubscribe).subscribe(res => {
                  this.sltt = res;
                  this.data = {
                    labels: ['Sản Phẩm','Loại Sản Phẩm','Nhóm Sản Phẩm','Hãng Sản Phẩm','Đơn Hàng','Người Dùng','Tin tức'],
                    datasets: [
                      {
                        data: [this.slsp, this.sllsp, this.slnsp, this.slhsp, this.sldh, this.slnd, this.sltt],
                        backgroundColor: [
                          "#42A5F5",
                          "#66BB6A",
                          "#FFA726",
                          "#0000FF",
                          "#808000",
                          "#00FF00",
                          "0066CC"
                        ],
                        hoverBackgroundColor: [
                          "#64B5F6",
                          "#81C784",
                          "#FFB74D",
                          "#191970",
                          "#8B4513",
                          "#32CD32",
                          "0000CC"
                        ]
                      }
                    ]
                  };
                });    
              }); 
            }); 
          }); 
        }); 
      }); 
    }); 
  }

  public openPDF():void {
    let DATA = document.getElementById('amount');
    
    html2canvas(DATA).then(canvas => {
      
      let fileWidth = 208;
      let fileHeight = canvas.height * fileWidth / canvas.width;
      
      const FILEURI = canvas.toDataURL('image/png')
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)
      
      PDF.save('amount.pdf');
    });     
  }
}
