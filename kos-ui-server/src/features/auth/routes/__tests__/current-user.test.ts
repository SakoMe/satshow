import request from 'supertest';

import app from '../../../../app';

describe('GET /api/v1/users/currentuser', () => {
  it('responds with 201 details about the current user', async () => {
    const cookie = await getAuthCookie();

    const response = await request(app)
      .get('/api/v1/users/currentuser')
      .set('Cookie', cookie)
      .expect(200);

    expect(response.body.email).toEqual('test@mail.com');
  });

  it('responds with 200 and null if not authenticated', async () => {
    const response = await request(app).get('/api/v1/users/currentuser').expect(200);

    expect(response.body).toBeNull();
  });
});
