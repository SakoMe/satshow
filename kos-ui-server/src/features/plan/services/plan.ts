import { Plan } from '@prisma/client';

import prisma from '../../../client';

export async function createPlan(planDTO: Plan, userId: number) {
  const newPlan = await prisma.plan.create({
    data: {
      ...planDTO,
      user_id: userId,
    },
  });

  await prisma.$disconnect();
  return newPlan;
}

export async function updatePlan(id: number, planDTO: Plan) {
  const updatedPlan = await prisma.plan.update({
    where: { id },
    data: {
      ...planDTO,
    },
  });

  await prisma.$disconnect();
  return updatedPlan;
}

export async function deletePlan(id: number) {
  const deletedPlan = await prisma.plan.delete({
    where: { id },
  });

  await prisma.$disconnect();
  return deletedPlan;
}

export async function getPlan(id: number) {
  const plan = await prisma.plan.findUnique({
    where: { id },
    select: {
      id: true,
      plan_name: true,
      status: true,
      service_segments: {
        select: {
          id: true,
          service_segment_name: true,
          service_segment_type: true,
          service_segment_data_type: true,
          regions: {
            select: {
              id: true,
              region_name: true,
              coordinates: true,
            },
          },
          service_params: {
            select: {
              id: true,
              band: true,
              direction: true,
              polarization: true,
              frequency_start: true,
              frequency_end: true,
            },
          },
          regulatory_constraints: {
            select: {
              id: true,
              regulatory_constraint_name: true,
              direction: true,
              max_copol_directivity: true,
              min_crosspol_discrimination: true,
              pfd_level: true,
              polarization: true,
            },
          },
          candidate_beams: {
            select: {
              id: true,
              beam_type: true,
              beam_diameter: true,
              beam_diameter_range_min: true,
              beam_diameter_range_max: true,
              latitude: true,
              longitude: true,
              spacing: true,
            },
          },
          gateways: {
            select: {
              id: true,
              gateway_name: true,
              direction: true,
              latitude: true,
              longitude: true,
              eirp: true,
              polarization: true,
              gt: true,
              npr: true,
              max_frequency: true,
              min_frequency: true,
              gateway_modems: {
                select: {
                  id: true,
                  direction: true,
                  latitude: true,
                  longitude: true,
                  max_agg_tot_sym: true,
                  max_frequency: true,
                  min_frequency: true,
                  max_num_carrier: true,
                  max_num_slice: true,
                  max_span: true,
                  max_sym_rate: true,
                  min_sym_rate: true,
                  max_term: true,
                  polarization: true,
                  rof: true,
                },
              },
            },
          },
          method_terminals: {
            select: {
              id: true,
              terminal_method: true,
              avg_num_of_termninals_per_square_km: true,
              method_terminals: true,
            },
          },
          terminals: {
            select: {
              id: true,
              latitude: true,
              longitude: true,
              bandwidth_forward: true,
              bandwidth_return: true,
              cir_forward: true,
              cir_return: true,
              eirp: true,
              satellite_eirp: true,
              gt: true,
              mir_forward: true,
              mir_return: true,
              target_availability_forward: true,
              target_availability_return: true,
              temporal_variations_forward: true,
              temporal_variations_return: true,
              modcods_forward: true,
              modcods_return: true,
              flight_paths: true,
              terminal_connectivities: true,
            },
          },
          connectivities: {
            select: {
              id: true,
              bandwidth: true,
              cir: true,
              mir: true,
              satellite_eirp: true,
              availability: true,
              temporal_variations: true,
              modcods: true,
              terminal_connectivities: true,
            },
          },
        },
      },
    },
  });

  await prisma.$disconnect();
  return plan;
}
