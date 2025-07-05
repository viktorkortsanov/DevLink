import { Routes } from '@angular/router';
import { Main } from './main/main';
import { LoginComponent } from './user/login/login';
import { RegisterComponent } from './user/register/register';
import { ProfileComponent } from './user/profile/profile';
import { EditProfileComponent } from './user/edit-profile/edit-profile';
import { ProjectsContainerComponent } from './projects/projects';
import { CreateProjectComponent } from './projects/create-project/create-project';
import { ProjectDetailsComponent } from './projects/project-details/project-details';

export const routes: Routes = [
    { path: '', component: Main },
    { path: 'sign-in', component: LoginComponent },
    { path: 'sign-up', component: RegisterComponent },
    { path: 'profile/:userId', component: ProfileComponent },
    { path: 'edit-profile/:userId', component: EditProfileComponent },
    { path: 'projects', component: ProjectsContainerComponent },
    { path: 'create-project', component: CreateProjectComponent },
    { path: 'projects/:projectId/details', component: ProjectDetailsComponent },
];
