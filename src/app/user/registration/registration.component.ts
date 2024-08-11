import { Component } from '@angular/core';
import { ReactiveFormsModule,FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { CommonModule } from '@angular/common';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,SweetAlert2Module, FormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent {

  loginModel = {
    UserName:'',
    Password:''
  }

  constructor(public userService: UserService,private router: Router) {}

  ngOnInit(): void {
    this.userService.formModel.reset();

    if (localStorage.getItem('token') != null)
      this.router.navigateByUrl('/shop');
  }

  onSubmit(){
    this.userService.register().subscribe(
      (response: any) => {
        if(response.succeeded){
          Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: 'You have registered successfully!',
            confirmButtonText: 'OK'
          });
          this.userService.formModel.reset();
        }
        else{
          response.errors.forEach((element: any) => {
            console.log(response);
            switch(element.code){
              case 'DuplicateUserName':
                Swal.fire({
                  icon: 'error',
                  title: 'Duplicate Username',
                  text: 'The username is already taken, please choose another one.',
                  confirmButtonText: 'OK'
                });
              break;
              default :
                Swal.fire({
                  icon: 'error',
                  title: 'Registration Failed',
                  text: 'An error occurred during registration. Please try again later.',
                  confirmButtonText: 'OK'
                });
              break;
            }
          });
        }
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Server Error',
          text: 'An error occurred on the server. Please try again later.',
          confirmButtonText: 'OK'
        });
        console.log(error);
      })
  }

  onLoginSubmit(form: NgForm){
    this.userService.login(form.value).subscribe(
      (res: any) => {
        localStorage.setItem('userName', form.value.UserName);
        localStorage.setItem('token', res.token);

        if(form.value.UserName === 'ProductCapturer@OnlineStore.com' || form.value.UserName === 'ProductManager@OnlineStore.com' || form.value.UserName === 'vendor1@OnlineStore.com')
        {
          this.router.navigateByUrl('/admin');
        }
        else
        {
          this.router.navigateByUrl('/shop');
        }

      },
      (error: any) => {
        if (error.status == 400)
        {
          Swal.fire({
            icon: 'error',
            title: 'Authentication failed.',
            text: 'Incorrect username or password.',
            confirmButtonText: 'OK'
          });
        }
        else{
          console.log(error);
        }
      }
    );
  }
}
