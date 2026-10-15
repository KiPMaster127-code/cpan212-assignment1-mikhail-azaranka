import { config } from '../config.js';
import { geocodeCity, getForecast } from './open-meteo.js';
import { describeWeatherCode } from './weather-codes.js';

// TODO (you): create one cache for the whole app, with a time to live of
// config.cacheTtlSeconds.

const cache = new Map(); 
let hits = 0;
let misses = 0;

function isStillGood(entry) {
  const age = (Date.now() - entry.savedAt) / 1000; 
  return age < config.cacheTtlSeconds;
}

// TODO (you): return the weather summary for one city, in the shape shown on
// the assignment page. Check the cache first. On a miss, geocode the city, get
// the forecast, build the summary, store it, and return it with cached: false.
// On a hit, return the stored summary with cached: true.

function makeSummary(geo, forecast) {
  const current = forecast.current_weather;
  const daily = forecast.daily;

  return {
    location: {
      name: geo.name,
      region: geo.region,
      country: geo.country,
      latitude: geo.latitude,
      longitude: geo.longitude,
      timezone: geo.timezone
    },

    current: {
      time: current.time,
      temperatureC: current.temperature,
      feelsLikeC: null, 
      humidityPercent: null, 
      windKmh: current.windspeed,
      weatherCode: current.weathercode,
      conditions: describeWeatherCode(current.weathercode)
    },

    daily: daily.time.map((date, i) => {
      return {
        date: date,
        minC: daily.temperature_2m_min[i],
        maxC: daily.temperature_2m_max[i],
        precipitationChancePercent: daily.precipitation_probability_max[i] ?? null,
        weatherCode: daily.weather_code[i],
        conditions: describeWeatherCode(daily.weather_code[i])
      };
    }),

    fetchedAt: new Date().toISOString(),
    cached: false
  };
}

export async function getCityWeather(city) {
  const key = city.toLowerCase();


  const entry = cache.get(key);
  if (entry && isStillGood(entry)) {
    hits++;
    return { ...entry.summary, cached: true };
  }


  misses++;


  const geo = await geocodeCity(city);
  const forecast = await getForecast(geo.latitude, geo.longitude);
  const summary = makeSummary(geo, forecast);


  cache.set(key, {
    summary: summary,
    savedAt: Date.now()
  });

 
  return summary;
}

// TODO (you): return the cache statistics for GET /api/cache/stats.
export function getCacheStats() {
  let active = 0;

  for (const entry of cache.values()) {
    if (isStillGood(entry)) {
      active++;
    }
  }

  return {
    entries: active,
    hits: hits,
    misses: misses,
    ttlSeconds: config.cacheTtlSeconds
  };
}
