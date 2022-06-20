import { Component, Injector, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/authentication.service';
import { BaseComponent } from 'src/app/core/base-component';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent extends BaseComponent implements OnInit {
  public user:any;
  constructor(
    injector: Injector,
    private authenticationService: AuthenticationService) { 
      super(injector)
    }

  ngOnInit(): void {
    this.authenticationService.user.subscribe((res) => {
      this.user = res;
      console.log(this.user);
    })
  }

}
