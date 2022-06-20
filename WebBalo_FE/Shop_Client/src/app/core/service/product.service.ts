import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ProductDetailService {
    private itemsSubject = new BehaviorSubject<any[]>([]);
    items = this.itemsSubject.asObservable();
  constructor() {
    let local_storage = JSON.parse(localStorage.getItem('detail_product'));
    if (!local_storage) {
        local_storage = [];
      }
    this.itemsSubject.next(local_storage); 
  }
  
  detailProduct(item) {   
    let local_storage:any;
    local_storage = item; 

    localStorage.setItem('detail_product', JSON.stringify(local_storage));
    this.itemsSubject.next(local_storage);
  }
}