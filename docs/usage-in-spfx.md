# Using nws-api-wrapper in SharePoint Framework (SPFx)

This guide explains how to use the `nws-api-wrapper` in a SharePoint Framework (SPFx) project.

## Installation

To use this library in your SPFx solution, you first need to add it as a dependency.

```bash
npm install nws-api-wrapper --save
```

## A Note on HTTP Clients in SPFx

SharePoint Framework provides its own `SPHttpClient` for making HTTP requests. This is the recommended way to make calls in SPFx, as it's already authenticated with SharePoint and handles potential cross-domain issues.

However, `nws-api-wrapper` uses `axios` under the hood. In many environments, making external anonymous web requests from SPFx using `axios` will work without issue. If you encounter any problems, particularly with authentication or blocked requests, you may need to use SPFx's `AadHttpClient` to call a proxy service (like an Azure Function) that then calls the NWS API. This is a more advanced topic beyond the scope of this documentation.

For standard, anonymous calls to the NWS API, using this library directly should be sufficient.

## Usage

1.  **Import the `NwsApi` class** into your SPFx web part or extension.

    ```typescript
    import { NwsApi, PointsResponse, ForecastResponse } from 'nws-api-wrapper';
    ```

2.  **Instantiate the `NwsApi` class.** You need to provide a User-Agent string, as required by the NWS API. This can be anything that identifies your application.

    ```typescript
    // In your web part's onInit() method or a service class
    const nwsApi = new NwsApi('MyWeatherWebPart/1.0 (my-tenant.sharepoint.com)');
    ```

3.  **Get the forecast.** The process involves two steps:
    a.  Get the grid points for a specific latitude and longitude.
    b.  Use the grid points to get the actual forecast.

    ```typescript
    public async getWeatherData(latitude: number, longitude: number): Promise<void> {
      try {
        // Step 1: Get the grid points
        const points: PointsResponse = await this.nwsApi.getPoints(latitude, longitude);
        const { gridId, gridX, gridY } = points.properties;

        // Step 2: Get the forecast
        const forecast: ForecastResponse = await this.nwsApi.getForecast(gridId, gridX, gridY);

        // Now you can use the forecast data
        console.log(forecast.properties.periods);

        // You can now use this data to render the weather in your web part.
        // For example, binding it to a React component's state.

      } catch (error) {
        console.error("Failed to get weather data", error);
      }
    }
    ```

## Example: A Simple Weather Web Part

Here's a conceptual example of how you might use this in a React-based SPFx web part.

```typescript
// MyWeatherWebPart.ts

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'MyWeatherWebPartStrings';
import MyWeather from './components/MyWeather';
import { IMyWeatherProps } from './components/IMyWeatherProps';
import { NwsApi, ForecastResponse } from 'nws-api-wrapper';

export interface IMyWeatherWebPartProps {
  latitude: number;
  longitude: number;
}

export default class MyWeatherWebPart extends BaseClientSideWebPart<IMyWeatherWebPartProps> {

  private nwsApi: NwsApi;

  protected onInit(): Promise<void> {
    this.nwsApi = new NwsApi('MyWeatherWebPart/1.0 (me@my-tenant.com)');
    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IMyWeatherProps> = React.createElement(
      MyWeather,
      {
        nwsApi: this.nwsApi,
        latitude: this.properties.latitude,
        longitude: this.properties.longitude
      }
    );

    ReactDom.render(element, this.domElement);
  }

  // ... other web part methods
}
```

```typescript
// components/MyWeather.tsx

// ... (React component imports)

export default class MyWeather extends React.Component<IMyWeatherProps, IMyWeatherState> {

  constructor(props: IMyWeatherProps) {
    super(props);
    this.state = {
      forecast: null,
      loading: true,
    };
  }

  public componentDidMount(): void {
    this.loadWeatherData();
  }

  private async loadWeatherData(): Promise<void> {
    try {
      const points = await this.props.nwsApi.getPoints(this.props.latitude, this.props.longitude);
      const forecast = await this.props.nwsApi.getForecast(
        points.properties.gridId,
        points.properties.gridX,
        points.properties.gridY
      );
      this.setState({ forecast: forecast.properties.periods, loading: false });
    } catch (error) {
      console.error(error);
      this.setState({ loading: false });
    }
  }

  public render(): React.ReactElement<IMyWeatherProps> {
    // ... Render your weather data here
    return (
      <div>
        {this.state.loading ? <p>Loading...</p> :
          <ul>
            {this.state.forecast.map(period => (
              <li key={period.number}>{period.name}: {period.detailedForecast}</li>
            ))}
          </ul>
        }
      </div>
    );
  }
}
```
