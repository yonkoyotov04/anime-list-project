import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Auth } from '../../core/services/auth.service';

@Component({
  selector: 'app-catalogue',
  imports: [RouterLink],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.css',
})
export class CatalogueComponent implements OnInit {
  constructor(private authService: Auth) {}

  ngOnInit(): void {
    console.log(this.authService.user());
  }
}
