import { Router } from 'express';
import { parseCity, parseCities } from '../validators/weather-query.js';
import { getCityWeather } from '../lib/weather.js';

export const weatherRouter = Router();

// TODO (you): GET /api/weather?city=Toronto
// Validate with parseCity, get the summary with getCityWeather, and respond
// with { data, attribution }. Routes never call fetch themselves.
weatherRouter.get('/weather', async (req, res, next) => {
  try {

    const city = parseCity(req.query.city);
    const data = await getCityWeather(city);

    res.json({
      data,
      attribution: 'Weather data provided by Open-Meteo.com'
    });
  } catch (err) {
    next(err); 
  }
});

// TODO (you): GET /api/compare?cities=Toronto,Vancouver,Halifax
// Validate with parseCities, start every lookup at once with Promise.allSettled,
// then build the cities array and the summary described on the assignment page.
weatherRouter.get('/compare', async (req, res, next) => {
  try {

    const cities = parseCities(req.query.cities);
    const results = await Promise.allSettled(
      cities.map(city => getCityWeather(city))
    );

    const cityResults = results.map((result, index) => {
      const name = cities[index];


      if (result.status === "fulfilled") {
        return {
          city: name,
          ok: true,
          weather: result.value
        };
      }


      const err = result.reason;
      return {
        city: name,
        ok: false,
        error: {
          message: err.message,
          status: err.status ?? 500
        }
      };
    });

    const successful = cityResults.filter(c => c.ok);

    const summary = {
      succeeded: successful.length,
      failed: cityResults.length - successful.length,
      warmest: null,
      coldest: null
    };


    if (successful.length > 0) {
      let warmest = successful[0];
      let coldest = successful[0];

      for (const c of successful) {
        if (c.weather.current.temperatureC > warmest.weather.current.temperatureC) {
          warmest = c;
        }
        if (c.weather.current.temperatureC < coldest.weather.current.temperatureC) {
          coldest = c;
        }
      }

      summary.warmest = warmest.weather.location.name;
      summary.coldest = coldest.weather.location.name;
    }


    res.json({
      data: {
        cities: cityResults,
        summary
      },
      attribution: "Weather data provided by Open-Meteo.com"
    });

  } catch (err) {
    next(err);
  }
});
