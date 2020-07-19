import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TournamentComponent } from './tournament.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: 'tournament', component: TournamentComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentRoutingModule { }
