import request from 'supertest';

import app from '../../../../app';

describe('POST api/v1/users/signup', () => {
  it('returns a 422 with an invalid email', async () => {
    await request(app)
      .post('/api/v1/users/signup')
      .send({ email: 'not-an-email', password: 'hello123' })
      .expect(422);
  });

  it('returns a 422 with an invalid password', async () => {
    await request(app)
      .post('/api/v1/users/signup')
      .send({ email: 'valid@mail.com', password: 'hel' })
      .expect(422);
  });

  it('returns a 422 with a missing email or password', async () => {
    await request(app)
      .post('/api/v1/users/signup')
      .send({ email: 'valid@mail.com' })
      .expect(422);
    await request(app)
      .post('/api/v1/users/signup')
      .send({ password: 'hello123' })
      .expect(422);
  });

  it('returns a 400 & does not allow duplicate emails', async () => {
    await request(app)
      .post('/api/v1/users/signup')
      .send({ email: 'valid@mail.com', password: 'hello123' });
    await request(app)
      .post('/api/v1/users/signup')
      .send({ email: 'valid@mail.com', password: 'hello123' })
      .expect(400);
  });

  it('returns a 201 on successful signup', async () => {
    await request(app)
      .post('/api/v1/users/signup')
      .send({ email: 'valid@mail.com', password: 'hello123' })
      .expect(201);
  });

  it('sets a cookie on successful signup', async () => {
    const response = await request(app)
      .post('/api/v1/users/signup')
      .send({ email: 'valid@mail.com', password: 'hello123' });
    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
