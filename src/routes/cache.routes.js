import { Router } from 'express';

export const cacheRouter = Router();

// TODO (you): respond with { data: <the cache statistics> }.
cacheRouter.get('/cache/stats', (req, res) => {
  const stats = getCacheStats();

  res.json({
    data: stats
  });
});
