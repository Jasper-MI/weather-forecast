import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { WeatherDataService } from '../../service/weather-data-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-weather-chart',
  imports: [NgxChartsModule],
  templateUrl: './weather-chart.html',
  styleUrl: './weather-chart.css'
})
export class WeatherChart implements OnInit, OnDestroy {

  averageRainArray: number[] = [];
  temperatureData: any[] = [];
  rainData: any[] = [];
  private sub = new Subscription();

  yScaleMin: number = 0;
  yScaleMax: number = 0;

  constructor(private weatherDataService: WeatherDataService) { }

  ngOnInit() {
    // set temperature data
    this.sub.add(
      this.weatherDataService.temperatureData$.subscribe(data => {
        this.temperatureData = [
          {
            name: 'Temperature',
            series: data.map((value, i) => ({
              name: `Day ${i + 1}`,
              value
            }))
          }
        ]

        // fit y-Axis to the data provided
        this.yScaleMax = Math.max(...data) + 1;
        this.yScaleMin = Math.min(...data) - 1;
        console.log( this.temperatureData)
      })
    );
    
    // set rain data
    this.sub.add(
      this.weatherDataService.rainData$.subscribe(data => {
        this.rainData = data.map((value, index) => ({
            name: `Day ${index + 1}`,
            value: value
          }));

        console.log(this.rainData)
      })
    );
    
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
