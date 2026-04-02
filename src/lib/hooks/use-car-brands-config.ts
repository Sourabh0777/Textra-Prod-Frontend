import { useState } from 'react';
import {
  useFetchBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useCreateModelMutation,
  useUpdateModelMutation,
  useDeleteModelMutation,
} from '@/lib/api/endpoints/carBrandsApi';
import { ICarBrand, ICarModel } from '@/types';
import { toastPromise } from '@/lib/toast-utils';
import { useUser } from '@clerk/nextjs';

export function useCarBrandsConfig() {
  const { user: clerkUser, isLoaded } = useUser();

  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<ICarBrand | null>(null);
  const [brandFormData, setBrandFormData] = useState<Partial<ICarBrand>>({ name: '', is_active: true });

  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<ICarModel | null>(null);
  const [modelFormData, setModelFormData] = useState<Partial<ICarModel>>({ name: '', variants: [] });
  const [activeBrandIdForModel, setActiveBrandIdForModel] = useState<string>('');

  const [expandedBrands, setExpandedBrands] = useState<Record<string, boolean>>({});

  const toggleBrandExpansion = (brandId: string) => {
    const id = String(brandId);
    setExpandedBrands((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const { data: brands = [], isLoading: loadingBrands } = useFetchBrandsQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const [createBrand] = useCreateBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();

  const [createModel] = useCreateModelMutation();
  const [updateModel] = useUpdateModelMutation();
  const [deleteModel] = useDeleteModelMutation();

  // Brand Handlers
  const handleOpenBrandModal = (brand?: ICarBrand) => {
    if (brand) {
      setEditingBrand(brand);
      setBrandFormData(brand);
    } else {
      setEditingBrand(null);
      setBrandFormData({ name: '', is_active: true });
    }
    setIsBrandModalOpen(true);
  };

  const handleBrandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBrand?._id) {
        await toastPromise(updateBrand({ id: editingBrand._id, data: brandFormData }).unwrap(), {
          loading: 'Updating brand...',
          success: 'Brand updated successfully',
          error: 'Failed to update brand',
        });
      } else {
        await toastPromise(createBrand(brandFormData).unwrap(), {
          loading: 'Creating brand...',
          success: 'Brand created successfully',
          error: 'Failed to create brand',
        });
      }
      setIsBrandModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBrand = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        await toastPromise(deleteBrand(id).unwrap(), {
          loading: 'Deleting brand...',
          success: 'Brand deleted successfully',
          error: 'Failed to delete brand',
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Model Handlers
  const handleOpenModelModal = (brandId: string, model?: ICarModel) => {
    setActiveBrandIdForModel(brandId);
    if (model) {
      setEditingModel(model);
      setModelFormData(model);
    } else {
      setEditingModel(null);
      setModelFormData({ name: '', variants: [] });
    }
    setIsModelModalOpen(true);
  };

  const handleModelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBrandIdForModel) return;

    try {
      if (editingModel?.name) {
        await toastPromise(
          updateModel({ brandId: activeBrandIdForModel, modelName: editingModel.name, data: modelFormData }).unwrap(),
          {
            loading: 'Updating model...',
            success: 'Model updated successfully',
            error: 'Failed to update model',
          },
        );
      } else {
        await toastPromise(createModel({ brandId: activeBrandIdForModel, data: modelFormData }).unwrap(), {
          loading: 'Creating model...',
          success: 'Model created successfully',
          error: 'Failed to create model',
        });
      }
      setIsModelModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteModel = async (brandId: string, modelName: string) => {
    if (window.confirm(`Are you sure you want to delete the model "${modelName}"?`)) {
      try {
        await toastPromise(deleteModel({ brandId, modelName }).unwrap(), {
          loading: 'Deleting model...',
          success: 'Model deleted successfully',
          error: 'Failed to delete model',
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  return {
    brands,
    loadingBrands,

    editingBrand,
    editingModel,

    isBrandModalOpen,
    setIsBrandModalOpen,
    brandFormData,
    setBrandFormData,
    handleOpenBrandModal,
    handleBrandSubmit,
    handleDeleteBrand,

    isModelModalOpen,
    setIsModelModalOpen,
    modelFormData,
    setModelFormData,
    handleOpenModelModal,
    handleModelSubmit,
    handleDeleteModel,
    activeBrandIdForModel,

    expandedBrands,
    toggleBrandExpansion,
  };
}
