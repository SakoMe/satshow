import prisma from '../../../client';

async function getAllBasebandBeams() {
  const data = await prisma.basebandBeam.findMany({
    include: {
      baseband_carriers: true,
      baseband_slices: true,
    },
  });

  await prisma.$disconnect();
  return data;
}

export { getAllBasebandBeams };
