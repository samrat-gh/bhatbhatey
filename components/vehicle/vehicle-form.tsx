'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn, generateSlug } from '@/lib/utils';

type VehicleType = 'BIKE' | 'CAR' | 'CYCLE';

interface VehicleFormData {
  name: string;
  slug: string;
  type: VehicleType;
  brand: string;
  model: string;
  description: string;
  mileage: number;
  costPerDay: number;
  imageUrl?: string;
}

export function VehicleForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VehicleFormData>();
  const router = useRouter();
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  // Watch the name field to auto-generate slug
  const watchedName = watch('name');

  // Auto-generate slug from name when name changes and slug hasn't been manually edited
  useEffect(() => {
    if (watchedName && !isSlugManuallyEdited) {
      const generatedSlug = generateSlug(watchedName);
      setValue('slug', generatedSlug);
    }
  }, [watchedName, isSlugManuallyEdited, setValue]);

  // Track if slug field has been manually edited
  const handleSlugChange = () => {
    setIsSlugManuallyEdited(true);
    // The register will handle the actual value change
  };

  const onSubmit = async (data: VehicleFormData) => {
    try {
      const response = await fetch('/api/vehicle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          mileage: Number(data.mileage),
          costPerDay: Number(data.costPerDay),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Vehicle created successfully!');
        router.push('/vehicles');
      } else {
        toast.error(result.message || 'Failed to create vehicle');
      }
    } catch (error) {
      toast.error('An error occurred while creating the vehicle');
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Add New Vehicle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Vehicle Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Royal Enfield Classic 350"
                  {...register('name', {
                    required: 'Vehicle name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  })}
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Slug Field */}
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-gray-700">
                  URL Slug
                  <span className="text-sm text-gray-500 ml-1">
                    (auto-generated, editable)
                  </span>
                </Label>
                <Input
                  id="slug"
                  type="text"
                  placeholder="royal-enfield-classic-350"
                  {...register('slug', {
                    required: 'Slug is required',
                    pattern: {
                      value: /^[a-z0-9-]+$/,
                      message:
                        'Slug can only contain lowercase letters, numbers, and hyphens',
                    },
                  })}
                  onChange={handleSlugChange}
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
                {errors.slug && (
                  <p className="text-sm text-red-600">{errors.slug.message}</p>
                )}
              </div>

              {/* Vehicle Type */}
              <div className="space-y-2">
                <Label htmlFor="type" className="text-gray-700">
                  Vehicle Type
                </Label>
                <select
                  id="type"
                  {...register('type', {
                    required: 'Vehicle type is required',
                  })}
                  className="flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus:border-orange-500 focus:ring-[3px] focus:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Type</option>
                  <option value="BIKE">Bike</option>
                  <option value="CAR">Car</option>
                  <option value="CYCLE">Cycle</option>
                </select>
                {errors.type && (
                  <p className="text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>

              {/* Brand */}
              <div className="space-y-2">
                <Label htmlFor="brand" className="text-gray-700">
                  Brand
                </Label>
                <Input
                  id="brand"
                  type="text"
                  placeholder="e.g., Royal Enfield, Honda, Hero"
                  {...register('brand', { required: 'Brand is required' })}
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
                {errors.brand && (
                  <p className="text-sm text-red-600">{errors.brand.message}</p>
                )}
              </div>

              {/* Model */}
              <div className="space-y-2">
                <Label htmlFor="model" className="text-gray-700">
                  Model
                </Label>
                <Input
                  id="model"
                  type="text"
                  placeholder="e.g., Classic 350, CBR 250R"
                  {...register('model', { required: 'Model is required' })}
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
                {errors.model && (
                  <p className="text-sm text-red-600">{errors.model.message}</p>
                )}
              </div>

              {/* Mileage */}
              <div className="space-y-2">
                <Label htmlFor="mileage" className="text-gray-700">
                  Mileage (km/l)
                </Label>
                <Input
                  id="mileage"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="e.g., 35.5"
                  {...register('mileage', {
                    required: 'Mileage is required',
                    min: { value: 0, message: 'Mileage must be positive' },
                  })}
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
                {errors.mileage && (
                  <p className="text-sm text-red-600">
                    {errors.mileage.message}
                  </p>
                )}
              </div>

              {/* Cost Per Day */}
              <div className="space-y-2">
                <Label htmlFor="costPerDay" className="text-gray-700">
                  Cost Per Day (₹)
                </Label>
                <Input
                  id="costPerDay"
                  type="number"
                  min="0"
                  placeholder="e.g., 500"
                  {...register('costPerDay', {
                    required: 'Cost per day is required',
                    min: { value: 0, message: 'Cost must be positive' },
                  })}
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
                {errors.costPerDay && (
                  <p className="text-sm text-red-600">
                    {errors.costPerDay.message}
                  </p>
                )}
              </div>

              {/* Image URL */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="imageUrl" className="text-gray-700">
                  Image URL (optional)
                </Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/vehicle-image.jpg"
                  {...register('imageUrl')}
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="text-gray-700">
                  Description
                </Label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Describe the vehicle features, condition, and any special notes..."
                  {...register('description', {
                    required: 'Description is required',
                  })}
                  className="flex min-h-[60px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-xs transition-colors focus:border-orange-500 focus:ring-[3px] focus:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
                {errors.description && (
                  <p className="text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/vehicles')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-orange-600 text-white hover:bg-orange-700"
              >
                Create Vehicle
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
