import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Auth } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
})
export class RegisterComponent {
    private formBuilder = inject(FormBuilder);

    constructor(private authService: Auth, private router: Router) {}

    registerForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(30)]],
        username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern((/^[a-zA-Z0-9]+$/))]],
        rePassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
        profilePic: ['', [Validators.pattern((/^https?:\/\//))]],
        bio: [''],
    })

    get emailControl() {
        return this.registerForm.get('email');
    }

    get usernameControl() {
        return this.registerForm.get('username');
    }

    get passwordControl() {
        return this.registerForm.get('password');
    }

    get rePasswordControl() {
        return this.registerForm.get('rePassword');
    }

    get profilePicControl() {
        return this.registerForm.get('profilePic');
    }

    get bioControl() {
        return this.registerForm.get('bio');
    }

    onSubmit(): void {
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        this.authService.register({...this.registerForm.value}).subscribe({
            next: (user) => {
                this.authService.setUser(user);
                this.router.navigateByUrl('/');
            },

            error: (error) => {
                console.error(error);
            }
        })
    }

    cancel(): void {
        this.router.navigateByUrl('/');
    }
}
