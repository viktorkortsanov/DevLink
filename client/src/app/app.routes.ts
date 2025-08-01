import { Routes } from '@angular/router';
import { Main } from './main/main';
import { LoginComponent } from './user/login/login';
import { RegisterComponent } from './user/register/register';
import { ProfileComponent } from './user/profile/profile';
import { EditProfileComponent } from './user/edit-profile/edit-profile';
import { ProjectsContainerComponent } from './projects/projects';
import { CreateProjectComponent } from './projects/create-project/create-project';
import { ProjectDetailsComponent } from './projects/project-details/project-details';
import { EditProjectComponent } from './projects/edit-project/edit-project';
import { UserInfoComponent } from './user/user-info/user-info';
import { DevelopersContainerComponent } from './developers-container/developers-container';
import { ReviewFormComponent } from './developers-container/review-form/review-form';
import { AdminPanelComponent } from './admin-panel/admin-panel';
import { EditUserComponent } from './admin-panel/edit-user/edit-user';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service';
import { ContactsComponent } from './contact-us/contact-us';
import { MentorshipComponent } from './mentors/mentors';

export const routes: Routes = [
    { path: '', component: Main },
    { path: 'sign-in', component: LoginComponent },
    { path: 'sign-up', component: RegisterComponent },
    { path: 'profile/:userId', component: ProfileComponent },
    { path: 'profile/:userId/info', component: UserInfoComponent },
    { path: 'edit-profile/:userId', component: EditProfileComponent },
    { path: 'projects', component: ProjectsContainerComponent },
    { path: 'create-project', component: CreateProjectComponent },
    { path: 'projects/:projectId/details', component: ProjectDetailsComponent },
    { path: 'projects/:projectId/edit', component: EditProjectComponent },
    { path: 'developers', component: DevelopersContainerComponent },
    { path: 'developers/:userId/review', component: ReviewFormComponent },
    { path: 'adminpanel', component: AdminPanelComponent },
    { path: 'adminpanel/:userId/edit-user', component: EditUserComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
    { path: 'terms-of-service', component: TermsOfServiceComponent },
    { path: 'contact-us', component: ContactsComponent },
    { path: 'mentors', component: MentorshipComponent },
];
