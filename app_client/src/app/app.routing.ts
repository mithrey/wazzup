import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { NoteComponent } from './note';
import { NoteUpdateComponent } from './noteUpdate';
import { NoteSharingComponent } from './noteSharing';
import { AuthGuard } from './_helpers';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'note', component: NoteComponent },
    { path: 'update/:id', component: NoteUpdateComponent },
    { path: 'r/:path', component: NoteSharingComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);