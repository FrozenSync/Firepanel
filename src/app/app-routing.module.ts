import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RpiComponent } from './rpi/rpi.component';
import { TournamentComponent } from './tournament/tournament.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';


const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'raspberry-pi', component: RpiComponent, canActivate: [AuthGuard] },
  { path: 'tournament', component: TournamentComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
