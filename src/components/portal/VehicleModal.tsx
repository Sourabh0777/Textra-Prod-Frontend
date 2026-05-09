'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import SearchableDropdown from '@/components/ui/searchable-dropdown';
import { TWO_WHEELER_TYPES } from '@/constants/vehicle-types';
import { useFetchTwoWheelerBrandsQuery } from '@/lib/api/endpoints/twoWheelerBrandsApi';
import { Gauge, Wrench, AlertTriangle } from 'lucide-react';

type UpdateScenario = 'details' | 'daily_travel' | 'service_due' | 'early_service';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  isLoading?: boolean;
}

export const VehicleModal = ({ isOpen, onClose, onSave, initialData, isLoading }: VehicleModalProps) => {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeScenario, setActiveScenario] = useState<UpdateScenario>('details');

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData, service_date: '' });
    }
    setErrors({});
    setActiveScenario('details');
  }, [initialData, isOpen]);

  const { data: brands = [], isLoading: isLoadingBrands } = useFetchTwoWheelerBrandsQuery(undefined, {
    skip: !isOpen,
  });

  const brandOptions = useMemo(() => {
    return (brands || [])
      .filter((b: any) => b.is_active)
      .map((b: any) => ({ value: b.name, label: b.name }));
  }, [brands]);

  const modelOptions = useMemo(() => {
    if (!formData.brand) return [];
    const selectedBrand = (brands || []).find((b: any) => b.name === formData.brand);
    if (!selectedBrand || !selectedBrand.models) return [];
    return selectedBrand.models.map((m: any) => ({ value: m.name, label: m.name }));
  }, [brands, formData.brand]);

  const handleBrandSelection = (val: string) => {
    setFormData({ ...formData, brand: val, vehicle_model: '' });
  };

  const handleModelSelection = (val: string) => {
    setFormData({ ...formData, vehicle_model: val });
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.vehicle_type) newErrors.vehicle_type = 'Required';
    if (!formData.brand) newErrors.brand = 'Required';
    if (!formData.vehicle_model) newErrors.vehicle_model = 'Required';
    if (!formData.registration_number || formData.registration_number.length < 5) newErrors.registration_number = 'Required/Invalid';

    if (activeScenario === 'early_service' && !formData.service_date) {
      newErrors.service_date = 'Please select the service date';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Build payload — only include service_date when the early service scenario is active
    const payload = { ...formData };
    if (activeScenario !== 'early_service') {
      delete payload.service_date;
    }

    onSave(payload);
  };

  const scenarios: { key: UpdateScenario; icon: React.ReactNode; label: string; hint: string }[] = [
    {
      key: 'details',
      icon: <Wrench className="w-4 h-4" />,
      label: 'Vehicle Info',
      hint: 'Update brand, model, plate, year',
    },
    {
      key: 'daily_travel',
      icon: <Gauge className="w-4 h-4" />,
      label: 'Daily Travel',
      hint: 'Changed how much you ride daily?',
    },
    {
      key: 'service_due',
      icon: <Gauge className="w-4 h-4" />,
      label: 'Service Due KM',
      hint: 'Adjust when your next service is due',
    },
    {
      key: 'early_service',
      icon: <AlertTriangle className="w-4 h-4" />,
      label: 'Got Serviced Early',
      hint: 'Breakdown or unplanned service?',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Vehicle"
      onConfirm={handleSubmit}
      confirmText="Update Vehicle"
      loading={isLoading}
    >
      <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto p-4">
        {/* ── Scenario Selector ── */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 ml-0.5">What do you want to update?</p>
          <div className="grid grid-cols-2 gap-2">
            {scenarios.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setActiveScenario(s.key)}
                className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all duration-200 ${
                  activeScenario === s.key
                    ? 'border-[#15368A] bg-[#15368A]/5 shadow-sm shadow-[#15368A]/10'
                    : 'border-neutral-100 bg-neutral-50/50 hover:border-neutral-200'
                }`}
              >
                <span className={`mt-0.5 ${activeScenario === s.key ? 'text-[#15368A]' : 'text-neutral-400'}`}>
                  {s.icon}
                </span>
                <div>
                  <p className={`text-xs font-bold ${activeScenario === s.key ? 'text-[#15368A]' : 'text-neutral-600'}`}>
                    {s.label}
                  </p>
                  <p className="text-[10px] text-neutral-400 leading-tight mt-0.5">{s.hint}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-neutral-100" />

        {/* ── Scenario: Vehicle Info ── */}
        {activeScenario === 'details' && (
          <div className="space-y-4">
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
                    onClick={() => setFormData({ ...formData, year })}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-600 hover:bg-blue-100 hover:text-blue-700 transition-colors border border-transparent hover:border-blue-200"
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Scenario: Daily Travel ── */}
        {activeScenario === 'daily_travel' && (
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <p className="text-xs text-blue-700 font-medium">
                💡 Updating your daily travel will automatically recalculate your next service reminder date.
              </p>
            </div>
            <Input
              label="Daily Travel (KM)"
              name="daily_travel"
              type="number"
              placeholder="e.g. 30"
              value={formData.daily_travel || ''}
              onChange={(e) => setFormData({ ...formData, daily_travel: Number(e.target.value) })}
              error={errors.daily_travel}
              fullWidth
            />
            <div className="flex gap-2 flex-wrap">
              {[10, 20, 30, 40, 50].map((km) => (
                <button
                  key={km}
                  type="button"
                  onClick={() => setFormData({ ...formData, daily_travel: km })}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors border ${
                    formData.daily_travel === km
                      ? 'bg-[#15368A] text-white border-[#15368A]'
                      : 'bg-neutral-100 text-neutral-600 border-transparent hover:bg-blue-100 hover:text-blue-700 hover:border-blue-200'
                  }`}
                >
                  {km} KM
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Scenario: Service Due KM ── */}
        {activeScenario === 'service_due' && (
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <p className="text-xs text-blue-700 font-medium">
                💡 Changing the service due KM will recalculate when your next service reminder is scheduled.
              </p>
            </div>
            <Input
              label="Next Service Due (KM)"
              name="next_service_due_km"
              type="number"
              placeholder="e.g. 2000"
              value={formData.next_service_due_km || ''}
              onChange={(e) => setFormData({ ...formData, next_service_due_km: Number(e.target.value) })}
              error={errors.next_service_due_km}
              fullWidth
            />
            <div className="flex gap-2">
              {[500, 1000, 2000, 2500].map((km) => (
                <button
                  key={km}
                  type="button"
                  onClick={() => setFormData({ ...formData, next_service_due_km: km })}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors border ${
                    formData.next_service_due_km === km
                      ? 'bg-[#15368A] text-white border-[#15368A]'
                      : 'bg-neutral-100 text-neutral-600 border-transparent hover:bg-blue-100 hover:text-blue-700 hover:border-blue-200'
                  }`}
                >
                  {km} KM
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Scenario: Early / Unplanned Service ── */}
        {activeScenario === 'early_service' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-700 font-medium">
                ⚠️ Use this if your vehicle was serviced before the scheduled date (breakdown, chain issue, engine damage, etc.).
                This will close the current service cycle and create a new reminder from the service date.
              </p>
            </div>
            <Input
              label="Service Date"
              name="service_date"
              type="date"
              value={formData.service_date || ''}
              onChange={onInputChange}
              error={errors.service_date}
              fullWidth
            />

            <div className="border-t border-dashed border-neutral-200 pt-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3">Optionally update these too</p>
              <div className="space-y-3">
                <Input
                  label="Daily Travel (KM)"
                  name="daily_travel"
                  type="number"
                  placeholder="e.g. 30"
                  value={formData.daily_travel || ''}
                  onChange={(e) => setFormData({ ...formData, daily_travel: Number(e.target.value) })}
                  fullWidth
                />
                <Input
                  label="Next Service Due (KM)"
                  name="next_service_due_km"
                  type="number"
                  placeholder="e.g. 2000"
                  value={formData.next_service_due_km || ''}
                  onChange={(e) => setFormData({ ...formData, next_service_due_km: Number(e.target.value) })}
                  fullWidth
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};
