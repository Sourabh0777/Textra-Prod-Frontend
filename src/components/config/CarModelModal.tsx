import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ICarModel, FuelType } from '@/types';
import { Plus, Trash2 } from 'lucide-react';

interface CarModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: Partial<ICarModel>;
  setFormData: (data: any) => void;
  isEdit: boolean;
}

const FUEL_TYPES_OPTIONS = Object.values(FuelType);

export function CarModelModal({ isOpen, onClose, onSubmit, formData, setFormData, isEdit }: CarModelModalProps) {
  const handleAddVariant = () => {
    const variants = formData.variants || [];
    setFormData({
      ...formData,
      variants: [...variants, { name: '', fuel_types: [] }],
    });
  };

  const handleRemoveVariant = (index: number) => {
    const variants = formData.variants || [];
    setFormData({
      ...formData,
      variants: variants.filter((_, i) => i !== index),
    });
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const variants = [...(formData.variants || [])];
    variants[index] = { ...variants[index], [field]: value };
    setFormData({ ...formData, variants });
  };

  const handleFuelTypeToggle = (index: number, fuelType: FuelType) => {
    const variants = [...(formData.variants || [])];
    const currentFuelTypes = variants[index].fuel_types || [];

    let newFuelTypes;
    if (currentFuelTypes.includes(fuelType)) {
      newFuelTypes = currentFuelTypes.filter((ft) => ft !== fuelType);
    } else {
      newFuelTypes = [...currentFuelTypes, fuelType];
    }

    variants[index] = { ...variants[index], fuel_types: newFuelTypes };
    setFormData({ ...formData, variants });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Model' : 'Add New Model'}
      onConfirm={onSubmit}
      confirmText={isEdit ? 'Update' : 'Create'}
    >
      <form onSubmit={onSubmit} className="space-y-6 pt-4 max-h-[60vh] overflow-y-auto pr-2">
        <Input
          label="Model Name"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Swift"
          required
          fullWidth
          disabled={isEdit} // Often don't change model name once created if it's the identifier, but it might not be. Let's allow edit if not strictly the ID. Wait, updateModel uses `:modelName` as ID. It might be unsafe to edit. Let's just disable.
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold text-neutral-800">Variants</h4>
            <Button type="button" variant="ghost" size="sm" onClick={handleAddVariant}>
              <Plus className="h-4 w-4 mr-1" />
              Add Variant
            </Button>
          </div>

          {(formData.variants || []).map((variant, index) => (
            <div key={index} className="p-4 rounded-md border border-neutral-200 bg-neutral-50 relative">
              <button
                type="button"
                onClick={() => handleRemoveVariant(index)}
                className="absolute top-2 right-2 text-neutral-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="space-y-4 pr-6">
                <Input
                  label={`Variant Name`}
                  value={variant.name || ''}
                  onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                  placeholder="e.g. LXI"
                  required
                  fullWidth
                />

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-2">Fuel Types</label>
                  <div className="flex flex-wrap gap-2">
                    {FUEL_TYPES_OPTIONS.map((ft) => {
                      const isSelected = (variant.fuel_types || []).includes(ft as FuelType);
                      return (
                        <button
                          key={ft}
                          type="button"
                          onClick={() => handleFuelTypeToggle(index, ft as FuelType)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-medium border transition-colors ${
                            isSelected
                              ? 'bg-blue-100 border-blue-500 text-blue-700'
                              : 'bg-white border-neutral-300 text-neutral-600 hover:bg-neutral-100'
                          }`}
                        >
                          {ft}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {(!formData.variants || formData.variants.length === 0) && (
            <div className="text-center py-6 border border-dashed border-neutral-300 rounded-md text-neutral-500 text-xs">
              No variants added yet.
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
}
