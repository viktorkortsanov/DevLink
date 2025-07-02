import { Routes } from '@angular/router';
import { Main } from './main/main';
import { AuthComponent } from './user/auth/auth';

export const routes: Routes = [
    { path: '', component: Main },
    { path: 'sign-up', component: AuthComponent}
];
