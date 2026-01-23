'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@clerk/nextjs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { env } from '@/env';
import { useFetchBusinessTypesQuery } from '@/lib/api/endpoints/businessApi';

interface BusinessType {
  _id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
}

export default function SelectBusinessTypePage() {
  const router = useRouter();
  const { user: clerkUser, isLoaded } = useUser();
  const [selectedBusinessType, setSelectedBusinessType] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: businessTypes, isLoading: loadingBusinessTypes } = useFetchBusinessTypesQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });
  const handleSave = async () => {
    if (!selectedBusinessType || !clerkUser) {
      setError('Please select a business type');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const token = await getToken();
      const apiUrl = env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${apiUrl}/users/${selectedBusinessType}/role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('🚀 ~ handleSave ~ response:', response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save business type');
      }

      // Redirect to dashboard
      router.push('/businesses');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || loadingBusinessTypes) {
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
            <h1 className="text-2xl font-bold text-gray-900">Select Business Type</h1>
            <p className="text-gray-600 mt-2">
              Welcome, {clerkUser?.firstName}! Please select your business type to continue.
            </p>
          </div>

          {error && <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}

          <div className="space-y-3">
            {businessTypes &&
              businessTypes.map((type) => (
                <label
                  key={type._id}
                  className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="business-type"
                    value={type.slug}
                    checked={selectedBusinessType === type.slug}
                    onChange={(e) => setSelectedBusinessType(e.target.value)}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{type.name}</h3>
                    {type.description && <p className="text-sm text-gray-600 mt-1">{type.description}</p>}
                  </div>
                </label>
              ))}
          </div>

          <Button onClick={handleSave} disabled={!selectedBusinessType || saving} className="w-full">
            {saving ? 'Saving...' : 'Save & Continue'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
