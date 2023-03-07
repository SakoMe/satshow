import request from 'supertest';

import app from '../../../../app';

describe('POST /api/v1/users/signin', () => {
  it('returns a 422 with an invalid email', async () => {
    await request(app)
      .post('/api/v1/users/signin')
      .send({ email: 'not-an-email', password: 'hello123' })
      .expect(422);
  });

  it('returns a 422 with an invalid password', async () => {
    await request(app)
      .post('/api/v1/users/signin')
      .send({ email: 'valid@mail.com', password: '' })
      .expect(422);
  });

  it('returns a 400 when trying to signin with an account that does not exist', async () => {
    await request(app)
      .post('/api/v1/users/signin')
      .send({ email: 'valid@mail.com', password: 'hello123' })
      .expect(400);
  });

  it('returns a 400 when trying to signin when email is incorrect', async () => {
    await request(app)
      .post('/api/v1/users/signup')
      .send({ email: 'valid@mail.com', password: 'hello123' });
    await request(app)
      .post('/api/v1/users/signin')
      .send({ email: 'not-valid@mail.com', password: 'hello123' })
      .expect(400);
  });

  it('returns a 400 when trying to signin when password is incorrect', async () => {
    await request(app)
      .post('/api/v1/users/signup')
      .send({ email: 'valid@mail.com', password: 'hello123' });
    await request(app)
      .post('/api/v1/users/signin')
      .send({ email: 'valid@mail.com', password: 'hello12' })
      .expect(400);
  });

  it('returns a 200 with correct credentials when signing in and sets a cookie', async () => {
    await request(app)
      .post('/api/v1/users/signup')
      .send({ email: 'valid@mail.com', password: 'hello123' });
    const response = await request(app)
      .post('/api/v1/users/signin')
      .send({ email: 'valid@mail.com', password: 'hello123' })
      .expect(200);
    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
