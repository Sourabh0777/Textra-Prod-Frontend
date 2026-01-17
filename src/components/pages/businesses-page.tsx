"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Loader } from "@/components/ui/loader";
import { fetchBusinesses, createBusiness, updateBusiness, deleteBusiness, fetchBusinessTypes } from "@/lib/api";
import type { IBusiness, IBusinessType } from "@/types";

export default function BusinessesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [businesses, setBusinesses] = useState<IBusiness[]>([]);
  const [businessTypes, setBusinessTypes] = useState<IBusinessType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<IBusiness>>({ is_active: true });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [businessRes, typesRes] = await Promise.all([fetchBusinesses(), fetchBusinessTypes()]);
    if (businessRes.success && Array.isArray(businessRes.data)) {
      setBusinesses(businessRes.data);
    }
    if (typesRes.success && Array.isArray(typesRes.data)) {
      setBusinessTypes(typesRes.data);
    }
    setLoading(false);
  };

  const handleOpenModal = (business?: IBusiness) => {
    if (business) {
      setFormData(business);
      setEditingId(business._id || null);
      setIsEditMode(true);
    } else {
      setFormData({ is_active: true });
      setEditingId(null);
      setIsEditMode(false);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "is_active" ? value === "true" : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.business_name) newErrors.business_name = "Business name is required";
    if (!formData.owner_name) newErrors.owner_name = "Owner name is required";
    if (!formData.phone_number) newErrors.phone_number = "Phone number is required";
    if (!formData.business_type_id) newErrors.business_type_id = "Business type is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.waba_id) newErrors.waba_id = "WABA ID is required";
    if (!formData.phone_number_id) newErrors.phone_number_id = "Phone Number ID is required";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      let result;
      if (isEditMode && editingId) {
        result = await updateBusiness(editingId, formData);
      } else {
        result = await createBusiness(formData);
      }

      if (result.success) {
        await loadData();
        setIsModalOpen(false);
        setFormData({ is_active: true });
      } else {
        setErrors({ submit: result.error || "Failed to save business" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this business?")) {
      const result = await deleteBusiness(id);
      if (result.success) {
        await loadData();
      } else {
        alert("Failed to delete business");
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Header title="Businesses" subtitle="Manage your business locations" />

      <div className="p-4 md:p-8">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-semibold text-neutral-900">All Businesses</h2>
          <Button onClick={() => handleOpenModal()}>+ Add Business</Button>
        </div>

        <Card>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Business Name</TableHeaderCell>
                    <TableHeaderCell className="hidden md:table-cell">Owner</TableHeaderCell>
                    <TableHeaderCell className="hidden lg:table-cell">Phone</TableHeaderCell>
                    <TableHeaderCell className="hidden md:table-cell">City</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {businesses.map((business) => (
                    <TableRow key={business._id}>
                      <TableCell className="font-semibold">{business.business_name}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{business.owner_name}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{business.phone_number}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{business.city}</TableCell>
                      <TableCell>
                        <Badge variant={business.is_active ? "success" : "danger"}>{business.is_active ? "Active" : "Inactive"}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenModal(business)}>
                            Edit
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(business._id || "")}>
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? "Edit Business" : "Add New Business"}
        onConfirm={handleSubmit}
        confirmText={isEditMode ? "Update Business" : "Add Business"}
        loading={submitting}
      >
        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.submit && <p className="text-red-600 text-sm">{errors.submit}</p>}
            <Select
              label="Business Type"
              name="business_type_id"
              value={formData.business_type_id || ""}
              onChange={handleChange}
              options={businessTypes.map((type) => ({
                value: type._id || "",
                label: type.name,
              }))}
              error={errors.business_type_id}
              fullWidth
            />
            <Input label="Business Name" name="business_name" value={formData.business_name || ""} onChange={handleChange} error={errors.business_name} fullWidth />
            <Input label="Owner Name" name="owner_name" value={formData.owner_name || ""} onChange={handleChange} error={errors.owner_name} fullWidth />
            <Input label="Phone Number" name="phone_number" value={formData.phone_number || ""} onChange={handleChange} error={errors.phone_number} fullWidth />
            <Input label="Address" name="address" value={formData.address || ""} onChange={handleChange} error={errors.address} fullWidth />
            <Input label="City" name="city" value={formData.city || ""} onChange={handleChange} error={errors.city} fullWidth />
            <Input label="WABA ID" name="waba_id" value={formData.waba_id || ""} onChange={handleChange} error={errors.waba_id} fullWidth />
            <Input label="Phone Number ID" name="phone_number_id" value={formData.phone_number_id || ""} onChange={handleChange} error={errors.phone_number_id} fullWidth />
            <Input label="Phone Number Display (Optional)" name="phone_number_display" value={formData.phone_number_display || ""} onChange={handleChange} fullWidth />
            <Input label="Access Token (Optional)" name="access_token" value={formData.access_token || ""} onChange={handleChange} type="password" fullWidth />
            <Select
              label="Status"
              name="is_active"
              value={String(formData.is_active)}
              onChange={handleChange}
              options={[
                { value: "true", label: "Active" },
                { value: "false", label: "Inactive" },
              ]}
              fullWidth
            />
          </form>
        </div>
      </Modal>
    </>
  );
}
