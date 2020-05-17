import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RpiComponent } from './rpi/rpi.component';
import { TournamentComponent } from './tournament/tournament.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'raspberry-pi', component: RpiComponent },
  { path: 'tournament', component: TournamentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
