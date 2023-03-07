import request from 'supertest';

import app from '../../../../app';

describe('POST /api/v1/users/signout', () => {
  it('returns a 204, logs the user out and removes the cookie', async () => {
    await request(app)
      .post('/api/v1/users/signup')
      .send({ email: 'valid@mail.com', password: 'hello123' })
      .expect(201);
    const response = await request(app)
      .post('/api/v1/users/signout')
      .send({})
      .expect(204);
    expect(response.get('Set-Cookie')).toBeDefined();
    expect(response.get('Set-Cookie')[0]).toEqual(
      'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly',
    );
  });
});
