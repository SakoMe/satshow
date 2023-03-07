import request from 'supertest';

import app from '../../../../app';
import { createUser } from '../../../auth/services/users';

describe('POST /api/v1/plan', () => {
  it('has a route handler listening to /api/v1/plan', async () => {
    const response = await request(app).post('/api/v1/plan');

    expect(response.status).not.toEqual(404);
  });

  it('returns a 401 if the user is not authenticated', async () => {
    await request(app).post('/api/v1/plan').expect(401);
  });

  it('returns a 422 if incorrect or incomplete plan data is sent', async () => {
    await request(app)
      .post('/api/v1/plan')
      .set('Cookie', global.setAuthCookie())
      .send({ plan_name: 0 })
      .expect(422);
  });

  it('returns a 500 if a plan is created under an invalid user', async () => {
    await request(app)
      .post('/api/v1/plan')
      .set('Cookie', global.setAuthCookie())
      .send({
        plan_name: 'plan name',
        number_segments: 1,
        time_period_start: new Date(2023, 2, 8),
        time_period_end: new Date(2023, 2, 9),
      })
      .expect(500);
  });

  it('returns a 201 if a plan is created under a valid user', async () => {
    const cookie = await getAuthCookie();
    const credentials = { email: 'valid@mail.com', password: 'hello123' };
    const user = await createUser(credentials.email, credentials.password);
    await request(app)
      .post('/api/v1/plan')
      .set('Cookie', cookie)
      .send({
        plan_name: 'plan name',
        number_segments: 1,
        time_period_start: new Date(2023, 2, 8),
        time_period_end: new Date(2023, 2, 9),
        user_id: user.id,
      })
      .expect(201);
  });
});
