import { Component,OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../shared/user.service';
import { HomeComponent } from "../home/home.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [HomeComponent,CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  cart: { product: Product, units: number }[] = [];
  totalAmount: number = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    // Retrieve cart data passed from the shop component
    this.cart = history.state.cart || [];
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalAmount = this.cart.reduce((sum, item) => sum + item.product.price * item.units, 0);
  }
}
