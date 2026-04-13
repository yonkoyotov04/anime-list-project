import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { Auth } from '../../core/services/auth.service';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { Notif } from '../../core/services/notif.service';

@Component({
    selector: 'app-header',
    imports: [RouterLink, ErrorMessageComponent],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
})
export class Header implements OnInit {
    private notifService = inject(Notif);

    notification = this.notifService.notification;

    // userData = signal<any>(null)

    constructor(private authService: Auth, private router: Router) { }

    ngOnInit(): void {
        // this.userData.set({ username: this.authService.user().username, profilePic: this.authService.user().profilePic });
    }

    isAuthenticated(): any {
        return this.authService.isAuthenticated();
    }

    userAvatar(): any {
        return { username: this.authService.user().username, profilePic: this.authService.user().profilePic }
    }

    logout() {
        this.authService.logout().subscribe({
            next: () => {
                this.authService.afterLogout();
                // this.userData.set(null);
                this.router.navigateByUrl('/');
            }
        });

    }
}
