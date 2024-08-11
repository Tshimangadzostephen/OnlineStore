import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { HomeComponent } from "../home/home.component";
import { CommonModule } from '@angular/common';
import { OrderDetailsModalComponent } from '../order-details-modal/order-details-modal.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [HomeComponent,CommonModule,OrderDetailsModalComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit, OnDestroy {

  selectedOrder: any = null;
  isModalVisible: boolean = false;

  orders: any[] = [];
  private statusUpdateSubscription!: Subscription;

  ngOnInit() {
    this.loadOrders();
    this.statusUpdateSubscription = interval(300000) // Update status every 5 minutes
      .subscribe(() => this.updateOrderStatuses());
  }

  ngOnDestroy() {
    if (this.statusUpdateSubscription) {
      this.statusUpdateSubscription.unsubscribe();
    }
  }

  loadOrders(): void {
    const userName = localStorage.getItem('userName'); // Get the logged-in user's username from local storage
    if (!userName) {
      console.error('User not logged in or username not found in local storage.');
      return;
    }

    // Load and filter orders
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    this.orders = allOrders.filter((order: any) => order.userName === userName || userName==='vendor1@OnlineStore.com');
  }

  updateOrderStatuses() {
    this.orders = this.orders.map(order => {
      if (order.status === 'Order Received') {
        order.status = 'Processing';
      } else if (order.status === 'Processing') {
        order.status = 'Out For Delivery';
      } else if (order.status === 'Out For Delivery') {
        order.status = 'Delivered';
      }
      return order;
    });
    localStorage.setItem('orders', JSON.stringify(this.orders));
  }

  viewOrder(orderNumber: number): void {
    // Retrieve orders from local storage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');

    // Find the order with the given orderNumber
    this.selectedOrder = orders.find((order: any) => order.orderNumber === orderNumber);

    if (this.selectedOrder) {
      this.isModalVisible = true;
    } else {
      console.error('Order not found:', orderNumber);
    }
  }

  closeModal(): void {
    this.isModalVisible = false;
  }
}
