import { Component, Input } from '@angular/core';
import { NgxChartsModule } from "@swimlane/ngx-charts";

@Component({
  selector: 'app-weather-table',
  imports: [NgxChartsModule],
  templateUrl: './weather-table.html',
  styleUrl: './weather-table.css'
})
export class WeatherTable {

  @Input() averageTemperatureArray: any [] = [];
  @Input() averageRainArray: any[] = [];

}
