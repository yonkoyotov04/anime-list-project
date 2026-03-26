import { Routes } from '@angular/router';
import { RegisterComponent } from './features/register/register.component';
import { LoginComponent } from './features/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { CatalogueComponent } from './features/catalogue/catalogue.component';
import { AboutComponent } from './features/about/about.component';
import { ProfileComponent } from './features/profile/profile.component';
import { AnimeDetailsComponent } from './features/anime-details/anime-details.component';
import { MyListComponent } from './features/my-list/my-list.component';
import { AddAnimeComponent } from './features/add-anime/add-anime.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { authGuard, guestGuard } from './core/guards/routeGuard';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'register', component: RegisterComponent, canActivate: [guestGuard]},
    {path: 'login', component: LoginComponent, canActivate: [guestGuard]},
    {path: 'catalogue', component: CatalogueComponent},
    {path: 'about', component: AboutComponent},
    {path: 'profile', component: ProfileComponent, canActivate: [authGuard]},
    {path: 'details/:animeId', component: AnimeDetailsComponent},
    {path: 'list', component: MyListComponent, canActivate: [authGuard]},
    {path: 'create', component: AddAnimeComponent, canActivate: [authGuard]},
    {path: '**', component: NotFoundComponent}
];
