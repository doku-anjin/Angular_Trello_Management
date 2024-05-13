import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticateService} from "../service/authenticate.service";
import {Router} from "@angular/router";
import {NavbarService} from "../service/navbar/navbar.service";
import {ToastService} from "../service/toast/toast.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmNewPassword: new FormControl(''),
    }
  )
  show: Boolean = false;

  constructor(private authenticationService: AuthenticateService,
              private router: Router,
              private navbarService: NavbarService,
              private toastService: ToastService) {
  }

  ngOnInit(): void {
  }

  onSubmit() {

    this.authenticationService.login(this.loginForm.get('userName')?.value, this.loginForm.get('password')?.value)
      .subscribe(() => {
        this.navbarService.getCurrentUser();
        this.router.navigate(['']);
        this.toastService.showMessage('Đăng nhập thành công', "is-success")
      }, error => {
        this.toastService.showMessage('Sai tài khoản hoặc mật khẩu', "is-warning")
      })
  }

  showPassword() {
    this.show = !this.show
  }
}
