'use client';

import { useState } from 'react';
import { useFetchOpticalCustomersQuery, useCreatePrescriptionMutation } from '@/lib/api/endpoints/opticalApi';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateOpticalPrescription() {
  const router = useRouter();
  const { data: customers, isLoading } = useFetchOpticalCustomersQuery(undefined);
  const [createPrescription, { isLoading: isSaving }] = useCreatePrescriptionMutation();

  const [form, setForm] = useState({
    customer_id: '',
    lens_type: '',
    lens_material: '',
    lens_coating: '',
    right_sph: '',
    right_cyl: '',
    right_axis: '',
    left_sph: '',
    left_cyl: '',
    left_axis: '',
    notes: '',
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.customer_id || !form.lens_type) {
      toast.error('Please select a patient and lens type.');
      return;
    }

    try {
      await createPrescription({
        customer_id: form.customer_id,
        lens_type: form.lens_type,
        lens_material: form.lens_material || undefined,
        lens_coating: form.lens_coating || undefined,
        right_sph: form.right_sph ? parseFloat(form.right_sph) : undefined,
        right_cyl: form.right_cyl ? parseFloat(form.right_cyl) : undefined,
        right_axis: form.right_axis ? parseFloat(form.right_axis) : undefined,
        left_sph: form.left_sph ? parseFloat(form.left_sph) : undefined,
        left_cyl: form.left_cyl ? parseFloat(form.left_cyl) : undefined,
        left_axis: form.left_axis ? parseFloat(form.left_axis) : undefined,
        notes: form.notes || undefined,
      }).unwrap();
      toast.success('Prescription created successfully.');
      router.push('/optical-service/prescriptions');
    } catch (error: unknown) {
      toast.error('Failed to create prescription.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">New Prescription</h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Record a new optical prescription for a registered patient.
          </p>
        </div>
        <Link
          href="/optical-service/prescriptions"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-all duration-300"
        >
          Back to Prescriptions
        </Link>
      </div>

      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="customer">Patient</Label>
              <select
                id="customer"
                value={form.customer_id}
                onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                <option value="">Select patient</option>
                {customers?.map((customer: any) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name} — {customer.phone_number}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lens_type">Lens Type</Label>
              <Input
                id="lens_type"
                value={form.lens_type}
                onChange={(e) => setForm({ ...form, lens_type: e.target.value })}
                placeholder="Single Vision, Progressives..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="lens_material">Lens Material</Label>
              <Input
                id="lens_material"
                value={form.lens_material}
                onChange={(e) => setForm({ ...form, lens_material: e.target.value })}
                placeholder="CR39, Polycarbonate"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lens_coating">Lens Coating</Label>
              <Input
                id="lens_coating"
                value={form.lens_coating}
                onChange={(e) => setForm({ ...form, lens_coating: e.target.value })}
                placeholder="Anti-glare, Blue light"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Additional notes"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="right_sph">Right SPH</Label>
              <Input
                id="right_sph"
                type="number"
                value={form.right_sph}
                onChange={(e) => setForm({ ...form, right_sph: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="right_cyl">Right CYL</Label>
              <Input
                id="right_cyl"
                type="number"
                value={form.right_cyl}
                onChange={(e) => setForm({ ...form, right_cyl: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="right_axis">Right Axis</Label>
              <Input
                id="right_axis"
                type="number"
                value={form.right_axis}
                onChange={(e) => setForm({ ...form, right_axis: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="left_sph">Left SPH</Label>
              <Input
                id="left_sph"
                type="number"
                value={form.left_sph}
                onChange={(e) => setForm({ ...form, left_sph: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="left_cyl">Left CYL</Label>
              <Input
                id="left_cyl"
                type="number"
                value={form.left_cyl}
                onChange={(e) => setForm({ ...form, left_cyl: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="left_axis">Left Axis</Label>
              <Input
                id="left_axis"
                type="number"
                value={form.left_axis}
                onChange={(e) => setForm({ ...form, left_axis: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Create Prescription'}
            </Button>
          </div>
        </form>
      </Card>
      {isLoading && (
        <div className="flex items-center justify-center p-6">
          <Loader />
        </div>
      )}
    </div>
  );
}
