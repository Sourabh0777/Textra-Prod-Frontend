import { useState } from 'react';
import {
  useFetchTwoWheelerBrandsQuery,
  useCreateTwoWheelerBrandMutation,
  useUpdateTwoWheelerBrandMutation,
  useDeleteTwoWheelerBrandMutation,
  useCreateTwoWheelerModelMutation,
  useUpdateTwoWheelerModelMutation,
  useDeleteTwoWheelerModelMutation,
} from '@/lib/api/endpoints/twoWheelerBrandsApi';
import { ITwoWheelerBrand, ITwoWheelerModel } from '@/types';
import { toastPromise } from '@/lib/toast-utils';
import { useUser } from '@clerk/nextjs';

export function useTwoWheelerBrandsConfig() {
  const { user: clerkUser, isLoaded } = useUser();

  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<ITwoWheelerBrand | null>(null);
  const [brandFormData, setBrandFormData] = useState<Partial<ITwoWheelerBrand>>({ name: '', is_active: true });

  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<ITwoWheelerModel | null>(null);
  const [modelFormData, setModelFormData] = useState<Partial<ITwoWheelerModel>>({ name: '' });
  const [activeBrandIdForModel, setActiveBrandIdForModel] = useState<string>('');

  const [expandedBrands, setExpandedBrands] = useState<Record<string, boolean>>({});

  const toggleBrandExpansion = (brandId: string) => {
    const id = String(brandId);
    setExpandedBrands((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const { data: brands = [], isLoading: loadingBrands } = useFetchTwoWheelerBrandsQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const [createBrand] = useCreateTwoWheelerBrandMutation();
  const [updateBrand] = useUpdateTwoWheelerBrandMutation();
  const [deleteBrand] = useDeleteTwoWheelerBrandMutation();

  const [createModel] = useCreateTwoWheelerModelMutation();
  const [updateModel] = useUpdateTwoWheelerModelMutation();
  const [deleteModel] = useDeleteTwoWheelerModelMutation();

  // Brand Handlers
  const handleOpenBrandModal = (brand?: ITwoWheelerBrand) => {
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
  const handleOpenModelModal = (brandId: string, model?: ITwoWheelerModel) => {
    setActiveBrandIdForModel(brandId);
    if (model) {
      setEditingModel(model);
      setModelFormData(model);
    } else {
      setEditingModel(null);
      setModelFormData({ name: '' });
    }
    setIsModelModalOpen(true);
  };

  const handleModelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBrandIdForModel) return;

    try {
      if (editingModel?.name) {
        await toastPromise(
          updateModel({
            brandId: activeBrandIdForModel,
            modelName: editingModel.name,
            newName: modelFormData.name || '',
          }).unwrap(),
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
