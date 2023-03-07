import request from 'supertest';

import app from '../../../../app';
import { createUser } from '../../../auth/services/users';

describe('GET /api/v1/plan/:id', () => {
  it('has a route handler listening to /api/v1/plan/:id', async () => {
    const response = await request(app).get('/api/v1/plan/:id');

    expect(response.status).not.toEqual(404);
  });

  it('returns a 401 if the user is not authenticated', async () => {
    const cookie = await getAuthCookie();
    const credentials = { email: 'valid@mail.com', password: 'hello123' };
    const user = await createUser(credentials.email, credentials.password);
    const planResponse = await request(app)
      .post('/api/v1/plan')
      .set('Cookie', cookie)
      .send({
        plan_name: 'plan name',
        number_segments: 1,
        time_period_start: new Date(2023, 2, 8),
        time_period_end: new Date(2023, 2, 9),
        user_id: user.id,
      });
    const plan = planResponse.body;

    await request(app).get(`/api/v1/plan/${plan.id}`).expect(401);
  });

  it('returns a 200 if a plan has been gotten from a valid user', async () => {
    const cookie = await getAuthCookie();
    const credentials = { email: 'valid@mail.com', password: 'hello123' };
    const user = await createUser(credentials.email, credentials.password);
    const planResponse = await request(app)
      .post('/api/v1/plan')
      .set('Cookie', cookie)
      .send({
        plan_name: 'plan name',
        number_segments: 1,
        time_period_start: new Date(2023, 2, 8),
        time_period_end: new Date(2023, 2, 9),
        user_id: user.id,
      });
    const plan = planResponse.body;

    const response = await request(app)
      .get(`/api/v1/plan/${plan.id}`)
      .set('Cookie', cookie);
    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(plan.id);
  });
});
