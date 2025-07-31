import axios, { AxiosInstance } from 'axios';

// Note: These interfaces are based on the NWS API documentation.
// They may need to be expanded with more properties based on actual API responses.

/**
 * Represents the response from the /points endpoint.
 * It contains the grid information needed to fetch a forecast.
 */
export interface PointsResponse {
    properties: {
        gridId: string;
        gridX: number;
        gridY: number;
        forecast: string; // URL to the forecast endpoint
        forecastHourly: string; // URL to the hourly forecast endpoint
        forecastGridData: string;
        observationStations: string;
    };
}

/**
 * Represents a single forecast period in a forecast response.
 */
export interface ForecastPeriod {
    number: number;
    name: string;
    startTime: string;
    endTime: string;
    isDaytime: boolean;
    temperature: number;
    temperatureUnit: string;
    temperatureTrend: string | null;
    windSpeed: string;
    windDirection: string;
    icon: string;
    shortForecast: string;
    detailedForecast: string;
}

/**
 * Represents the response from the forecast endpoint.
 */
export interface ForecastResponse {
    properties: {
        updated: string;
        units: string;
        forecastGenerator: string;
        generatedAt: string;
        updateTime: string;
        validTimes: string;
        elevation: {
            value: number;
            unitCode: string;
        };
        periods: ForecastPeriod[];
    };
}

/**
 * A client for the National Weather Service (NWS) API.
 */
export class NwsWeatherWrapper {
    private readonly axiosInstance: AxiosInstance;

    /**
     * Creates a new NwsApi client.
     * @param userAgent A unique user agent string to identify your application.
     *                  The NWS API requires this. (e.g., "my-weather-app, contact@example.com")
     */
    constructor(userAgent: string) {
        if (!userAgent) {
            throw new Error('A user agent is required to use the NWS API.');
        }

        this.axiosInstance = axios.create({
            baseURL: 'https://api.weather.gov',
            headers: {
                'User-Agent': userAgent,
                'Accept': 'application/geo+json' // Per documentation, GeoJSON is a common format
            }
        });
    }

    /**
     * Retrieves gridpoint information for a given latitude and longitude.
     * This is the first step to getting a forecast.
     * @param latitude The latitude.
     * @param longitude The longitude.
     * @returns A promise that resolves to the points response.
     */
    public async getPoints(latitude: string, longitude: string): Promise<PointsResponse> {
        const response = await this.axiosInstance.get<PointsResponse>(`/points/${latitude},${longitude}`);
        return response.data;
    }

    /**
     * Retrieves the forecast for a given gridpoint.
     * You should first call getPoints() to get the grid office and coordinates.
     * @param office The grid office (e.g., "TOP").
     * @param gridX The grid X coordinate.
     * @param gridY The grid Y coordinate.
     * @returns A promise that resolves to the forecast response.
     */
    public async getForecast(office: string, gridX: number, gridY: number): Promise<ForecastResponse> {
        const response = await this.axiosInstance.get<ForecastResponse>(`/gridpoints/${office}/${gridX},${gridY}/forecast`);
        return response.data;
    }
}
