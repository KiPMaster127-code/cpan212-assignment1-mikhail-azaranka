# City Weather API

City Weather API will provide you with a weather information in your city followed by a 3 day forecast. With the help of Open Meteo API to retrieve weather weather data and cache to prevent an unnecessary calls and return a summary in a JSON responses. 

## Run it

1. Clone the repository

   git clone https://github.com/KiPMaster127-code/cpan212-assignment1-mikhail-azaranka.git

2. Navigate to the directory

   cd cpan212-assignment1-mikhail-azaranka

3. Install Node.js modules, copy the environment variables to .env and run the project

   -npm install
   -cp .env.example .env
   -npm start

## Environment variables


| Variable | Value | Description |
|---|---|---|
| PORT | 4000 | Set port number for running the server |
| GEOCODING_URL | https://geocoding-api.open-meteo.com/v1 | URL for Open Meteo geocoding API |
| FORECAST_URL | https://api.open-meteo.com/v1 | URL for weather forecast API |
| UPSTREAM_TIMEOUT_MS | 5000 | Maximum time to wait for API response before timing out |
| CACHE_TTL_SECONDS | 600 | Creates a number of seconds that cached API has before its expiry |



## Endpoints

| Endpoint | Description |
|---|---|
| GET /api/weather?city=Toronto | The response will return the current weather and a 3 day forecast in Toronto |
| GET /api/compare?cities=Toronto,Vancouver,Halifax | The response will be comparing the weather between various cities |
| GET /api/cache/stats | The response will return weather cache that was being used |


## Data source

All this couldn't have been done without Open-Meteo API (https://open-meteo.com/)

## AI use

ChatGPT was used to assist in understanding the instructions for the assignment and helped me to understand the mistake I've made when writing fetchJson in open-meteo.js where I would get generic error instead of specific ones.
