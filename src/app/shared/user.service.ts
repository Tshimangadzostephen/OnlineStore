import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  formModel: FormGroup;
  readonly BaseURI = 'https://onlinestoreapi20240811150047.azurewebsites.net';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.formModel = this.fb.group({
      Name: ['', Validators.required],
      EmailAddress: ['', [Validators.required, Validators.email]],
      Passwords: this.fb.group({
        Password: ['', Validators.required],
        PasswordConfirm: ['', Validators.required]
      }, { validators: this.comparePasswords() })
    });
  }

  comparePasswords(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('Password');
      const confirmPassword = formGroup.get('PasswordConfirm');

      if (password && confirmPassword && password.value !== confirmPassword.value) {
        return { pwdMisMatch: true };
      }
      return null;
    };
  }

  register()
  {
    var body = {
      FullName: this.formModel.value.Name,
      Email: this.formModel.value.EmailAddress,
      Password: this.formModel.value.Passwords.Password,
      UserName: this.formModel.value.EmailAddress
    };

    return this.http.post(this.BaseURI + '/AppUser/Register', body);
  }

  login(formData : any) {
    return this.http.post(this.BaseURI + '/AppUser/Login', formData);
  }

  getUserProfile(): Observable<any> {
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.BaseURI}/UserProfile/GetUserProfile`, { headers });
  }


  roleMatch(allowedRoles: string[]): boolean {
    let isMatch = false;

    //* Get the JWT token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      return false; //* No token found, return false
    }

    //* Decode the JWT token payload
    const payload = JSON.parse(window.atob(token.split('.')[1]));
    const userRole = payload.role;
    console.log(userRole);

    //* Check if userRole matches any of the allowedRoles
    if (allowedRoles && Array.isArray(allowedRoles)) {
      allowedRoles.forEach((element: string) => {
        if (userRole === element) {
          isMatch = true;
        }
      });
    }

    return isMatch;
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.BaseURI}/api/Products`);
  }

  updateProductUnits(product: Product) {
    return this.http.put(`${this.BaseURI}/api/Products/${product.id}`, product);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.BaseURI}/api/Products`, product);
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.BaseURI}/api/Products/${productId}`);
  }

  getProductsByStatus(status: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.BaseURI}/api/Products?status=${status}`);
  }

}

export interface Product {
  id: number;
  name: string;
  price: number;
  unit: number;
  image: string;
  status: 'Pending' | 'Approved';
  isDeleted: boolean;
}
