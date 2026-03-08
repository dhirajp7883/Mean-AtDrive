import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.scss',
})

export class Register implements OnDestroy {

  registerForm!: FormGroup;
  submitted = false;
  fb = inject(FormBuilder);
  authService = inject(Auth);
  private destroy$ = new Subject<void>();
  private router = inject(Router);


  ngOnInit() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) return;

    const payload = {
      username: this.f['username'].value,
      password: this.f['password'].value
    };

    this.authService.register(payload).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        if (res?.success) {
          alert('Registration successful! Please login.');
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        alert(err?.error?.message || 'Registration failed');
      }
    });

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}