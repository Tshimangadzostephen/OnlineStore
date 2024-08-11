import { UserService } from './../shared/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterLink,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  userDetails: any;
  currentUser: string | null = '';
  isRestrictedUser: boolean = false;

  constructor(private router: Router, private service: UserService) {
    this.loadCurrentUser();
  }

  ngOnInit() {
    //this.currentUser = localStorage.getItem('userName');
    //this.isRestrictedUser = this.currentUser === 'ProductCapturer@OnlineStore.com' || this.currentUser === 'ProductManager@OnlineStore.com';

    this.service.getUserProfile().subscribe({
      next: res => {
        this.userDetails = res;
      },
      error: err => {
        console.log(err);
      },
      complete: () => {
        console.log('Request complete');
      }
    });
  }

  loadCurrentUser() {
    // Simulating async operation or fetching user
    setTimeout(() => {
      this.currentUser = localStorage.getItem('userName') || '';
      this.isRestrictedUser = this.currentUser === 'ProductCapturer@OnlineStore.com' ||
                              this.currentUser === 'ProductManager@OnlineStore.com' ||
                              this.currentUser === 'vendor1@OnlineStore.com';
      console.log('Is Restricted User:', this.isRestrictedUser);
    }, 1000);
  }

  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.router.navigate(['/user/registration']);
  }
}
