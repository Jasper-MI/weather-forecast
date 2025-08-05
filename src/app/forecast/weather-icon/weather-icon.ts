import { Component, Input, numberAttribute } from '@angular/core';

@Component({
  selector: 'app-weather-icon',
  imports: [],
  templateUrl: './weather-icon.html',
  styleUrl: './weather-icon.css'
})
export class WeatherIcon {

  @Input() rainAmount: number | undefined;
  @Input() cloudCoverage: number | undefined;
  @Input() currentWindSpeed: number | undefined;


  get weatherIconClass(): string{

    if (
      typeof this.rainAmount === 'number' &&
      typeof this.cloudCoverage === 'number' &&
      typeof this.currentWindSpeed === 'number'
    ) {
      
      // set icon depending on the parameters
      if (this.rainAmount > 3) {
        return 'bi-cloud-drizzle-fill';
      } else if (this.currentWindSpeed > 50) {
        return 'bi-wind';
      } else if (this.cloudCoverage > 50) {
        return 'bi-clouds-fill';
      }

    } else {
        return 'bi-sun';
    }

    return 'bi-sun';
  }

}
