'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type VehicleType = 'BIKE' | 'CAR' | 'CYCLE';

interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  brand: string;
  slug: string;
  model: string;
  description: string;
  mileage: number;
  costPerDay: number;
  imageUrl?: string;
  available: boolean;
  createdAt: string;
}

interface VehiclesResponse {
  success: boolean;
  vehicles: Vehicle[];
  message?: string;
}

const VehicleTypeFilter = ({
  selectedType,
  onTypeChange,
}: {
  selectedType: string;
  onTypeChange: (type: string) => void;
}) => {
  const types = [
    { value: 'all', label: 'All Vehicles' },
    { value: 'BIKE', label: 'Bikes' },
    { value: 'CAR', label: 'Cars' },
    { value: 'CYCLE', label: 'Cycles' },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {types.map((type) => (
        <Button
          key={type.value}
          variant={selectedType === type.value ? 'default' : 'outline'}
          onClick={() => onTypeChange(type.value)}
          className="transition-all duration-200"
        >
          {type.label}
        </Button>
      ))}
    </div>
  );
};

const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
  const [imageError, setImageError] = useState(false);

  const getVehicleTypeColor = (type: VehicleType) => {
    switch (type) {
      case 'BIKE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'CAR':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'CYCLE':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getDefaultImage = (type: VehicleType) => {
    switch (type) {
      case 'BIKE':
        return '/sports-bike.jpg';
      case 'CAR':
        return '/logo.png'; // You can replace with a car image
      case 'CYCLE':
        return '/bycycle.jpg';
      default:
        return '/logo.png';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <div className="relative aspect-video overflow-hidden">
        {!imageError ? (
          <Image
            src={vehicle.imageUrl || getDefaultImage(vehicle.type)}
            alt={vehicle.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">
                {vehicle.type === 'BIKE' && '🏍️'}
                {vehicle.type === 'CAR' && '🚗'}
                {vehicle.type === 'CYCLE' && '🚴'}
              </div>
              <p className="text-sm text-muted-foreground">{vehicle.type}</p>
            </div>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge
            variant={vehicle.available ? 'default' : 'destructive'}
            className="shadow-sm"
          >
            {vehicle.available ? 'Available' : 'Unavailable'}
          </Badge>
        </div>
        <div className="absolute top-2 left-2">
          <Badge className={getVehicleTypeColor(vehicle.type)}>
            {vehicle.type}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
              {vehicle.name}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground line-clamp-3 ">
              {vehicle.brand} • {vehicle.model}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {vehicle.description}
        </p>

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Mileage:</span>
            <span className="font-medium">{vehicle.mileage} km/l</span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              ₹{vehicle.costPerDay}
            </div>
            <div className="text-xs text-muted-foreground">per day</div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Link
          className="w-full px-5 py-2 bg-neutral-900 text-white rounded-md text-center hover:bg-neutral-800 transition-colors duration-200"
          href={`/vehicles/${vehicle.slug}`}
        >
          {vehicle.available ? 'Book Now' : 'Not Available'}
        </Link>
      </CardFooter>
    </Card>
  );
};

const Page = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState('all');

  const fetchVehicles = async (type: string = 'all') => {
    try {
      setLoading(true);
      setError(null);

      const queryParam = type !== 'all' ? `?type=${type}` : '';
      const response = await fetch(`/api/vehicle${queryParam}`);
      const data: VehiclesResponse = await response.json();

      if (data.success) {
        setVehicles(data.vehicles);
      } else {
        setError(data.message || 'Failed to fetch vehicles');
      }
    } catch (err) {
      setError('An error occurred while fetching vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles(selectedType);
  }, [selectedType]);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
          <Button onClick={() => fetchVehicles(selectedType)}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex justify-center items-center mb-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Our Vehicle Fleet
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose from our diverse collection of well-maintained vehicles for
          your next adventure
        </p>
      </div>

      {/* Filter Section */}
      <div className="flex justify-center mb-8">
        <VehicleTypeFilter
          selectedType={selectedType}
          onTypeChange={handleTypeChange}
        />
      </div>

      {/* Vehicles Grid */}
      {vehicles.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚗</div>
          <h3 className="text-xl font-semibold mb-2">No vehicles found</h3>
          <p className="text-muted-foreground">
            {selectedType === 'all'
              ? 'No vehicles are currently available.'
              : `No ${selectedType.toLowerCase()}s are currently available.`}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          {/* Results Summary */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Showing {vehicles.length}{' '}
              {vehicles.length === 1 ? 'vehicle' : 'vehicles'}
              {selectedType !== 'all' &&
                ` in ${selectedType.toLowerCase()}s category`}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
