import { Component, OnInit,Injector } from '@angular/core';
import { BaseComponent } from '../../../core/base-component';

@Component({
  selector: 'app-quick-view-modal',
  templateUrl: './quick-view-modal.component.html',
  styleUrls: ['./quick-view-modal.component.css']
})
export class QuickViewModalComponent extends BaseComponent implements OnInit {

  sanpham:any;
  constructor(injector: Injector) { 
    super(injector);
  }
  ngOnInit(): void {
    this._product_detail.items.subscribe((res) => {
      this.sanpham = res;
      setTimeout(() => {
        this.loadScripts();
      });
    });    
    console.log(this.sanpham);
    
  }

}
