import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { Auth } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { Notif } from '../../core/services/notif.service';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent {
    formBuilder = inject(FormBuilder);

    constructor(private authService: Auth, private notifService: Notif, private router: Router) { }

    loginForm = this.formBuilder.group({
        email: ['', [Validators.required]],
        password: ['', [Validators.required]]
    })

    get emailControl() {
        return this.loginForm.get('email');
    }

    get passwordControl() {
        return this.loginForm.get('password');
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.authService.login({ ...this.loginForm.value }).subscribe({
            next: (user) => {
                this.authService.setUser(user);
                this.notifService.setSuccessMessage('Succesfully logged in!')
                this.router.navigateByUrl('/');
            },

            error: (error) => {
                const errorMessage = error.error?.message;
                this.notifService.setErrorMessage(errorMessage);
            }
        })
    }

    cancel(): void {
        this.router.navigateByUrl('/');
    }
}
