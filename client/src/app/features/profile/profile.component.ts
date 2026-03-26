import { Component, OnInit, signal } from '@angular/core';
import { Auth } from '../../core/services/auth.service';
import { User } from '../../shared/interfaces/user';
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-profile',
    imports: [RouterLink],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
    user = signal<User|null>(null)

    constructor(private authService: Auth) {}

    ngOnInit(): void {
        this.authService.getUserData(this.authService.user()._id).subscribe((userData) => {
            this.user.set(userData);
        })
    }
    
}
