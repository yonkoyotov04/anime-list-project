import { Component, OnInit, signal } from '@angular/core';
import { Auth } from '../../core/services/auth.service';
import { User } from '../../shared/interfaces/user';
import { Router, RouterLink } from "@angular/router";
import { DeletePromptComponent } from '../../shared/components/delete-prompt/delete-prompt.component';

@Component({
    selector: 'app-profile',
    imports: [RouterLink, DeletePromptComponent],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
    user = signal<User|null>(null);
    deleteBox = signal<boolean>(false);

    constructor(private authService: Auth, private router: Router) {}

    ngOnInit(): void {
        this.authService.getUserData(this.authService.user()._id).subscribe((userData) => {
            this.user.set(userData);
            console.log(userData);
        })
    }

    showDeleteBox() {
        this.deleteBox.set(true);
    }

    hideDeleteBox() {
        this.deleteBox.set(false);
    }

    delete(userId: string) {
        this.authService.deleteUser(userId).subscribe(() => {
            this.authService.logout();
            this.router.navigateByUrl('/');
        });
    }
    
}
