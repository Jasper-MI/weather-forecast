import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WeatherDataService {

  private temperatureSubject = new BehaviorSubject<number[]>([]);
  private rainSubject = new BehaviorSubject<number[]>([]);

  temperatureData$ = this.temperatureSubject.asObservable();
  rainData$ = this.rainSubject.asObservable();

  setTemperature(data: number[]) {
    this.temperatureSubject.next(data);
  }

  setRain(data: number[]) {
    this.rainSubject.next(data);
  }
}