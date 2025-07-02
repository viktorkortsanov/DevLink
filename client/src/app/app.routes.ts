import { Routes } from '@angular/router';
import { Main } from './main/main';
import { LoginComponent } from './user/login/login';
import { RegisterComponent } from './user/register/register';

export const routes: Routes = [
    { path: '', component: Main },
    { path: 'sign-in', component: LoginComponent },
    { path: 'sign-up', component: RegisterComponent }
];
