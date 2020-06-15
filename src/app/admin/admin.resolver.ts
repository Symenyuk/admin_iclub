import {Injectable} from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
import {FirebaseService} from '../services/firebase.service';
import {FirebaseUserModel} from '../models/user.model';

@Injectable()
export class AdminResolver implements Resolve<FirebaseUserModel> {

  constructor(public firebaseService: FirebaseService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot): Promise<FirebaseUserModel> {

    let user = new FirebaseUserModel();

    return new Promise((resolve, reject) => {
      this.firebaseService.getCurrentUser()
        .then(res => {
          if (res.providerData[0].providerId === 'password') {
            user.name = res.displayName;
            user.provider = res.providerData[0].providerId;
            return resolve(user);
          } else {
            user.image = res.photoURL;
            user.name = res.displayName;
            user.provider = res.providerData[0].providerId;
            return resolve(user);
          }
        }, err => {
          this.router.navigate(['/login']);
          return reject(err);
        });
    });
  }
}
