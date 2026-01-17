"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardBody } from "@/components/ui/card"
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Loader } from "@/components/ui/loader"
import { fetchCustomers, createCustomer, updateCustomer, deleteCustomer, fetchBusinesses } from "@/lib/api"
import type { ICustomer, IBusiness } from "@/types"

export default function CustomersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [customers, setCustomers] = useState<ICustomer[]>([])
  const [businesses, setBusinesses] = useState<IBusiness[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<ICustomer>>({ is_active: true })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const [customersRes, businessesRes] = await Promise.all([fetchCustomers(), fetchBusinesses()])
    if (customersRes.success && Array.isArray(customersRes.data)) {
      setCustomers(customersRes.data)
    }
    if (businessesRes.success && Array.isArray(businessesRes.data)) {
      setBusinesses(businessesRes.data)
    }
    setLoading(false)
  }

  const handleOpenModal = (customer?: ICustomer) => {
    if (customer) {
      setFormData(customer)
      setEditingId(customer._id || null)
      setIsEditMode(true)
    } else {
      setFormData({ is_active: true })
      setEditingId(null)
      setIsEditMode(false)
    }
    setErrors({})
    setIsModalOpen(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "is_active" ? value === "true" : value,
    })
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.business_id) newErrors.business_id = "Business is required"
    if (!formData.name) newErrors.name = "Name is required"
    if (!formData.phone_number) newErrors.phone_number = "Phone number is required"
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitting(true)
    try {
      let result
      if (isEditMode && editingId) {
        result = await updateCustomer(editingId, formData)
      } else {
        result = await createCustomer(formData)
      }

      if (result.success) {
        await loadData()
        setIsModalOpen(false)
        setFormData({ is_active: true })
      } else {
        setErrors({ submit: result.error || "Failed to save customer" })
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      const result = await deleteCustomer(id)
      if (result.success) {
        await loadData()
      } else {
        alert("Failed to delete customer")
      }
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <Header title="Customers" subtitle="Manage your customer base" />

      <div className="p-4 md:p-8">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-semibold text-neutral-900">All Customers</h2>
          <Button onClick={() => handleOpenModal()}>+ Add Customer</Button>
        </div>

        <Card>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Name</TableHeaderCell>
                    <TableHeaderCell className="hidden md:table-cell">Phone</TableHeaderCell>
                    <TableHeaderCell className="hidden lg:table-cell">Email</TableHeaderCell>
                    <TableHeaderCell className="hidden lg:table-cell">Address</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer._id}>
                      <TableCell className="font-semibold">{customer.name}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{customer.phone_number}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{customer.email || "-"}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{customer.address || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={customer.is_active ? "success" : "danger"}>
                          {customer.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenModal(customer)}>
                            Edit
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(customer._id || "")}>
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
        title={isEditMode ? "Edit Customer" : "Add New Customer"}
        onConfirm={handleSubmit}
        confirmText={isEditMode ? "Update Customer" : "Add Customer"}
        loading={submitting}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.submit && <p className="text-red-600 text-sm">{errors.submit}</p>}
          <Select
            label="Business"
            name="business_id"
            value={formData.business_id || ""}
            onChange={handleChange}
            options={businesses.map((business) => ({
              value: business._id || "",
              label: business.business_name,
            }))}
            error={errors.business_id}
            fullWidth
          />
          <Input
            label="Name"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            error={errors.name}
            fullWidth
          />
          <Input
            label="Phone Number"
            name="phone_number"
            value={formData.phone_number || ""}
            onChange={handleChange}
            error={errors.phone_number}
            fullWidth
          />
          <Input
            label="Email (Optional)"
            name="email"
            type="email"
            value={formData.email || ""}
            onChange={handleChange}
            fullWidth
          />
          <Input
            label="Address (Optional)"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            fullWidth
          />
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
      </Modal>
    </>
  )
}
