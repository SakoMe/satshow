import request from 'supertest';

import app from '../../../../app';

describe('POST /api/v1/segment-group', () => {
  it('has a route handler listening to /api/v1/segment-group', async () => {
    const response = await request(app).post('/api/v1/segment-group');

    expect(response.status).not.toEqual(404);
  });

  it('returns a 401 if the user is not authenticated', async () => {
    await request(app).post('/api/v1/segment-group').expect(401);
  });

  it('returns a 500 if incorrect or incomplete group data is sent', async () => {
    await request(app)
      .post('/api/v1/segment-group')
      .set('Cookie', global.setAuthCookie())
      .send({ service_segment_group_name: 0 })
      .expect(500);
  });

  it('returns a 201 if a group is created under a valid user', async () => {
    await request(app)
      .post('/api/v1/segment-group')
      .set('Cookie', global.setAuthCookie())
      .send({ service_segment_group_name: 'test group' })
      .expect(201);
  });
});
