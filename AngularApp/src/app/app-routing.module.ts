import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [{
	path: '',
	redirectTo: '/pages/authentication',
	pathMatch: 'full'
}, {
	path: 'pages',
	loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
}, {
	path: '**',
	redirectTo: '/pages/authentication'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
