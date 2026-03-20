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

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    {path: 'catalogue', component: CatalogueComponent},
    {path: 'about', component: AboutComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'details', component: AnimeDetailsComponent},
    {path: 'list', component: MyListComponent},
    {path: 'create', component: AddAnimeComponent}
];
