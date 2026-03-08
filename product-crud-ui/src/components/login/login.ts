import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnDestroy {

  loginForm!: FormGroup;
  submitted = false;
  fb = inject(FormBuilder);
  authService = inject(Auth);
  private destroy$ = new Subject<void>();
  private router = inject(Router);


  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {

    this.submitted = true;

    if (this.loginForm.invalid) return;

    const payload = {
      username: this.f['username'].value,
      password: this.f['password'].value
    };

    this.authService.login(payload).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        if (res?.success && res?.token) {
          localStorage.setItem('token', res.token);
          alert('Login Successful');
          this.router.navigate(['/product-list']);
        }
      },
      error: (err) => {
        alert(err?.error?.message || 'Invalid credentials');
      }
    });

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}