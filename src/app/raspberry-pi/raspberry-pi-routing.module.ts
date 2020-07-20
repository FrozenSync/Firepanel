import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { RaspberryPiComponent } from './raspberry-pi.component';

const routes: Routes = [
  { path: 'raspberry-pi', component: RaspberryPiComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RaspberryPiRoutingModule { }
