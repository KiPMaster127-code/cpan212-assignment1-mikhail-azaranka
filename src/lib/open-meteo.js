import { config } from '../config.js';
import { HttpError } from './http-error.js';

// This is the only file that calls fetch or knows Open-Meteo's URLs.
// The exact requests are on the assignment page.

// TODO (you): write a helper that fetches a URL and returns the parsed JSON.

async function fetchJson(url) {
  let response;

  try {
    response = await fetch(url, {
      signal: AbortSignal.timeout(config.upstreamTimeoutMs)
    });
  } catch (err) {
    if (err.name === 'TimeoutError') {
      throw new HttpError(504, `The upstream service did not respond within`);
    }

    throw new HttpError(502, 'Network error');
  }

  if (!response.ok) {
    throw new HttpError( 502, 'Could not get a valid response from the upstream service');
  }

  try {
    return await response.json();
  } catch {
    throw new HttpError(502, 'Upstream service returned invalid JSON');
  }
}

// TODO (you): look up a city with the geocoding API and return
// { name, region, country, latitude, longitude, timezone } for the first result.
// Throw a 404 HttpError when there are no results.
export async function geocodeCity(name) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1`;
  const data = await fetchJson(url);

  if (!data.results || data.results.length === 0) {
    throw new HttpError(404, `City not found: ${name}`);
  }

  const r = data.results[0];

  return {
    name: r.name,
    region: r.admin1 ?? null,
    country: r.country ?? null,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone
  };
}

// TODO (you): get the current weather and a 3-day daily forecast from the
// forecast API and return the parsed response.
export async function getForecast(lat, lon) {
  console.log("DEBUG: Using UPDATED getForecast()");
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current_weather=true` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code` +
    `&timezone=auto&forecast_days=3`;

  return await fetchJson(url);
}

