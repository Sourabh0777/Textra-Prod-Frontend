/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardBody } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import type { IBusiness } from '@/types';
import { fetchBusiness } from '@/lib/api';
const BusinessPage = () => {
  const [business, setBusiness] = useState<any>();
  const [formData, setFormData] = useState<Partial<IBusiness>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadData = async () => {
    setLoading(true);
    const res = await fetchBusiness('123');
    if (res.success && res.data) {
      setBusiness(res.data);
      setFormData(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);
  return (
    <>
      <Header title="Business Profile" subtitle="Manage your business information & WhatsApp setup" />

      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <Card>
          <CardBody className="space-y-6">
            <Input
              label="Business Name"
              name="business_name"
              value={formData.business_name || ''}
              //   onChange={handleChange}
              error={errors.business_name}
              fullWidth
            />

            <Input
              label="Owner Name"
              name="owner_name"
              value={formData.owner_name || ''}
              //   onChange={handleChange}
              fullWidth
            />

            <Input
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number || ''}
              //   onChange={handleChange}
              error={errors.phone_number}
              fullWidth
            />

            <Input
              label="City"
              name="city"
              value={formData.city || ''}
              //   onChange={handleChange}
              error={errors.city}
              fullWidth
            />

            <Input
              label="Address"
              name="address"
              value={formData.address || ''}
              // onChange={handleChange}
              fullWidth
            />

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-3">WhatsApp Configuration</h3>

              <Input
                label="WABA ID"
                name="waba_id"
                value={formData.waba_id || ''}
                //   onChange={handleChange}
                fullWidth
              />

              <Input
                label="Phone Number ID"
                name="phone_number_id"
                value={formData.phone_number_id || ''}
                // onChange={handleChange}
                fullWidth
              />

              <Input
                label="Display Number"
                name="phone_number_display"
                value={formData.phone_number_display || ''}
                // onChange={handleChange}
                fullWidth
              />
            </div>

            <Select
              label="Business Status"
              name="is_active"
              value={String(formData.is_active)}
              //   onChange={handleChange}
              options={[
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' },
              ]}
              fullWidth
            />

            <div className="flex justify-end pt-4">
              <Button
                loading={saving}
                //    onClick={handleSave}
              >
                Save Changes
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default BusinessPage;
