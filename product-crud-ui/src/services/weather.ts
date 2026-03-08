import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WeatherData {
  location: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  current: {
    temperature: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    precipitation: number;
    cloud_cover: number;
    weather_code: number;
    weather_description: string;
    is_day: boolean;
  };
  units: any;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private baseUrl = "http://localhost:3024/api/weather";

  constructor(private http: HttpClient) { }

  getWeather(city: string = 'London'): Observable<any> {
    return this.http.get(`${this.baseUrl}/weather?city=${encodeURIComponent(city)}`);
  }
}
