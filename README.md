# NWS Weather Wrapper

A simple TypeScript wrapper for the National Weather Service (NWS) API.

## Description

This library provides a convenient way to interact with the NWS API to retrieve weather forecasts. It handles the API endpoints for getting grid data from latitude and longitude, and then fetching the forecast for that grid.

## Version

  2025.0731.1446 Alpha (Untested / Not Ready for Production)

## Features

-   Simple, promise-based API.
-   Typed interfaces for API responses.
-   Lightweight, with `axios` as the only dependency.

## Installation

```bash
npm install @bdking71/nws-weather-wrapper
```

## Quick Start

Here's a basic example of how to use the library:

```typescript
// Import necessary types and the NWS API wrapper class from the 'nws-api-wrapper' package
import { ForecastResponse, PointsResponse, NwsWeatherWrapper } from 'nws-api-wrapper';

// Define a user agent string, which is **required by NWS API** per their usage policy
// Replace 'my-contact-email@example.com' with your actual email or website
const userAgent = 'My Weather App, my-contact-email@example.com';

// Create an instance of the NWS API wrapper using your user agent
const nwsAPI = new NwsWeatherWrapper(userAgent);

// Define the coordinates for which you want to retrieve the forecast
const latitude: string | undefined = '39.7456';
const longitude: string | undefined = '-97.0892';

// Define an asynchronous function that fetches the forecast for a single location
const fetchSingleForecastFromNWS = async (): Promise<ForecastResponse> => {
  // Ensure both latitude and longitude are defined before continuing
  if (!latitude || !longitude) {
    throw new Error('Latitude and longitude are required.');
  }

  // Step 1: Use the NWS API to get the "gridpoint" information for this location
  // This provides the grid ID and coordinates (gridX, gridY) for the forecast query
  const points: PointsResponse = await nwsAPI.getPoints(latitude, longitude);

  // Step 2: Use the gridpoint data to get the full forecast from the NWS API
  const forecast: ForecastResponse = await nwsAPI.getForecast(
    points.properties.gridId,
    points.properties.gridX,
    points.properties.gridY
  );

  // Step 3: Return the full forecast object to the caller
  return forecast;
};

// Call the function and handle the result using .then()/.catch()
// This is your app's entry point for outputting the forecast
fetchSingleForecastFromNWS()
  .then((forecast) => {
    // Log the timestamp of the forecast update
    console.log(`Forecast for ${forecast.properties.updated}:`);

    // Loop through each forecast period (e.g., Today, Tonight, Tomorrow) and log its details
    forecast.properties.periods.forEach((period) => {
      console.log(`${period.name}: ${period.detailedForecast}`);
    });
  })
  .catch((error) => {
    // If anything goes wrong (bad coordinates, network issue, API error), log it here
    console.error('Failed to fetch forecast:', error);
  });
```


## Documentation

For more detailed documentation, please see the following files:

-   **[Usage in SPFx](./docs/usage-in-spfx.md):** A guide for using this library in SharePoint Framework (SPFx) projects.
-   **[Testing](./docs/testing.md):** Instructions on how to run the tests for this project.

## License

This project is licensed under the MIT License.
