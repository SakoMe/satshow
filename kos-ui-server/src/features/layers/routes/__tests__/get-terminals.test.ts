import request from 'supertest';

import app from '../../../../app';

describe('POST /api/v1/users/signup GET /api/v1/layers/terminals', () => {
  it('requests the terminals without signing in', async () => {
    await request(app).get('/api/v1/layers/terminals').expect(401);
  });

  it('signs up, then logs in a user, and finally requests the terminals', async () => {
    await request(app)
      .post('/api/v1/users/signup')
      .send({ email: 'valid@mail.com', password: 'hello123' })
      .expect(201);
    await request(app)
      .get('/api/v1/layers/terminals')
      .set('Cookie', global.setAuthCookie())
      .expect(200);
  });
});
