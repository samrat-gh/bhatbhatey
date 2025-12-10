import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

import { getAuthToken } from '@/lib/cookies';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  let token = request.headers.get('Authorization')?.split(' ')[1];

  // If no token in header, try to get from cookies
  if (!token) {
    token = await getAuthToken();
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'JWT Secret not found',
        }),
        { status: 500 }
      );
    }

    if (!token) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'Token not found',
        }),
        { status: 401 }
      );
    }

    const unsignedUser = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
    };

    if (unsignedUser.email) {
      const user = await prisma.user.findUnique({
        where: {
          email: unsignedUser.email,
        },
        select: {
          id: true,
        },
      });

      if (!user) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: 'User not found',
          }),
          { status: 404 }
        );
      }

      const orders = await prisma.orders.findMany({
        where: {
          userId: user.id,
        },
        include: {
          vehicle: {
            select: {
              id: true,
              name: true,
              brand: true,
              model: true,
              type: true,
              imageUrl: true,
              costPerDay: true,
            },
          },
          rental: {
            select: {
              startDate: true,
              endDate: true,
              status: true,
            },
          },
          payments: {
            select: {
              id: true,
              transactionId: true,
              amount: true,
              status: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return new NextResponse(
        JSON.stringify({
          success: true,
          message: 'Orders fetched successfully',
          orders,
        })
      );
    } else {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'Invalid token',
        }),
        { status: 401 }
      );
    }
  } catch (err: any) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: err?.message || 'Something went wrong!',
      }),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  let token = request.headers.get('Authorization')?.split(' ')[1];

  // If no token in header, try to get from cookies
  if (!token) {
    token = await getAuthToken();
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'JWT Secret not found',
        }),
        { status: 500 }
      );
    }

    if (!token) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'Token not found',
        }),
        { status: 401 }
      );
    }

    const unsignedUser = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
    };

    if (!unsignedUser.email) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'Invalid token',
        }),
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: unsignedUser.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'User not found',
        }),
        { status: 404 }
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
          userId: user.id,
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
          userId: user.id,
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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
