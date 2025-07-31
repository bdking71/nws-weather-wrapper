# NWS API Wrapper

A simple TypeScript wrapper for the National Weather Service (NWS) API.

## Description

This library provides a convenient way to interact with the NWS API to retrieve weather forecasts. It handles the API endpoints for getting grid data from latitude and longitude, and then fetching the forecast for that grid.

## Version

  2025.0731.1037 Alpha (Untested / Not Ready for Production)

## Features

-   Simple, promise-based API.
-   Typed interfaces for API responses.
-   Lightweight, with `axios` as the only dependency.

## Installation

```bash
npm install nws-api-wrapper --save
```

## Quick Start

Here's a basic example of how to use the library:

```typescript
import { NwsApi } from 'nws-api-wrapper';

// You must provide a User-Agent, as required by the NWS API.
// See the NWS API documentation for more details.
const userAgent = 'My Weather App, my-contact-email@example.com';
const api = new NwsApi(userAgent);

// Latitude and longitude for a location (e.g., somewhere in Kansas)
const latitude = 39.7456;
const longitude = -97.0892;

async function getForecast() {
  try {
    // 1. Get the gridpoint information
    const points = await api.getPoints(latitude, longitude);
    const { gridId, gridX, gridY } = points.properties;

    // 2. Get the forecast for the gridpoint
    const forecast = await api.getForecast(gridId, gridX, gridY);

    // 3. Log the forecast periods
    forecast.properties.periods.forEach(period => {
      console.log(`${period.name}: ${period.detailedForecast}`);
    });

  } catch (error) {
    console.error('Failed to fetch weather data:', error);
  }
}

getForecast();
```

## Documentation

For more detailed documentation, please see the following files:

-   **[Usage in SPFx](./docs/usage-in-spfx.md):** A guide for using this library in SharePoint Framework (SPFx) projects.
-   **[Testing](./docs/testing.md):** Instructions on how to run the tests for this project.

## License

This project is licensed under the MIT License.
