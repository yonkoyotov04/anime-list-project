import { Routes } from '@angular/router';
import guestGuard from './core/guards/guestGuard';
import authGuard from './core/guards/authGuard';
import reviewGuard from './core/guards/reviewGuard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/home/home.component')
            .then(m => m.HomeComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./features/register/register.component')
            .then(m => m.RegisterComponent),
        canActivate: [guestGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./features/login/login.component')
            .then(m => m.LoginComponent),
        canActivate: [guestGuard]
    },
    {
        path: 'catalogue',
        loadComponent: () => import('./features/catalogue/catalogue.component')
            .then(m => m.CatalogueComponent)
    },
    {
        path: 'about',
        loadComponent: () => import('./features/about/about.component')
            .then(m => m.AboutComponent)
    },
    {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component')
            .then(m => m.ProfileComponent),
        canActivate: [authGuard]
    },
    {
        path: 'profile/edit',
        loadComponent: () => import('./features/edit-profile/edit-profile.component')
            .then(m => m.EditProfileComponent),
        canActivate: [authGuard]
    },
    {
        path: 'profile/edit/password',
        loadComponent: () => import('./features/change-password/change-password.component')
            .then(m => m.ChangePasswordComponent),
        canActivate: [authGuard]
    },
    {
        path: 'profile/:userId',
        loadComponent: () => import('./features/profile/profile.component')
            .then(m => m.ProfileComponent),
        canActivate: [authGuard]
    },
    {
        path: 'details/:animeId',
        loadComponent: () => import('./features/anime-details/anime-details.component')
            .then(m => m.AnimeDetailsComponent)
    },
    {
        path: 'list',
        loadComponent: () => import('./features/my-list/my-list.component')
            .then(m => m.MyListComponent),
        canActivate: [authGuard]
    },
    {
        path: 'list/:userId',
        loadComponent: () => import('./features/my-list/my-list.component')
            .then(m => m.MyListComponent),
        canActivate: [authGuard]
    },
    {
        path: 'create',
        loadComponent: () => import('./features/add-anime/add-anime.component')
            .then(m => m.AddAnimeComponent),
        canActivate: [authGuard]
    },
    {
        path: 'edit/anime/:animeId',
        loadComponent: () => import('./features/add-anime/add-anime.component')
            .then(m => m.AddAnimeComponent),
        canActivate: [authGuard]
    },
    {
        path: 'review/:animeId',
        loadComponent: () => import('./features/add-review/add-review.component')
            .then(m => m.AddReviewComponent),
        canActivate: [authGuard, reviewGuard]
    },
    {
        path: 'edit/review/:reviewId',
        loadComponent: () => import('./features/add-review/add-review.component')
            .then(m => m.AddReviewComponent),
        canActivate: [authGuard]
    },
    {
        path: '**',
        loadComponent: () => import('./features/not-found/not-found.component')
            .then(m => m.NotFoundComponent)
    }
];
