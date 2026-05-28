'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useFetchOpticalCustomersQuery, useCreateBillMutation } from '@/lib/api/endpoints/opticalApi';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OpticalNewBillPage() {
  const router = useRouter();
  const { data: customers, isLoading } = useFetchOpticalCustomersQuery(undefined);
  const [createBill, { isLoading: isSaving }] = useCreateBillMutation();
  const [form, setForm] = useState({
    customer_id: '',
    subtotal: '',
    discount: '',
    tax_percentage: '',
    total: '',
    amount_paid: '',
    payment_status: 'pending',
    payment_method: 'cash',
    notes: '',
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.customer_id || !form.subtotal || !form.total) {
      toast.error('Please select a customer and enter subtotal/total.');
      return;
    }

    try {
      await createBill({
        customer_id: form.customer_id,
        subtotal: parseFloat(form.subtotal),
        discount: form.discount ? parseFloat(form.discount) : undefined,
        tax_percentage: form.tax_percentage ? parseFloat(form.tax_percentage) : undefined,
        total: parseFloat(form.total),
        payment_status: form.payment_status,
        amount_paid: form.amount_paid ? parseFloat(form.amount_paid) : undefined,
        payment_method: form.payment_method || undefined,
        notes: form.notes || undefined,
      }).unwrap();
      toast.success('Bill created successfully.');
      router.push('/optical-service/bills');
    } catch (error: unknown) {
      toast.error('Failed to create bill.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create New Bill</h1>
          <p className="text-slate-500 text-xs mt-0.5">Generate a billing record for a customer order.</p>
        </div>
        <Link
          href="/optical-service/bills"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-all duration-300"
        >
          Back to Bills
        </Link>
      </div>

      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
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
              <Label htmlFor="payment_status">Payment Status</Label>
              <select
                id="payment_status"
                value={form.payment_status}
                onChange={(e) => setForm({ ...form, payment_status: e.target.value })}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="subtotal">Subtotal</Label>
              <Input
                id="subtotal"
                type="number"
                value={form.subtotal}
                onChange={(e) => setForm({ ...form, subtotal: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="discount">Discount</Label>
              <Input
                id="discount"
                type="number"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tax_percentage">Tax %</Label>
              <Input
                id="tax_percentage"
                type="number"
                value={form.tax_percentage}
                onChange={(e) => setForm({ ...form, tax_percentage: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="total">Total</Label>
              <Input
                id="total"
                type="number"
                value={form.total}
                onChange={(e) => setForm({ ...form, total: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="amount_paid">Amount Paid</Label>
              <Input
                id="amount_paid"
                type="number"
                value={form.amount_paid}
                onChange={(e) => setForm({ ...form, amount_paid: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="payment_method">Payment Method</Label>
              <select
                id="payment_method"
                value={form.payment_method}
                onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Invoice notes"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Create Bill'}
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
