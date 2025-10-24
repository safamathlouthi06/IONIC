import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { from, Observable, map } from 'rxjs';

// Ce service sert de "gardien" pour protéger l'accès aux pages
// Il vérifie que l'utilisateur a le bon rôle avant de lui permettre d'accéder à une page
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  // On a besoin de deux services :
  // - auth : pour vérifier le rôle de l'utilisateur
  // - router : pour rediriger l'utilisateur si il n'a pas le bon rôle
  constructor(private auth: AuthService, private router: Router) {}

  // Cette méthode est appelée automatiquement par Angular quand un utilisateur essaie d'accéder à une page protégée
  // Elle décide si oui ou non on laisse l'utilisateur accéder à la page demandée
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    // On récupère le rôle requis pour cette page
    // Par exemple, pour la page du marchand, on attend le rôle 'merchant'
    const expectedRole = route.data['role'] as 'client' | 'merchant';
    
    // On vérifie si l'utilisateur connecté a bien ce rôle
    // hasRole() retourne une Promesse, donc on la transforme en Observable avec from()
    return from(this.auth.hasRole(expectedRole)).pipe(
      // On transforme le résultat pour prendre une décision
      map(hasRole => {
        if (!hasRole) {
          // Si l'utilisateur n'a pas le bon rôle, on le redirige vers la page d'accueil
          this.router.navigate(['/home']);
          return false; // On refuse l'accès
        }
        // Si l'utilisateur a le bon rôle, on lui permet d'accéder à la page
        return true;
      })
    );
  }
}