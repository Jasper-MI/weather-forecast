import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-weather-details',
  imports: [],
  templateUrl: './weather-details.html',
  styleUrl: './weather-details.css'
})
export class WeatherDetails {

  @Input() currentTemperature: number | undefined;
  @Input() currentWindSpeed: number | undefined;

  date = new Date().toDateString();
  

}
