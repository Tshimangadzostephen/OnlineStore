import { RegistrationComponent } from './user/registration/registration.component';
import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './auth/auth.guard';
import { AdminComponent } from './admin/admin.component';
import { ShopComponent } from './shop/shop.component';
import { OrdersComponent } from './orders/orders.component';
import { CheckoutComponent } from './checkout/checkout.component';

export const routes: Routes = [
  {path: '', redirectTo: '/user/registration', pathMatch:'full'},
  { path:'user', component: UserComponent,
    children:
    [
      { path: 'registration', component: RegistrationComponent },
    ]
  },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard], data: { permittedRoles: ['Product Capturer','Product Manager','Vendor'] } },
  { path:'shop',component: ShopComponent,canActivate:[authGuard],data: { permittedRoles: ['Customer'] } },
  { path:'orders',component: OrdersComponent,canActivate:[authGuard],data: { permittedRoles: ['Customer','Vendor'] } },
  { path: 'checkout', component: CheckoutComponent,canActivate:[authGuard],data: { permittedRoles: ['Customer'] } }
];
