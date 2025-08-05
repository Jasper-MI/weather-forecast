import { Routes } from '@angular/router';
import { StartComponent } from './start-component/start-component';
import { Forecast } from './forecast/forecast';

export const routes: Routes = [
    {path: '', component: StartComponent},
    {path: 'forecast', component: Forecast}
];
