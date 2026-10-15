import { HttpError } from '../lib/http-error.js';

// TODO (you): check ?city= and return the trimmed city name. Throw a 400
// HttpError with details.city when it breaks a rule from the assignment page.
export function parseCity(value) {

  if (value === undefined) {
    throw new HttpError(400, 'Invalid query', { city: 'city is required' });
  }

  if (Array.isArray(value)) {
    throw new HttpError(400, 'Invalid query', { city: 'city must be sent once' });
  }

  const trimmed = value.trim();


  if (trimmed.length === 0) {
    throw new HttpError(400, 'Invalid query', { city: 'city must not be empty' });
  }

  if (trimmed.length < 2 || trimmed.length > 60) {
    throw new HttpError(400, 'Invalid query', { city: 'city must be 2 to 60 characters' });
  }

  return trimmed;
}
// TODO (you): check ?cities= and return an array of trimmed city names. Throw a
// 400 HttpError with details.cities when it breaks a rule from the assignment page.
export function parseCities(value) {
  if (value === undefined) {
    throw new HttpError(400, 'Invalid query', { cities: 'cities is required' });
  }


  if (Array.isArray(value)) {
    throw new HttpError(400, 'Invalid query', { cities: 'cities must be sent once' });
  }

  const parts = value.split(',').map(name => name.trim());


  if (parts.length < 2 || parts.length > 5) {
    throw new HttpError(400, 'Invalid query', { cities: 'cities must list 2 to 5 names' });
  }

  for (const name of parts) {
    if (name.length === 0) {
      throw new HttpError(400, 'Invalid query', { cities: 'cities must not contain empty names' });
    }
    if (name.length < 2 || name.length > 60) {
      throw new HttpError(400, 'Invalid query', { cities: `"${name}" must be 2 to 60 characters` });
    }
  }

  const seen = new Set();
  for (const name of parts) {
    const lower = name.toLowerCase();
    if (seen.has(lower)) {
      throw new HttpError(400, 'Invalid query', { cities: `"${name}" is listed more than once"` });
    }
    seen.add(lower);
  }

  return parts;
}
