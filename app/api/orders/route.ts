import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { vehicleId, pickupDate, pickupLocation, rentalDays } = body;

    // Validate required fields
    if (!vehicleId || !pickupDate || !pickupLocation || !rentalDays) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if vehicle exists and is available
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      return NextResponse.json(
        { success: false, message: 'Vehicle not found' },
        { status: 404 }
      );
    }

    if (!vehicle.available) {
      return NextResponse.json(
        { success: false, message: 'Vehicle is not available' },
        { status: 400 }
      );
    }

    // Calculate dates and costs
    const startDate = new Date(pickupDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + rentalDays);

    const totalCost = vehicle.costPerDay * rentalDays;
    const serviceFee = totalCost * 0.1;
    const taxes = totalCost * 0.05;
    const finalTotal = totalCost + serviceFee + taxes;

    // Create rental and order in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create rental
      const rental = await tx.rental.create({
        data: {
          userId: user.id!,
          vehicleId: vehicle.id,
          startDate,
          endDate,
          totalCost: finalTotal,
          status: 'PENDING',
        },
      });

      // Create order
      const order = await tx.orders.create({
        data: {
          userId: user.id!,
          vehicleId: vehicle.id,
          rentalId: rental.id,
          pickupDate: startDate,
          pickupLocation,
          totalCost: finalTotal,
          status: 'PENDING',
        },
      });

      return { rental, order };
    });

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
