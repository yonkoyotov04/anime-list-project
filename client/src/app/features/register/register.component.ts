import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Auth } from '../../core/services/auth.service';

@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
})
export class RegisterComponent {
    private formBuilder = inject(FormBuilder);

    constructor(private authService: Auth) {}

    registerForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(30)]],
        username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern((/^[a-zA-Z0-9]+$/))]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
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
        console.log('SUBMIT ENTERED');
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        this.authService.register({...this.registerForm.value}).subscribe({
            next: (user) => {
                console.log('NEXT ENTERED');
                this.authService.setUser(user);
            },

            error: (error) => {
                console.error(error);
            }
        })
    }
}
