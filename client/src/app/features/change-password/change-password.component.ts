import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
    private formBuilder = inject(FormBuilder);
    private router = inject(Router);

    constructor(private authService: Auth) {}

    changePasswordForm = this.formBuilder.group({
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern((/^[a-zA-Z0-9]+$/))]],
        reNewPassword: ['', [Validators.required]]
    })

    get newPasswordControl() {
        return this.changePasswordForm.get('newPassword');
    }

    get reNewPasswordControl() {
        return this.changePasswordForm.get('reNewPassword');
    }

    onSubmit() {
        if (this.changePasswordForm.invalid) {
            this.changePasswordForm.markAllAsTouched();
            return
        }

        this.authService.changePassword({...this.changePasswordForm.value}).subscribe({
            next: () => {
                this.router.navigateByUrl('/profile');
            },

            error: (error) => {
                console.error(error);
            }
        })

    }

    cancel() {
        this.router.navigateByUrl('/profile');
    }
}
