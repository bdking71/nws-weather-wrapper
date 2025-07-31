import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { NwsApi, PointsResponse, ForecastResponse } from '../src/index';

describe('NwsApi', () => {
    let mock: MockAdapter;
    const userAgent = 'test-app, test@example.com';

    // It's important to use a new mock for each test to prevent interference
    beforeEach(() => {
        // We are mocking the global axios instance. Because NwsApi uses axios.create() without
        // providing a custom adapter, it will use the same adapter as the global instance,
        // so our mock will intercept calls from the NwsApi instance.
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.restore();
    });

    it('should throw an error if no user agent is provided', () => {
        // Test that creating an instance with an empty user agent string throws an error.
        expect(() => new NwsApi('')).toThrow('A user agent is required to use the NWS API.');
    });

    it('should create an instance with a valid user agent', () => {
        // Test that a valid user agent does not throw an error.
        expect(() => new NwsApi(userAgent)).not.toThrow();
    });

    describe('getPoints', () => {
        it('should fetch gridpoint data for a given lat/lon', async () => {
            const lat = 39.7456;
            const lon = -97.0892;
            const mockData: PointsResponse = {
                properties: {
                    gridId: 'TOP',
                    gridX: 31,
                    gridY: 80,
                    forecast: 'https://api.weather.gov/gridpoints/TOP/31,80/forecast',
                    forecastHourly: 'https://api.weather.gov/gridpoints/TOP/31,80/forecast/hourly',
                    forecastGridData: 'https://api.weather.gov/gridpoints/TOP/31,80',
                    observationStations: 'https://api.weather.gov/gridpoints/TOP/31,80/stations',
                },
            };

            // Mock the GET request to the points endpoint
            mock.onGet(`https://api.weather.gov/points/${lat},${lon}`).reply(200, mockData);

            const api = new NwsApi(userAgent);
            const data = await api.getPoints(lat, lon);

            // Assert that the returned data matches the mock data
            expect(data).toEqual(mockData);
            // Assert that the correct URL was called
            // Note: axios-mock-adapter records the relative path when a baseURL is used.
            expect(mock.history.get[0].url).toBe(`/points/${lat},${lon}`);
        });
    });

    describe('getForecast', () => {
        it('should fetch forecast data for a given gridpoint', async () => {
            const office = 'TOP';
            const gridX = 31;
            const gridY = 80;
            const mockData: ForecastResponse = {
                properties: {
                    updated: '2023-06-20T14:57:00+00:00',
                    units: 'us',
                    forecastGenerator: 'ForecastOffice',
                    generatedAt: '2023-06-20T15:57:00+00:00',
                    updateTime: '2023-06-20T14:57:00+00:00',
                    validTimes: '2023-06-20T08:00:00+00:00/P7DT12H',
                    elevation: { value: 433.12, unitCode: 'unit:m' },
                    periods: [
                        {
                            number: 1,
                            name: 'This Afternoon',
                            startTime: '2023-06-20T13:00:00-05:00',
                            endTime: '2023-06-20T18:00:00-05:00',
                            isDaytime: true,
                            temperature: 82,
                            temperatureUnit: 'F',
                            temperatureTrend: null,
                            windSpeed: '10 to 15 mph',
                            windDirection: 'S',
                            icon: 'https://api.weather.gov/icons/land/day/sct?size=medium',
                            shortForecast: 'Mostly Sunny',
                            detailedForecast: 'Mostly sunny, with a high near 82.',
                        },
                    ],
                },
            };

            // Mock the GET request to the forecast endpoint
            mock.onGet(`https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast`).reply(200, mockData);

            const api = new NwsApi(userAgent);
            const data = await api.getForecast(office, gridX, gridY);

            // Assert that the returned data matches the mock data
            expect(data).toEqual(mockData);
            // Assert that the correct URL was called
            // Note: axios-mock-adapter records the relative path when a baseURL is used.
            expect(mock.history.get[0].url).toBe(`/gridpoints/${office}/${gridX},${gridY}/forecast`);
        });
    });
});
