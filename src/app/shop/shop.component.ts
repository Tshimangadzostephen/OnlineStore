import { Component, OnInit } from '@angular/core';
import { HomeComponent } from "../home/home.component";
import { UserService, Product } from '../shared/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [HomeComponent,CommonModule,FormsModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})

export class ShopComponent implements OnInit {
  products: Product[] = [];
  cart: { product: Product, units: number }[] = [];
  selectedUnits: { [key: number]: number } = {}; // Track selected units for each product

  constructor(private userService: UserService,private router: Router) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.userService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products.filter(p => p.status === 'Approved' && !p.isDeleted);
      },
      error: (err) => console.error('Error loading products:', err),
    });
  }

  onUnitChange(product: Product, units: number) {
    // Limit to 10 units
    this.selectedUnits[product.id] = units > 10 ? 10 : units;
  }

  addToCart(product: Product) {
    const units = this.selectedUnits[product.id] || 0;
    if (units > 0 && units <= product.unit) {
      const existingItem = this.cart.find(item => item.product.id === product.id);
      if (existingItem) {
        existingItem.units += units;
      } else {
        this.cart.push({ product, units });
      }
      // Update available units in product
      product.unit -= units;
      // Reset selected units after adding to cart
      this.selectedUnits[product.id] = 0;
    }
  }

  updateCartItem(product: Product, units: number) {
    const item = this.cart.find(item => item.product.id === product.id);
    if (item) {
      // Ensure units are within available stock and update cart item
      item.units = Math.min(units, product.unit + (item.units - item.units));
    }
  }

  removeFromCart(product: Product) {
    const itemIndex = this.cart.findIndex(item => item.product.id === product.id);
    if (itemIndex !== -1) {
      // Update available units in product
      this.products.find(p => p.id === product.id)!.unit += this.cart[itemIndex].units;
      // Remove item from cart
      this.cart.splice(itemIndex, 1);
    }
  }

  checkout() {
    this.cart.forEach(item => {
        // Calculate new unit value
        // const updatedUnit = item.product.unit - item.units;
        const updatedUnit = item.product.unit;
        console.log(`Product ID: ${item.product.id}, Initial Units: ${item.product.unit}, Units Bought: ${item.units}`);


        // Check if the new unit value is valid
        if (updatedUnit < 0) {
            console.error(`Invalid unit count for product ID ${item.product.id}. Units cannot be negative.`);
            return;
        }

        // Create a new product object with updated units
        const updatedProduct = { ...item.product, unit: updatedUnit };

        this.userService.updateProductUnits(updatedProduct).subscribe(() => {
            console.log(`Updated product ID ${updatedProduct.id} in the database`);
        });
    });

    const order = {
      orderNumber: this.generateOrderNumber(), // You can implement this method to generate unique order numbers
      userName: this.getUserName(), // Retrieve the logged-in user's username
      date: new Date().toISOString(),
      status: 'Order Received',
      items: this.cart
    };

    console.log(order);
    // Save order to local storage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Navigate to the checkout page with cart details
    this.router.navigate(['/checkout'], { state: { cart: this.cart } });
}

// Method to get the logged-in user's username
getUserName(): string {
  return localStorage.getItem('userName') || 'Unknown User';
}

// Method to generate a unique order number
generateOrderNumber(): number {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  return orders.length ? orders[orders.length - 1].orderNumber + 1 : 1;
}

}
