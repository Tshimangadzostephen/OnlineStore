import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService

 } from '../shared/user.service';
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const userService = inject(UserService);

  //* Check if token exists
  const token = localStorage.getItem('token');
  if (token != null) {
    //* Get permitted roles from route data
    const roles = route.data['permittedRoles'] as Array<string>;
    console.log(roles);

    //* If permittedRoles is defined, perform role check
    if (roles && roles.length > 0)
    {
      if (userService.roleMatch(roles))
      {
        console.log('Role match successful');
        return true;
      }
      else
      {
        //* Navigate to unauthorized page or if roles don't match
        console.log('Role match failed');
        router.navigate(['/user/shop']);
        return false;
      }
    }
    else
    {
      //* If permittedRoles is not defined, allow access
      console.log('No roles specified');
      return true;
    }
  }
  else
  {
    //* Navigate to login if no token
    console.log('No token specified');
    router.navigate(['/user/registration']);
    return false;
  }
};
