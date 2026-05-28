'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useFetchOpticalCustomersQuery, useCreateLensOrderMutation, useCreateFrameOrderMutation } from '@/lib/api/endpoints/opticalApi';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OpticalNewOrderPage() {
  const router = useRouter();
  const { data: customers, isLoading } = useFetchOpticalCustomersQuery(undefined);
  const [createLensOrder, { isLoading: creatingLens }] = useCreateLensOrderMutation();
  const [createFrameOrder, { isLoading: creatingFrame }] = useCreateFrameOrderMutation();
  const [orderType, setOrderType] = useState<'lens' | 'frame'>('lens');
  const [form, setForm] = useState({
    customer_id: '',
    lens_type: '',
    lens_material: '',
    lens_coating: '',
    frame_name: '',
    frame_type: '',
    price: '',
    quantity: '1',
    notes: '',
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.customer_id || !form.price) {
      toast.error('Please select a customer and enter a price.');
      return;
    }

    try {
      if (orderType === 'lens') {
        await createLensOrder({
          customer_id: form.customer_id,
          lens_type: form.lens_type || 'Standard',
          lens_material: form.lens_material || undefined,
          lens_coating: form.lens_coating || undefined,
          price: parseFloat(form.price),
          quantity: Number(form.quantity) || 1,
          notes: form.notes || undefined,
        }).unwrap();
      } else {
        await createFrameOrder({
          customer_id: form.customer_id,
          frame_name: form.frame_name || 'Standard Frame',
          frame_type: form.frame_type || undefined,
          price: parseFloat(form.price),
          quantity: Number(form.quantity) || 1,
          notes: form.notes || undefined,
        }).unwrap();
      }

      toast.success('Order created successfully.');
      router.push('/optical-service/orders');
    } catch (error: unknown) {
      toast.error('Failed to create order.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Optical Order</h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Create a new frame or lens order for a registered customer.
          </p>
        </div>
        <Link
          href="/optical-service/orders"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-all duration-300"
        >
          Back to Orders
        </Link>
      </div>

      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant={orderType === 'lens' ? 'primary' : 'secondary'}
              onClick={() => setOrderType('lens')}
              className="flex-1"
            >
              Lens Order
            </Button>
            <Button
              type="button"
              variant={orderType === 'frame' ? 'primary' : 'secondary'}
              onClick={() => setOrderType('frame')}
              className="flex-1"
            >
              Frame Order
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="customer">Customer</Label>
              <select
                id="customer"
                value={form.customer_id}
                onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                <option value="">Select customer</option>
                {customers?.map((customer: any) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name} — {customer.phone_number}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>

          {orderType === 'lens' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="lens_type">Lens Type</Label>
                <Input
                  id="lens_type"
                  value={form.lens_type}
                  onChange={(e) => setForm({ ...form, lens_type: e.target.value })}
                  placeholder="Single Vision"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lens_material">Lens Material</Label>
                <Input
                  id="lens_material"
                  value={form.lens_material}
                  onChange={(e) => setForm({ ...form, lens_material: e.target.value })}
                  placeholder="Polycarbonate"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lens_coating">Lens Coating</Label>
                <Input
                  id="lens_coating"
                  value={form.lens_coating}
                  onChange={(e) => setForm({ ...form, lens_coating: e.target.value })}
                  placeholder="Anti-glare"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="frame_name">Frame Name</Label>
                <Input
                  id="frame_name"
                  value={form.frame_name}
                  onChange={(e) => setForm({ ...form, frame_name: e.target.value })}
                  placeholder="Classic Frame"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="frame_type">Frame Type</Label>
                <Input
                  id="frame_type"
                  value={form.frame_type}
                  onChange={(e) => setForm({ ...form, frame_type: e.target.value })}
                  placeholder="Full rim"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                placeholder="1"
              />
            </div>
            <div className="space-y-1.5 md:col-span-3">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Special instructions"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={creatingLens || creatingFrame}>
              {creatingLens || creatingFrame ? 'Saving...' : 'Create Order'}
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
