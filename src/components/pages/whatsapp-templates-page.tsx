/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardBody } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/loader';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useWhatsAppTemplatesPage } from '@/lib/hooks/use-whatsapp-templates-page';
import { WHATSAPP_TEMPLATE_CONFIG, TemplateTypeConfig } from '@/config/whatsappTemplatesConfig';

export default function WhatsAppTemplatesPage() {
  const {
    loading,
    fetchError,
    searchQuery,
    setSearchQuery,
    filteredTemplates,
    templates,
    selectedTemplates,
    handleTemplateSelect,
    handleSaveConfig,
    isSaving,
  } = useWhatsAppTemplatesPage();
  console.log('🚀 ~ WhatsAppTemplatesPage ~ templates:', templates);

  const templateOptions = templates.map((t: any) => ({
    value: t.name,
    label: t.name,
  }));

  if (loading) {
    return (
      <>
        <Header title="WhatsApp Templates" subtitle="View and manage WhatsApp message templates" />
        <div className="p-4 md:p-8 flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      </>
    );
  }

  if (fetchError) {
    return (
      <>
        <Header title="WhatsApp Templates" subtitle="View and manage WhatsApp message templates" />
        <div className="p-4 md:p-8">
          <Card>
            <CardBody>
              <p className="text-red-500">Error loading templates. Please try again later.</p>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="WhatsApp Templates" subtitle="View and manage WhatsApp message templates" />

      <div className="p-4 md:p-8">
        {/* Mapping Section */}
        <div className="mb-10">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Template Configuration</h2>
            <p className="text-sm text-neutral-500">Map WhatsApp templates to specific automated events</p>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {WHATSAPP_TEMPLATE_CONFIG.map((item: TemplateTypeConfig) => {
              const selectedTemplateName = selectedTemplates[item.type];
              const selectedTemplate = templates.find((t: any) => t.name === selectedTemplateName);
              const bodyText = selectedTemplate?.components?.find((c: any) => c.type === 'BODY')?.text || '';

              const extractVariables = (text: string) => {
                const regex = /{{(\d+)}}/g;
                const matches = [...text.matchAll(regex)];
                return Array.from(new Set(matches.map((m) => m[0]))).sort((a, b) => {
                  return parseInt(a.replace(/\D/g, '')) - parseInt(b.replace(/\D/g, ''));
                });
              };

              const variables = extractVariables(bodyText);
              const isServiceReminder = item.type === 'SERVICE_REMINDER';
              const hasWrongVariableCount = isServiceReminder && selectedTemplateName && variables.length !== 5;

              return (
                <Card
                  key={item.type}
                  className={`border-l-4 ${item.enabled ? 'border-l-blue-500' : 'border-l-neutral-200'}`}
                >
                  <CardBody className="p-5">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col md:flex-row md:items-end gap-4">
                        <div className="flex-1 max-w-md">
                          <Select
                            label={item.label}
                            options={templateOptions}
                            value={selectedTemplateName}
                            onChange={(e) => handleTemplateSelect(item.type, e.target.value)}
                            disabled={!item.enabled}
                            fullWidth
                          />
                        </div>
                        <div className="w-full md:w-auto">
                          <Button
                            onClick={() => handleSaveConfig(item.type)}
                            disabled={!item.enabled || !selectedTemplateName || isSaving}
                            className="w-full md:px-8"
                          >
                            {isSaving ? 'Saving...' : 'Save Config'}
                          </Button>
                        </div>
                        {!item.enabled && (
                          <div className="flex items-center text-xs text-neutral-400 italic md:mb-2">
                            (Currently Disabled)
                          </div>
                        )}
                      </div>

                      {selectedTemplate && item.enabled && (
                        <div className="mt-2 pt-4 border-t border-neutral-100">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                                Message Preview
                              </h4>
                              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed">
                                {bodyText}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                                Required Variables
                              </h4>
                              {variables.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {variables.map((v) => (
                                    <span
                                      key={v}
                                      className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-mono"
                                    >
                                      {v}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-neutral-400 italic">No variables found in this template</p>
                              )}

                              {hasWrongVariableCount && (
                                <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                                  <p className="text-xs text-red-600 font-medium">
                                    ⚠️ Service Reminders require exactly 5 variables (Current: {variables.length}).
                                    Please choose a template that includes placeholders for: Name, Brand, Model, Reg.
                                    Number, and Date.
                                  </p>
                                </div>
                              )}

                              <p className="mt-3 text-[11px] text-neutral-500 leading-normal">
                                Ensure your automation logic provides values for all variables listed above to avoid
                                message delivery failures.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-semibold text-neutral-900 whitespace-nowrap">Available Templates</h2>
              <span className="text-sm text-neutral-500 font-medium">({filteredTemplates.length})</span>
            </div>
            <div className="w-full md:w-72">
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((template: any) => (
              <Card key={template.id || template.name}>
                <CardBody>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full uppercase">
                      {template.status}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
                    {template.components?.find((c: any) => c.type === 'BODY')?.text || 'No body content'}
                  </p>
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>{template.category}</span>
                    <span>{template.language}</span>
                  </div>
                </CardBody>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card>
                <CardBody className="text-center py-12">
                  <p className="text-neutral-500 text-lg">No templates found</p>
                </CardBody>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
