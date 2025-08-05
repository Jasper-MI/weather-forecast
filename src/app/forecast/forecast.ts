import { Component } from '@angular/core';
import { fetchWeatherApi } from 'openmeteo';
import { WeatherDetails } from './weather-details/weather-details';
import { WeatherIcon } from './weather-icon/weather-icon';
import { WeatherTable } from './weather-table/weather-table';
import { WeatherChart } from './weather-chart/weather-chart';
import { WeatherDataService } from '../service/weather-data-service';
////

@Component({
  selector: 'app-forecast',
  imports: [WeatherDetails, WeatherIcon, WeatherTable, WeatherChart],
  templateUrl: './forecast.html',
  styleUrl: './forecast.css'
})
export class Forecast {

  currentTemperature: number = 0;
  rainAmount: number = 0;
  cloudCoverage: number = 0;
  currentWindSpeed: number = 0;
  averageTemperatureArray: number[] = [];
  averageRainArray: number[] = [];

  toastStyle = 'none'

  constructor(private weatherDataService: WeatherDataService) {
    this.fetchWeather()
  }

  // Call the API -> fetch weather data -> asign it to variables
  async fetchWeather() {
    const params = {
      "latitude": 52.52,
      "longitude": 13.41,
      "hourly": ["temperature_2m", "rain", "cloud_cover", "wind_speed_10m"],
      "timezone": "Europe/Berlin"
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    let responses: any[] = [];
    try {
      responses = await fetchWeatherApi(url, params);
    } catch (error) {
      this.toastStyle = 'block'
      console.log('Error while fetching Weather API: ' + error);
      throw new Error();
    }

    

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    const utcOffsetSeconds = response.utcOffsetSeconds();

    const hourly = response.hourly()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      hourly: {
        time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
          (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
        ),
        temperature_2m: hourly.variables(0)!.valuesArray(),
        rain: hourly.variables(1)!.valuesArray(),
        cloud_cover: hourly.variables(2)!.valuesArray(),
        wind_speed_10m: hourly.variables(3)!.valuesArray(),
      },
    };

    console.log("\nHourly data", weatherData.hourly)



    // get the array index by current datetime
    const datetime = new Date();
    datetime.setMinutes(0);
    datetime.setSeconds(0);
    datetime.setMilliseconds(0);
    // datetime.setHours(datetime.getHours() + 2) //remove !!!

    const datetimeTimestamp = datetime.getTime();

    const arrayIndex = weatherData.hourly.time.findIndex(
      (date: Date) => date.getTime() === datetimeTimestamp
    );


    // set variable values

    // asign currentTemperature
    if (weatherData.hourly.temperature_2m != null) {
      this.currentTemperature = Math.trunc(weatherData.hourly.temperature_2m[arrayIndex]);
      console.log("currentTemperature: " + this.currentTemperature);
    } else {
      throw new Error('Temperature data is null.');
    }

    // asign currentWindSpeed
    if (weatherData.hourly.wind_speed_10m != null) {
      this.currentWindSpeed = Math.trunc(weatherData.hourly.wind_speed_10m[arrayIndex]);
      console.log("currentWindSpeed: " + this.currentWindSpeed);
    } else {
      throw new Error('currentWindSpeed data is null.')
    }

    // asign rainAmount
    if (weatherData.hourly.rain != null) {
      this.rainAmount = Math.trunc(weatherData.hourly.rain[arrayIndex]);
      console.log("rainAmount: " + this.rainAmount)
    } else {
      throw new Error('rainAmount data is null.')
    }

    // asign cloudCoverage
    if (weatherData.hourly.cloud_cover != null) {
      this.cloudCoverage = Math.trunc(weatherData.hourly.cloud_cover[arrayIndex]);
      console.log("cloudCoverage: " + this.cloudCoverage)
    } else {
      throw new Error('cloudCoverage data is null.')
    }


    // asign both averageTemperatureArray and averageRainArray
    this.generateAverageWeatherArrays(weatherData.hourly.temperature_2m, weatherData.hourly.rain)

    // set the arrays in the weatherDataService
    this.weatherDataService.setTemperature(this.averageTemperatureArray);
    this.weatherDataService.setRain(this.averageRainArray);

  }


  generateAverageWeatherArrays(temperature_2m: Float32Array<ArrayBufferLike>, rain: Float32Array<ArrayBufferLike>) {

    if (temperature_2m != null && rain != null) {

      for (let i = 0; i < 7; i++) { //loop through the week
        var sumTemperature: number = 0;
        var sumRain: number = 0;

        for (let j = 0; j < 24; j++) { //loop through the days
          sumTemperature += temperature_2m[j + i * 24]; // current hour + passed days
          sumRain += rain[j + i * 24];
        }

        // set the values
        this.averageTemperatureArray[i] = Math.trunc( sumTemperature / 24 );
        this.averageRainArray[i] = (Math.trunc( (sumRain / 24) * 10 )) / 10;
        console.log("Avarage Temperature: " + this.averageTemperatureArray[i]);
      }
    }
  }

}
