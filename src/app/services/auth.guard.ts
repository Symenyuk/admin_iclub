import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {FirebaseService} from './firebase.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    public firebaseService: FirebaseService,
    private router: Router
  ) {
  }

  canActivate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.firebaseService.getCurrentUser()
        .then(user => {
          this.router.navigate(['/admin/user-invitation']);
          return resolve(false);
        }, err => {
          return resolve(true);
        });
    });
  }
}
