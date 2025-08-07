import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export type VehicleInterface = 'BIKE' | 'CAR' | 'CYCLE' | 'all';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const vehicleType = (searchParams.get('type') as VehicleInterface) || 'all';

  try {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        type: vehicleType === 'all' ? undefined : vehicleType,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (vehicles) {
      return new NextResponse(
        JSON.stringify({
          success: true,
          vehicles,
        }),
        { status: 200 }
      );
    } else {
      throw new Error('cannot retrieve data at the moment');
    }
  } catch (err: any) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: err?.message || 'something went wrong!',
      }),
      { status: 500 }
    );
  }
}
