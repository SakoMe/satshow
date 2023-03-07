import {
  GAIN_MODE_TYPE,
  SERVICE_SEGMENT_DATA_TYPE,
  SERVICE_SEGMENT_TYPE,
  TERMINAL_METHOD_TYPE,
} from '@prisma/client';
import request from 'supertest';

import app from '../../../../app';
import { createUser } from '../../../auth/services/users';

describe('DELETE /api/v1/method-terminal/:id', () => {
  jest.setTimeout(10000);

  it('has a route handler listening to /api/v1/method-terminal/:id', async () => {
    const response = await request(app).del('/api/v1/method-terminal/:id');

    expect(response.status).not.toEqual(404);
  });

  it('returns a 401 if the user is not authenticated', async () => {
    await request(app).del('/api/v1/method-terminal/:id').expect(401);
  });

  it('returns a 500 if the method does not exist', async () => {
    await request(app)
      .del('/api/v1/method-terminal/0')
      .set('Cookie', global.setAuthCookie())
      .expect(500);
  });

  it('returns a 200 if a method is deleted', async () => {
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

    const groupResponse = await request(app)
      .post('/api/v1/segment-group')
      .set('Cookie', cookie)
      .send({ service_segment_group_name: 'test group' })
      .expect(201);
    const group = groupResponse.body;

    const segmentResponse = await request(app)
      .post('/api/v1/service-segment')
      .set('Cookie', cookie)
      .send({
        service_segment_name: 'test segment',
        service_segment_type: SERVICE_SEGMENT_TYPE.DTH,
        service_segment_data_type: SERVICE_SEGMENT_DATA_TYPE.Bandwidth,
        service_segment_priority: 0,
        service_segment_gateway_handover: false,
        defrag_userlink_allowed: false,
        service_segment_gain_mode: GAIN_MODE_TYPE.ALC,
        plan_id: plan.id,
        group_id: group.id,
      });
    const segment = segmentResponse.body;

    const methodResponse = await request(app)
      .post('/api/v1/method-terminal')
      .set('Cookie', cookie)
      .send({
        terminal_method: TERMINAL_METHOD_TYPE.Population_density,
        avg_num_of_termninals_per_square_km: 1,
        method_terminals: [
          {
            latitude: 40,
            longitude: 40,
            eirp: 1,
            gt: 1,
            satellite_eirp: 1,
            bandwidth_forward: 1,
            bandwidth_return: 1,
            mir_forward: 1,
            mir_return: 1,
            cir_forward: 1,
            cir_return: 1,
            target_availability_forward: 1,
            target_availability_return: 1,
            flight_paths: [{ time: 'time', lat: 45, lng: 45, alt: 200 }],
            temporal_variations_forward: [{ time: 'time', demand: 1 }],
            temporal_variations_return: [{ time: 'time', demand: 1 }],
            modcods_forward: [
              { name: 'forward', spec_eff_ideal: 1, spec_eff: 1, esno: 1 },
            ],
            modcods_return: [
              { name: 'forward', spec_eff_ideal: 1, spec_eff: 1, esno: 1 },
            ],
            service_segment_id: segment.id,
          },
        ],
        service_segment_id: segment.id,
      });
    const method = methodResponse.body;

    const response = await request(app)
      .del(`/api/v1/method-terminal/${method.id}`)
      .set('Cookie', cookie);

    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(method.id);
  });
});
