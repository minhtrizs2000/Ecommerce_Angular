import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/base-component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseComponent implements OnInit {
  data: any;
  chartOptions: any;
  public slsp:number;
  public sllsp:any;
  public slnsp:any;
  public slhsp:any;
  public sldh:any;
  public slnd:any;
  public sltt:any;

  public products: any;
  public page = 1;
  public pageSize = 100;
  public totalItems:any;
  public formsearch: any;
  public getBestSelling:any;
  public arrTenSanPham = [];
  public arrSoLuong = [];

  constructor(injector: Injector) { 
    super(injector);
  }

  ngOnInit(): void {
    this.getAmount();
    this.getBestSell();
  }
  getAmount(){
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
  getBestSell() {
    this._api.post('/api/ThongKe/get-sanpham-banchay',{page: this.page, pageSize: this.pageSize, tenSanPham: ""}).takeUntil(this.unsubscribe).subscribe(res => {
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

}
