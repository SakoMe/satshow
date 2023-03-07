import request from 'supertest';

import app from '../../../../app';

describe('GET /api/v1/data/beams', () => {
  it('has a route handler listening to /api/v1/data/beams', async () => {
    const response = await request(app).get('/api/v1/data/beams');

    expect(response.status).not.toEqual(404);
  });

  it('returns a 401 if the user is not authenticated', async () => {
    const response = await request(app).get('/api/v1/data/beams');

    expect(response.status).toEqual(401);
  });

  it('returns a 200 if the user is authenticated', async () => {
    const response = await request(app)
      .get('/api/v1/data/beams')
      .set('Cookie', global.setAuthCookie());

    expect(response.status).toEqual(200);
  });
});
