import {
  GAIN_MODE_TYPE,
  LINK_DIRECTION_TYPE,
  POLARIZATION_TYPE,
  SERVICE_SEGMENT_DATA_TYPE,
  SERVICE_SEGMENT_TYPE,
} from '@prisma/client';
import request from 'supertest';

import app from '../../../../app';
import { createUser } from '../../../auth/services/users';

describe('PATCH /api/v1/gateway-modem-collection', () => {
  jest.setTimeout(10000);

  it('has a route handler listening to /api/v1/gateway-modem-collection', async () => {
    const response = await request(app).patch('/api/v1/gateway-modem-collection');

    expect(response.status).not.toEqual(404);
  });

  it('returns a 401 if the user is not authenticated', async () => {
    await request(app).patch('/api/v1/gateway-modem-collection').expect(401);
  });

  it('returns a 422 if the modems do not exist', async () => {
    await request(app)
      .patch('/api/v1/gateway-modem-collection')
      .set('Cookie', global.setAuthCookie())
      .expect(422);
  });

  it('returns a 500 if the modems are updated with invalid data', async () => {
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

    const gatewayResponse = await request(app)
      .post('/api/v1/segment-gateway')
      .set('Cookie', cookie)
      .send({
        gateway_name: 'test gateway',
        latitude: 40,
        longitude: 40,
        polarization: POLARIZATION_TYPE.HLP,
        direction: LINK_DIRECTION_TYPE.DownLink,
        min_frequency: 10,
        max_frequency: 20,
        eirp: 1.24,
        gt: 0.5,
        npr: 9,
        service_segment_id: segment.id,
      });
    const gateway = gatewayResponse.body;

    const modemsResponse = await request(app)
      .post('/api/v1/gateway-modem-collection')
      .set('Cookie', global.setAuthCookie())
      .send([
        {
          latitude: 40,
          longitude: 40,
          polarization: POLARIZATION_TYPE.HLP,
          direction: LINK_DIRECTION_TYPE.UpLink,
          min_frequency: 10,
          max_frequency: 20,
          max_span: 1,
          max_agg_tot_sym: 1,
          rof: 1,
          max_sym_rate: 1,
          min_sym_rate: 1,
          max_num_slice: 1,
          max_num_carrier: 1,
          max_term: 1,
          gateway_id: gateway.id,
        },
        {
          latitude: 90,
          longitude: 40,
          polarization: POLARIZATION_TYPE.RHCP,
          direction: LINK_DIRECTION_TYPE.DownLink,
          min_frequency: 10,
          max_frequency: 20,
          max_span: 1,
          max_agg_tot_sym: 1,
          rof: 1,
          max_sym_rate: 1,
          min_sym_rate: 1,
          max_num_slice: 1,
          max_num_carrier: 5,
          max_term: 1,
          gateway_id: gateway.id,
        },
      ]);
    const modems = modemsResponse.body;
    const updatedModems = JSON.parse(JSON.stringify(modems)) as typeof modems;
    updatedModems[0].latitude = 'lat';
    updatedModems[1].polarization = 0;
    expect(modems).not.toStrictEqual(updatedModems);

    const response = await request(app)
      .patch('/api/v1/gateway-modem-collection')
      .set('Cookie', cookie)
      .send(updatedModems);

    expect(response.status).toEqual(500);
  });

  it('returns a 200 if the modem is updated', async () => {
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

    const gatewayResponse = await request(app)
      .post('/api/v1/segment-gateway')
      .set('Cookie', cookie)
      .send({
        gateway_name: 'test gateway',
        latitude: 40,
        longitude: 40,
        polarization: POLARIZATION_TYPE.HLP,
        direction: LINK_DIRECTION_TYPE.DownLink,
        min_frequency: 10,
        max_frequency: 20,
        eirp: 1.24,
        gt: 0.5,
        npr: 9,
        service_segment_id: segment.id,
      });
    const gateway = gatewayResponse.body;

    const modemsResponse = await request(app)
      .post('/api/v1/gateway-modem-collection')
      .set('Cookie', global.setAuthCookie())
      .send([
        {
          latitude: 40,
          longitude: 40,
          polarization: POLARIZATION_TYPE.HLP,
          direction: LINK_DIRECTION_TYPE.UpLink,
          min_frequency: 10,
          max_frequency: 20,
          max_span: 1,
          max_agg_tot_sym: 1,
          rof: 1,
          max_sym_rate: 1,
          min_sym_rate: 1,
          max_num_slice: 1,
          max_num_carrier: 1,
          max_term: 1,
          gateway_id: gateway.id,
        },
        {
          latitude: 90,
          longitude: 40,
          polarization: POLARIZATION_TYPE.RHCP,
          direction: LINK_DIRECTION_TYPE.DownLink,
          min_frequency: 10,
          max_frequency: 20,
          max_span: 1,
          max_agg_tot_sym: 1,
          rof: 1,
          max_sym_rate: 1,
          min_sym_rate: 1,
          max_num_slice: 1,
          max_num_carrier: 5,
          max_term: 1,
          gateway_id: gateway.id,
        },
      ]);
    const modems = modemsResponse.body;
    const updatedModems = JSON.parse(JSON.stringify(modems)) as typeof modems;
    updatedModems[0].latitude = 30;
    updatedModems[1].max_num_carrier = 1;
    expect(modems).not.toStrictEqual(updatedModems);

    console.log(modems);
    console.log(updatedModems);

    const response = await request(app)
      .patch('/api/v1/gateway-modem-collection')
      .set('Cookie', cookie)
      .send(updatedModems);

    expect(response.status).toEqual(200);
    expect(response.body[0].id).toEqual(modems[0].id);
  });
});
