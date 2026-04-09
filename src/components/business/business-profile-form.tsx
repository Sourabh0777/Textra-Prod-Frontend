/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Card, CardBody } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { IBusiness, IBusinessType, IState, IZone } from '@/types';
import { ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import { useCurrentUser } from '@/lib/hooks/useFetchUserData';
import { useFetchLoginUserQuery } from '@/lib/api/endpoints/userApi';

interface BusinessProfileFormProps {
  formData: Partial<IBusiness>;
  errors: Record<string, string>;
  businessTypes: IBusinessType[] | undefined;
  states?: IState[];
  zones?: IZone[];
  saving: boolean;
  wabaSaving?: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSave: () => void;
  onWabaSave?: () => void;
}

export function BusinessProfileForm({
  formData,
  errors,
  businessTypes,
  states,
  zones,
  saving,
  wabaSaving,
  onInputChange,
  onSave,
  onWabaSave,
}: BusinessProfileFormProps) {
  const { user } = useCurrentUser();
  console.log('🚀 ~ BusinessProfileForm ~ user:', user);

  const isActive = user?.business_id?.is_active === true;

  const isProfileIncomplete =
    !formData.phone_number || !formData.city || !formData.state || !formData.zone || !formData.address;

  const handleWabaSaveClick = () => {
    if (isProfileIncomplete) {
      toast.error('Cannot save unless Phone Number, City, State, Zone, and Address are filled');
      return;
    }
    onWabaSave?.();
  };

  const handleFacebookConnectClick = (e: React.MouseEvent) => {
    if (!user?.business_id) {
      e.preventDefault();
      toast.error('Please save your WhatsApp config first to connect to Facebook.');
      return;
    }
    if (isProfileIncomplete) {
      e.preventDefault();
      toast.error('Please complete your business profile before connecting to Facebook');
    }
  };

  return (
    <Card>
      <CardBody>
        <div className="mb-8 border-b pb-6">
          <h2 className="text-2xl font-bold text-gray-900">Business Profile Settings</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your main business information and WhatsApp API connectivity. Fields marked with an asterisk (
            <span className="text-red-500">*</span>) are required.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 space-y-6 lg:pr-10">
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">{errors.general}</div>
            )}

            {/* Business Type */}
            <Select
              label="Business Type"
              name="business_type_id"
              value={
                typeof formData.business_type_id === 'object'
                  ? formData.business_type_id?._id
                  : formData.business_type_id || ''
              }
              onChange={onInputChange}
              options={
                businessTypes?.map((type) => ({
                  value: type?._id || '',
                  label: type?.name || '',
                })) || []
              }
              error={errors.business_type_id}
              fullWidth
              disabled
            />

            <Input
              label="Business Name"
              name="business_name"
              value={formData.business_name || ''}
              onChange={onInputChange}
              error={errors.business_name}
              fullWidth
              required
            />

            <Input
              label="Owner Name"
              name="owner_name"
              value={formData.owner_name || ''}
              onChange={onInputChange}
              error={errors.owner_name}
              fullWidth
              required
            />

            <Input
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number || ''}
              onChange={onInputChange}
              error={errors.phone_number}
              fullWidth
              required
            />

            <Input
              label="City"
              name="city"
              value={formData.city || ''}
              onChange={onInputChange}
              error={errors.city}
              fullWidth
              required
            />

            <Select
              label="State"
              name="state"
              value={formData.state || ''}
              onChange={onInputChange}
              options={
                states?.map((s) => ({
                  value: s._id || '',
                  label: s.name,
                })) || []
              }
              error={errors.state}
              fullWidth
              required
            />

            <Select
              label="Zone"
              name="zone"
              value={formData.zone || ''}
              onChange={onInputChange}
              options={
                zones?.map((z) => ({
                  value: z._id || '',
                  label: z.name,
                })) || []
              }
              error={errors.zone}
              fullWidth
              required
            />

            <Input
              label="Address"
              name="address"
              value={formData.address || ''}
              onChange={onInputChange}
              error={errors.address}
              fullWidth
              required
            />
            <div className="flex justify-end pt-4">
              <Button loading={saving} onClick={onSave}>
                Save Changes
              </Button>
            </div>
          </div>

          <div className="flex-1 mt-10 lg:mt-0 pt-8 lg:pt-0 border-t lg:border-t-0 lg:border-l lg:pl-10">
            <h3 className="font-semibold text-xl mb-4 text-gray-800">WhatsApp Configuration</h3>

            {isProfileIncomplete && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                <span className="bg-amber-100 p-1.5 rounded-lg text-amber-600 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </span>
                <div>
                  <p className="font-semibold mb-1 text-amber-900">Profile Incomplete</p>
                  <p className="text-amber-700">
                    First these details are required to complete the profile:{' '}
                    <span className="font-medium">Phone Number, City, State, Zone, Address</span>
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {!user?.business_id.business_id && (
                <div className="text-blue-800 space-y-4 mb-6 text-sm">
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-md text-yellow-800 font-medium">
                    ⚠️ <span className="font-semibold">Important Step:</span> Please enter the{' '}
                    <strong>Business Profile ID</strong> field below and click <strong>Save WhatsApp Config</strong>{' '}
                    first. We cannot connect your account without this.
                  </div>
                  <p>
                    Once saved, click the button below to seamlessly set up your account. This requires zero integration
                    and links directly to us.
                  </p>
                </div>
              )}
              <Input
                label="Business Profile ID"
                name="business_id"
                value={formData.business_id || ''}
                onChange={onInputChange}
                error={errors.business_id}
                fullWidth
                required
              />

              <Input
                label="WABA ID"
                name="waba_id"
                value={formData.waba_id || ''}
                error={errors.waba_id}
                fullWidth
                disabled
              />

              <Input
                label="Phone Number ID"
                name="phone_number_id"
                value={formData.phone_number_id || ''}
                error={errors.phone_number_id}
                fullWidth
                disabled
              />

              <Input
                label="Display Number"
                name="phone_number_display"
                value={formData.phone_number_display || ''}
                onChange={onInputChange}
                error={errors.phone_number_display}
                fullWidth
                disabled
              />

              <div className="flex justify-end pt-4">
                <Button type="button" loading={wabaSaving} onClick={handleWabaSaveClick}>
                  Save WhatsApp Config
                </Button>
              </div>
            </div>

            {/* Zero Integration Info Card */}
            {!isActive && user?.business_id.business_id && (
              <div className="mb-8 mt-2 bg-blue-50/50 p-6 rounded-2xl border border-blue-100 shadow-sm">
                <h4 className="font-semibold text-lg text-blue-900 mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 p-1.5 rounded-lg">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                    Connect WhatsApp Business
                  </div>
                </h4>

                <Link
                  href="https://business.facebook.com/messaging/whatsapp/onboard/?app_id=2076414226456262&config_id=1446461537160697"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleFacebookConnectClick}
                  className={!user?.business_id ? 'cursor-not-allowed opacity-60' : ''}
                >
                  <Button
                    type="button"
                    size="lg"
                    disabled={!user?.business_id}
                    className={`bg-[#1877F2] text-white px-8 py-6 text-base font-semibold rounded-xl shadow-md transition-all group flex items-center gap-2 ${
                      !user?.business_id ? '' : 'hover:bg-[#166FE5] hover:scale-105 active:scale-95'
                    }`}
                  >
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Connect with Facebook
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
