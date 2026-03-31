import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-edit-profile',
    imports: [ReactiveFormsModule],
    templateUrl: './edit-profile.component.html',
    styleUrl: './edit-profile.component.css',
})
export class EditProfileComponent implements OnInit{
    private formBuilder = inject(FormBuilder);

    constructor(private authService: Auth, private router: Router) { }

    editForm = this.formBuilder.group({
        username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
        profilePic: ['', [Validators.pattern((/^https?:\/\//))]],
        bio: ['']
    })

    get usernameControl() {
        return this.editForm.get('username');
    }

    get profilePicControl() {
        return this.editForm.get('profilePic');
    }

    get bioControl() {
        return this.editForm.get('bio');
    }

    ngOnInit(): void {
        this.authService.getUserData().subscribe((user) => {
            const data = {username: user.username, profilePic: user.profilePic, bio: user.bio};
            this.editForm.patchValue(data);
        })
        
    }

    edit() {
        if (this.editForm.invalid) {
            this.editForm.markAllAsTouched();
            return;
        }

        this.authService.editUser({...this.editForm.value}).subscribe({
            next: (user) => {
                const token = this.authService.getToken();
                this.authService.setUser({accessToken: token, ...user});
                this.router.navigateByUrl('/profile');
            },

            error: (error) => {
                console.error(error);
            }
        })
    }
}
