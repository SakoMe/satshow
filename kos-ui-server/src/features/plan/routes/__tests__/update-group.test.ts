import request from 'supertest';

import app from '../../../../app';

describe('PATCH /api/v1/segment-group', () => {
  it('has a route handler listening to /api/v1/segment-group', async () => {
    const response = await request(app).patch('/api/v1/segment-group/:id');

    expect(response.status).not.toEqual(404);
  });

  it('returns a 401 if the user is not authenticated', async () => {
    await request(app).patch('/api/v1/segment-group/:id').expect(401);
  });

  it('returns a 500 if the group does not exist', async () => {
    await request(app)
      .patch(`/api/v1/segment-group/0`)
      .set('Cookie', global.setAuthCookie())
      .expect(500);
  });

  it('returns a 500 if group is updated with incorrect data', async () => {
    const groupResponse = await request(app)
      .post('/api/v1/segment-group')
      .set('Cookie', global.setAuthCookie())
      .send({ service_segment_group_name: 'test group' });
    const group = groupResponse.body;

    await request(app)
      .patch(`/api/v1/segment-group/${group.id}`)
      .set('Cookie', global.setAuthCookie())
      .send({ service_segment_group_name: 0 })
      .expect(500);
  });

  it('returns a 200 if a group is updated', async () => {
    const groupResponse = await request(app)
      .post('/api/v1/segment-group')
      .set('Cookie', global.setAuthCookie())
      .send({ service_segment_group_name: 'test group' });
    const group = groupResponse.body;

    const response = await request(app)
      .patch(`/api/v1/segment-group/${group.id}`)
      .set('Cookie', global.setAuthCookie())
      .send({ service_segment_group_name: 'different name' });

    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(group.id);
    expect(response.body.service_segment_group_name).not.toEqual(
      group.service_segment_group_name,
    );
  });
});
