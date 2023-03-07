import {
  BEAM_TYPE,
  GAIN_MODE_TYPE,
  SERVICE_SEGMENT_DATA_TYPE,
  SERVICE_SEGMENT_TYPE,
} from '@prisma/client';
import request from 'supertest';

import app from '../../../../app';
import { createUser } from '../../../auth/services/users';

describe('PATCH /api/v1/candidate-beam-collection', () => {
  jest.setTimeout(10000);

  it('has a route handler listening to /api/v1/candidate-beam-collection', async () => {
    const response = await request(app).patch('/api/v1/candidate-beam-collection');

    expect(response.status).not.toEqual(404);
  });

  it('returns a 401 if the user is not authenticated', async () => {
    await request(app).patch('/api/v1/candidate-beam-collection').expect(401);
  });

  it('returns a 422 if beams do not exist', async () => {
    await request(app)
      .patch('/api/v1/candidate-beam-collection')
      .set('Cookie', global.setAuthCookie())
      .expect(422);
  });

  it('returns a 500 if beams are updated with invalid data', async () => {
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

    const beamsResponse = await request(app)
      .post('/api/v1/candidate-beam-collection')
      .set('Cookie', cookie)
      .send([
        {
          beam_type: BEAM_TYPE.Fixed,
          beam_diameter: 1,
          latitude: 40,
          longitude: 40,
          service_segment_id: segment.id,
        },
        {
          beam_type: BEAM_TYPE.Uniform,
          beam_diameter: 1,
          latitude: 30,
          longitude: 20,
          service_segment_id: segment.id,
        },
      ]);
    const beams = beamsResponse.body;
    const updatedBeams = JSON.parse(JSON.stringify(beams)) as typeof beams;
    updatedBeams[0].beam_type = 0;
    updatedBeams[1].latitude = 'lat';
    expect(beams).not.toStrictEqual(updatedBeams);

    const response = await request(app)
      .patch('/api/v1/candidate-beam-collection')
      .set('Cookie', cookie)
      .send(updatedBeams);

    expect(response.status).toEqual(500);
  });

  it('returns a 200 if beams are updated', async () => {
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

    const beamsResponse = await request(app)
      .post('/api/v1/candidate-beam-collection')
      .set('Cookie', cookie)
      .send([
        {
          beam_type: BEAM_TYPE.Fixed,
          beam_diameter: 1,
          latitude: 40,
          longitude: 40,
          service_segment_id: segment.id,
        },
        {
          beam_type: BEAM_TYPE.Uniform,
          beam_diameter: 1,
          latitude: 30,
          longitude: 20,
          service_segment_id: segment.id,
        },
      ]);
    const beams = beamsResponse.body;
    const updatedBeams = JSON.parse(JSON.stringify(beams)) as typeof beams;
    updatedBeams[0].beam_type = BEAM_TYPE.Uniform;
    updatedBeams[1].latitude = 90;
    expect(beams).not.toStrictEqual(updatedBeams);

    const response = await request(app)
      .patch('/api/v1/candidate-beam-collection')
      .set('Cookie', cookie)
      .send(updatedBeams);

    expect(response.status).toEqual(200);
    expect(response.body[0].id).toEqual(beams[0].id);
  });
});
