import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RpiComponent } from './rpi/rpi.component';
import { TournamentComponent } from './tournament/tournament.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'raspberry-pi', component: RpiComponent },
  { path: 'tournament', component: TournamentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
