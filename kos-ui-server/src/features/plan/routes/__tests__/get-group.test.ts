import request from 'supertest';

import app from '../../../../app';

describe('GET /api/v1/segment-group', () => {
  it('has a route handler listening to /api/v1/segment-group', async () => {
    const response = await request(app).get('/api/v1/segment-group/:id');

    expect(response.status).not.toEqual(404);
  });

  it('returns a 401 if the user is not authenticated', async () => {
    const groupResponse = await request(app)
      .post('/api/v1/segment-group')
      .set('Cookie', global.setAuthCookie())
      .send({ service_segment_group_name: 'test group' });
    const group = groupResponse.body;

    const response = await request(app).get(`/api/v1/segment-group/${group.id}`);

    expect(response.status).toEqual(401);
  });

  it('returns a 404 if the group does not exist', async () => {
    const response = await request(app)
      .get(`/api/v1/segment-group/0`)
      .set('Cookie', global.setAuthCookie());

    expect(response.status).toEqual(404);
  });

  it('returns a 200 if the group exists', async () => {
    const groupResponse = await request(app)
      .post('/api/v1/segment-group')
      .set('Cookie', global.setAuthCookie())
      .send({ service_segment_group_name: 'test group' });
    const group = groupResponse.body;

    const response = await request(app)
      .get(`/api/v1/segment-group/${group.id}`)
      .set('Cookie', global.setAuthCookie());

    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(group.id);
  });
});
