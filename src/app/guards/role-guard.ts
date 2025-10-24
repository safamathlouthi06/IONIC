import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { from, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const expectedRole = route.data['role'] as 'client' | 'merchant';
    return from(this.auth.hasRole(expectedRole)).pipe(  // from() convertit Promise en Observable
      map(hasRole => {
        if (!hasRole) {
          this.router.navigate(['/home']);
          return false;
        }
        return true;
      })
    );
  }
}
