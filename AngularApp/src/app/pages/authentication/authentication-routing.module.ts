import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationComponent } from './authentication.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';

const routes: Routes = [{
	path: '',
	component: AuthenticationComponent
},{
	path:'admin',component:AdminPanelComponent
},
{
	path: '**',
	redirectTo: '',
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
