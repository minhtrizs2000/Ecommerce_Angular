import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/core/base-component';
import { MustMatch } from 'src/app/core/helper/must-match.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent extends BaseComponent implements OnInit {
  public frmRegister: FormGroup;
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    injector: Injector,
    private router: Router) {
      super(injector);
    }
    
    ngOnInit(): void {
      this.frmRegister = this.formBuilder.group({
        HoTen: ['', [Validators.required]],
        Email: ['', [Validators.required, Validators.email]],
        TaiKhoan: ['',[Validators.required]],
        NgaySinh: ['',[Validators.required]],
        DiaChi:  ['',[Validators.required]],
        MatKhau: ['',[Validators.required, Validators.minLength(6)]],
        NhapLaiMatKhau: ['',[Validators.required, Validators.minLength(6)]],
      },{
        validator: MustMatch('MatKhau', 'NhapLaiMatKhau')
      });
    }
    
    onSubmit(value : any){
      this.submitted = true;
      if(this.frmRegister.invalid) return;
    
      this._api.post('/api/NguoiDung/create-user', 
      {
        HoTen:value.HoTen, 
        Email:value.Email, 
        TaiKhoan:value.TaiKhoan, 
        NgaySinh:value.NgaySinh, 
        DiaChi:value.DiaChi, 
        MatKhau: value.MatKhau,
        role: 'User'
      })
      .takeUntil(this.unsubscribe).subscribe(res => {
        alert('Đăng ký thành công');
        this.router.navigate(['/auth/login']);
      }, err => { 
        alert('Có lỗi trong quá trình thực hiện');
     
      });    
    }
    
  }
  