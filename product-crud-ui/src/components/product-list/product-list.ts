import { ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import { ProductService } from '../../services/product';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnDestroy {

  isModalOpen = false;
  isEditMode = false;
  selectedProductId: string | null = null;

  products: any[] = [];

  productService = inject(ProductService);
  cd = inject(ChangeDetectorRef);
  fb = inject(FormBuilder);

  private destroy$ = new Subject<void>();

  productForm = this.fb.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['']
  });

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.products = res?.data || [];
        this.cd.detectChanges();
      });
  }

  addProduct() {
    if (this.productForm.invalid) return;
    this.productService.createProduct(this.productForm.value as any)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.productForm.reset();
        this.loadProducts();
      });
  }

  deleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.deleteProduct(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          alert('Product deleted successfully');
          this.loadProducts();
        },
        error: (err) => {
          alert(err?.error?.message || 'Failed to delete product');
        }
      });
  }

  saveProduct() {
    if (this.productForm.invalid) return;

    if (this.isEditMode && this.selectedProductId) {
      this.productService.updateProduct(this.selectedProductId, this.productForm.value as any)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            alert('Product updated successfully');
            this.afterSave();
          },
          error: (err) => {
            alert(err?.error?.message || 'Failed to update product');
          }
        });
    } else {
      this.productService.createProduct(this.productForm.value as any)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            alert('Product created successfully');
            this.afterSave();
          },
          error: (err) => {
            alert(err?.error?.message || 'Failed to create product');
          }
        });
    }
  }

  afterSave() {
    this.productForm.reset();
    this.isModalOpen = false;
    this.loadProducts();
  }

  openCreateModal() {
    this.isEditMode = false;
    this.productForm.reset();
    this.isModalOpen = true;
  }

  openEditModal(product: any) {
    this.isEditMode = true;
    this.selectedProductId = product._id;
    this.productForm.patchValue({
      name: product.name,
      price: product.price,
      description: product.description
    });
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
