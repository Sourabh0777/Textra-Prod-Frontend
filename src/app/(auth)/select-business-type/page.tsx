'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { useFetchBusinessTypesQuery } from '@/lib/api/endpoints/businessApi';
import { useAssignUserRoleMutation } from '@/lib/api/endpoints/userApi';

export default function SelectBusinessTypePage() {
  const router = useRouter();
  const { user: clerkUser, isLoaded } = useUser();

  const [selectedBusinessTypeId, setSelectedBusinessTypeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: businessTypes, isLoading } = useFetchBusinessTypesQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const [assignUserRole, { isLoading: saving }] = useAssignUserRoleMutation();

  const handleSave = async () => {
    if (!selectedBusinessTypeId) {
      setError('Please select a business type');
      return;
    }

    try {
      setError(null);

      await assignUserRole({
        businessTypeId: selectedBusinessTypeId,
      }).unwrap();

      router.push('/');
    } catch (err: any) {
      setError(err?.data?.message || 'Something went wrong');
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Select Business Type</h1>
            <p className="text-gray-600 mt-2">Welcome, {clerkUser?.firstName}</p>
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">{error}</div>}

          <div className="space-y-3">
            {businessTypes?.map((type) => (
              <label key={type._id} className="flex items-start p-4 border rounded cursor-pointer">
                <input
                  type="radio"
                  name="businessType"
                  checked={selectedBusinessTypeId === type.slug}
                  onChange={() => setSelectedBusinessTypeId(type.slug)}
                  className="mt-1 mr-3"
                />
                <div>
                  <p className="font-medium">{type.name}</p>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
              </label>
            ))}
          </div>

          <Button onClick={handleSave} disabled={!selectedBusinessTypeId || saving} className="w-full">
            {saving ? 'Saving...' : 'Save & Continue'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
