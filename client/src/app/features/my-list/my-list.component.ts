import { Component, OnInit, signal } from '@angular/core';
import { Api } from '../../core/services/api.service';
import { Auth } from '../../core/services/auth.service';

@Component({
    selector: 'app-my-list',
    imports: [],
    templateUrl: './my-list.component.html',
    styleUrl: './my-list.component.css',
})
export class MyListComponent implements OnInit {

    constructor(private apiService: Api, private authService: Auth) {}

    ngOnInit(): void {
        
    }

}
