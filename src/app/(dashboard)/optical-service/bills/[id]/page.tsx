'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFetchBillQuery, useRecordPaymentMutation } from '@/lib/api/endpoints/opticalApi';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader } from '@/components/ui/loader';
import { toast } from 'sonner';
import Link from 'next/link';

export default function OpticalBillDetailPage() {
  const params = useParams();
  const billId = params?.id as string;
  const router = useRouter();
  const { data: bill, isLoading } = useFetchBillQuery(billId);
  const [recordPayment, { isLoading: isRecording }] = useRecordPaymentMutation();
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const handlePayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!paymentAmount) {
      toast.error('Enter an amount before submitting.');
      return;
    }

    try {
      await recordPayment({
        id: billId,
        data: { amount: parseFloat(paymentAmount), payment_method: paymentMethod },
      }).unwrap();
      toast.success('Payment recorded.');
      router.refresh();
      setPaymentAmount('');
    } catch (error: unknown) {
      toast.error('Unable to record payment.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="p-6">
        <p className="text-slate-500">Bill not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Invoice {bill.invoice_number}</h1>
          <p className="text-slate-500 text-xs mt-0.5">Review billing details and record payments.</p>
        </div>
        <Link
          href="/optical-service/bills"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-all duration-300"
        >
          Back to Bills
        </Link>
      </div>

      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">Patient</p>
              <p className="text-slate-800 font-semibold">{bill.customer_id?.name ?? 'Walk-in Patient'}</p>
              <p className="text-slate-400 text-xs">{bill.customer_id?.phone_number ?? 'No phone'}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">Invoice Date</p>
              <p className="text-slate-800">{new Date(bill.bill_date).toLocaleDateString('en-GB')}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">Payment Status</p>
              <p className="capitalize text-slate-800">{bill.payment_status}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">Total</p>
              <p className="text-2xl font-semibold text-slate-900">₹{bill.total?.toFixed?.(2) ?? '0.00'}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">Paid</p>
              <p className="text-slate-800">₹{bill.amount_paid?.toFixed?.(2) ?? '0.00'}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">Balance Due</p>
              <p className="text-slate-800">₹{bill.balance_due?.toFixed?.(2) ?? '0.00'}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Record a Payment</h2>
        <p className="text-slate-500 text-xs mt-1">Mark the invoice as paid or partially paid.</p>
        <form onSubmit={handlePayment} className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="paymentAmount">Amount</Label>
            <Input
              id="paymentAmount"
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="paymentMethod">Method</Label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>
          <div className="flex items-end justify-end">
            <Button type="submit" disabled={isRecording}>
              {isRecording ? 'Recording...' : 'Record Payment'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
