import { NgModule } from '@angular/core';

import {AuthGuardService as AuthGuard} from './../services/auth-guard/auth-guard.service';

import { PagesComponent } from './pages.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
	path: '',
	component: PagesComponent,
	children: [{
		path: '',
		redirectTo: 'authentication',
		pathMatch: 'full'
	}, {
		path: 'authentication',
		loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule),

	}, {
		path: 'home',
		loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
		canActivate: [AuthGuard]
	},
	 {
		path: '**',
		redirectTo: 'home'
	}]
}];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PagesRoutingModule { }
