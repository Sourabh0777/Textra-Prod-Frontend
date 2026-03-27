/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  useFetchWhatsAppTemplatesQuery,
  useFetchTemplateConfigsQuery,
  useUpdateTemplateConfigMutation,
} from '@/lib/api/endpoints/whatsappApi';
import { TemplateType } from '@/types';

export function useWhatsAppTemplatesPage() {
  const { user: clerkUser, isLoaded } = useUser();

  /** RTK Query hooks */
  const {
    data: templatesResponse,
    isLoading: templatesLoading,
    error: templatesError,
  } = useFetchWhatsAppTemplatesQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const {
    data: configResponse,
    isLoading: configLoading,
    error: configError,
  } = useFetchTemplateConfigsQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const [updateTemplateConfig, { isLoading: isSaving }] = useUpdateTemplateConfigMutation();

  const templates = Array.isArray(templatesResponse) ? templatesResponse : (templatesResponse as any)?.data || [];
  const existingConfigs = Array.isArray(configResponse) ? configResponse : (configResponse as any)?.data || [];

  const [selectedTemplates, setSelectedTemplates] = useState<Record<TemplateType, string>>({
    SERVICE_REMINDER: '',
    SERVICE_COMPLETED: '',
    FEEDBACK_REQUEST: '',
    CUSTOM_MESSAGE: '',
  });

  // Sync selectedTemplates with existingConfigs
  useEffect(() => {
    if (existingConfigs.length > 0) {
      const newSelected: Record<TemplateType, string> = { ...selectedTemplates };
      existingConfigs.forEach((config: any) => {
        if (config.template_type) {
          newSelected[config.template_type as TemplateType] = config.template_name;
        }
      });
      setSelectedTemplates(newSelected);
    }
  }, [existingConfigs]);

  const [searchQuery, setSearchQuery] = useState('');

  const extractVariables = (text: string) => {
    const regex = /{{(\d+)}}/g;
    const matches = [...text.matchAll(regex)];
    return Array.from(new Set(matches.map((m) => m[0]))).sort((a, b) => {
      return parseInt(a.replace(/\D/g, '')) - parseInt(b.replace(/\D/g, ''));
    });
  };

  const filteredTemplates = templates.filter((template: any) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (template.name?.toLowerCase() || '').includes(searchLower) ||
      (template.category?.toLowerCase() || '').includes(searchLower) ||
      (template.language?.toLowerCase() || '').includes(searchLower)
    );
  });

  const handleTemplateSelect = (type: TemplateType, templateName: string) => {
    setSelectedTemplates((prev) => ({
      ...prev,
      [type]: templateName,
    }));
  };

  const handleSaveConfig = async (type: TemplateType) => {
    const templateName = selectedTemplates[type];
    if (!templateName) return;

    const template = templates.find((t: any) => t.name === templateName);
    if (!template) return;

    // Validation for SERVICE_REMINDER: must have exactly 5 variables
    if (type === 'SERVICE_REMINDER') {
      const bodyText = template.components?.find((c: any) => c.type === 'BODY')?.text || '';
      const variables = extractVariables(bodyText);
      if (variables.length !== 5) {
        alert(
          `Validation Failed: The template "${templateName}" has ${variables.length} variables. Please select a template with exactly 5 variables for Service Reminders (e.g., name, bike brand, model, number, and date).`,
        );
        return;
      }
    }

    const payload = {
      template_type: type,
      template_name: template.name,
      meta_template_id: template.id,
      template_language: template.language,
      template_category: template.category,
      template_sub_category: template.sub_category || '', // Added based on request
      parameter_format: 'POSITIONAL', // Defaulting for now
      is_active: true, // Defaulting for now
      status: template.status,
    };

    try {
      await updateTemplateConfig(payload).unwrap();
      alert(`Configuration for ${type} saved successfully!`);
    } catch (err) {
      console.error(`Error saving config for ${type}:`, err);
      alert(`Failed to save configuration for ${type}.`);
    }
  };

  return {
    templates,
    loading: !isLoaded || templatesLoading || configLoading,
    fetchError: templatesError || configError,
    searchQuery,
    setSearchQuery,
    filteredTemplates,
    selectedTemplates,
    handleTemplateSelect,
    handleSaveConfig,
    isSaving,
  };
}
