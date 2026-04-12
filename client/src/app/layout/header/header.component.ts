import { Component, inject, signal } from '@angular/core';
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
export class Header {
    private notifService = inject(Notif);

    notification = this.notifService.notification;

    constructor(private authService: Auth, private router: Router) { }

    isAuthenticated() {
        return this.authService.isAuthenticated();
    }

    logout() {
        this.authService.logout().subscribe({
            next: () => {
                this.authService.afterLogout();
                this.router.navigateByUrl('/');
            }
        });

    }
}
