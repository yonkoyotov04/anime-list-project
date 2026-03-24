import { Component, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Auth } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class Header {
    constructor(private authService: Auth) {}

    isAuthenticated() {
        return this.authService.isAuthenticated();
    }

    logout() {
        this.authService.logout();
    }
}
