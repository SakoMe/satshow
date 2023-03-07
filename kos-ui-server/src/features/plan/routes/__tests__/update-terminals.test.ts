import {
  GAIN_MODE_TYPE,
  SERVICE_SEGMENT_DATA_TYPE,
  SERVICE_SEGMENT_TYPE,
} from '@prisma/client';
import request from 'supertest';

import app from '../../../../app';
import { createUser } from '../../../auth/services/users';

describe('PATCH /api/v1/segment-terminal-collection', () => {
  jest.setTimeout(10000);

  it('has a route handler listening to /api/v1/segment-terminal-collection', async () => {
    const response = await request(app).patch('/api/v1/segment-terminal-collection');

    expect(response.status).not.toEqual(404);
  });

  it('returns a 401 if the user is not authenticated', async () => {
    await request(app).patch('/api/v1/segment-terminal-collection').expect(401);
  });

  it('returns a 422 if terminals do not exist', async () => {
    await request(app)
      .patch('/api/v1/segment-terminal-collection')
      .set('Cookie', global.setAuthCookie())
      .expect(422);
  });

  it('returns a 500 if terminals are updated with invalid data', async () => {
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

    const terminalsResponse = await request(app)
      .post('/api/v1/segment-terminal-collection')
      .set('Cookie', cookie)
      .send([
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
          modcods_forward: [{ name: 'forward', spec_eff_ideal: 1, spec_eff: 1, esno: 1 }],
          modcods_return: [{ name: 'forward', spec_eff_ideal: 1, spec_eff: 1, esno: 1 }],
          service_segment_id: segment.id,
        },
        {
          latitude: 80,
          longitude: 77,
          eirp: 1,
          gt: 1,
          satellite_eirp: 1,
          bandwidth_forward: 1,
          bandwidth_return: 2,
          mir_forward: 1,
          mir_return: 1,
          cir_forward: 1,
          cir_return: 1,
          target_availability_forward: 1,
          target_availability_return: 1,
          flight_paths: [{ time: 'time', lat: 89, lng: 45, alt: 200 }],
          temporal_variations_forward: [{ time: 'time', demand: 1 }],
          temporal_variations_return: [{ time: 'time', demand: 1 }],
          modcods_forward: [{ name: 'forward', spec_eff_ideal: 1, spec_eff: 1, esno: 1 }],
          modcods_return: [{ name: 'forward', spec_eff_ideal: 1, spec_eff: 1, esno: 1 }],
          service_segment_id: segment.id,
        },
      ]);
    const terminals = terminalsResponse.body;
    const updatedTerminals = JSON.parse(JSON.stringify(terminals)) as typeof terminals;
    updatedTerminals[0].beam_type = 0;
    updatedTerminals[1].latitude = 'lat';
    expect(terminals).not.toStrictEqual(updatedTerminals);

    const response = await request(app)
      .patch('/api/v1/segment-terminal-collection')
      .set('Cookie', cookie)
      .send(updatedTerminals);

    expect(response.status).toEqual(500);
  });

  it('returns a 200 if terminals are updated', async () => {
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

    const terminalsResponse = await request(app)
      .post('/api/v1/segment-terminal-collection')
      .set('Cookie', cookie)
      .send([
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
          modcods_forward: [{ name: 'forward', spec_eff_ideal: 1, spec_eff: 1, esno: 1 }],
          modcods_return: [{ name: 'forward', spec_eff_ideal: 1, spec_eff: 1, esno: 1 }],
          service_segment_id: segment.id,
        },
        {
          latitude: 80,
          longitude: 77,
          eirp: 1,
          gt: 1,
          satellite_eirp: 1,
          bandwidth_forward: 1,
          bandwidth_return: 2,
          mir_forward: 1,
          mir_return: 1,
          cir_forward: 1,
          cir_return: 1,
          target_availability_forward: 1,
          target_availability_return: 1,
          flight_paths: [{ time: 'time', lat: 89, lng: 45, alt: 200 }],
          temporal_variations_forward: [{ time: 'time', demand: 1 }],
          temporal_variations_return: [{ time: 'time', demand: 1 }],
          modcods_forward: [{ name: 'forward', spec_eff_ideal: 1, spec_eff: 1, esno: 1 }],
          modcods_return: [{ name: 'forward', spec_eff_ideal: 1, spec_eff: 1, esno: 1 }],
          service_segment_id: segment.id,
        },
      ]);
    const terminals = terminalsResponse.body;
    const updatedTerminals = JSON.parse(JSON.stringify(terminals)) as typeof terminals;
    updatedTerminals[0].latitude = 21;
    updatedTerminals[1].gt = 5;
    expect(terminals).not.toStrictEqual(updatedTerminals);

    const response = await request(app)
      .patch('/api/v1/segment-terminal-collection')
      .set('Cookie', cookie)
      .send(updatedTerminals);

    expect(response.status).toEqual(200);
    expect(response.body[0].id).toEqual(terminals[0].id);
  });
});
