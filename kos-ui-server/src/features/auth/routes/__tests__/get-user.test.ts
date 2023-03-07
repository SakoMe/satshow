import request from 'supertest';

import app from '../../../../app';
import { createUser } from '../../services/users';

describe('GET /api/v1/users/:id', () => {
  it('responds with 401 not authorized if not authenticated', async () => {
    const credentials = { email: 'valid@mail.com', password: 'hello123' };
    const user = await createUser(credentials.email, credentials.password);
    await request(app).get(`/api/v1/users/${user.id}`).expect(401);
  });

  it('responds with 200 and details about the current user', async () => {
    const cookie = await getAuthCookie();
    const credentials = { email: 'valid@mail.com', password: 'hello123' };
    const user = await createUser(credentials.email, credentials.password);
    const response = await request(app)
      .get(`/api/v1/users/${user.id}`)
      .set('Cookie', cookie)
      .expect(200);
    expect(response.body.id).toEqual(user.id);
  });
});
