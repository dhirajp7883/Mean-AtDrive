import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather';
import { Subject, takeUntil } from 'rxjs';


@Component({
    selector: 'app-dashboard',
    standalone: false,
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, OnDestroy {

    weatherService = inject(WeatherService);
    private destroy$ = new Subject<void>();
    cd = inject(ChangeDetectorRef);

    weatherData: any = null;
    loading = false;
    error = '';
    searchCity = 'Mumbai';

    ngOnInit() {
        this.loadWeather();
    }

    loadWeather() {
        this.loading = true;
        this.error = '';

        this.weatherService.getWeather(this.searchCity)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    this.weatherData = res?.data || null;
                    this.loading = false;
                    this.cd.detectChanges();
                },
                error: (err) => {
                    this.error = err?.error?.message || 'Failed to load weather data';
                    this.loading = false;
                    this.weatherData = null;
                    this.cd.detectChanges();
                }
            });
    }

    onSearch() {
        if (this.searchCity.trim()) {
            this.loadWeather();
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
