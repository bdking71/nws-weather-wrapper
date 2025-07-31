# Testing

This document outlines how to run the tests for the `nws-api-wrapper` project.

## Prerequisites

Before you can run the tests, you need to have Node.js and npm installed. You also need to install the project's dependencies.

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/nws-api-wrapper.git
    cd nws-api-wrapper
    ```

2.  **Install dependencies:**

    Install all the necessary development dependencies from `package.json`.

    ```bash
    npm install
    ```

## Running Tests

The project uses [Jest](https://jestjs.io/) for testing. The tests are located in the `tests/` directory.

To run the entire test suite, use the following command:

```bash
npm test
```

This will execute all files in the `tests/` directory that end with `.test.ts`. The results will be displayed in your terminal.

## Test Structure

The tests use `axios-mock-adapter` to mock the HTTP requests to the NWS API. This allows for testing the library's functionality without making actual network calls, which makes the tests faster and more reliable.

Each test suite generally follows this structure:

1.  **Setup:** A `beforeEach` block creates a new `MockAdapter` instance to ensure tests are isolated.
2.  **Mocking:** The `mock.onGet()` method is used to define a mock response for a specific API endpoint.
3.  **Execution:** The `NwsApi` method is called.
4.  **Assertion:** `expect()` is used to assert that the method returns the expected data and that the correct API endpoint was called.
5.  **Cleanup:** An `afterEach` block restores the original `axios` adapter.
