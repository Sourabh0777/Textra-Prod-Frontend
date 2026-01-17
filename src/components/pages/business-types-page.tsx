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
import { Loader } from "@/components/ui/loader";
import { fetchBusinessTypes, createBusinessType, updateBusinessType, deleteBusinessType } from "@/lib/api";
import type { IBusinessType } from "@/types";

export default function BusinessTypesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [businessTypes, setBusinessTypes] = useState<IBusinessType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<IBusinessType>>({ is_active: true });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await fetchBusinessTypes();
    if (res.success && Array.isArray(res.data)) {
      setBusinessTypes(res.data);
    }
    setLoading(false);
  };

  const handleOpenModal = (type?: IBusinessType) => {
    if (type) {
      setFormData(type);
      setEditingId(type._id || null);
      setIsEditMode(true);
    } else {
      setFormData({ is_active: true, name: "", description: "" });
      setEditingId(null);
      setIsEditMode(false);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
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
        result = await updateBusinessType(editingId, formData);
      } else {
        result = await createBusinessType(formData);
      }

      if (result.success) {
        await loadData();
        setIsModalOpen(false);
      } else {
        setErrors({ submit: result.error || "Failed to save business type" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this business type?")) {
      const result = await deleteBusinessType(id);
      if (result.success) {
        await loadData();
      } else {
        alert("Failed to delete business type");
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Header title="Business Types" subtitle="Manage categories for your businesses" />

      <div className="p-4 md:p-8">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-semibold text-neutral-900">All Business Types</h2>
          <Button onClick={() => handleOpenModal()}>+ Add Business Type</Button>
        </div>

        <Card>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Name</TableHeaderCell>
                    <TableHeaderCell>Description</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {businessTypes.map((type) => (
                    <TableRow key={type._id}>
                      <TableCell className="font-semibold">{type.name}</TableCell>
                      <TableCell className="text-sm">{type.description || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={type.is_active ? "success" : "danger"}>{type.is_active ? "Active" : "Inactive"}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenModal(type)}>
                            Edit
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(type._id || "")}>
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
        title={isEditMode ? "Edit Business Type" : "Add New Business Type"}
        onConfirm={handleSubmit}
        confirmText={isEditMode ? "Update" : "Add"}
        loading={submitting}
      >
        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.submit && <p className="text-red-600 text-sm">{errors.submit}</p>}
            <Input label="Name" name="name" value={formData.name || ""} onChange={handleChange} error={errors.name} fullWidth />
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-700">Description</label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              />
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
