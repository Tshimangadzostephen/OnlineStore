import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, Product } from '../shared/user.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, HomeComponent, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  approvedProducts: Product[] = [];
  pendingProducts: Product[] = [];
  currentUser: string | null = '';
  productForm: FormGroup;
  editingProduct: Product | null = null;
  Role: string | null = '';
  isReadonly: boolean = true;

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      unit: [0, [Validators.required, Validators.min(0)]],
      image: ['']
    });
  }

  ngOnInit(): void {
    this.currentUser = localStorage.getItem('userName');
    if(this.currentUser === 'ProductManager@OnlineStore.com')
    {
      this.Role = 'Product Manager';
    }
    else if(this.currentUser === 'ProductCapturer@OnlineStore.com')
    {
      this.Role = 'Product Capturer';
    }
    else
    {
      this.Role = 'Vendor';
    }
    this.loadProducts();
    this.checkUserRole();
  }

  checkUserRole(): void {
    // const allowedRoles = ['Product Capturer', 'Product Manager'];
    // this.isReadonly = !allowedRoles.includes(this.currentUser || '');
    if(this.currentUser === 'vendor1@OnlineStore.com')
    {
      this.isReadonly = true;
    }
    else
    {
      this.isReadonly = false;
    }
  }

  loadProducts(): void {
    this.userService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.approvedProducts = products.filter(p => p.status === 'Approved' && !p.isDeleted);
        this.pendingProducts = products.filter(p => p.status === 'Pending');
      },
      error: (err) => console.error('Error loading products:', err),
    });
  }

  onImageUpload(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.productForm.patchValue({ image: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  createProduct(): void {
    if (this.productForm.valid) {
      const newProduct: Product = {
        ...this.productForm.value,
        id: new Date().getTime(), // or any unique identifier
        status: 'Pending',
      };

      this.userService.createProduct(newProduct).subscribe({
        next: () => {
          this.loadProducts(); // Reload products after creation
          this.productForm.reset(); // Clear the form after the product is created
        },
        error: (err) => console.error('Error creating product:', err),
      });
    }
  }

  approveProduct(product: Product): void {
    if (confirm('Are you sure you want to approve this product?')) {
      product.status = 'Approved';
      this.userService.updateProductUnits(product).subscribe({
        next: () => this.loadProducts(), // Reload products after approval
        error: (err) => console.error('Error approving product:', err),
      });
    }
  }

  editProduct(product: Product): void {
    this.editingProduct = { ...product };
    this.productForm.patchValue(product);
  }

  updateProduct(): void {
    if (this.productForm.valid && this.editingProduct) {
      const updatedProduct: Product = { ...this.editingProduct, ...this.productForm.value };
      this.userService.updateProductUnits(updatedProduct).subscribe({
        next: () => {
          this.loadProducts(); // Reload products after update
          this.editingProduct = null;
          this.productForm.reset(); // Clear the form after the product is updated
        },
        error: (err) => console.error('Error updating product:', err),
      });
    }
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.userService.deleteProduct(productId).subscribe({
        next: () => this.loadProducts(),
        error: (err) => console.error('Error deleting product:', err),
      });
    }
  }
}
