/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import SearchableDropdown from '@/components/ui/searchable-dropdown';
import { TWO_WHEELER_TYPES } from '@/constants/vehicle-types';
import type { IVehicle, ICustomer } from '@/types';
import { useFetchTwoWheelerBrandsQuery } from '@/lib/api/endpoints/twoWheelerBrandsApi';
import { Gauge, Wrench, AlertTriangle, CarFront } from 'lucide-react';

type UpdateScenario = 'details' | 'daily_travel' | 'service_due' | 'early_service';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  formData: Partial<IVehicle>;
  errors: Record<string, string>;
  customers: ICustomer[];
  submitting: boolean;
  onFormDataChange: (data: Partial<IVehicle>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCustomerChange: (customerId: string) => void;
  onBrandChange: (brand: string) => void;
}

export function VehicleModal({
  isOpen,
  onClose,
  isEditMode,
  formData,
  errors,
  customers,
  submitting,
  onFormDataChange,
  onInputChange,
  onSubmit,
  onCustomerChange,
  onBrandChange,
}: VehicleModalProps) {
  const [activeScenario, setActiveScenario] = useState<UpdateScenario>('details');

  // Reset scenario when modal opens/closes or mode changes
  useEffect(() => {
    setActiveScenario('details');
  }, [isOpen, isEditMode]);

  // Fetch Two-Wheeler Brands dynamically
  const { data: brands = [], isLoading: isLoadingBrands } = useFetchTwoWheelerBrandsQuery(undefined, {
    skip: !isOpen,
  });

  // Map brands for SearchableDropdown
  const brandOptions = useMemo(() => {
    return (brands || [])
      .filter((b) => b.is_active)
      .map((b) => ({
        value: b.name,
        label: b.name,
      }));
  }, [brands]);

  // Map models for SearchableDropdown based on selected brand
  const modelOptions = useMemo(() => {
    if (!formData.brand) return [];
    const selectedBrand = (brands || []).find((b) => b.name === formData.brand);
    if (!selectedBrand || !selectedBrand.models) return [];
    return selectedBrand.models.map((m) => ({
      value: m.name,
      label: m.name,
    }));
  }, [brands, formData.brand]);

  const handleBrandSelection = (val: string) => {
    onBrandChange(val);
    // Reset model when brand changes
    onFormDataChange({ ...formData, brand: val, vehicle_model: '' });
  };

  const handleModelSelection = (val: string) => {
    onFormDataChange({ ...formData, vehicle_model: val });
  };

  const scenarios: { key: UpdateScenario; icon: React.ReactNode; label: string; hint: string }[] = [
    {
      key: 'details',
      icon: <CarFront className="w-4 h-4" />,
      label: 'Vehicle Info',
      hint: 'Update brand, model, plate, year',
    },
    {
      key: 'daily_travel',
      icon: <Gauge className="w-4 h-4" />,
      label: 'Daily Travel',
      hint: 'Changed how much they ride daily?',
    },
    {
      key: 'service_due',
      icon: <Wrench className="w-4 h-4" />,
      label: 'Service Due KM',
      hint: 'Adjust when next service is due',
    },
    {
      key: 'early_service',
      icon: <AlertTriangle className="w-4 h-4" />,
      label: 'Early Service',
      hint: 'Breakdown or unplanned service?',
    },
  ];

  // ── Shared field renderers ──

  const renderCustomerField = () => (
    <SearchableDropdown
      fieldLabel="Customer"
      placeholder="Select a customer"
      searchPlaceholder="Search by name, phone or email..."
      selectedVal={
        typeof formData.customer_id === 'object' ? (formData.customer_id as any)?._id : formData.customer_id || ''
      }
      handleChange={(val) => onCustomerChange(val as string)}
      options={customers.map((customer: ICustomer) => ({
        id: customer._id || '',
        name: `${customer.name} | ${customer.phone_number} ${customer.email ? `| ${customer.email}` : ''}`,
      }))}
      label="name"
      id="id"
      error={errors.customer_id}
      fullWidth
      disabled={isEditMode}
    />
  );

  const renderVehicleInfoFields = () => (
    <>
      <Select
        label="Vehicle Type"
        name="vehicle_type"
        value={formData.vehicle_type || ''}
        onChange={onInputChange}
        options={TWO_WHEELER_TYPES}
        error={errors.vehicle_type}
        fullWidth
      />

      {isLoadingBrands ? (
        <div className="text-xs text-neutral-500 animate-pulse py-2">Loading brands...</div>
      ) : (
        <SearchableDropdown
          fieldLabel="Brand"
          placeholder="Select or search brand"
          selectedVal={formData.brand || ''}
          handleChange={(val) => handleBrandSelection(val as string)}
          options={brandOptions}
          label="label"
          id="value"
          error={errors.brand}
          fullWidth
        />
      )}

      <SearchableDropdown
        fieldLabel="Model"
        placeholder={formData.brand ? 'Select or search model' : 'Please select a brand first'}
        selectedVal={formData.vehicle_model || ''}
        handleChange={(val) => handleModelSelection(val as string)}
        options={modelOptions}
        label="label"
        id="value"
        error={errors.vehicle_model}
        fullWidth
      />

      <Input
        label="Registration Number / Number Plate"
        name="registration_number"
        placeholder="e.g. MH12AB1234"
        className="uppercase"
        value={formData.registration_number || ''}
        onChange={onInputChange}
        error={errors.registration_number}
        fullWidth
      />

      <div className="space-y-2">
        <Input
          label="Model Year"
          name="year"
          type="number"
          placeholder="e.g. 2023"
          value={formData.year || ''}
          onChange={onInputChange}
          error={errors.year}
          fullWidth
        />
        <div className="flex gap-2">
          {[2018, 2020, 2025].map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => onFormDataChange({ ...formData, year })}
              className="px-3 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-600 hover:bg-blue-100 hover:text-blue-700 transition-colors border border-transparent hover:border-blue-200"
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    </>
  );

  const renderDailyTravelField = () => (
    <div className="space-y-2">
      <Input
        label="Daily Travel (KM)"
        name="daily_travel"
        type="number"
        placeholder="e.g. 30"
        value={formData.daily_travel || ''}
        onChange={(e) => onFormDataChange({ ...formData, daily_travel: Number(e.target.value) })}
        error={errors.daily_travel}
        fullWidth
      />
      <div className="flex gap-2 flex-wrap">
        {[10, 20, 30, 40, 50].map((km) => (
          <button
            key={km}
            type="button"
            onClick={() => onFormDataChange({ ...formData, daily_travel: km })}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors border ${
              formData.daily_travel === km
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-neutral-100 text-neutral-600 border-transparent hover:bg-blue-100 hover:text-blue-700 hover:border-blue-200'
            }`}
          >
            {km} KM
          </button>
        ))}
      </div>
    </div>
  );

  const renderServiceDueKmField = () => (
    <div className="space-y-2">
      <Input
        label="Next Service Due (KM)"
        name="next_service_due_km"
        type="number"
        placeholder="e.g. 2000"
        value={formData.next_service_due_km || ''}
        onChange={(e) => onFormDataChange({ ...formData, next_service_due_km: Number(e.target.value) })}
        error={errors.next_service_due_km}
        fullWidth
      />
      <div className="flex gap-2">
        {[500, 1000, 2000, 2500].map((km) => (
          <button
            key={km}
            type="button"
            onClick={() => onFormDataChange({ ...formData, next_service_due_km: km })}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors border ${
              formData.next_service_due_km === km
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-neutral-100 text-neutral-600 border-transparent hover:bg-blue-100 hover:text-blue-700 hover:border-blue-200'
            }`}
          >
            {km} KM
          </button>
        ))}
      </div>
    </div>
  );

  const renderServiceDateField = () => (
    <Input
      label="Service Date"
      name="service_date"
      type="date"
      value={formData.service_date ? new Date(formData.service_date).toISOString().split('T')[0] : ''}
      onChange={(e) => onFormDataChange({ ...formData, service_date: e.target.value as any })}
      error={errors.service_date}
      fullWidth
    />
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'}
      onConfirm={onSubmit}
      confirmText={isEditMode ? 'Update Vehicle' : 'Add Vehicle'}
      loading={submitting}
    >
      <div className="p-4">
        <form onSubmit={onSubmit} className="space-y-5">
          {errors.submit && <p className="text-red-600 text-sm">{errors.submit}</p>}

          {/* Customer is always shown, disabled in edit mode */}
          {renderCustomerField()}

          {/* ── ADD MODE: show all fields flat (original layout) ── */}
          {!isEditMode && (
            <div className="space-y-4">
              {renderVehicleInfoFields()}
              {renderDailyTravelField()}
              {renderServiceDueKmField()}

              <div className="pt-2 border-t border-neutral-100">
                {renderServiceDateField()}
                <p className="mt-1 text-xs text-blue-600 font-medium bg-blue-50 p-2 rounded">
                  💡 If the bike is getting service today, please select the date here so that a service record and
                  reminder will be automatically created.
                </p>
              </div>
            </div>
          )}

          {/* ── EDIT MODE: scenario-based UI ── */}
          {isEditMode && (
            <>
              {/* Scenario Selector */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 ml-0.5">
                  What do you want to update?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {scenarios.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setActiveScenario(s.key)}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all duration-200 ${
                        activeScenario === s.key
                          ? 'border-blue-600 bg-blue-50 shadow-sm shadow-blue-100'
                          : 'border-neutral-100 bg-neutral-50/50 hover:border-neutral-200'
                      }`}
                    >
                      <span className={`mt-0.5 ${activeScenario === s.key ? 'text-blue-600' : 'text-neutral-400'}`}>
                        {s.icon}
                      </span>
                      <div>
                        <p
                          className={`text-xs font-bold ${activeScenario === s.key ? 'text-blue-600' : 'text-neutral-600'}`}
                        >
                          {s.label}
                        </p>
                        <p className="text-[10px] text-neutral-400 leading-tight mt-0.5">{s.hint}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-100" />

              {/* Scenario: Vehicle Info */}
              {activeScenario === 'details' && <div className="space-y-4">{renderVehicleInfoFields()}</div>}

              {/* Scenario: Daily Travel */}
              {activeScenario === 'daily_travel' && (
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <p className="text-xs text-blue-700 font-medium">
                      💡 Updating daily travel will automatically recalculate the next service reminder date.
                    </p>
                  </div>
                  {renderDailyTravelField()}
                </div>
              )}

              {/* Scenario: Service Due KM */}
              {activeScenario === 'service_due' && (
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <p className="text-xs text-blue-700 font-medium">
                      💡 Changing the service due KM will recalculate when the next service reminder is scheduled.
                    </p>
                  </div>
                  {renderServiceDueKmField()}
                </div>
              )}

              {/* Scenario: Early / Unplanned Service */}
              {activeScenario === 'early_service' && (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs text-amber-700 font-medium">
                      ⚠️ Use this if the vehicle was serviced before the scheduled date (breakdown, chain issue, engine
                      damage, etc.). This will close the current service cycle and create a new reminder from the
                      service date.
                    </p>
                  </div>
                  {renderServiceDateField()}

                  <div className="border-t border-dashed border-neutral-200 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3">
                      Optionally update these too
                    </p>
                    <div className="space-y-3">
                      {renderDailyTravelField()}
                      {renderServiceDueKmField()}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </form>
      </div>
    </Modal>
  );
}
