import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base-component';

@Component({
  selector: 'app-add-cart-modal',
  templateUrl: './add-cart-modal.component.html',
  styleUrls: ['./add-cart-modal.component.css']
})
export class AddCartModalComponent extends BaseComponent implements OnInit {

  items:any;
  total:any;
  sanpham:any;
  constructor(injector: Injector) { 
    super(injector);
  }


  ngOnInit(): void {

    this._product_detail.items.subscribe((res) => {
      this.sanpham = res;
    });
    this._cart.items.subscribe((res) => {
      this.items = res;
      this.total = 0;
      for(let x of this.items){ 
        x.money = x.quantity * x.giaBan;
        this.total += x.quantity * x.giaBan;
      } 
    });
    console.log(this.items);
    console.log(this.sanpham);
    
  }
  clearCart() { 
    this._cart.clearCart();
    alert('Xóa thành công');
  }
  addQty(item, quantity){ 
    item.quantity =  quantity;
    item.money =  Number.parseInt(item.quantity) *  item.giaBan;
    this._cart.addQty(item);
  }

}
