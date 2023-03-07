import request from 'supertest';

import app from '../../../../app';

describe('GET /api/v1/segment', () => {
  it('has a route handler listening to /api/v1/segment-gateway', async () => {
    const response = await request(app).get('/api/v1/segment-gateway');

    expect(response.status).not.toEqual(404);
  });

  it('returns a 401 if the user is not authenticated', async () => {
    const response = await request(app).get('/api/v1/segment-gateway');

    expect(response.status).toEqual(401);
  });

  it('returns a 200 if the gateways are retrieved', async () => {
    const response = await request(app)
      .get('/api/v1/segment-gateway')
      .set('Cookie', global.setAuthCookie());

    expect(response.status).toEqual(200);
  });
});
