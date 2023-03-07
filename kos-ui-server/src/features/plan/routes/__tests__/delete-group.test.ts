import request from 'supertest';

import app from '../../../../app';

describe('DELETE /api/v1/segment-group/:id', () => {
  it('has a route handler listening to /api/v1/segment-group/:id', async () => {
    const response = await request(app).del('/api/v1/segment-group/:id');

    expect(response.status).not.toEqual(404);
  });

  it('returns a 401 if the user is not authenticated', async () => {
    const groupResponse = await request(app)
      .post('/api/v1/segment-group')
      .set('Cookie', global.setAuthCookie())
      .send({ service_segment_group_name: 'test group' });
    const group = groupResponse.body;

    await request(app).del(`/api/v1/segment-group/${group.id}`).expect(401);
  });

  it('returns a 500 if the group id does not exist', async () => {
    await request(app)
      .del('/api/v1/segment-group/-1')
      .set('Cookie', global.setAuthCookie())
      .expect(500);
  });

  it('returns a 200 if a group is deleted', async () => {
    const groupResponse = await request(app)
      .post('/api/v1/segment-group')
      .set('Cookie', global.setAuthCookie())
      .send({ service_segment_group_name: 'test group' });
    const group = groupResponse.body;

    const response = await request(app)
      .del(`/api/v1/segment-group/${group.id}`)
      .set('Cookie', global.setAuthCookie());
    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(group.id);
  });
});
